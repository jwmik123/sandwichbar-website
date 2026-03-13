'use client'

import Link from 'next/link'
import { usePageTransition } from './page-transition'
import { type ComponentProps } from 'react'

type TransitionLinkProps = ComponentProps<typeof Link>

export function TransitionLink({ href, onClick, ...props }: TransitionLinkProps) {
  const { navigate, isAnimating } = usePageTransition()

  return (
    <Link
      href={href}
      onClick={(e) => {
        e.preventDefault()
        onClick?.(e)
        if (!isAnimating) {
          navigate(href.toString())
        }
      }}
      {...props}
    />
  )
}
