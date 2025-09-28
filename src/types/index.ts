export interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  website?: string;
  category: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
}

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';