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
/*
 * **Marcas se igualam por área, não por altura nem por largura.**
 *
 * As oito vão de 2,6:1 (Garupa) a 7,1:1 (Banco do Brasil). Igualar a altura faz a
 * mais larga ocupar quase três vezes o papel da mais compacta; igualar a largura
 * faz o contrário, e foi o que aconteceu com o teto de 12rem — ele derrubou o
 * Banco do Brasil para 27px de altura enquanto Brivia e Nexfar ficavam com os 48
 * cheios. Os dois critérios erram porque nenhum descreve o que o olho compara,
 * que é quanta tinta a marca põe na página.
 *
 * Área constante é a régua que os designers usam à mão para mural de logo, e ela
 * tem forma fechada: com área A e proporção r, a altura é `√(A/r)`. Marca compacta
 * fica alta e estreita, marca comprida fica baixa e larga, e as duas ocupam o
 * mesmo tanto de papel.
 *
 * **A proporção é medida do arquivo, não tabelada.** `naturalWidth/naturalHeight`
 * vem do próprio SVG, então trocar um logo reajusta o tamanho dele sozinho — que é
 * o que evita uma tabela de números mágicos envelhecendo em silêncio a cada troca
 * de arquivo.
 *
 * Os limites existem para o caso extremo: uma marca quadrada pediria altura demais
 * e uma faixa muito comprida sumiria. Dentro deles, `scale` no conteúdo é o ajuste
 * fino para quando o olho discordar da conta.
 */
const BRAND_AREA = 7744
const BRAND_MIN_H = 32
const BRAND_MAX_H = 56

function fitByArea(event: React.SyntheticEvent<HTMLImageElement>, scale = 1) {
  const img = event.currentTarget
  const ratio = img.naturalWidth / img.naturalHeight
  if (!Number.isFinite(ratio) || ratio <= 0) return
  const raw = Math.sqrt(BRAND_AREA / ratio) * scale
  img.style.height = `${Math.min(BRAND_MAX_H, Math.max(BRAND_MIN_H, raw))}px`
}

function BrandItem({ brand }: { brand: Brand }) {
  return (
    <li className="brand-item">
      {brand.logo ? (
        <img
          src={brand.logo}
          alt={brand.name}
          /* **Sem `lazy` aqui, e é por causa do cálculo.** O tamanho de cada marca
             sai do `onLoad`, e imagem adiada não dispara evento até entrar em
             cena — as cópias da direita ficariam nos 3rem do palpite inicial,
             com altura diferente das mesmas marcas à esquerda. São oito SVGs
             pequenos, reusados em todas as cópias e servidos do cache. */
          decoding="async"
          onLoad={(event) => fitByArea(event, brand.scale)}
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
      /* O teto de 6 é contra o transitório, não contra o cálculo. Antes das
         imagens carregarem a lista mede quase só o padding, e a divisão pedia dez
         ou mais cópias — dez listas montadas e desmontadas no frame seguinte,
         quando o observador remede com a largura real. */
      setCopies(Math.min(6, Math.max(2, Math.ceil(railWidth / setWidth) + 1)))
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
     * **Os dois lados têm que somar igual, e é isso que a conta abaixo faz.** O vão
     * de cima é o fecho dos cases mais a abertura desta seção; o de baixo é só o
     * fecho dela, porque o Sobre não abre com padding. Repetindo o mesmo `pb` das
     * outras seções, a marca ficava com 160px em cima e 112px embaixo, e o autor
     * leu a diferença de imediato. O `pb` daqui é a soma que o topo já produz:
     * 112 + 48 no telefone, 208 + 96 acima de md.
     */
    <section className="pt-block pb-[160px] md:pt-section md:pb-[304px]">
      <Container>
        <FadeIn>
          {/* `mt-4` e não `mt-3`. A grade de espaçamento do DESIGN.md é de 8px, o
              que na escala do Tailwind quer dizer só os pares; `mt-3` são 12px e
              fura. Doze contra dezesseis não se vê sozinho, e é justamente por
              isso que a grade existe: o que se vê é a página inteira meio fora de
              esquadro depois de vinte decisões dessas. */}
          <h2 className="measure text-balance text-h1 font-extrabold text-ink">
            {title}
          </h2>
          {/* `text-pretty` no lead porque ele quebra em duas linhas na maioria das
              larguras, e sem isso a primeira terminava no "e" solto de "negócio,
              e". Conjunção órfã no fim da linha faz o olho voltar para conferir se
              perdeu alguma coisa. */}
          <p className="measure mt-4 text-pretty text-body text-ink-soft">{lead}</p>
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
