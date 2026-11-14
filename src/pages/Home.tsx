import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { planets, type FocusId, type PlanetId } from '../data/planets'
import { ContactPanel } from '../components/ui/ContactPanel'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'
import { FallbackUniverse } from '../components/ui/FallbackUniverse'
import { Instructions } from '../components/ui/Instructions'
import { LoadingScreen } from '../components/ui/LoadingScreen'
import { Navigation, type NavTarget } from '../components/ui/Navigation'
import { PlanetPanel } from '../components/ui/PlanetPanel'
import { SunCard } from '../components/ui/SunCard'
import { Toast } from '../components/ui/Toast'
import { hasWebGL, isLowPowerDevice } from '../lib/device'
import { useMediaQuery } from '../lib/useMediaQuery'
import { loadCreativityPage, navigate } from '../lib/router'
import { useI18n } from '../i18n/I18nProvider'

const SolarSystem = lazy(() => import('../components/universe/SolarSystem'))

type View = { kind: 'universe' } | { kind: 'sun' } | { kind: 'planet'; id: PlanetId } | { kind: 'contact' }

const navToPlanet: Partial<Record<NavTarget, PlanetId>> = {
  projects: 'engineering',
  photography: 'creative',
}

const planetIds = new Set<string>(planets.map((p) => p.id))

function viewFromHash(): View {
  const h = window.location.hash.replace('#', '')
  // The Creative planet lives on its own page; #creative is redirected on mount.
  if (planetIds.has(h) && h !== 'creative') return { kind: 'planet', id: h as PlanetId }
  if (h === 'contact') return { kind: 'contact' }
  if (h === 'about') return { kind: 'sun' }
  return { kind: 'universe' }
}

export default function Home() {
  const { t, locale } = useI18n()
  const [webgl] = useState(hasWebGL)
  const [sceneFailed, setSceneFailed] = useState(false)
  const [lowPower] = useState(isLowPowerDevice)
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const isWide = useMediaQuery('(min-width: 768px)')
  const panelSide = isWide ? 'right' : 'bottom'

  const [view, setView] = useState<View>(viewFromHash)
  const [hoveredId, setHoveredId] = useState<FocusId | null>(null)
  const [ready, setReady] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number>()
  /** Fly-in to the Creative planet, then a glow veil, then the /creativity page. */
  const [entering, setEntering] = useState<'off' | 'flying' | 'veil'>('off')
  const transitTimers = useRef<number[]>([])
  /** Captured before any effect rewrites the URL. */
  const initialHash = useRef(window.location.hash)

  const use3D = webgl && !sceneFailed
  const focusId: FocusId | null = view.kind === 'planet' ? view.id : view.kind === 'sun' ? 'sun' : null

  // Never keep visitors waiting: the loader hides after the first frame (or a safety timeout).
  useEffect(() => {
    if (!use3D) {
      const t = setTimeout(() => setReady(true), 350)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setReady(true), 6000)
    return () => clearTimeout(t)
  }, [use3D])

  const onReady = useCallback(() => setTimeout(() => setReady(true), 250), [])

  // Keep the URL shareable (#engineering, #contact …). The Creative fly-in never writes a hash,
  // so the browser's Back button from /creativity lands cleanly on the universe.
  useEffect(() => {
    const hash =
      view.kind === 'planet' && view.id !== 'creative'
        ? `#${view.id}`
        : view.kind === 'contact'
          ? '#contact'
          : view.kind === 'sun'
            ? '#about'
            : ''
    // Keep ?lang=… when clearing the hash.
    if (window.location.hash !== hash) history.replaceState(null, '', window.location.pathname + window.location.search + hash)
  }, [view])

  useEffect(() => {
    const onHash = () => setView(viewFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Old links to /#creative → the dedicated page (no extra history entry).
  useEffect(() => {
    if (initialHash.current === '#creative') navigate('/creativity', { replace: true })
  }, [])

  const clearTransit = useCallback(() => {
    transitTimers.current.forEach(clearTimeout)
    transitTimers.current = []
  }, [])
  useEffect(() => clearTransit, [clearTransit])

  const goUniverse = useCallback(() => {
    clearTransit()
    setEntering('off')
    setView({ kind: 'universe' })
  }, [clearTransit])

  const startCreativity = useCallback(() => {
    void loadCreativityPage() // fetch the gallery while the camera is moving
    setHoveredId(null)
    if (!use3D || reducedMotion) {
      navigate('/creativity')
      return
    }
    clearTransit()
    setView({ kind: 'planet', id: 'creative' })
    setEntering('flying')
    transitTimers.current = [
      window.setTimeout(() => setEntering('veil'), 1300),
      window.setTimeout(() => navigate('/creativity'), 2050),
    ]
  }, [use3D, reducedMotion, clearTransit])

  const selectPlanet = useCallback(
    (id: PlanetId) => {
      if (id === 'creative') return startCreativity()
      setHoveredId(null)
      setView({ kind: 'planet', id })
    },
    [startCreativity],
  )
  /** The sun (Wendy) opens the personal introduction; planets open their panels. */
  const select = useCallback(
    (id: FocusId) => {
      if (id === 'sun') {
        setHoveredId(null)
        setView({ kind: 'sun' })
      } else selectPlanet(id)
    },
    [selectPlanet],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') goUniverse()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goUniverse])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 3200)
  }, [])
  const onCvUnavailable = useCallback(() => showToast(t.cvToast), [showToast, t])

  const onNavigate = useCallback(
    (t: NavTarget) => {
      if (t === 'universe') return goUniverse()
      if (t === 'contact') return setView({ kind: 'contact' })
      if (t === 'about') return setView({ kind: 'sun' })
      const id = navToPlanet[t]
      if (id) selectPlanet(id)
    },
    [goUniverse, selectPlanet],
  )

  const activeNav: NavTarget | null = useMemo(() => {
    if (view.kind === 'universe') return 'universe'
    if (view.kind === 'contact') return 'contact'
    if (view.kind === 'sun') return 'about'
    const entry = Object.entries(navToPlanet).find(([, id]) => id === view.id)
    return (entry?.[0] as NavTarget) ?? null
  }, [view])

  const fallback = <FallbackUniverse onSelect={select} dimmed={view.kind !== 'universe'} />

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden">
      <div className="nebula" aria-hidden />

      <main aria-label="Wendy's Universe">
        {use3D ? (
          <ErrorBoundary fallback={fallback} onError={() => setSceneFailed(true)}>
            <Suspense fallback={null}>
              <SolarSystem
                focusId={focusId}
                hoveredId={hoveredId}
                onHover={setHoveredId}
                onSelect={select}
                onReady={onReady}
                reducedMotion={reducedMotion}
                lowPower={lowPower}
                panelSide={panelSide}
                locale={locale}
              />
            </Suspense>
          </ErrorBoundary>
        ) : (
          fallback
        )}

        {view.kind === 'contact' && <div className="scrim" onClick={goUniverse} aria-hidden />}

        <Instructions visible={ready && view.kind === 'universe'} hoveredId={hoveredId} onHover={setHoveredId} onSelect={select} />

        <AnimatePresence mode="wait">
          {view.kind === 'planet' && (
            <PlanetPanel key={view.id} id={view.id} side={panelSide} onClose={goUniverse} onSelect={selectPlanet} reducedMotion={reducedMotion} />
          )}
          {view.kind === 'sun' && (
            <SunCard
              key="sun"
              side={panelSide}
              reducedMotion={reducedMotion}
              onClose={goUniverse}
              onJourney={() => selectPlanet('journey')}
              onContact={() => setView({ kind: 'contact' })}
              onCvUnavailable={onCvUnavailable}
            />
          )}
          {view.kind === 'contact' && (
            <ContactPanel key="contact" side={panelSide} onClose={goUniverse} onCvUnavailable={onCvUnavailable} reducedMotion={reducedMotion} />
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {entering === 'veil' && (
          <motion.div
            key="veil"
            className="planet-glow-veil planet-glow-veil--enter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.75, ease: [0.4, 0, 0.2, 1] } }}
            role="status"
            aria-live="polite"
          >
            <span className="planet-glow-veil__text">{t.creativity.entering}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Navigation active={activeNav} onNavigate={onNavigate} onCvUnavailable={onCvUnavailable} />
      <Toast message={toast} />
      <LoadingScreen visible={!ready} />
    </div>
  )
}
