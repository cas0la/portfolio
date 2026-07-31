import { useEffect, useRef, useState } from 'react'
import { Container } from '@/components/primitives/Container'
import { FadeIn } from '@/components/primitives/FadeIn'
import { useLocale } from '@/lib/i18n'
import { copyFor, type Brand } from '@/content'

/**
 * A faixa de marcas, entre os cases e o Sobre.
 *
 * **Ela existe como credencial, e o lugar dela é depois da prova.** Antes dos
 * cases, uma fileira de logos pediria confiança antes de ter mostrado trabalho,
 * que é como uma landing page se apresenta. Depois deles, ela responde a uma
 * pergunta que a leitura já fez: em que contextos isso aconteceu.
 *
 * **A ressalva de qualidade é obrigatória.** Oito marcas em fila afirmam, por
 * associação, que ele trabalhou em todas elas como empregado. A linha abaixo do
 * título diz que não, e é o que separa esta faixa de uma afirmação inflada.
 *
 * **Este é o segundo movimento em laço do site, e o registro importa.** O
 * DESIGN.md dizia que a seta do hero era o único, com o argumento de que um
 * segundo laço tira dela o que a faz convidar. O autor derrubou a regra ao
 * escolher o laço contínuo, e o argumento continua valendo como limite: um
 * terceiro não entra. Os dois convivem porque nunca estão na mesma tela e porque
 * fazem coisas diferentes — a seta convida a descer, a faixa mostra que a lista
 * não acabou na borda.
 */
function BrandItem({ brand }: { brand: Brand }) {
  return (
    <li className="brand-item">
      {brand.logo ? (
        <img
          src={brand.logo}
          alt={brand.name}
          loading="lazy"
          decoding="async"
          className="brand-logo"
          data-tone={brand.tone}
        />
      ) : (
        /* Sem arquivo, o nome é a marca. Ele não finge ser logo: sai na família de
           display, no mesmo cinza dos logos, e some no instante em que o SVG
           entrar no conteúdo. */
        <span className="brand-word">{brand.name}</span>
      )}
    </li>
  )
}

export function Brands() {
  const { locale } = useLocale()
  const t = copyFor(locale)
  const { title, lead, items } = t.brands
  const railRef = useRef<HTMLDivElement | null>(null)
  const setRef = useRef<HTMLUListElement | null>(null)
  const [copies, setCopies] = useState(2)

  /*
   * **Duas cópias não bastam, e é isso que fazia a faixa "acabar na Garupa".**
   *
   * A pista anda exatamente a largura de uma cópia e volta ao início. No instante
   * antes de voltar, o que está à vista começa no fim da primeira cópia, então
   * ainda precisa existir uma tela inteira de conteúdo **depois** desse ponto. Com
   * duas cópias, o que sobra ali é exatamente uma cópia — e quando a lista é mais
   * estreita que a janela, ela não preenche a tela e aparece o vão.
   *
   * A conta é quantas cópias cabem na janela, mais uma para cobrir o trecho já
   * percorrido. Ela é medida e não chutada porque a largura da lista vai mudar:
   * cada nome que virar logo muda a largura da fileira inteira.
   */
  useEffect(() => {
    const rail = railRef.current
    const set = setRef.current
    if (!rail || !set || typeof ResizeObserver === 'undefined') return

    const measure = () => {
      const setWidth = set.getBoundingClientRect().width
      const railWidth = rail.getBoundingClientRect().width
      if (setWidth < 1) return
      setCopies(Math.max(2, Math.ceil(railWidth / setWidth) + 1))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(rail)
    observer.observe(set)
    return () => observer.disconnect()
  }, [items.length, locale])

  if (items.length === 0) return null

  return (
    /*
     * **Esta é a única seção que abre com padding, e é exceção declarada.**
     *
     * A regra do DESIGN.md é que seção fecha com `pb` e nunca abre, para o
     * intervalo entre duas seções ser contado uma vez só em vez de somar duas
     * margens. Aqui somar é o objetivo. As outras seções têm altura de sobra para
     * ocupar a própria dobra; esta tem título, uma linha e uma faixa, e com o
     * intervalo padrão ela aparecia junto com o pé dos cases ou com o topo do
     * Sobre, o que a fazia ler como rodapé da seção vizinha em vez de assunto
     * próprio.
     *
     * Mais acima do que abaixo, seguindo a mesma regra que vale para título.
     */
    <section className="pt-block pb-[112px] md:pt-section md:pb-beat">
      <Container>
        <FadeIn>
          <h2 className="measure text-h1 font-extrabold text-ink">{title}</h2>
          <p className="measure mt-3 text-body text-ink-soft">{lead}</p>
        </FadeIn>
      </Container>

      {/* A faixa vive **fora do Container** para correr de borda a borda. Dentro
          dele ela pararia no respiro lateral, e a máscara desbotaria contra uma
          margem em vez de contra a borda da tela, que é onde o corte incomoda. */}
      <FadeIn delay={0.06}>
        <div className="brand-rail mt-block" ref={railRef}>
          <div className="brand-run" style={{ ['--brand-copies' as string]: copies }}>
            <ul className="brand-set" ref={setRef}>
              {items.map((brand) => (
                <BrandItem key={brand.name} brand={brand} />
              ))}
            </ul>
            {/* As cópias existem só para fechar o laço, e não existem para quem
                ouve a página: repetir oito marcas várias vezes num leitor de tela
                transformaria a credencial em ruído. */}
            {Array.from({ length: copies - 1 }, (_, i) => (
              <ul className="brand-set" aria-hidden="true" key={i}>
                {items.map((brand) => (
                  <BrandItem key={brand.name} brand={brand} />
                ))}
              </ul>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
