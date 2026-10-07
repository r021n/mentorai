import type { InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  type?: string
  value: string
  onValueChange?: (value: string) => void
  label?: string
  error?: string
  className?: string
}

export function Input({
  type = 'text',
  value,
  onValueChange,
  label,
  id,
  error,
  required,
  className,
  ...rest
}: InputProps) {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={id} className="text-xs font-semibold text-neutral-800 tracking-wide uppercase">
          {label}
          {required ? <span className="text-neutral-900">*</span> : null}
        </label>
      ) : null}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onValueChange?.(event.target.value)}
        required={required}
        className={cn(
          'w-full px-3.5 py-2 text-sm bg-white border border-neutral-300 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors disabled:bg-neutral-100 disabled:text-neutral-400',
          error ? 'border-neutral-900' : '',
          className,
        )}
        {...rest}
      />
      {error ? <p className="text-xs text-neutral-700 font-medium">{error}</p> : null}
    </div>
  )
}
