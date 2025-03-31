import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateForInput = (
  date: Date | string | undefined | null
): string => {
  if (!date) return '';

  if (typeof date === 'string') {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return '';
    date = parsedDate;
  }

  return date.toISOString().split('T')[0];
};

export const formatDate = (date: Date | null) => {
  return date ? new Date(date).toLocaleDateString() : 'Not provided';
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Formats a date with time including seconds
 * @param date The date to format
 * @returns Formatted date string with time including seconds
 */
export function formatDateWithTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function setDateWithCurrentTime(dateInput?: Date | string): Date {
  const baseDate = dateInput ? new Date(dateInput) : new Date();
  const now = new Date();
  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds()
  );
}

const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

// Convert UUID (hex) to Base62
export function uuidToBase62(uuid: string): string {
  let num = BigInt('0x' + uuid.replace(/-/g, ''));
  let base62 = '';

  while (num > BigInt(0)) {
    base62 = BASE62[Number(num % BigInt(62))] + base62;
    num /= BigInt(62);
  }

  return base62.padStart(22, '0'); // Ensures a fixed length
}

export function base62ToUuid(base62: string): string {
  let num = BigInt(0);

  for (const char of base62) {
    num = num * BigInt(62) + BigInt(BASE62.indexOf(char));
  }

  const hex = num.toString(16).padStart(32, '0'); // Ensure 32 hex chars

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
