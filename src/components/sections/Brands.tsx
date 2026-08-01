import { useEffect, useRef, useState } from 'react'
import { FadeIn } from '@/components/primitives/FadeIn'
import { useLocale } from '@/lib/i18n'
import { copyFor, type Brand } from '@/content'

/**
 * A faixa de marcas, entre o hero e os cases.
 *
 * **Ela é só a pista, sem título nem linha de apoio, por decisão do autor em
 * 31/07/2026.** Antes tinha os dois, vivia depois dos cases, e o argumento
 * registrado era que credencial pedida antes da prova é postura de landing page.
 * O que mudou não foi o argumento, foi o objeto: uma faixa com título é uma
 * afirmação e precisa ter sido merecida; uma pista de logos sozinha é contexto, e
 * contexto pertence perto da abertura. **Se o título voltar, o lugar volta com
 * ele** — os dois foram a mesma decisão.
 *
 * **O que se perdeu junto, e é o custo real: a ressalva de qualidade.** Ela vivia
 * na linha abaixo do título e dizia que estas oito não são oito empregos — sem
 * ela, oito marcas em fila afirmam por associação uma carreira que não é a dele.
 * O texto continua em `brands.lead`, sem ninguém renderizar. **A leitura inflada
 * é hoje um risco aberto**, e há três saídas se ele incomodar: devolver a linha
 * sozinha sob a pista, qualificar no `alt` de cada marca, ou voltar o par
 * título+ressalva e com ele o lugar antigo.
 *
 * **Este é o segundo movimento em laço do site, e o registro importa.** O
 * DESIGN.md dizia que a seta do hero era o único, com o argumento de que um
 * segundo laço tira dela o que a faz convidar. O autor derrubou a regra ao
 * escolher o laço contínuo, e o argumento continua valendo como limite: um
 * terceiro não entra. Eles faziam coisas diferentes — a seta convida a descer, a
 * pista mostra que a lista não acabou na borda — e não se cruzavam, porque uma
 * vivia no pé da primeira dobra e a outra depois dos cases.
 *
 * **Subir a pista para logo abaixo do hero derrubou a metade "nunca na mesma
 * tela".** O chevron e os logos em marcha podem aparecer juntos durante a
 * rolagem, e isso é risco novo, não decisão tomada. Se o conjunto ficar inquieto,
 * quem cede é a pista, que anda por decoração, e não o chevron, que convida.
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
  /* `title` e `lead` continuam no arquivo de textos e não são lidos aqui. É
     conteúdo em espera, igual ao bloco de fotos do Sobre: se a ressalva voltar,
     ela volta pronta e nos dois idiomas. */
  const { items } = t.brands
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
     * **A exceção de abrir com padding acabou junto com o título.**
     *
     * A seção somava `pt` ao `pb` da vizinha de cima porque tinha três coisas
     * dentro e precisava de ar dos dois lados para não ler como rodapé da seção
     * anterior. Com só a pista, somar 96px em cima dos 208px do hero afastaria os
     * logos do que eles qualificam.
     *
     * Hoje ela obedece a regra geral do DESIGN.md — seção fecha com `pb` e nunca
     * abre — e o resultado é simetria de graça: o `pb` do hero põe a pista a
     * 112/208px abaixo dele, e este `pb`, que é o mesmo, põe os cases à mesma
     * distância. A pista fica entre as duas seções sem pertencer a nenhuma.
     */
    <section className="pb-[112px] md:pb-beat">
      {/* A faixa vive **fora do Container** para correr de borda a borda. Dentro
          dele ela pararia no respiro lateral, e a máscara desbotaria contra uma
          margem em vez de contra a borda da tela, que é onde o corte incomoda. */}
      <FadeIn>
        <div className="brand-rail" ref={railRef}>
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
