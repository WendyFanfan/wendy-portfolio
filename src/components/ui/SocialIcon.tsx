import { Instagram } from 'lucide-react'

/** Monochrome marks that match the Lucide line icons used elsewhere. */
export function SocialIcon({ id, size = 16 }: { id: 'xiaohongshu' | 'instagram' | 'x'; size?: number }) {
  if (id === 'instagram') return <Instagram size={size} />
  if (id === 'x')
    return (
      <svg width={size - 2} height={size - 2} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  // Xiaohongshu has no line-icon convention; its English brand name "RED" reads cleanly at icon size.
  return (
    <span style={{ fontSize: size * 0.56, fontWeight: 700, letterSpacing: '0.04em', lineHeight: 1 }} aria-hidden>
      RED
    </span>
  )
}
