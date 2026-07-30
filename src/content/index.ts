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
 *   @@trecho@@   palavra-chave do hero. Itálico de serifa, pintado de royal → roxo.
 *                SÓ NO HERO: ver o comentário em `Rich.tsx`.
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
    /**
     * O `h1`. É a afirmação de papel, não a saudação: quem abre a página em
     * processo seletivo precisa saber o cargo antes do nome. Aceita os marcadores
     * de ênfase, e usa o `@@` no trecho do cargo.
     */
    headline: string
    /** O `h2`. A apresentação em primeira pessoa, com o apelido. */
    greeting: string
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
    /*
     * "e2e" saiu daqui na quarta passada de clarify, por escolha do autor entre
     * quatro opções. O achado: abreviação de nicho na linha mais importante da
     * página, e leitor de tela a anuncia como "ê-dois-ê". Verbo no lugar de rótulo
     * resolve as duas coisas, e "do início ao fim" é o termo que a seção de cases já
     * usa ("Um produto que conduzi do começo ao fim"), então as duas superfícies
     * passam a chamar a mesma coisa pelo mesmo nome.
     *
     * "de ponta a ponta" foi considerada e recusada: é a frase que o autor lista
     * como tell de texto de IA.
     */
    headline: '@@Product Manager@@ que conduz do início ao fim',
    greeting: 'Oi, sou o Lucas. Quase todo mundo me chama de “Casanova”.',
    /*
     * Terceira passada de clarify. Agora o parágrafo carrega as quatro coisas que o
     * autor nomeou como o que ele quer passar, uma por frase:
     *
     *   1. posição sólida no mercado    → o par de números que abre
     *   2. IA e LLM de verdade          → onde ele usa, não adjetivo
     *   3. research e craft decidindo   → o que a base sustenta
     *   4. condução e2e com dado        → o fecho de verbos, e o `e2e` do `headline`
     *
     * OS NÚMEROS SÃO VERIFICADOS, não arredondados para soar bem. `curriculo-base.md`
     * dá Set/2016 como início de mercado, o que fecha 10 anos em jul/2026, e
     * Nov/2018 como o primeiro cargo de Product Designer (myTapp), o que fecha 8.
     * Ficam em `**tinta**` porque são prova, e prova nesta página nunca é colorida.
     *
     * Nota de coerência: o PRODUCT.md descreve os mesmos 8 anos como "os oito anos
     * anteriores em Product Design e UX Research". É o mesmo intervalo contado do
     * mesmo marco; muda só o enquadramento. "8 em produto" serve melhor ao
     * posicionamento, que manda o avaliador não sair em dúvida sobre qual cadeira
     * ele quer — e Product Designer é trabalho de produto.
     *
     * O que saiu nas passadas anteriores, para não voltar: "de forma holística
     * desde a concepção até o pós-lançamento" e "desenho o fluxo, decido o escopo e
     * instrumento a métrica sem passar a bola" diziam, junto com o fecho de verbos,
     * a mesma ideia de alcance três vezes. Sobreviveu a formulação do autor.
     *
     * Quarta passada de clarify:
     *
     * - **"no meu processo" era substantivo vago**, e a ordem estava invertida. Virou
     *   "no produto que conduzo e no meu próprio trabalho": o produto vem primeiro
     *   porque é a parte demonstrável, e o princípio 3 do PRODUCT.md manda a IA
     *   aparecer no artefato antes de aparecer na afirmação.
     * - **"sustenta cada decisão que eu defendo" era circular e absoluto.** Dizia que
     *   a base sustenta a decisão sem dizer como, e "cada" é uma promessa que ninguém
     *   pode cumprir. Virou o mecanismo real: pesquisa produz evidência, e é a
     *   evidência que fica atrás da decisão.
     *
     * Quinta passada, as duas mudanças de estrutura, as duas pedidas pelo autor:
     *
     * - **O fecho de seis verbos saiu.** Ele era a formulação do autor e sobreviveu a
     *   três passadas por isso, mas depois de o `headline` passar a dizer "que conduz
     *   do início ao fim", os verbos enumeravam a mesma ideia que o título já
     *   afirmava. Foi a quarta tentativa dessa ideia de se duplicar no hero.
     * - **O par de números deixou de abrir sem verbo.** "10 anos de mercado, 8 deles
     *   em produto." era fragmento nominal logo depois de uma apresentação em
     *   primeira pessoa, e o autor leu como início abrupto. Com verbo, ele continua a
     *   fala do `greeting` em vez de recomeçar.
     *
     * A transição entre as frases agora é um arco de tempo, e é ele que faz o
     * parágrafo ler como fala e não como três fatos empilhados: passado ("estou no
     * mercado há"), presente ("hoje uso"), origem ("venho de"). Termina no raciocínio
     * de produto, que é o princípio 1 do PRODUCT.md, e não na IA.
     *
     * Sexta passada. O autor pediu "executo" entre "decido" e "meço", e "acompanho o
     * desempenho" no lugar de "meço depois". A construção literal não fecha: em "por
     * trás do que eu decido, executo e acompanho o desempenho", os dois primeiros
     * verbos tomam "do que" como objeto e o terceiro traz o seu próprio, então sobra
     * "por trás do que eu ... acompanho o desempenho".
     *
     * A regência mudou de "por trás do que eu" para "para", e os três verbos viraram
     * infinitivo. Assim cada um fica com o objeto que pede, e o trio ganha o ritmo de
     * três tempos que a lista de seis verbos tinha e que era o que valia nela. A
     * primeira pessoa se mantém, porque quem vem de research e craft é ele: a frase
     * abre em "Venho de".
     */
    lead: 'Estou no mercado há **10 anos**, **8 deles em produto**. Hoje uso @@IA e LLM@@ no produto que conduzo e no meu próprio trabalho. Venho de @@research e craft@@, e é de lá que vem a evidência para decidir, executar e acompanhar o desempenho.',
    location: 'Florianópolis, Brasil',
    ctaResume: 'Baixar meu currículo (PDF)',
    ctaBuilds: 'Veja meus cases',
  },
  /*
   * A DOBRA 2 NÃO EXISTE MAIS. `Intro.tsx` foi apagado e saiu do `App`, por decisão
   * do autor em 30/07/2026. O que estava nela foi diluído:
   *
   * - "Cheguei a produto pelo design, e o caminho teve ida e volta" já era, quase
   *   literal, a afirmação que abre o Sobre. Não foi para lugar nenhum porque já
   *   estava lá.
   * - "eu desenho o fluxo, decido o escopo e instrumento a métrica sem precisar
   *   passar a bola" foi para o hero, onde virou o fecho de seis verbos que o autor
   *   escreveu. É o que sustenta o "e2e" do título.
   * - **Os números abaixo vão para dentro do case do Inteligência Comercial**, e é
   *   por isso que este objeto continua aqui sem ninguém renderizar: é conteúdo em
   *   trânsito, não conteúdo morto. Quando o case absorver os números e a fonte do
   *   dado, apagar `intro` daqui e do tipo `Copy`.
   */
  intro: {
    paragraphs: [
      'O Inteligência Comercial saiu do zero na minha mão e hoje tem **mais de 400 usuários**, **NPS 80+** e **cinco operações migradas em seis meses**. Foram mais de 20 melhorias nos últimos três meses, priorizadas com dado de uso e conversa com quem vende em campo.',
    ],
    source: 'Números de julho de 2026, medidos em Power BI e Mixpanel.',
  },
  builds: {
    title: 'O que eu construí',
    lead: 'Um produto que conduzi do começo ao fim e dois trabalhos de pesquisa. Cada case ganha uma página própria na próxima rodada.',
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
      /*
       * Banco do Brasil (Consórcios) e Sea the Future saíram por decisão do autor
       * em 30/07/2026: eram os dois cases de UI pura, e ele não busca essa cadeira.
       * "Quem faz de tudo, não faz nada" — um portfólio de PM com dois cases de
       * interface no fim convida a dúvida sobre qual vaga ele quer, que é
       * exatamente o que o posicionamento do PRODUCT.md manda evitar.
       *
       * Isto encerra de vez a pendência do "Oceanário de Lisboa", que era a
       * organização atribuída ao Sea the Future e não aparecia em nenhum documento
       * fonte. O case saiu antes de a atribuição ter que ser confirmada.
       *
       * Os dois continuam existindo no Notion e no histórico do git, se algum dia
       * fizerem sentido de novo.
       */
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
    headline: '@@Product Manager@@ who runs the product from start to finish',
    greeting: 'Hi, I’m Lucas. Almost everyone calls me “Casanova”.',
    lead: 'I’ve been working for **10 years**, **8 of them in product**. Today I use @@AI and LLMs@@ inside the product I run and in my own work. I come from @@research and craft@@, and that is where the evidence comes from to decide, to execute and to track how it performs.',
    location: 'Florianópolis, Brazil',
    ctaResume: 'Download my résumé (PDF)',
    ctaBuilds: 'See my cases',
  },
  intro: {
    paragraphs: [
      'Inteligência Comercial started from nothing in my hands and today has **more than 400 users**, a **product NPS above 80** and **five operations migrated in six months**. More than 20 improvements shipped in the last three months, prioritised from usage data and conversations with the people selling in the field.',
    ],
    source: 'Figures from July 2026, measured in Power BI and Mixpanel.',
  },
  builds: {
    title: 'What I have built',
    lead: 'One product I ran from start to finish and two research projects. Each case gets its own page in the next update.',
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
      /* Ver a nota na versão em português: os dois cases de UI pura saíram. */
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
