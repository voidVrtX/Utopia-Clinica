// La UI captura/muestra fechas como "DD/MM/AAAA"; el backend (columnas DATE
// de Postgres) espera y devuelve "AAAA-MM-DD". Estos helpers convierten en
// la frontera entre la app y la API.

export function toISODate(ddmmyyyy: string | undefined): string | undefined {
  if (!ddmmyyyy) return undefined;
  const [d, m, y] = ddmmyyyy.split('/');
  if (!d || !m || !y) return undefined;
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

export function fromISODate(isoDate: string | undefined): string | undefined {
  if (!isoDate) return undefined;
  const [y, m, d] = isoDate.split('-');
  if (!y || !m || !d) return undefined;
  return `${d}/${m}/${y}`;
}
