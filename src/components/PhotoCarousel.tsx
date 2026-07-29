import { useEffect, useRef, useState } from 'react'

// Carrossel de fotos estilo Instagram: uma foto por vez (scroll-snap horizontal,
// swipe no touch/trackpad) com dots sobre a foto. Auto-play a cada 3s (pausa no
// hover, respeita prefers-reduced-motion). `data-lenis-prevent` impede o Lenis
// de sequestrar o scroll horizontal interno.
export function PhotoCarousel({ photos }: { photos: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const onScroll = () => {
    const el = trackRef.current
    if (!el) return
    setIndex(Math.round(el.scrollLeft / el.clientWidth))
  }
  const goTo = (i: number) => {
    const el = trackRef.current
    if (!el) return
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }

  // Auto-play: avança pra próxima foto a cada 3s (lê a posição atual do DOM, então
  // continua de onde o usuário parou). Some no hover e pra quem prefere menos motion.
  useEffect(() => {
    if (photos.length <= 1 || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      const el = trackRef.current
      if (!el) return
      const cur = Math.round(el.scrollLeft / el.clientWidth)
      const next = (cur + 1) % photos.length
      el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' })
    }, 3000)
    return () => clearInterval(id)
  }, [photos.length, paused])

  if (photos.length === 0) return null

  return (
    <div
      className="relative min-h-[200px] flex-1 overflow-hidden rounded-md bg-paper-sunken"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        onScroll={onScroll}
        data-lenis-prevent
        className="flex size-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((src, i) => (
          <div key={i} className="relative size-full shrink-0 snap-center">
            <img
              src={src}
              alt=""
              loading="lazy"
              draggable={false}
              className="absolute inset-0 size-full select-none object-cover"
            />
          </div>
        ))}
      </div>

      {photos.length > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
          <div className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-black/25 px-2 py-1.5 backdrop-blur">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Foto ${i + 1}`}
                className={`size-1.5 rounded-full transition-all ${
                  i === index ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
