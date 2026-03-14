import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export function PageTitle({ title }: { title: string }) {
  useEffect(() => { document.title = title }, [title])
  return null
}
