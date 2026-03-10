export function sanitizeText(value: string) {
  return value
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[<>]/g, '');
}

export function sanitizeEmail(value: string) {
  return value.trim().toLowerCase();
}