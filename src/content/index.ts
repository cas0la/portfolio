import type { Locale } from '@/lib/i18n'

/*
 * Todo o texto do site, nos dois idiomas.
 *
 * REGRA DURA: nada aqui pode ser inventado. Número, cliente, período e entrega
 * saem de PRODUCT.md ou de curriculo/curriculo-base.md. Onde a prova não existe,
 * o campo fica marcado como `pending` e a página afirma menos, em vez de
 * preencher. Ver PRODUCT.md, princípio 2.
 *
 * ÊNFASE: os três marcadores abaixo viram `<strong>` pelo componente `Rich`, e
 * cada um tem um significado fixo. Ver `components/primitives/Rich.tsx`.
 *
 *   **trecho**   prova: número, período, resultado medido. Fica em tinta.
 *   ++trecho++   afirmação sobre o papel de Product Manager. Azul royal.
 *   ==trecho==   o que vem da origem em design. Roxo, sempre em minoria.
 *
 * Teto de três trechos coloridos por parágrafo. Acima disso a cor deixa de
 * destacar e vira textura.
 */

export type BuildTier = 'highlight' | 'major' | 'minor'

export type Piece = {
  name: string
  detail: string
  /**
   * Número real que o módulo sustenta, separado em valor e unidade para o valor
   * poder ser tipografado grande e a unidade ficar discreta ao lado.
   */
  count?: { value: string; unit: string }
}

export type Build = {
  id: string
  tier: BuildTier
  /** Numeral do passo. A ordem é de leitura, não de cronologia. */
  step: string
  name: string
  org?: string
  /** A tag do que foi feito ali. */
  tag: string
  body: string
  pieces?: Piece[]
  /** O custo da decisão. Nativo da caixa de peças, não pendurado no fim. */
  tradeoff?: string
  /** Marcado quando o conteúdo depende de material que o Lucas ainda não passou. */
  pending?: string
  href?: string
  /**
   * Capa do case. Enquanto não existir, o componente mostra placeholder.
   * Exporte em 16:10, solte em `public/assets/cases/` e preencha aqui.
   * `alt` descreve o que a imagem mostra, e vai vazio se ela for decorativa.
   */
  cover?: { src: string; alt: string }
}

export type InventoryRow = {
  when: string
  role: string
  org: string
  span: string
}

type Copy = {
  meta: { title: string; description: string }
  nav: {
    builds: string
    inventory: string
    contact: string
    resume: string
    resumeFile: string
    openMenu: string
    closeMenu: string
    skipToContent: string
  }
  lang: {
    label: string
    pt: string
    en: string
    ptAlt: string
    enAlt: string
  }
  hero: {
    greeting: string
    role: string
    lead: string
    location: string
    ctaResume: string
    ctaBuilds: string
  }
  intro: {
    paragraphs: string[]
    source: string
  }
  builds: {
    title: string
    lead: string
    piecesLabel: string
    openCase: string
    /** Avisa que o link sai do site. Entra só no rótulo acessível. */
    newTab: string
    items: Build[]
  }
  inventory: {
    /** A afirmação que abre a seção, em escala de display. Promovida do texto. */
    statement: string
    story: string[]
    experienceLabel: string
    rows: InventoryRow[]
    toolsLabel: string
    tools: string[]
    /**
     * Fontes de dado que ele consulta, e a ressalva de como. Separadas das
     * ferramentas de propósito: numa lista única, "GraphQL" ao lado de "Figma" lê
     * como domínio direto, e o acesso é de leitura via MCP do Claude.
     */
    dataLabel: string
    data: string[]
    dataNote: string
    languagesLabel: string
    /** Um item por idioma, exibido com o mesmo tratamento das ferramentas. */
    languages: string[]
    /**
     * Retrato principal do Sobre. Enquanto `src` não existir, o componente mostra
     * espaço reservado e declara que está esperando arquivo. Exportar em 4:5.
     */
    portrait?: { src: string; alt: string }
    portraitPending: string
    photosLabel: string
    /** Uma frase por slot. Texto idêntico em caixas vizinhas lê como bug, não como candura. */
    photosPending: string[]
    /** Fotos fora do trabalho. Exportar em 4:3. */
    hobbies?: { src: string; alt: string }[]
  }
  close: {
    title: string
    lead: string
    signoff: string
    ctaResume: string
    copy: string
    copied: string
    /** Clipboard negado ou contexto não seguro. O endereço fica selecionado. */
    copyFailed: string
    linkedin: string
    location: string
    builtWith: string
    rights: string
  }
}

const pt: Copy = {
  meta: {
    title: 'Lucas Casanova · Product Manager',
    description:
      'Product Manager sênior. Respondo pelo Inteligência Comercial na Nexfar: catálogo, preço e estoque em tempo real, cotação por OCR e recomendação por IA.',
  },
  nav: {
    builds: 'Cases',
    inventory: 'Sobre',
    contact: 'Contato',
    resume: 'Currículo',
    resumeFile: '/CV-Lucas-Casanova-PT.pdf',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    skipToContent: 'Ir para o conteúdo',
  },
  lang: {
    label: 'Idioma',
    pt: 'PT',
    en: 'EN',
    ptAlt: 'Bandeira do Brasil, ver o site em português',
    enAlt: 'Bandeira dos Estados Unidos, ver o site em inglês',
  },
  hero: {
    greeting: 'Oi, eu sou o Lucas',
    role: 'Product Manager Sênior',
    lead: 'Priorizo o ++roadmap++ a partir de pesquisa com quem usa, de conversa direta com o cliente e do dado de uso. Uso ++IA++ no meu próprio trabalho e dentro do produto que eu conduzo. Quando ele pede, ==desenho a interface== eu mesmo: vim do design, e o craft ficou.',
    location: 'Florianópolis, Brasil',
    ctaResume: 'Baixar meu currículo (PDF)',
    ctaBuilds: 'Veja os cases',
  },
  intro: {
    paragraphs: [
      'Cheguei a produto pelo design, e o caminho teve ida e volta. Isso mudou o tipo de PM que eu sou: eu desenho o fluxo, decido o escopo e instrumento a métrica sem precisar passar a bola.',
      'O Inteligência Comercial saiu do zero na minha mão e hoje tem **mais de 400 usuários**, **NPS 80+** e **cinco operações migradas em seis meses**. Foram mais de 20 melhorias nos últimos três meses, priorizadas com dado de uso e conversa com quem vende em campo.',
    ],
    source: 'Números de julho de 2026, medidos em Power BI e Mixpanel.',
  },
  builds: {
    title: 'O que eu construí',
    lead: 'Um produto que conduzi do começo ao fim, dois trabalhos de pesquisa e dois de interface. Cada case ganha uma página própria na próxima rodada.',
    piecesLabel: 'Módulos',
    openCase: 'Ver o case no Notion',
    newTab: 'abre em nova aba',
    items: [
      {
        id: 'nf-next-ic',
        tier: 'highlight',
        step: '01',
        name: 'Inteligência Comercial',
        org: 'Nexfar',
        tag: 'Product Manager, do marco zero',
        body: 'O único produto que conduzi desde o começo: visão, estratégia, roadmap, especificação, instrumentação da métrica e o design da interface. Três módulos em produção, cada um resolvendo uma etapa da visita do vendedor à farmácia. Em produção com clientes reais.',
        pieces: [
          {
            name: 'Cotação Ágil',
            detail:
              'A lista do cliente entra por foto e vira cotação por OCR. Poupa **mais de uma hora** de digitação por cotação, com 50 a 100 itens em média, e a comparação manual de condições. A conversão fica **acima de 80%**.',
            count: { value: '400+', unit: 'cotações/mês' },
          },
          {
            name: 'Catálogo Digital',
            detail:
              'Preço e estoque em tempo real no lugar do catálogo impresso, com visibilidade sobre o que o cliente olhou.',
            count: { value: '300+', unit: 'catálogos/90 dias' },
          },
          {
            name: 'Objetivos e Sugestões',
            detail:
              'Histórico do ponto de venda vira sugestão de mix e meta. É o módulo de IA do produto.',
            count: { value: '~200', unit: 'pedidos/dia' },
          },
        ],
        pending:
          'Ainda falta a parte mais importante aqui: qual decisão me custou algo, e o que ela custou. Vou escrever isso junto com o histórico de versões na página interna deste case.',
      },
      {
        id: 'electrolux-cuida',
        tier: 'major',
        step: '02',
        name: 'Electrolux Cuida',
        org: 'Electrolux',
        tag: 'UX Research',
        body: 'Pesquisa de usuário como parte da estruturação do research de produtos digitais da Electrolux, área que até então olhava só para produto industrial.',
        pending:
          'Não tenho material visual publicável deste trabalho. O que eu tenho é o processo e o framework de pesquisa, e eles entram na página interna.',
      },
      {
        id: 'unicesumar-mundo-azul',
        tier: 'major',
        step: '03',
        name: 'Mundo Azul',
        org: 'Unicesumar',
        tag: 'UX Research',
        body: 'Pesquisa de usuário conduzida como designer principal da conta.',
        pending:
          'Também não tenho material visual deste. O processo entra na página interna.',
      },
      {
        id: 'bb-consorcios',
        tier: 'minor',
        step: '04',
        name: 'Consórcios',
        org: 'Banco do Brasil',
        tag: 'UI e regra de negócio',
        body: 'Passo a passo da contratação de consórcio, com as regras de negócio e a simulação desenhadas junto ao cliente.',
        href: 'https://app.notion.com/p/casola-design/BB-Cons-rcios-Produtos-8e451f7acfc94c1b8dda85ac5e915bd7',
      },
      {
        id: 'sea-the-future',
        tier: 'minor',
        step: '05',
        name: 'Sea the Future',
        org: 'Oceanário de Lisboa',
        tag: 'UI e craft',
        body: 'Site do projeto. O material escrito do case está no Notion.',
        href: 'https://app.notion.com/p/casola-design/Sea-the-Future-Site-819cdb9ced6f4127928ca5ab506adad5',
      },
    ],
  },
  inventory: {
    statement: 'O caminho até produto teve ida e volta',
    story: [
      'Comecei em design digital em 2016, replicando telas de caixa eletrônico. Entrei em produto ainda como designer, depois **liderei um time de nove designers**, voltei para pesquisa, voltei para product design e então assumi Product Manager. Não preciso de handoff externo para design, pesquisa ou produto.',
      'Onde eu jogo mais confortável: **discovery com quem usa de verdade**, **instrumentação de métrica** e **IA aplicada ao trabalho de produto**. Codei protótipo funcional para validar ideia antes do handoff, e construí ferramenta interna que o time usa no dia a dia.',
      'Trabalho bem com informação incompleta e com mudança de direção no meio do caminho. A decisão que eu defendo se sustenta pela leitura do problema, e a ferramenta nova que eu levo para o time chega testada antes de virar processo.',
    ],
    experienceLabel: 'Experiência',
    rows: [
      {
        when: 'Agora',
        role: 'Product Manager, Inteligência Comercial',
        org: 'Nexfar',
        span: '2025',
      },
      { when: 'Antes', role: 'Product Designer Sênior', org: 'Nexfar', span: '2023–2025' },
      { when: 'Antes', role: 'UX Researcher Sênior', org: 'Electrolux', span: '2022–2023' },
      { when: 'Antes', role: 'Lead Designer, time de 9', org: 'Garupa Design', span: '2021–2022' },
      {
        when: 'Antes',
        role: 'Product Designer',
        org: 'Ahgora Sistemas, hoje TOTVS',
        span: '2020–2021',
      },
      { when: 'Antes', role: 'Product Designer', org: 'myTapp Tecnologia', span: '2018–2020' },
    ],
    toolsLabel: 'Ferramentas',
    tools: [
      'Figma',
      'Claude Code',
      'Power BI',
      'Mixpanel',
      'Microsoft Clarity',
      'ClickUp',
      'Jira',
      'Miro',
    ],
    dataLabel: 'Dados',
    data: ['GraphQL', 'Postgres', 'BigQuery'],
    dataNote: 'Consulto para leitura, via MCP do Claude.',
    languagesLabel: 'Idiomas',
    languages: [
      'Português nativo',
      'Inglês B2 (leitura e escrita fluentes, conversação intermediária)',
    ],
    portraitPending: 'Meu retrato entra aqui.',
    photosLabel: 'Fora do trabalho',
    photosPending: [
      'Uma foto minha fora do trabalho entra aqui.',
      'Outra, de outro hobby, entra aqui.',
    ],
  },
  close: {
    title: 'Vamos conversar.',
    lead: 'Se você está montando um time de produto, ou quer entender melhor alguma decisão que eu tomei, me escreve. Também deixei o currículo completo em PDF. Respondo em português ou inglês.',
    signoff: 'Obrigado por ler até aqui.',
    ctaResume: 'Baixar meu currículo (PDF)',
    copy: 'Copiar e-mail',
    copied: 'Copiado!',
    copyFailed: 'Não consegui copiar. Selecionei o endereço para você copiar.',
    linkedin: 'LinkedIn',
    location: 'Florianópolis, SC, Brasil',
    builtWith: 'Feito por mim com React, Vite e Tailwind.',
    rights: '© 2026 Lucas Casanova',
  },
}

const en: Copy = {
  meta: {
    title: 'Lucas Casanova · Product Manager',
    description:
      'Senior product manager. I own Inteligência Comercial at Nexfar: real-time catalog, price and stock, OCR quoting and AI order recommendation.',
  },
  nav: {
    builds: 'Cases',
    inventory: 'About',
    contact: 'Contact',
    resume: 'Résumé',
    resumeFile: '/CV-Lucas-Casanova-EN.pdf',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    skipToContent: 'Skip to content',
  },
  lang: {
    label: 'Language',
    pt: 'PT',
    en: 'EN',
    ptAlt: 'Flag of Brazil, view this site in Portuguese',
    enAlt: 'Flag of the United States, view this site in English',
  },
  hero: {
    greeting: "Hi, I’m Lucas",
    role: 'Senior Product Manager',
    lead: 'I prioritise the ++roadmap++ from research with the people who use it, from talking to customers directly, and from usage data. I use ++AI++ in my own work and inside the product I run. When it calls for it, I ==design the interface== myself: I came from design, and the craft stayed.',
    location: 'Florianópolis, Brazil',
    ctaResume: 'Download my résumé (PDF)',
    ctaBuilds: 'See the cases',
  },
  intro: {
    paragraphs: [
      'I came to product through design, and the path doubled back more than once. That changed the kind of PM I am: I draw the flow, decide the scope, and instrument the metric without handing it off.',
      'Inteligência Comercial started from nothing in my hands and today has **more than 400 users**, a **product NPS above 80** and **five operations migrated in six months**. More than 20 improvements shipped in the last three months, prioritised from usage data and conversations with the people selling in the field.',
    ],
    source: 'Figures from July 2026, measured in Power BI and Mixpanel.',
  },
  builds: {
    title: 'What I have built',
    lead: 'One product I ran from start to finish, two research projects, and two interface projects. Each case gets its own page in the next update.',
    piecesLabel: 'Modules',
    openCase: 'Read the case on Notion',
    newTab: 'opens in a new tab',
    items: [
      {
        id: 'nf-next-ic',
        tier: 'highlight',
        step: '01',
        name: 'Inteligência Comercial',
        org: 'Nexfar',
        tag: 'Product manager, from zero',
        body: 'The one product I have run from the start: vision, strategy, roadmap, specs, metric instrumentation, and the interface design. Three modules in production, each solving one stage of a rep visiting a pharmacy. Live with real customers.',
        pieces: [
          {
            name: 'Cotação Ágil',
            detail:
              "The customer’s list goes in as a photo and comes out as a quote via OCR. It saves **more than an hour** of typing per quote, at 50 to 100 items on average, plus the manual comparison of terms. Conversion runs **above 80%**.",
            count: { value: '400+', unit: 'quotes/month' },
          },
          {
            name: 'Catálogo Digital',
            detail:
              'Real-time price and stock replacing the printed catalog, with visibility into what the customer actually looked at.',
            count: { value: '300+', unit: 'catalogs/90 days' },
          },
          {
            name: 'Objetivos e Sugestões',
            detail:
              "The point of sale’s history becomes product mix suggestions and sales targets. This is the product’s AI module.",
            count: { value: '~200', unit: 'orders/day' },
          },
        ],
        pending:
          "The most important part is still missing here: which decision cost me something, and what it cost. I will write that up with the version history on this case's own page.",
      },
      {
        id: 'electrolux-cuida',
        tier: 'major',
        step: '02',
        name: 'Electrolux Cuida',
        org: 'Electrolux',
        tag: 'UX research',
        body: "User research as part of standing up digital-product research at Electrolux, an area that until then only looked at industrial products.",
        pending:
          'I have no publishable visual material from this work. What I do have is the process and the research framework, and they go on the case page.',
      },
      {
        id: 'unicesumar-mundo-azul',
        tier: 'major',
        step: '03',
        name: 'Mundo Azul',
        org: 'Unicesumar',
        tag: 'UX research',
        body: 'User research run as lead designer on the account.',
        pending:
          'No visual material for this one either. The process goes on the case page.',
      },
      {
        id: 'bb-consorcios',
        tier: 'minor',
        step: '04',
        name: 'Consortium journey',
        org: 'Banco do Brasil',
        tag: 'UI and business rules',
        body: 'The step-by-step of buying into a consortium, with the business rules and the simulation designed alongside the client.',
        href: 'https://app.notion.com/p/casola-design/BB-Cons-rcios-Produtos-8e451f7acfc94c1b8dda85ac5e915bd7',
      },
      {
        id: 'sea-the-future',
        tier: 'minor',
        step: '05',
        name: 'Sea the Future',
        org: 'Oceanário de Lisboa',
        tag: 'UI and craft',
        body: 'Project website. The written case material lives in Notion.',
        href: 'https://app.notion.com/p/casola-design/Sea-the-Future-Site-819cdb9ced6f4127928ca5ab506adad5',
      },
    ],
  },
  inventory: {
    statement: 'The path into product doubled back',
    story: [
      'I started in digital design in 2016, rebuilding ATM screens. I moved into product while still a designer, then **led a team of nine designers**, went back to research, back to product design, and took product management on from there. I do not need an external handoff for design, research, or product.',
      'Where I play most comfortably: **discovery with the people who actually use the thing**, **metric instrumentation** and **AI applied to product work**. I have coded working prototypes to validate an idea before handoff, and built internal tooling the team uses daily.',
      'I work well with incomplete information and with the direction shifting halfway through. The decisions I argue for stand on how well the problem was read, and the new tool I bring to the team arrives tested before it becomes process.',
    ],
    experienceLabel: 'Experience',
    rows: [
      {
        when: 'Now',
        role: 'Product Manager, Inteligência Comercial',
        org: 'Nexfar',
        span: '2025',
      },
      { when: 'Prev.', role: 'Senior Product Designer', org: 'Nexfar', span: '2023–2025' },
      { when: 'Prev.', role: 'Senior UX Researcher', org: 'Electrolux', span: '2022–2023' },
      { when: 'Prev.', role: 'Lead Designer, team of 9', org: 'Garupa Design', span: '2021–2022' },
      {
        when: 'Prev.',
        role: 'Product Designer',
        org: 'Ahgora Sistemas, now TOTVS',
        span: '2020–2021',
      },
      { when: 'Prev.', role: 'Product Designer', org: 'myTapp Tecnologia', span: '2018–2020' },
    ],
    toolsLabel: 'Tools',
    tools: [
      'Figma',
      'Claude Code',
      'Power BI',
      'Mixpanel',
      'Microsoft Clarity',
      'ClickUp',
      'Jira',
      'Miro',
    ],
    dataLabel: 'Data',
    data: ['GraphQL', 'Postgres', 'BigQuery'],
    dataNote: 'Read-only, queried through Claude MCP.',
    languagesLabel: 'Languages',
    languages: [
      'Portuguese, native',
      'English B2 (fluent reading and writing, intermediate conversation)',
    ],
    portraitPending: 'My portrait goes here.',
    photosLabel: 'Off the clock',
    photosPending: [
      'A photo of me away from work goes here.',
      'Another one, from a different hobby, goes here.',
    ],
  },
  close: {
    title: "Let’s talk.",
    lead: 'If you are building a product team, or you want to dig into a decision I made, write to me. I have also left the full résumé as a PDF. I answer in English or Portuguese.',
    signoff: 'Thanks for reading this far.',
    ctaResume: 'Download my résumé (PDF)',
    copy: 'Copy email',
    copied: 'Copied!',
    copyFailed: 'I could not copy it. I selected the address for you to copy.',
    linkedin: 'LinkedIn',
    location: 'Florianópolis, SC, Brazil',
    builtWith: 'Built by me with React, Vite and Tailwind.',
    rights: '© 2026 Lucas Casanova',
  },
}

export const EMAIL = 'contato.lcasanova@gmail.com'
export const LINKEDIN = 'https://www.linkedin.com/in/casanovahs/'

const dictionary: Record<Locale, Copy> = { pt, en }

export function copyFor(locale: Locale): Copy {
  return dictionary[locale]
}
