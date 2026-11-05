import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { buttonClassName } from './button-styles'
import type { ButtonSize, ButtonVariant } from './button-styles'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={buttonClassName({ variant, size, className })} {...rest}>
      {children}
    </button>
  )
}
