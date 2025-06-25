export function getOrEmptyGuid(id?: string | null): string {
  return id && id.trim() !== '' ? id : '00000000-0000-0000-0000-000000000000';
}
