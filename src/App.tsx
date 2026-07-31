/*
 * CONTRATO DE DIREÇÃO
 *
 * THESIS: Um portfólio de PM que se lê como carta de apresentação escrita por
 * uma pessoa, em primeira pessoa, não como landing page de empresa. Hierarquia
 * tipográfica faz o trabalho que moldura e cartão fariam. Recusa a fileira de
 * cartões iguais, a faixa de métricas com divisórias e a sobrancelha de seção em
 * caixa-alta, que são os três tells de site corporativo feito por template.
 *
 * OWN-WORLD: Papel #F7F8FB com superfície branca, tinta #10131F, texto
 * secundário #5A6480. Azul royal #1E40C8 no que é ação e no que é destaque;
 * roxo #6D28D9 em elemento pequeno (etiqueta, número de módulo, marcador de
 * período); gradiente royal para roxo em um endereço só, o botão de currículo.
 * Separação é fio de cabelo de 1px, nunca borda grossa. Canto de 8 a 14px.
 * Schibsted Grotesk no display, Newsreader itálico nos destaques, Public Sans no corpo.
 *
 * STORY: Liderança de produto entende em segundos que é um PM sênior que
 * desenha, vê número real com fonte declarada, encontra o case conduzido do
 * começo ao fim, e sai com o currículo e o e-mail na mão.
 *
 * FIRST VIEWPORT: "Oi, eu sou o Lucas" em display, com o ponto final em royal.
 * Abaixo, o cargo em uma linha, o parágrafo em primeira pessoa sobre o produto
 * que ele conduz, e a linha de ações com currículo, cases e localização. À
 * direita, o retrato, que é o sinal mais forte de que isto é uma pessoa.
 *
 * FORM: O padrão de portfólio pessoal sênior, executado a sério, escolhido pelo
 * autor depois de recusar o mundo de manual de montagem que o baralho tinha
 * dado (seed 5ddfc11f). Régua de acabamento confirmada por ele: portfólio
 * pessoal sênior, leitura confortável, pouca decoração, personalidade no
 * detalhe.
 */

import { Routes, Route } from 'react-router'
import { Nav } from '@/components/sections/Nav'
import { ScrollManager } from '@/components/ScrollManager'
import { Home } from '@/pages/Home'
import { CaseInteligenciaComercial } from '@/pages/CaseInteligenciaComercial'
import { NotFound } from '@/pages/NotFound'
import { LocaleProvider } from '@/lib/i18n'

/*
 * ROTAS
 *
 * O site nasceu de uma página só e ganhou roteador em 31/07/2026, para a página
 * interna do case do Inteligência Comercial. O gatilho "Ver o case completo" já
 * apontava para `/cases/inteligencia-comercial` desde a rodada anterior e devolvia
 * 404 — a rota abaixo é o que fecha essa dívida.
 *
 * **Roteador de verdade e não um segundo HTML de entrada.** Os dois cases de
 * pesquisa também vão querer página, e com entradas separadas o cabeçalho, o
 * seletor de idioma e o Lenis seriam recarregados e reinicializados a cada troca —
 * inclusive a escolha de idioma, que vive em estado de React e só sobrevive por
 * causa do `localStorage`.
 *
 * O `Nav` fica **fora** do `Routes`: ele é a moldura, e remontá-lo a cada rota
 * faria o `ResizeObserver` republicar `--header-h` e a barra piscar na navegação.
 */

export default function App() {
  return (
    <LocaleProvider>
      <ScrollManager />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/cases/inteligencia-comercial"
            element={<CaseInteligenciaComercial />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </LocaleProvider>
  )
}
