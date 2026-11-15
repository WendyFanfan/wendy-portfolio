import { Suspense, lazy, useEffect } from 'react'
import Home from './pages/Home'
import { useI18n } from './i18n/I18nProvider'
import { loadCreativityPage, useRoute } from './lib/router'

const CreativityPage = lazy(loadCreativityPage)
const LegalPage = lazy(() => import('./pages/LegalPage'))

export default function App() {
  const route = useRoute()
  const { t } = useI18n()

  // Per-route document title and description (kept here so they follow both route and language).
  useEffect(() => {
    const meta =
      route === 'creativity'
        ? t.creativity.meta
        : route === 'impressum'
          ? { title: `${t.legal.imprintTitle} | ${t.hero.siteName}`, description: t.meta.description }
          : route === 'privacy'
            ? { title: `${t.legal.privacyTitle} | ${t.hero.siteName}`, description: t.meta.description }
            : t.meta
    document.title = meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description)
  }, [route, t])

  if (route === 'impressum' || route === 'privacy') {
    return (
      <Suspense fallback={<div className="min-h-[100dvh] bg-space-900" />}>
        <LegalPage kind={route === 'impressum' ? 'impressum' : 'privacy'} />
      </Suspense>
    )
  }
  if (route === 'creativity') {
    return (
      <Suspense fallback={<div className="min-h-[100dvh] bg-space-900" />}>
        <CreativityPage />
      </Suspense>
    )
  }
  return <Home />
}
