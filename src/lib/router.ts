import { useEffect, useState } from 'react'

/**
 * Minimal path router (two routes don't justify a dependency).
 * Keeps ?lang=… when navigating so shared links stay in the chosen language.
 */
const EVENT = 'app:navigate'

export type Route = 'home' | 'creativity'

export const routeFromPath = (pathname: string): Route =>
  pathname.replace(/\/+$/, '') === '/creativity' ? 'creativity' : 'home'

export function navigate(path: string, { replace = false } = {}) {
  const url = new URL(path, window.location.origin)
  const lang = new URLSearchParams(window.location.search).get('lang')
  if (lang && !url.searchParams.has('lang')) url.searchParams.set('lang', lang)
  const target = url.pathname + url.search + url.hash
  if (replace) history.replaceState(null, '', target)
  else history.pushState(null, '', target)
  window.dispatchEvent(new Event(EVENT))
  window.scrollTo(0, 0)
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => routeFromPath(window.location.pathname))
  useEffect(() => {
    const update = () => setRoute(routeFromPath(window.location.pathname))
    window.addEventListener('popstate', update)
    window.addEventListener(EVENT, update)
    // A child may have navigated during the first render pass, before this listener existed.
    update()
    return () => {
      window.removeEventListener('popstate', update)
      window.removeEventListener(EVENT, update)
    }
  }, [])
  return route
}

/** Warm the gallery chunk early (e.g. while the camera flies to the Creative planet). */
export const loadCreativityPage = () => import('../pages/CreativityPage')
