import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';
import { enAU } from 'date-fns/locale';

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd/MM/yyyy', { locale: enAU });
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd/MM/yyyy h:mm a', { locale: enAU });
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (isToday(d)) return formatDistanceToNow(d, { addSuffix: true, locale: enAU });
  if (isYesterday(d)) return 'yesterday';
  return formatDistanceToNow(d, { addSuffix: true, locale: enAU });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 2 }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-AU').format(num);
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}
