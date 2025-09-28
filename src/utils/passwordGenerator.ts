import { GeneratorOptions, PasswordStrength } from '../types';

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const SIMILAR_CHARS = /[0O1lI|]/g;

export function generatePassword(options: GeneratorOptions): string {
  let charset = '';
  let password = '';

  // Build character set based on options
  if (options.includeUppercase) charset += UPPERCASE;
  if (options.includeLowercase) charset += LOWERCASE;
  if (options.includeNumbers) charset += NUMBERS;
  if (options.includeSymbols) charset += SYMBOLS;

  if (!charset) return '';

  // Remove similar characters if requested
  if (options.excludeSimilar) {
    charset = charset.replace(SIMILAR_CHARS, '');
  }

  // Generate password ensuring at least one character from each selected type
  const requiredChars: string[] = [];
  if (options.includeUppercase) {
    const chars = options.excludeSimilar ? UPPERCASE.replace(SIMILAR_CHARS, '') : UPPERCASE;
    requiredChars.push(chars[Math.floor(Math.random() * chars.length)]);
  }
  if (options.includeLowercase) {
    const chars = options.excludeSimilar ? LOWERCASE.replace(SIMILAR_CHARS, '') : LOWERCASE;
    requiredChars.push(chars[Math.floor(Math.random() * chars.length)]);
  }
  if (options.includeNumbers) {
    const chars = options.excludeSimilar ? NUMBERS.replace(SIMILAR_CHARS, '') : NUMBERS;
    requiredChars.push(chars[Math.floor(Math.random() * chars.length)]);
  }
  if (options.includeSymbols) {
    requiredChars.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
  }

  // Add required characters
  password += requiredChars.join('');

  // Fill remaining length with random characters
  for (let i = password.length; i < options.length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  let score = 0;

  // Length scoring
  if (password.length >= 12) score += 2;
  else if (password.length >= 8) score += 1;

  // Character variety scoring
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  // Additional complexity
  if (password.length >= 16) score += 1;
  if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/.test(password)) score += 1;

  if (score >= 7) return 'very-strong';
  if (score >= 5) return 'strong';
  if (score >= 3) return 'good';
  if (score >= 2) return 'fair';
  return 'weak';
}

export function getStrengthColor(strength: PasswordStrength): string {
  switch (strength) {
    case 'very-strong': return 'text-green-600';
    case 'strong': return 'text-green-500';
    case 'good': return 'text-yellow-500';
    case 'fair': return 'text-orange-500';
    case 'weak': return 'text-red-500';
  }
}

export function getStrengthBgColor(strength: PasswordStrength): string {
  switch (strength) {
    case 'very-strong': return 'bg-green-500';
    case 'strong': return 'bg-green-400';
    case 'good': return 'bg-yellow-400';
    case 'fair': return 'bg-orange-400';
    case 'weak': return 'bg-red-400';
  }
}