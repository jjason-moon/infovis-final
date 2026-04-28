'use client'
import { useEffect } from 'react'

export default function ScrollObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) e.target.classList.add('visible')
        })
      },
      { threshold: 0.1 }
    )

    // observe all current .reveal elements
    const observe = () => {
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    }

    observe()

    // also re-observe when new elements are added (dynamic components loading in)
    const mutationObs = new MutationObserver(observe)
    mutationObs.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObs.disconnect()
    }
  }, [])

  return null
}