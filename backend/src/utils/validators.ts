// Valida formato e dígitos verificadores do CPF brasileiro
export function isValidCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '');

  if (cleaned.length !== 11 || /^(\d)\1+$/.test(cleaned)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cleaned[i]!) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned[9]!)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cleaned[i]!) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned[10]!)) return false;

  return true;
}

// Valida formato de e-mail
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

// Valida se um campo não está vazio
export function isNotEmpty(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}

// Valida formato e dígito verificador do ISSN (NNNN-NNNN)
export function isValidISSN(issn: string): boolean {
  const cleaned = issn.replace(/\s/g, '').toUpperCase();

  const issnRegex = /^\d{4}-\d{3}[\dX]$/;
  if (!issnRegex.test(cleaned)) return false;

  const digits = cleaned.replace('-', '');

  let sum = 0;
  for (let i = 0; i < 7; i++) {
    sum += parseInt(digits[i]!) * (8 - i);
  }

  const remainder = sum % 11;
  const checkDigit = 11 - remainder;

  const lastChar = digits[7]!;

  // Se checkDigit = 10 → dígito deve ser X
  if (checkDigit === 10) return lastChar === 'X';

  // Se checkDigit = 11 → dígito deve ser 0
  if (checkDigit === 11) return lastChar === '0';

  return parseInt(lastChar) === checkDigit;
}
