# Core Layer

Framework-agnostic, project-agnostic UI primitives and utilities for Expo / React Native projects built on Atomic Design.

---

## Quick Start

**1. Install peer deps** (NativeWind, Reanimated, Lucide, Gesture Handler — see root `package.json`)

**2. Copy `/src/core` into your project and set up the path alias:**
```jsonc
// tsconfig.json
{ "paths": { "@/*": ["./src/*"] } }
```

**3. Wrap your app in `AppProviders` and you're ready:**
```tsx
import { AppProviders } from '@/core/components/templates'

export default function RootLayout() {
  return <AppProviders><Stack /></AppProviders>
}
```

---

## Atomic Design Hierarchy

```
┌─────────────────────────────────────────────┐
│  Template  — layout skeleton, no logic       │
│  ┌─────────────────────────────────────────┐ │
│  │  Organism  — complex, self-contained UI  │ │
│  │  ┌───────────────────────────────────┐  │ │
│  │  │  Molecule  — 2–5 atoms, one goal  │  │ │
│  │  │  ┌────────────────────────────┐   │  │ │
│  │  │  │  Atom  — indivisible unit  │   │  │ │
│  │  │  └────────────────────────────┘   │  │ │
│  │  └───────────────────────────────────┘  │ │
│  └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

**Rule:** imports only flow downward. An Atom cannot import a Molecule.

> Domain-specific organisms live in `domains/[x]/components/`, not here.

---

## Import Examples

### Atoms — individual primitives
```tsx
import { Button, Text, Badge, Avatar, Input, Icon } from '@/core/components/atoms'

<Button label="Devam Et" onPress={handlePress} variant="primary" size="md" />
<Text variant="heading" weight="bold">Başlık</Text>
<Badge label="Yeni" variant="iris" />
<Avatar initials="AK" size="lg" />
```

### Molecules — composed UI blocks
```tsx
import { InputField, SearchBar, RatingRow, PriceDisplay, StatCard } from '@/core/components/molecules'

<InputField label="E-posta" name="email" control={control} />
<SearchBar placeholder="Uzman ara…" onSearch={handleSearch} />
<RatingRow rating={4.5} reviewCount={128} interactive onRatingChange={setRating} />
<PriceDisplay amount={750} currency="TRY" originalAmount={1000} />
<StatCard value={42} label="Toplam Seans" trend="up" trendValue={8} />
```

### Namespace import (master barrel)
```tsx
import { atoms, molecules, hooks, utils } from '@/core'

const { Button, Text } = atoms      // components
const { useDebounce } = hooks        // hooks
const { formatPrice } = utils        // utilities
```

### Hooks
```tsx
import { useDebounce, useThrottle, useKeyboard, useBoolean, useAppState } from '@/core/hooks'

const debouncedQuery = useDebounce(searchQuery, 300)
const { isVisible: keyboardOpen } = useKeyboard()
const { value: isOpen, setTrue: open, setFalse: close } = useBoolean()
```

### Utils
```tsx
import { formatPrice, formatDate, truncate, initials, isEmail, cn } from '@/core/utils'

formatPrice(1500)                       // "₺1.500"
formatDate(new Date(), 'relative')      // "3 dakika önce"
truncate('Uzun başlık metni', 20)       // "Uzun başlık metn..."
initials('Ayşe Kaya')                   // "AK"
cn('px-4 py-2', isActive && 'bg-iris-50')
```

### Design Tokens
```tsx
import { tokens, colors, radius } from '@/core/theme'

// Use in Reanimated / StyleSheet (where NativeWind can't reach)
const style = { backgroundColor: '#5C4FD6' }   // iris-500

// Token name references for className strings
<View className={`bg-${colors.surface.base} rounded-${radius.xl}`} />
```

---

## Overriding Design Tokens

Tokens are CSS custom properties defined in `tailwind.config.js`. Override per-project by replacing the values in the theme extension:

```js
// tailwind.config.js  (new project)
module.exports = {
  theme: {
    extend: {
      colors: {
        iris: {
          500: '#YOUR_BRAND_COLOR',   // replaces the default iris-500
        },
        'surface-base': '#F8F7FF',    // page background
      },
    },
  },
}
```

No component code changes required — all components reference tokens by name.

---

## How to Add a New Atom

1. Create the folder: `src/core/components/atoms/MyAtom/`
2. Write `MyAtom.tsx` — props type at top, no business logic, NativeWind `className` only
3. Write `MyAtom.test.tsx` — aim for **100% line coverage**
4. Write `index.ts`:
   ```ts
   export { MyAtom } from './MyAtom'
   export type { MyAtomProps } from './MyAtom'
   ```
5. Add to `src/core/components/atoms/index.ts`:
   ```ts
   export * from './MyAtom'
   ```
6. Add named export to `src/core/components/index.ts`
7. Run `npx jest MyAtom --coverage` → confirm 100% lines

---

## How to Add a New Molecule

1. Create the folder: `src/core/components/molecules/MyMolecule/`
2. Import only from `@/core/components/atoms` — never from other molecules
3. Write `MyMolecule.tsx` — compose 2–5 atoms, one clear UI purpose
4. Write `MyMolecule.test.tsx` — aim for **95%+ line coverage**
5. Write `index.ts`:
   ```ts
   export { MyMolecule } from './MyMolecule'
   export type { MyMoleculeProps } from './MyMolecule'
   ```
6. Add to `src/core/components/molecules/index.ts`:
   ```ts
   export * from './MyMolecule'
   ```
7. Add named export to `src/core/components/index.ts`

> If you find yourself needing domain data (user ID, API calls) inside the molecule — it belongs in `domains/[x]/components/` instead.

---

## Anti-Patterns

```tsx
// ❌ Reverse import: Atom importing a Molecule
// core/components/atoms/Button.tsx
import { InputField } from '../molecules/InputField'  // BANNED

// ❌ Server state in useState
const [data, setData] = useState([])
useEffect(() => { fetchData().then(setData) }, [])
// ✅ Use TanStack Query in the domain layer

// ❌ Business logic inside a component
function ExpertCard({ id }) {
  const [price, setPrice] = useState(0)
  useEffect(() => { /* price calculation */ }, [id])
}
// ✅ Extract to a hook: const { price } = useExpertPrice(id)

// ❌ Direct cross-domain import
import { Expert } from '../../expert/types/expert.types'
// ✅ Only via barrel: import type { Expert } from '@/domains/expert'

// ❌ StyleSheet or inline style (when a token exists)
<View style={{ padding: 16, backgroundColor: '#5C4FD6' }} />
// ✅ NativeWind className
<View className="p-4 bg-iris-500" />

// ❌ Unvalidated API cast
const expert = response.data as Expert
// ✅ Zod parse
const expert = ExpertSchema.parse(response.data)
```

---

## Test Commands

```bash
# Run all tests
npx jest

# Run with coverage report
npx jest --coverage --coverageDirectory coverage

# Run a single component
npx jest Button --coverage

# Watch mode
npx jest --watch

# Type check
npx tsc --noEmit --skipLibCheck

# Lint (zero warnings)
npx eslint src/core --max-warnings 0

# Format check
npx prettier --check src/core

# Format fix
npx prettier --write src/core

# Circular dependency check
npx madge --circular --extensions ts,tsx src/core/index.ts
```

**Coverage thresholds:**

| Scope | Lines |
|---|---|
| `atoms/` | ≥ 95% |
| `utils/` | 100% |
| `hooks/` | ≥ 90% |
