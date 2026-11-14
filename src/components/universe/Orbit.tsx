import { memo, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  rx: number
  rz: number
  color: string
  highlighted: boolean
  dimmed: boolean
}

function OrbitImpl({ rx, rz, color, highlighted, dimmed }: Props) {
  const line = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const n = 160
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(a) * rx, 0, -Math.sin(a) * rz))
    }
    const g = new THREE.BufferGeometry().setFromPoints(pts)
    const m = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.16, depthWrite: false })
    return new THREE.Line(g, m)
  }, [rx, rz, color])
  const target = highlighted ? 0.5 : dimmed ? 0.05 : 0.16
  const mat = line.material as THREE.LineBasicMaterial
  const ref = useRef(mat)
  ref.current = mat

  useFrame(() => {
    ref.current.opacity += (target - ref.current.opacity) * 0.08
  })

  return <primitive object={line} />
}

export const Orbit = memo(OrbitImpl)
