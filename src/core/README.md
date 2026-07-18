# core/

Projeler arası taşınabilir atomic design katmanı. Domain bilgisi içermez; yalnızca görünüm, tema ve saf yardımcılar barındırır.

## Yapı

```
core/
  components/
    atoms/        AppRefreshControl, Avatar, Badge, Button, Chip, DecorCircles,
                  Divider, Icon, Input, Skeleton, Switch, Text
    molecules/    BackButton, DiscoverMore, EmptyState, HeaderActions, InputField,
                  ListRowSkeleton, MenuRow, RatingRow, ScreenTitle, SectionHeader,
                  SegmentedControl, StatPill, StepProgress, ToggleRow
    organisms/    BottomActionBar, HeroPager, HeroQuickActions
    templates/    AppProviders
  hooks/          useRefresh (birden çok query'yi tek pull-to-refresh'te birleştirir)
  theme/          palette.ts — themeColors / useThemeColors (className kabul etmeyen
                  prop'lar için tek hex kaynağı; global.css ile birebir aynı değerler)
  utils/          cn, formatDate, personName
```

## Kurallar

- Import yönü: Atom → Molecule → Organism → Template. Geriye doğru import yasak.
- Her bileşen kendi klasöründe `Bileşen.tsx + index.ts (+ test)` üçlüsüyle yaşar; dışarıya katman barrel'ından (`atoms/index.ts` vb.) açılır.
- Stil yalnızca NativeWind className ile yazılır. className kabul etmeyen prop'larda (Icon `color`, `placeholderTextColor` vb.) `useThemeColors()` kullanılır — hex literal yazılmaz.
- `shadow-*` sınıfları yasaktır (flat design); derinlik zemin/kart renk farkı ile verilir.
- Kullanım örnekleri ve tüm kurallar için kök `CLAUDE.md` PART 1 esastır.
