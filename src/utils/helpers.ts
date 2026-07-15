export function uid(prefix = ''): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function maskEmail(email: string): string {
  const [user, domain] = email.split('@');
  if (!user || !domain) return email;
  const visible = user.slice(0, 2);
  return `${visible}${'*'.repeat(Math.max(user.length - 2, 3))}@${domain}`;
}

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

export function formatFechaLarga(fechaISO: string): string {
  const [y, m, d] = fechaISO.split('-').map(Number);
  const date = new Date(y, (m || 1) - 1, d || 1);
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  return `${dias[date.getDay()]} ${d} de ${MESES[(m || 1) - 1]} de ${y}`;
}

export function formatFechaCorta(fechaISO: string): string {
  const [y, m, d] = fechaISO.split('-').map(Number);
  return `${d} de ${MESES[(m || 1) - 1]} de ${y}`;
}

export function initials(nombre: string): string {
  return nombre
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
