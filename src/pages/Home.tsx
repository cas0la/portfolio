import { Hero } from '@/components/sections/Hero'
import { Cases } from '@/components/sections/Cases'
import { Brands } from '@/components/sections/Brands'
import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'

/**
 * A home, que até a chegada do roteador era o site inteiro.
 *
 * A ordem é a do contrato de direção em `App.tsx`: quem é ele, o que ele fez, de
 * onde vem, como falar com ele. Nada aqui mudou na virada para rotas — o arquivo
 * existe para que a home seja *uma* rota entre outras em vez de ser o `App`.
 *
 * **As marcas subiram para entre o hero e os cases em 31/07/2026, por decisão do
 * autor.** Elas viviam depois dos cases, com o argumento de que credencial pedida
 * antes da prova é postura de landing page. O argumento continua verdadeiro para
 * uma faixa *com título e texto*, que é o que ela era; sem eles, o que restou é
 * uma linha de contexto, não uma afirmação — e contexto pertence perto da
 * abertura. Se o título voltar, o lugar volta com ele.
 */
export function Home() {
  return (
    <>
      <Hero />
      <Brands />
      <Cases />
      <About />
      <Contact />
    </>
  )
}
