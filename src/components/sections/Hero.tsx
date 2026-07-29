import { Container } from '@/components/primitives/Container'
import { FadeIn } from '@/components/primitives/FadeIn'

export function Hero() {
  return (
    <section id="top" className="relative scroll-mt-20 overflow-hidden">
      {/* glow lima ao fundo (modelado no hero do Kyne, cor da marca) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-[radial-gradient(50%_70%_at_50%_100%,rgba(170,238,134,0.55),transparent_70%)]"
      />

      <Container className="relative flex min-h-[92svh] flex-col items-center justify-center py-24 text-center">
        <FadeIn>
          <h1 className="font-display text-display leading-[1.05] text-ink md:leading-[0.98]">
            <span className="block">
              hi, I'm <span className="italic">Your Name</span>
            </span>
            <span className="block">Product Designer</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.12}>
          <p className="mt-8 max-w-2xl text-balance text-body-lg text-ink-muted">
            Focused on UI and the craft of getting the details right. Always
            exploring new tools and ideas.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <span className="label mt-14 block !text-ink-subtle">
            Scroll down &amp; explore
          </span>
        </FadeIn>
      </Container>
    </section>
  )
}
