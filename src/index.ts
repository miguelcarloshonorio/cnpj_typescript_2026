const BODY_LENGTH = 12;
const FULL_LENGTH = 14;
const FIRST_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const SECOND_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const BODY_PATTERN = /^[0-9A-Z]{12}$/;
const FULL_PATTERN = /^[0-9A-Z]{12}[0-9]{2}$/;
const FORMATTED_PATTERN = /^([0-9A-Z]{2})([0-9A-Z]{3})([0-9A-Z]{3})([0-9A-Z]{4})([0-9]{2})$/;

export type CnpjParts = {
  raiz: string;
  ordem: string;
  dv: string;
};

export function normalize(value: string): string {
  return value.replace(/[^0-9A-Za-z]/g, "").toUpperCase();
}

export function isFormatted(value: string): boolean {
  return /^[0-9A-Z]{2}\.[0-9A-Z]{3}\.[0-9A-Z]{3}\/[0-9A-Z]{4}-[0-9]{2}$/.test(
    value.toUpperCase(),
  );
}

export function format(value: string): string {
  const normalized = normalize(value);
  if (!FULL_PATTERN.test(normalized)) {
    throw new Error("CNPJ must contain 12 alphanumeric characters followed by 2 numeric check digits.");
  }

  const match = normalized.match(FORMATTED_PATTERN);
  if (!match) {
    throw new Error("Invalid CNPJ.");
  }

  return `${match[1]}.${match[2]}.${match[3]}/${match[4]}-${match[5]}`;
}

export function split(value: string): CnpjParts {
  const normalized = normalize(value);
  if (!FULL_PATTERN.test(normalized)) {
    throw new Error("Invalid CNPJ.");
  }

  return {
    raiz: normalized.slice(0, 8),
    ordem: normalized.slice(8, 12),
    dv: normalized.slice(12),
  };
}

export function charValue(char: string): number {
  const code = char.toUpperCase().charCodeAt(0);
  if (code >= 48 && code <= 57) {
    return code - 48;
  }

  if (code >= 65 && code <= 90) {
    return code - 48;
  }

  throw new Error(`Invalid CNPJ character: ${char}`);
}

function computeDigit(base: string, weights: number[]): number {
  const sum = [...base].reduce((total, char, index) => {
    return total + charValue(char) * weights[index];
  }, 0);

  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function calculateCheckDigits(base: string): string {
  const normalized = normalize(base);
  if (!BODY_PATTERN.test(normalized)) {
    throw new Error("Base CNPJ must contain exactly 12 alphanumeric characters.");
  }

  const firstDigit = computeDigit(normalized, FIRST_WEIGHTS);
  const secondDigit = computeDigit(`${normalized}${firstDigit}`, SECOND_WEIGHTS);

  return `${firstDigit}${secondDigit}`;
}

export function generate(base: string): string {
  const normalized = normalize(base);
  return `${normalized}${calculateCheckDigits(normalized)}`;
}

export function validate(value: string): boolean {
  const normalized = normalize(value);
  if (!FULL_PATTERN.test(normalized)) {
    return false;
  }

  const base = normalized.slice(0, BODY_LENGTH);
  const dv = normalized.slice(BODY_LENGTH, FULL_LENGTH);
  return calculateCheckDigits(base) === dv;
}

export function assertValid(value: string): string {
  const normalized = normalize(value);
  if (!validate(normalized)) {
    throw new Error("Invalid CNPJ.");
  }

  return normalized;
}
