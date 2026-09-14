import React, { useEffect, useRef } from 'react'
import { loadComponent } from '@eldon/h/clients/web/app'
import { ContentPageProps } from '@eldon/h/clients/web/page'
import Layout from './Layout.js'

/**
 * Particles orbiting the pointer on a canvas. Ported from the Hugo site's
 * `experiments/field-lines/orbit.js`.
 */
function OrbitField() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const resetRef = useRef<() => void>(() => {})

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!canvas || !ctx) {
            return
        }

        const pointer = { x: 0, y: 0, active: false }
        type Particle = { x: number; y: number; px: number; py: number; vx: number; vy: number }
        let particles: Particle[] = []
        let frame = 0

        const reset = () => {
            const { width, height } = canvas.getBoundingClientRect()
            particles = Array.from({ length: Math.min(160, Math.floor(width / 5)) }, (_, i) => {
                const angle = (i / 160) * Math.PI * 2
                const radius = 35 + Math.random() * Math.min(width, height) * 0.42
                return {
                    x: width / 2 + Math.cos(angle) * radius,
                    y: height / 2 + Math.sin(angle) * radius,
                    px: 0,
                    py: 0,
                    vx: Math.cos(angle + Math.PI / 2) * 0.35,
                    vy: Math.sin(angle + Math.PI / 2) * 0.35
                }
            })
            ctx.fillStyle = '#111713'
            ctx.fillRect(0, 0, width, height)
        }
        resetRef.current = reset

        const resize = () => {
            const rect = canvas.getBoundingClientRect()
            const scale = Math.min(window.devicePixelRatio, 2)
            canvas.width = rect.width * scale
            canvas.height = rect.height * scale
            ctx.setTransform(scale, 0, 0, scale, 0, 0)
            reset()
        }

        const tick = () => {
            const rect = canvas.getBoundingClientRect()
            ctx.fillStyle = 'rgba(17,23,19,.055)'
            ctx.fillRect(0, 0, rect.width, rect.height)
            const target = pointer.active ? pointer : { x: rect.width / 2, y: rect.height / 2 }
            particles.forEach((p, i) => {
                p.px = p.x
                p.py = p.y
                const dx = target.x - p.x
                const dy = target.y - p.y
                const distance = Math.max(45, Math.hypot(dx, dy))
                const pull = pointer.active ? 1.8 : 0.7
                p.vx += ((dx / distance) * pull) / Math.sqrt(distance)
                p.vy += ((dy / distance) * pull) / Math.sqrt(distance)
                p.vx *= 0.995
                p.vy *= 0.995
                p.x += p.vx
                p.y += p.vy
                if (p.x < 0 || p.x > rect.width || p.y < 0 || p.y > rect.height) {
                    p.x = rect.width / 2 + (Math.random() - 0.5) * 80
                    p.y = rect.height / 2 + (Math.random() - 0.5) * 80
                    p.px = p.x
                    p.py = p.y
                }
                ctx.beginPath()
                ctx.moveTo(p.px, p.py)
                ctx.lineTo(p.x, p.y)
                ctx.strokeStyle = `hsla(${12 + (i % 35)},75%,62%,.52)`
                ctx.lineWidth = 0.8
                ctx.stroke()
            })
            frame = requestAnimationFrame(tick)
        }

        const point = (event: PointerEvent) => {
            const rect = canvas.getBoundingClientRect()
            pointer.x = event.clientX - rect.left
            pointer.y = event.clientY - rect.top
            pointer.active = true
        }
        const leave = () => {
            pointer.active = false
        }

        canvas.addEventListener('pointermove', point)
        canvas.addEventListener('pointerleave', leave)
        window.addEventListener('resize', resize, { passive: true })
        resize()
        tick()

        return () => {
            cancelAnimationFrame(frame)
            canvas.removeEventListener('pointermove', point)
            canvas.removeEventListener('pointerleave', leave)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <div className='orbit_lab'>
            <canvas ref={canvasRef} aria-label='Interactive orbit simulation' />
            <div className='orbit_controls'>
                <p>Move your pointer across the field. The particles remember where you have been.</p>
                <button type='button' onClick={() => resetRef.current()}>
                    Reset field
                </button>
            </div>
        </div>
    )
}

const Page = (props: ContentPageProps<{}>) => {
    return (
        <Layout headerPosition='normal' state={props.state}>
            <div className='field_lines_page'>
                <h1>Drawing with Orbits</h1>
                <p className='field_lines_description'>
                    A tiny interactive sketch about attraction, momentum, and paths.
                </p>
                <OrbitField />
                <p className='field_lines_note'>
                    The sketch above is a minimal example of an interactive article: a React page with its own script
                    and stylesheet, living next to the markdown pages of the site.
                </p>
            </div>
        </Layout>
    )
}

const FieldLinesPage = loadComponent({
    component: Page
})
export default FieldLinesPage
