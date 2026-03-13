'use client'

import { Link } from '@/i18n/navigation'
import { usePageTransition } from './page-transition'
import { type ComponentProps } from 'react'

type TransitionLinkProps = ComponentProps<typeof Link>

export function TransitionLink({ href, locale, onClick, ...props }: TransitionLinkProps) {
  const { navigate, isAnimating } = usePageTransition()

  return (
    <Link
      href={href}
      locale={locale}
      onClick={(e) => {
        e.preventDefault()
        onClick?.(e)
        if (!isAnimating) {
          navigate(href.toString(), locale as string | undefined)
        }
      }}
      {...props}
    />
  )
}
