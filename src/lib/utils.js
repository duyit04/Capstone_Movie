import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatNumber(number) {
  return new Intl.NumberFormat().format(number);
}

export function formatDate(date, format = 'DD/MM/YYYY') {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const map = {
    DD: String(d.getDate()).padStart(2, '0'),
    MM: String(d.getMonth() + 1).padStart(2, '0'),
    YYYY: d.getFullYear(),
    YY: String(d.getFullYear()).slice(2),
    HH: String(d.getHours()).padStart(2, '0'),
    mm: String(d.getMinutes()).padStart(2, '0'),
    ss: String(d.getSeconds()).padStart(2, '0'),
  };
  
  return format.replace(/DD|MM|YYYY|YY|HH|mm|ss/g, matched => map[matched]);
}

export function getInitials(name) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}
