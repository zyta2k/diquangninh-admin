import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type FormatCurrencyOptions = {
  /** Force a currency symbol (default: `$`) */
  currencySymbol?: string
  /** Number of decimals to show after scaling. If not provided, uses smart defaults. */
  decimals?: number | null
}

/**
 * Format a number or dollar string into a compact currency string.
 * Examples:
 *  - 10000 -> $10k
 *  - "$1500" -> $1.5k
 */
export function formatCurrencyShort(
  input: number | string,
  opts: FormatCurrencyOptions = {},
) {
  const currencySymbol = opts.currencySymbol ?? '$'

  let n: number
  if (typeof input === 'string') {
    // strip common currency characters and commas
    const cleaned = input.replace(/[^0-9.\-]/g, '')
    n = Number(cleaned)
  } else {
    n = input
  }

  if (!Number.isFinite(n) || Number.isNaN(n)) return String(input)

  const negative = n < 0
  const abs = Math.abs(n)

  if (abs < 1000) {
    return `${negative ? '-' : ''}${currencySymbol}${abs}`
  }

  const units = ['k', 'M', 'B', 'T']
  let value = abs
  let unit = ''
  let i = -1
  while (value >= 1000 && i < units.length - 1) {
    value = value / 1000
    i++
  }

  if (i >= 0) unit = units[i]

  // smart decimals: if caller provided decimals use it; otherwise show 1 decimal for <10, else 0
  const decimals = typeof opts.decimals === 'number' ? opts.decimals : value < 10 ? 1 : 0

  const formatted = value.toFixed(decimals).replace(/\.0+$/, '')

  return `${negative ? '-' : ''}${currencySymbol}${formatted}${unit}`
}
