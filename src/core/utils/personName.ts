type NamedPerson = { firstName?: string | null; lastName?: string | null }

export function getFullName(person: NamedPerson | null | undefined): string {
  if (!person) return ''
  return `${person.firstName ?? ''} ${person.lastName ?? ''}`.trim()
}

export function getInitials(person: NamedPerson | null | undefined): string {
  if (!person) return ''
  return `${person.firstName?.[0] ?? ''}${person.lastName?.[0] ?? ''}`.toUpperCase()
}
