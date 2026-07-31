import { Hero } from '@/components/sections/Hero'
import { Cases } from '@/components/sections/Cases'
import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'

/**
 * A home, que até a chegada do roteador era o site inteiro.
 *
 * A ordem é a do contrato de direção em `App.tsx`: quem é ele, o que ele fez, de
 * onde vem, como falar com ele. Nada aqui mudou na virada para rotas — o arquivo
 * existe para que a home seja *uma* rota entre outras em vez de ser o `App`.
 */
export function Home() {
  return (
    <>
      <Hero />
      <Cases />
      <About />
      <Contact />
    </>
  )
}
