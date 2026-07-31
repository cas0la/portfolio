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
 *   ~~trecho~~   marco do percurso. Itálico de serifa em tinta, sem gradiente.
 *
 * Teto de três trechos coloridos por parágrafo. Acima disso a cor deixa de
 * destacar e vira textura.
 */

export type BuildTier = 'highlight' | 'major' | 'minor'

/**
 * Uma estação do painel de evolução: um marco datado da vida do produto.
 *
 * O painel substituiu uma capa em imagem. A primeira versão era um JPEG de
 * 2100x640 composto fora do site, e ela morria no telefone: a faixa encolhia para
 * cerca de 104px de altura e as cinco estações viravam borrão. Como componente, a
 * mesma cronologia é horizontal no desktop e vertical no telefone, e cada marco
 * continua legível.
 *
 * **O que se ganhou junto foi semântica.** Em imagem, tudo isto cabia num `alt`
 * longo, que um leitor de tela despeja num parágrafo só. Agora cada estação é item
 * de lista ordenada com `<time>` real, e a navegação é marco a marco.
 */
export type Milestone = {
  /** Ano e mês em ISO, para o `datetime` do `<time>`. Ex.: `'2024-11'`. */
  iso: string
  /** O mesmo instante como se lê. Ex.: `'Nov 2024'`. */
  when: string
  title: string
  /** Uma linha do que aconteceu ali. */
  note?: string
  /**
   * As capturas deste marco. Vazio no primeiro, que é tipográfico, e no último,
   * que é o medidor de NPS desenhado em SVG.
   *
   * Mais de uma imagem só no marco de produção: são três módulos de um produto
   * só, e por isso aparecem agrupados em vez de em estações separadas.
   */
  shots?: { src: string; alt: string }[]
  /**
   * As dores que o produto ataca, no marco de ideação.
   *
   * **Texto e não captura de slide, por decisão do autor.** A captura era o slide
   * verde da primeira apresentação interna, e ela punha uma quarta família de cor
   * na peça — o painel é royal, o produto de hoje é roxo, o lo-fi é cinza. Em
   * tipografia do site, a ideação deixa de ser "foto de um slide" e vira conteúdo
   * do portfólio.
   *
   * **O custo é conhecido:** deixa de ser artefato original e passa a ser
   * interpretação. O slide continua existindo e o lugar dele é a página interna,
   * onde cabe mostrar o documento como documento.
   */
  pains?: string[]
  /** O número que fecha a linha, com a fonte declarada. */
  score?: { value: string; label: string; source: string; min: string; max: string }
}

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
  /**
   * Os papéis que ele exerceu no trabalho, um por cápsula.
   *
   * **Papel, não habilidade.** "Discovery" entra porque ele conduziu discovery
   * neste produto; "Product discovery" como competência já vive nas credenciais do
   * Sobre, e repetir a lista de lá aqui faria o case provar menos, não mais. Cada
   * item precisa ser verdade sobre *este* trabalho.
   *
   * Teto de 20 caracteres, igual às credenciais: a cápsula é a mesma e a razão é
   * a mesma.
   */
  roles?: string[]
  /**
   * Os destaques de escopo e de resultado, também em cápsula.
   *
   * Dois tipos convivem aqui de propósito, e o componente distingue sozinho: onde
   * há algarismo o valor sai em royal (é medição), onde não há ele sai em tinta (é
   * escopo). "NPS 80+" e "E2E" moram na mesma fileira porque respondem à mesma
   * pergunta do avaliador, que é "o quanto disso é sério".
   *
   * **Todo número aqui é verificado**, não arredondado para cima: eles saem de
   * `curriculo-base.md` e da memória de métricas do produto, ambos apurados em
   * Power BI e Mixpanel em julho de 2026.
   */
  highlights?: { value: string; label?: string }[]
  /**
   * Rota interna da página do case, para o botão do case principal.
   *
   * Diferente de `href`, que é link externo e abre em nova aba. Este fica dentro
   * do site e navega na mesma aba.
   */
  page?: string
  /**
   * O painel de evolução, exclusivo do case de destaque. Onde ele existe, ele
   * substitui a capa: um case não tem os dois.
   */
  milestones?: Milestone[]
  pieces?: Piece[]
  /** O custo da decisão. Nativo da caixa de peças, não pendurado no fim. */
  tradeoff?: string
  /** Marcado quando o conteúdo depende de material que o Lucas ainda não passou. */
  pending?: string
  href?: string
  /**
   * Capa do case. Enquanto não existir, o componente mostra placeholder.
   *
   * **Duas proporções, conforme o `tier`.** O case `highlight` abre a seção em
   * largura inteira e exporta em **21:9** (2100x900); em 16:10 ele passaria de
   * 700px de altura e comeria um viewport de notebook sozinho. Os secundários
   * seguem em **16:10** (1600x1000), que é a caixa do `CaseCover`.
   *
   * Solte em `public/assets/cases/` e preencha aqui. O `alt` descreve o que a
   * imagem mostra, e vai vazio se ela for decorativa — mas capa que carrega
   * argumento, como a do case de destaque, **nunca é decorativa**.
   */
  cover?: { src: string; alt: string }
}

/**
 * Uma linha da linha do tempo de experiência. Três níveis de informação, sempre
 * na mesma ordem, mais o ano.
 */
export type InventoryRow = {
  /** O ano ou o intervalo. */
  when: string
  /** Marca a posição atual, que recebe a etiqueta "Agora" ao lado do ano. */
  current?: boolean
  /** Nível 1: posição e senioridade. */
  role: string
  /**
   * Nível 2: o squad, a frente ou o produto.
   *
   * **Estes valores foram derivados das descrições de cargo do
   * `curriculo/curriculo-base.md`, não de nomes de squad informados.** Onde o
   * currículo diz o produto ou a frente em que ele atuou, é isso que está aqui. Se
   * algum squad tinha nome próprio diferente, corrigir aqui.
   */
  squad?: string
  /** Nível 3: a empresa. */
  org: string
}

/**
 * Relato de alguém que trabalhou com ele.
 *
 * REGRA: o texto é sempre a palavra da pessoa, nunca paráfrase, e a atribuição é
 * sempre pela relação de trabalho, nunca por nome.
 */
export type Testimonial = {
  quote: string
  /** A relação de trabalho de quem falou. Ex.: "Par direto", "Ex-liderado". */
  source: string
  /**
   * O relato que abre o bloco, em escala de display.
   *
   * **Um só.** O componente pega o primeiro marcado e trata o resto como o grupo
   * de baixo; dois em destaque não é destaque, é duas colunas grandes. Para trocar
   * qual é o pico, mover esta marca — e preferir um relato curto, porque em corpo
   * de display um texto longo vira parágrafo grande em vez de citação.
   */
  featured?: boolean
}

/**
 * Um idioma, na forma que a pílula exige.
 *
 * Ele era uma string só — `'Inglês B2 (leitura e escrita fluentes, conversação
 * intermediária)'` — e essa frase não cabe numa pílula: ela quebraria em três
 * linhas dentro de uma cápsula de canto redondo, que é a forma errada para
 * texto corrido. A informação não se perdeu, ela se separou pelo que é: o nome e
 * o nível vão para dentro da pílula, que é credencial curta, e a ressalva vai
 * para uma linha de texto abaixo do grupo, que é onde prosa lê bem.
 *
 * A ressalva **fica**. "Inglês B2" sozinho deixa quem lê imaginar o que quiser
 * sobre a conversação, e o que está escrito aqui é mais honesto que a média das
 * declarações de idioma em currículo.
 */
export type Language = {
  name: string
  /** O nível, em corpo apagado dentro da mesma pílula. */
  level: string
  /**
   * Ressalva de escopo, exibida como nota abaixo do grupo. **Frase inteira e
   * autossuficiente, com o idioma dentro dela**: a nota fica separada da cápsula
   * que a originou, e uma nota que dependesse do contexto ("leitura e escrita
   * fluentes") deixaria de dizer de qual idioma se trata quando um segundo idioma
   * ganhasse ressalva.
   */
  note?: string
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
    /** Rótulo das cápsulas de papel no case principal. */
    rolesLabel: string
    /** Rótulo das cápsulas de escopo e resultado no case principal. */
    highlightsLabel: string
    /** Nome acessível da lista de marcos, lido antes do primeiro item. */
    timelineLabel: string
    /** Botão do case principal, que leva para a página interna. */
    openFull: string
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
    /** Etiqueta da posição atual na linha do tempo. */
    nowLabel: string
    skillsLabel: string
    skills: string[]
    toolsLabel: string
    tools: string[]
    languagesLabel: string
    /** Um item por idioma, exibido com o mesmo tratamento das ferramentas. */
    languages: Language[]
    /**
     * Retrato principal do Sobre. Enquanto `src` não existir, o componente mostra
     * espaço reservado e declara que está esperando arquivo. Exportar em 4:5.
     */
    portrait?: { src: string; alt: string }
    portraitPending: string
    /**
     * O que aparece na faixa que sobe do retrato no hover: o nome e os hobbies.
     *
     * **Os hobbies estão aqui e não nas credenciais** porque não são credencial.
     * Eles existem para o avaliador sair com uma pessoa na cabeça, não uma lista —
     * e é por isso que o emoji, que o DESIGN.md não usa em nenhum outro lugar,
     * cabe exatamente neste.
     *
     * O emoji vai no conteúdo e não no componente porque ele **é** conteúdo: ele
     * carrega significado próprio e muda com o item, ao contrário de um ícone
     * decorativo. Cada um recebe `aria-hidden` na renderização — o rótulo ao lado
     * já diz a mesma coisa em palavra, e sem isso o leitor de tela anunciaria
     * "cara de cachorro" antes de "meus cachorros".
     */
    portraitName: string
    /** Rótulo curto acima da lista, na faixa. */
    interestsLabel: string
    interests: { emoji: string; label: string }[]
    photosLabel: string
    /** Uma frase por slot. Texto idêntico em caixas vizinhas lê como bug, não como candura. */
    photosPending: string[]
    /** Fotos fora do trabalho. Exportar em 4:3. */
    hobbies?: { src: string; alt: string }[]
    /**
     * Subseção de relatos de terceiros.
     *
     * O `testimonialsNote` declara a origem, e isso não é formalidade: relato sem
     * procedência declarada lê como depoimento de landing page, que é a coisa que
     * o DESIGN.md recusa. Dizer que vem de avaliação interna é o que separa prova
     * de propaganda.
     */
    testimonialsTitle: string
    testimonialsNote: string
    testimonials: Testimonial[]
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
    github: string
    location: string
    builtWith: string
    rights: string
  }
}

const pt: Copy = {
  meta: {
    title: 'Lucas Casanova · Product Manager',
    description:
      'Product Manager que conduz do início ao fim. 10 anos de mercado, 8 deles em produto. Conduzo o Inteligência Comercial na Nexfar: cotação por OCR, catálogo em tempo real e recomendação por IA.',
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
    /* Reescrito pelo autor em 30/07/2026. Era "Oi, sou o Lucas. Quase todo mundo
       me chama de 'Casanova'." — duas frases, e a segunda relatava um fato sobre
       terceiros ("quase todo mundo") em vez de falar com quem está lendo. "Pode me
       chamar" é convite e é dirigido, que é o registro do resto do hero. As aspas
       são as tipográficas do sistema, não as retas. */
    greeting: 'Oi, eu sou o Lucas, mas pode me chamar de “Casanova”.',
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
    /*
     * O convite a descer.
     *
     * "Veja meus cases" nomeava o destino e não dava razão nenhuma para ir até
     * ele. O clarify trata isso como texto de apoio que repete o controle: a seta
     * já diz que há mais abaixo, e a palavra "cases" já está no menu. Repetir o
     * rótulo não é convite.
     *
     * "Comece pelo produto que eu conduzi do zero" foi a tentativa seguinte, e o
     * autor apontou que ainda não convidava. Ele estava certo sobre a causa:
     * **"Comece" é imperativo.** Manda em vez de chamar, e o modo verbal é o que
     * separa instrução de convite, por mais útil que a instrução seja.
     *
     * "Vem ver" é oferta. E é o registro que o resto do hero já usa — o `greeting`
     * diz "Oi, sou o Lucas. Quase todo mundo me chama de Casanova". O DESIGN.md
     * define o site como carta em primeira pessoa; num convite, a pessoa fala.
     *
     * A promessa é verificável: o produto conduzido do zero existe na página, é o
     * case de destaque, e "do marco zero" é o que o PRODUCT.md e o próprio case já
     * afirmam. E ela é a instância concreta do que o `headline` promete no alto.
     *
     * O QUE EU NÃO ESCREVI, e por quê: a versão mais atraente seria prometer as
     * decisões e os custos por trás dos cases, que é exatamente o que este leitor
     * quer. Mas o campo `tradeoff` está **vazio nos três cases**, e o princípio 2 do
     * PRODUCT.md é evidência real ou silêncio. Prometer no hero o que a seção não
     * entrega é o pior lugar possível para uma promessa quebrada. Quando os
     * trade-offs forem escritos, esta linha pode ficar bem mais forte.
     */
    ctaBuilds: 'Vem ver o que eu conduzi do zero',
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
    /*
     * O título passou por três versões, e a razão de cada troca importa.
     *
     * "O que eu construí" divergia do menu, do convite do hero e do endereço da
     * âncora, que já diziam "Cases" nos três lugares. Virou "Cases", e aí o autor
     * apontou o problema seguinte: **substantivo solto ao lado de frases.** Todos os
     * outros títulos da página são orações em primeira pessoa — "Product Manager que
     * conduz do início ao fim", a afirmação que abre o Sobre, "Vamos conversar." —,
     * e uma palavra sozinha lê como aba de menu no meio de uma carta.
     *
     * A frase de agora é oração, é primeira pessoa e **é promovida do parágrafo
     * abaixo**, que é a regra que o Sobre já segue: o título sai do texto da seção,
     * nunca é afirmação nova. O menu continua dizendo "Cases", e deve continuar —
     * item de navegação é rótulo, não voz.
     */
    title: 'Trabalhos que eu gosto de contar',
    /*
     * A abertura da seção, reescrita a pedido do autor.
     *
     * A versão anterior — "Um produto que conduzi do começo ao fim e dois trabalhos
     * de pesquisa" — fazia o que ele recusou: **inventariava o que vinha logo em
     * seguida**, em vez de dizer alguma coisa sobre como ele trabalha. Uma frase
     * que descreve a própria lista é redundante com a lista, e o leitor chega nos
     * cases já tendo lido o resumo deles.
     *
     * A frase de agora diz para que serve um case e o que ele põe dentro de cada
     * um, e termina convidando. **Ela não repete o hero de propósito:** o hero fala
     * do percurso dele (dez anos, IA, origem em research), esta fala do critério —
     * decisão, custo e número. Duplicação entre dobras foi o achado que mais
     * apareceu nas passadas de clarify.
     */
    /*
     * Reescrito a pedido do autor, que leu a versão anterior como passivo-agressiva.
     * Ele tem razão, e vale nomear o mecanismo: ela abria com "Um case serve para
     * verificar o que um currículo só afirma", ou seja, **começava dizendo que o
     * documento que o leitor tem na mão não basta.** Quem chega aqui chegou pelo
     * currículo. Abrir contestando a ferramenta de quem lê põe a pessoa na defensiva
     * antes da primeira prova.
     *
     * A frase de agora faz o mesmo trabalho pelo lado de dentro: em vez de atacar o
     * currículo, ela diz o que estes textos têm de diferente, e o "inclusive o que
     * não saiu como eu esperava" entrega a mesma credibilidade que a versão anterior
     * tentava arrancar do contraste.
     *
     * "Fica à vontade" fecha convidando, no lugar de "Abre o que te interessar", que
     * era imperativo seco. Sem travessão, pela regra de voz do autor.
     */
    lead: 'Em cada um eu conto o começo, a decisão que mudou o rumo e o que veio depois, inclusive o que não saiu como eu esperava. Fica à vontade para entrar pelo que te interessar.',
    rolesLabel: 'O que eu fiz',
    timelineLabel: 'Como o produto evoluiu',
    highlightsLabel: 'Escopo e resultado',
    openFull: 'Ver o case completo',
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
        page: '/cases/inteligencia-comercial',
        /*
         * Três linhas, teto pedido pelo autor. A versão anterior tinha seis e fazia
         * o trabalho da página interna: listava os papéis (agora em `roles`), os
         * módulos (que já têm bloco próprio) e o estágio do produto (agora em
         * `highlights`). Sobrando só a narrativa, o parágrafo pode fazer a única
         * coisa que cápsula nenhuma faz, que é **contar de onde o produto veio**.
         *
         * Abre pelo problema e não pela solução, porque é o problema que prende
         * quem avalia: um vendedor parado dentro da farmácia sem as três
         * informações de que precisa é uma cena, e cena instiga. "Três módulos em
         * produção" é conclusão, e conclusão fecha o assunto em vez de abrir.
         */
        body: 'Começou com um problema de campo: o vendedor dentro da farmácia sem preço, sem estoque e sem o histórico do cliente na mão. Hoje são três módulos em produção, e a operação comercial roda em cima deles.',
        /* Papéis exercidos neste produto, apurados da descrição de cargo no
           `curriculo-base.md`. Nenhum deles é aspiracional. */
        roles: [
          'Discovery contínuo',
          'Visão e estratégia',
          'Roadmap',
          'Spec e handoff',
          'Instrumentação',
          'Design da interface',
        ],
        /*
         * Escopo e resultado. Os números saem de `curriculo-base.md` e da memória de
         * métricas do produto, apurados em Power BI e Mixpanel em julho de 2026.
         *
         * **"MVP" e "soft launch" não entraram.** O autor citou os dois como exemplo
         * de formato, e nenhuma fonte que eu tenho registra que o IC passou por um
         * MVP declarado ou por um soft launch. Se passou, ele confirma e eu ponho —
         * a regra dura deste arquivo é que nada aqui pode ser afirmado sem fonte, e
         * ela vale principalmente para o que soa bem.
         *
         * "NPS +85" tem fonte, e ela chegou depois: o medidor que o autor mandou
         * para a capa marca **86**. A pílula fica em "+85" por escolha dele, que é
         * arredondar para baixo — a afirmação continua verdadeira e não precisa ser
         * revista quando o número oscilar. Antes daqui a pílula dizia "NPS 80+", que
         * era o que o `curriculo-base.md` sustentava.
         *
         * **O currículo ainda diz "NPS 80+"** nos três arquivos (base e os dois
         * publicados). Se for para alinhar, é uma edição e dois PDFs regerados.
         */
        highlights: [
          { value: 'E2E' },
          { value: 'SaaS B2B' },
          { value: '400+', label: 'usuários' },
          { value: 'NPS +85' },
          { value: '80%+', label: 'de conversão' },
        ],
        /*
         * O painel de evolução. Ver o tipo `Milestone` para por que ele deixou de
         * ser uma imagem e por que a ideação é texto e não a captura do slide.
         *
         * As datas são do autor (30/07/2026) e não constam em nenhum outro
         * documento deste repositório: se um dia precisarem ser conferidas, a
         * fonte é ele.
         */
        milestones: [
          {
            iso: '2024-11',
            when: 'Nov 2024',
            title: 'Ideação',
            note: 'A primeira apresentação interna nomeia o que o produto vai atacar.',
            /* Do slide "Dores que buscamos resolver", da apresentação interna.
               Encurtadas para caber em três linhas; o sentido é o do slide. */
            pains: [
              'Estagnação no mix comercializado',
              'Falta de visibilidade das campanhas',
              'Perda de eficiência no planejamento',
            ],
          },
          {
            iso: '2024-12',
            when: 'Dez 2024',
            title: 'Lo-fi',
            note: 'O primeiro fluxo, ainda sem marca.',
            shots: [
              {
                src: '/assets/cases/ic/lofi.jpg',
                alt: 'Wireframe em tons de cinza da tela de sugestões, com a lista de clientes e o carrinho sugerido.',
              },
            ],
          },
          {
            iso: '2025-01',
            when: 'Jan 2025',
            title: 'First draft',
            note: 'A interface ganha marca e os pedidos ideais.',
            shots: [
              {
                src: '/assets/cases/ic/draft.jpg',
                alt: 'Primeiro rascunho de interface, em verde, com a lista de pedidos ideais por cliente.',
              },
            ],
          },
          {
            iso: '2025-09',
            when: 'Set 2025',
            title: 'Em produção',
            note: 'Três módulos no ar, com clientes reais.',
            shots: [
              {
                src: '/assets/cases/ic/objetivos.jpg',
                alt: 'Objetivos e Sugestões: rosca de desempenho de venda total e o gráfico de projeção contra a meta.',
              },
              {
                src: '/assets/cases/ic/cotacao.jpg',
                alt: 'Cotação Ágil: o resumo de uma cotação com os produtos, as quantidades e o preço por unidade.',
              },
              {
                src: '/assets/cases/ic/catalogo.jpg',
                alt: 'Catálogo Digital: as estatísticas de um catálogo publicado, com interesses, acessos e tempo ativo.',
              },
            ],
          },
          {
            iso: '2026-07',
            when: 'Jul 2026',
            title: 'NPS do produto',
            /* A procedência é o Formbricks, informada pelo autor. Ela **fica**: o
               site declara origem em todo número que publica, e NPS sem fonte pesa
               menos justamente para quem sabe ler NPS. Eu já errei esta linha uma
               vez, atribuindo ao Mixpanel — o Mixpanel mede uso da plataforma. */
            score: {
              value: '86',
              label: 'NPS do produto',
              source: 'Formbricks',
              min: '-100',
              max: '100',
            },
          },
        ],
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
    /*
     * O título nomeia os dois extremos do percurso, e não só o destino. "O caminho
     * até produto teve ida e volta" dizia de onde ele saiu por omissão; com "do
     * design até Product Manager" a seção anuncia o assunto que o autor pediu — a
     * migração — antes do primeiro parágrafo.
     *
     * A regra do `statement` continua valendo: a frase é promovida do texto da
     * seção, nunca é afirmação nova.
     */
    statement: 'Do design até Product Manager',
    /*
     * Reescrito para ser trajetória, que é o que o autor pediu para esta coluna.
     *
     * A versão anterior tinha três parágrafos e só o primeiro contava o percurso.
     * O segundo listava onde ele joga confortável e o terceiro descrevia jeito de
     * trabalhar — os dois são afirmação sobre si mesmo, e **os dois passaram a ter
     * dono melhor na página**: o hero já diz de onde vem a evidência com que ele
     * decide, e a subseção de relatos diz, na voz de terceiros, que ele leva
     * ferramenta testada para o time. Autoelogio ao lado do mesmo elogio dito por
     * outra pessoa é o autoelogio perdendo.
     *
     * Ficou um arco de três tempos: origem, virada, hoje. É a virada que o autor
     * queria explicar, e ela estava faltando — a versão anterior pulava de "voltei
     * para product design" direto para "assumi Product Manager", sem dizer o que
     * aconteceu no meio.
     */
    story: [
      'Comecei em 2016 desenhando telas de caixa eletrônico. Entrei em produto ainda como designer, ~~liderei um time de nove~~, voltei para pesquisa na Electrolux e cheguei à Nexfar como o ~~primeiro Product Designer~~ da empresa.',
      'Foi ali que a virada aconteceu. Estruturar a frente de design sozinho me pôs para ~~decidir escopo e defender prioridade~~, não só desenhar a solução. Essa parte do trabalho foi ficando maior que a outra.',
      'Em 2025 assumi como ~~Product Manager~~, e o Inteligência Comercial saiu do zero na minha mão. A base em design não virou passado: é ela que me deixa desenhar o fluxo, instrumentar a métrica e chegar ao dado sem depender de handoff.',
    ],
    experienceLabel: 'Experiência',
    nowLabel: 'Agora',
    rows: [
      {
        when: '2025',
        current: true,
        role: 'Product Manager, Sênior',
        squad: 'Inteligência Comercial',
        org: 'Nexfar',
      },
      {
        when: '2023–2025',
        role: 'Product Designer, Sênior',
        squad: 'Frente de design de produtos digitais',
        org: 'Nexfar',
      },
      {
        when: '2022–2023',
        role: 'UX Researcher, Sênior',
        squad: 'Produtos digitais',
        org: 'Electrolux',
      },
      {
        when: '2021–2022',
        role: 'Lead Designer',
        squad: 'Time de 9 designers',
        org: 'Garupa Design',
      },
      {
        when: '2020–2021',
        role: 'Product Designer, Pleno',
        squad: 'PontoWeb, back-office',
        org: 'Ahgora Sistemas, hoje TOTVS',
      },
      {
        when: '2018–2020',
        role: 'Product Designer, Pleno',
        squad: 'Equipe de Produto',
        org: 'myTapp Tecnologia',
      },
      /* Os dois primeiros cargos numa linha só: UX Designer na Garupa (set/2016 a
         nov/2017) e UI/UX Designer Júnior na Dzigual Golinelli (nov/2017 a nov/2018).
         Juntos porque a lista tem sete linhas e essas duas são o mesmo capítulo, e
         porque sem elas a linha do tempo abria em 2018 e fazia parecer que a carreira
         começou ali.

         **Dentro desta linha a ordem é cronológica, ao contrário da lista inteira**,
         por correção do autor em 30/07/2026. Ela era invertida, para acompanhar a
         lista, e isso punha a Dzigual na frente. Duas razões para a exceção: o
         intervalo é rotulado "Até 2018", que já pede leitura para frente; e a Garupa
         é a empresa para onde ele volta em 2021, três linhas acima — abrindo por ela,
         a linha do tempo mostra um retorno em vez de repetir um nome do nada. */
      {
        when: 'Até 2018',
        role: 'UX/UI Designer',
        squad: 'Generalista',
        org: 'Garupa Design e Dzigual Golinelli',
      },
    ],
    /* Da seção Habilidades do `curriculo-base.md`, recorte de Produto. As de design
       e as de dado ficam de fora: o posicionamento do PRODUCT.md manda a base em
       design entrar como o que sustenta o PM, e nunca como oferta alternativa de
       serviço. Uma lista de skills de design ao lado de uma de produto é
       exatamente a dúvida que o avaliador não pode ter. */
    skillsLabel: 'Skills',
    /* TETO DE 20 CARACTERES POR ITEM. A lista vive numa coluna de cerca de 380px, e
       ali um rótulo mais longo que isso não divide fileira com nenhum outro: cada
       item passa a custar uma linha inteira. Foi o que aconteceu na primeira versão
       em cápsulas — "Gestão de stakeholders e cliente" e "Métricas e analytics de
       produto" sozinhas geravam oito fileiras para nove itens.

       Os termos abaixo são os do `curriculo-base.md` encurtados, e onde encurtar
       perderia informação eu separei em dois itens em vez de truncar:

       - "Roadmap e priorização"    → "Roadmap" + "Priorização"
       - "KPI e instrumentação"     → "KPIs" + "Instrumentação"
       - "Métricas e analytics de produto" → "Métricas e analytics" ("de produto"
         é redundante numa seção que só fala de produto)
       - "Gestão de stakeholders e cliente" → "Stakeholders". Aqui houve perda
         real, e ela é consciente: o cliente saiu do rótulo. Ele continua dito na
         prosa da trajetória, em "Product discovery" (o discovery dele é com
         cliente e com vendedor em campo) e por inteiro no currículo. Uma cápsula
         "Discovery com cliente" ao lado de "Product discovery" seria a mesma
         palavra duas vezes, que é o defeito que mais aparece nesta página.

       **O currículo não segue este teto** e não deve seguir: lá o campo é uma
       linha de texto, não uma cápsula, e a forma longa é a que os filtros de ATS
       leem. As duas listas divergem de propósito. */
    skills: [
      'Product discovery',
      'Roadmap',
      'Priorização',
      'PRD e tech spec',
      'Métricas e analytics',
      'KPIs',
      'Instrumentação',
      'Stakeholders',
      'Product-led growth',
      'Backlog management',
      'Build vs. buy',
      /* Entrou por pedido do autor em 30/07/2026, e fica na última posição de
         propósito: numa lista lida em varredura, o fim é a segunda posição mais
         forte depois do começo, e este é o item que separa o currículo dele do de
         outro PM sênior. Sem tradução na versão em inglês — o termo já é inglês, e
         traduzir "vibe coding" produziria uma frase que ninguém procura. */
      'Vibe coding',
    ],
    toolsLabel: 'Ferramentas',
    tools: [
      'Figma',
      'Claude Code',
      'MCP',
      'Power BI',
      'Mixpanel',
      'Microsoft Clarity',
      'ClickUp',
      'Jira',
      'Miro',
    ],
    /* A lista "Dados" (GraphQL, Postgres, BigQuery, com a ressalva de acesso de
       leitura via MCP) saiu por decisão do autor em 30/07/2026: irrelevante para o
       que a seção precisa dizer. O MCP entrou em Ferramentas, que é onde ele
       importa. **O que se perdeu junto:** a ressalva de escopo, que existia porque
       "GraphQL" numa lista de credenciais lê como domínio direto, e o acesso é de
       leitura. Se as três voltarem algum dia, a ressalva volta com elas. */
    languagesLabel: 'Idiomas',
    languages: [
      { name: 'Português', level: 'Nativo' },
      {
        name: 'Inglês',
        level: 'B2',
        note: 'Leio e escrevo em inglês com fluência; na conversação estou em nível intermediário.',
      },
    ],
    /* Recortada em 4:5 a partir de um quadrado de 1280px e **espelhada de volta**:
       o arquivo veio da câmera frontal, e no original "1985" no boné, "KING" no
       bolso e os katakana da manga liam de trás para frente. */
    portrait: {
      src: '/assets/retrato.jpg',
      alt: 'Lucas Casanova de boné e óculos, com o rosto virado de lado sob uma faixa de luz de sol.',
    },
    portraitPending: 'Meu retrato entra aqui.',
    portraitName: 'Lucas Casanova',
    interestsLabel: 'Fora do trabalho',
    /* Os três que o autor listou, nesta ordem. O emoji é conteúdo aqui, não
       decoração: ele carrega o significado junto com a palavra e muda com o item. */
    interests: [
      { emoji: '🥊', label: 'Boxe' },
      { emoji: '🎮', label: 'Videogames' },
      { emoji: '🐶', label: 'Tempo com meus cachorros' },
      { emoji: '🎧', label: 'Rap nacional e pop rock' },
    ],
    photosLabel: 'Eu fora do trabalho',
    photosPending: [
      'Uma foto minha fora do trabalho entra aqui.',
      'Outra, de outro hobby, entra aqui.',
    ],
    testimonialsTitle: 'O que acham de trabalhar comigo?',
    /*
     * Diz do que a seção trata, e não de onde os relatos vêm — o autor pediu a
     * troca. Duas correções na frase que ele escreveu:
     *
     * - **"abaixo" saiu.** O DESIGN.md proíbe copy que descreve posição de layout,
     *   e aqui a regra morde de verdade: os relatos estão numa grade que é de uma
     *   coluna no telefone e de três no desktop, e o que está "abaixo" numa largura
     *   está ao lado na outra. No convite do hero "abaixo" era função; aqui é
     *   coordenada.
     * - **"pares" saiu.** Com o ex-líder e o ex-liderado na lista, "pares" deixou de
     *   ser verdade. "Quem trabalhou comigo" cobre os três tipos de relação sem
     *   prometer simetria que não existe.
     *
     * Também corrigi "dia-a-dia" para "dia a dia", que é a grafia depois do Acordo
     * Ortográfico. Como substantivo hifenizado, ele só sobrevive em "o dia-a-dia" de
     * antes de 2009.
     */
    testimonialsNote: 'O que quem trabalhou comigo pensa do meu papel no dia a dia.',
    /*
     * ORIGEM dos três primeiros: `relatorio_lucas-acosta-casanova_2026-mar-jun.pdf`,
     * os blocos de resposta dos pares. Os marcados "[Autoavaliação]" no relatório são
     * do próprio Lucas e **nunca** entram aqui — o valor deste bloco é ser palavra de
     * terceiro. Os dois últimos foram ditados pelo autor.
     *
     * ENCURTADOS POR OMISSÃO, NUNCA POR REESCRITA. O autor pediu relatos mais
     * sucintos, e há duas formas de encurtar palavra de outra pessoa: cortar trecho,
     * ou reescrever. **A segunda transforma citação em paráfrase**, e aí as aspas
     * passam a mentir sobre quem escolheu aquelas palavras. Todo corte aqui é
     * supressão de oração inteira; nenhuma palavra foi trocada de lugar nem
     * substituída. O que saiu de cada um:
     *
     *   1. "As pessoas ao redor embarcam com mais facilidade no que ele propõe, e o
     *      trabalho de implementar anda de forma mais coletiva." Também já havia saído
     *      antes o elogio por tempo de casa, que não transfere de empresa.
     *   2. "que apoiam o desenvolvimento das atividades", oração adjetiva que não
     *      acrescenta nada ao que já está dito em "ferramentas".
     *   3. "Com colegas, com outras áreas, não importa de onde vem a dúvida ou o
     *      pedido: ele não se nega." Enumeração que a primeira frase já resume.
     *
     * O segundo é o mais longo dos cinco e não desce mais sem virar reescrita: ele é
     * uma frase única, sem oração descartável sobrando.
     *
     * PENDÊNCIA: **o relatório não identifica a relação de trabalho de quem
     * escreveu.** Por isso os três primeiros estão em "Colega de trabalho", que é o
     * mais específico que se sustenta, e não em "Par direto" ou "Colega de setor
     * parceiro". Só o autor sabe quem escreveu o quê. Ao corrigir, trocar só o
     * `source`.
     */
    testimonials: [
      {
        quote:
          'Quando a solução parte dele, ela costuma ganhar tração entre os colegas. Não é influência pela imposição, é pela confiança que o time tem na leitura dele.',
        source: 'Colega de trabalho',
      },
      {
        quote: 'Te vejo como um profissional que, acima de tudo, é Sênior em aprender.',
        source: 'Ex-líder',
      },
      {
        quote: 'Sempre senti que podia chegar em ti e abrir sobre a realidade.',
        source: 'Ex-liderado, em 1:1',
        featured: true,
      },
      {
        quote:
          'Atua de forma proativa ao trazer e testar ferramentas, especialmente com o uso de IA e automação, contribuindo para ganhos de eficiência do time.',
        source: 'Colega de trabalho',
      },
      {
        quote:
          'O Casanova não espera ser chamado pra ajudar. Quando não sabe a resposta, vai atrás ou indica quem sabe.',
        source: 'Colega de trabalho',
      },
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
    github: 'GitHub',
    location: 'Florianópolis, SC, Brasil',
    builtWith: 'Feito por mim com React, Vite e Tailwind.',
    rights: '© 2026 Lucas Casanova',
  },
}

const en: Copy = {
  meta: {
    title: 'Lucas Casanova · Product Manager',
    description:
      'Product manager who runs the product from start to finish. 10 years in the market, 8 of them in product. I own Inteligência Comercial at Nexfar: OCR quoting, real-time catalog and AI order recommendation.',
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
    /* Acompanha a reescrita em português: convite dirigido a quem lê, não relato
       sobre o que os outros fazem. Ver o comentário na versão em português. */
    greeting: 'Hi, I’m Lucas, but you can call me “Casanova”.',
    lead: 'I’ve been working for **10 years**, **8 of them in product**. Today I use @@AI and LLMs@@ inside the product I run and in my own work. I come from @@research and craft@@, and that is where the evidence comes from to decide, to execute and to track how it performs.',
    location: 'Florianópolis, Brazil',
    ctaResume: 'Download my résumé (PDF)',
    ctaBuilds: 'Come see what I ran from day one',
  },
  intro: {
    paragraphs: [
      'Inteligência Comercial started from nothing in my hands and today has **more than 400 users**, a **product NPS above 80** and **five operations migrated in six months**. More than 20 improvements shipped in the last three months, prioritised from usage data and conversations with the people selling in the field.',
    ],
    source: 'Figures from July 2026, measured in Power BI and Mixpanel.',
  },
  builds: {
    /* Ver os comentários na versão em português para as duas reescritas. */
    title: 'Work I like talking about',
    lead: 'In each one I walk through the start, the decision that changed course and what came after, including what did not go the way I hoped. Feel free to begin wherever you like.',
    rolesLabel: 'What I did',
    timelineLabel: 'How the product evolved',
    highlightsLabel: 'Scope and outcome',
    openFull: 'Read the full case',
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
        page: '/cases/inteligencia-comercial',
        body: 'It started with a problem in the field: the rep standing inside the pharmacy with no price, no stock and no client history at hand. Today it is three modules in production, and the commercial operation runs on them.',
        roles: [
          'Continuous discovery',
          'Vision and strategy',
          'Roadmap',
          'Specs and handoff',
          'Instrumentation',
          'Interface design',
        ],
        highlights: [
          { value: 'E2E' },
          { value: 'B2B SaaS' },
          { value: '400+', label: 'users' },
          { value: 'NPS +85' },
          { value: '80%+', label: 'conversion' },
        ],
        /* Ver os comentários na versão em português. */
        milestones: [
          {
            iso: '2024-11',
            when: 'Nov 2024',
            title: 'Ideation',
            note: 'The first internal deck names what the product will attack.',
            pains: [
              'Stagnant product mix',
              'No visibility into campaigns',
              'Planning losing efficiency',
            ],
          },
          {
            iso: '2024-12',
            when: 'Dec 2024',
            title: 'Lo-fi',
            note: 'The first flow, still unbranded.',
            shots: [
              {
                src: '/assets/cases/ic/lofi.jpg',
                alt: 'Greyscale wireframe of the suggestions screen, with the client list and the suggested cart.',
              },
            ],
          },
          {
            iso: '2025-01',
            when: 'Jan 2025',
            title: 'First draft',
            note: 'The interface gets a brand, and ideal orders.',
            shots: [
              {
                src: '/assets/cases/ic/draft.jpg',
                alt: 'First interface draft, in green, with the list of ideal orders per client.',
              },
            ],
          },
          {
            iso: '2025-09',
            when: 'Sep 2025',
            title: 'Live',
            note: 'Three modules shipped, with real customers.',
            shots: [
              {
                src: '/assets/cases/ic/objetivos.jpg',
                alt: 'Objetivos e Sugestões: total-sales performance dial and the projection chart against target.',
              },
              {
                src: '/assets/cases/ic/cotacao.jpg',
                alt: 'Cotação Ágil: a quote summary with products, quantities and unit price.',
              },
              {
                src: '/assets/cases/ic/catalogo.jpg',
                alt: 'Catálogo Digital: stats for a published catalogue, with interest, views and time live.',
              },
            ],
          },
          {
            iso: '2026-07',
            when: 'Jul 2026',
            title: 'Product NPS',
            score: {
              value: '86',
              label: 'Product NPS',
              source: 'Formbricks',
              min: '-100',
              max: '100',
            },
          },
        ],
        pieces: [
          {
            name: 'Cotação Ágil',
            detail:
              'The customer’s list goes in as a photo and comes out as a quote via OCR. It saves **more than an hour** of typing per quote, at 50 to 100 items on average, plus the manual comparison of terms. Conversion runs **above 80%**.',
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
              'The point of sale’s history becomes product mix suggestions and sales targets. This is the product’s AI module.',
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
        body: 'User research as part of standing up digital-product research at Electrolux, an area that until then only looked at industrial products.',
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
    statement: 'From design to Product Manager',
    story: [
      'I started in 2016 drawing ATM screens. I moved into product while still a designer, ~~led a team of nine~~, went back to research at Electrolux, and joined Nexfar as the company’s ~~first Product Designer~~.',
      'That is where it turned. Building the design practice on my own put me in the position of ~~deciding scope and defending priority~~, not only drawing the solution. That part of the work kept growing.',
      'In 2025 I took over as ~~Product Manager~~, and Inteligência Comercial started from nothing in my hands. The design background did not become past tense: it is what lets me draw the flow, instrument the metric and get to the data without a handoff.',
    ],
    experienceLabel: 'Experience',
    nowLabel: 'Now',
    rows: [
      {
        when: '2025',
        current: true,
        role: 'Senior Product Manager',
        squad: 'Inteligência Comercial',
        org: 'Nexfar',
      },
      {
        when: '2023–2025',
        role: 'Senior Product Designer',
        squad: 'Digital product design practice',
        org: 'Nexfar',
      },
      {
        when: '2022–2023',
        role: 'Senior UX Researcher',
        squad: 'Digital products',
        org: 'Electrolux',
      },
      {
        when: '2021–2022',
        role: 'Lead Designer',
        squad: 'Team of 9 designers',
        org: 'Garupa Design',
      },
      {
        when: '2020–2021',
        role: 'Product Designer',
        squad: 'PontoWeb, back-office',
        org: 'Ahgora Sistemas, now TOTVS',
      },
      {
        when: '2018–2020',
        role: 'Product Designer',
        squad: 'Product team',
        org: 'myTapp Tecnologia',
      },
      {
        when: 'Until 2018',
        role: 'UX/UI Designer',
        squad: 'Generalist',
        /* Ordem cronológica dentro da linha, igual à versão em português. Ver o
           comentário lá. */
        org: 'Garupa Design and Dzigual Golinelli',
      },
    ],
    skillsLabel: 'Skills',
    /* Mesmo teto de 20 caracteres da versão em português, e os mesmos cortes. Ver
       o comentário lá para o raciocínio e para o que se perdeu. */
    skills: [
      'Product discovery',
      'Roadmap',
      'Prioritisation',
      'PRD and tech spec',
      'Metrics and analytics',
      'KPIs',
      'Instrumentation',
      'Stakeholders',
      'Product-led growth',
      'Backlog management',
      'Build vs. buy',
      'Vibe coding',
    ],
    toolsLabel: 'Tools',
    tools: [
      'Figma',
      'Claude Code',
      'MCP',
      'Power BI',
      'Mixpanel',
      'Microsoft Clarity',
      'ClickUp',
      'Jira',
      'Miro',
    ],
    languagesLabel: 'Languages',
    languages: [
      { name: 'Portuguese', level: 'Native' },
      {
        name: 'English',
        level: 'B2',
        note: 'I read and write English fluently; my conversation is at an intermediate level.',
      },
    ],
    portrait: {
      src: '/assets/retrato.jpg',
      alt: 'Lucas Casanova in a cap and glasses, face turned to the side under a band of sunlight.',
    },
    portraitPending: 'My portrait goes here.',
    portraitName: 'Lucas Casanova',
    interestsLabel: 'Away from work',
    interests: [
      { emoji: '🥊', label: 'Boxing' },
      { emoji: '🎮', label: 'Video games' },
      { emoji: '🐶', label: 'Time with my dogs' },
      /* "Rap nacional" fica em português na versão em inglês: é o nome do gênero,
         não uma descrição. Traduzir para "Brazilian rap" perderia o termo pelo
         qual ele é conhecido. */
      { emoji: '🎧', label: 'Rap nacional and pop rock' },
    ],
    photosLabel: 'Me away from work',
    photosPending: [
      'A photo of me away from work goes here.',
      'Another one, from a different hobby, goes here.',
    ],
    testimonialsTitle: 'What is it like to work with me?',
    testimonialsNote: 'What the people I have worked with think of my day-to-day role.',
    /* Ver a nota na versão em português para os cortes e para a pendência de
       atribuição. **Estes cinco são tradução minha de originais em português**, e a
       seção não diz mais isso: a declaração de procedência saiu a pedido do autor.
       Citação traduzida sem aviso é prática comum em site bilíngue, mas é uma perda
       real de transparência e vale saber que ela existe. */
    testimonials: [
      {
        quote:
          'When the solution comes from him, it tends to gain traction with his colleagues. It is not influence through pressure, it is through the trust the team has in his reading of things.',
        source: 'Colleague',
      },
      {
        quote: 'I see you as someone who is, above all, senior at learning.',
        source: 'Former manager',
      },
      {
        quote:
          'I always felt I could come to you and be honest about where things really stood.',
        source: 'Former report, in a 1:1',
        featured: true,
      },
      {
        quote:
          'He proactively brings in and tests tools, especially using AI and automation, contributing to efficiency gains for the team.',
        source: 'Colleague',
      },
      {
        quote:
          'Casanova does not wait to be asked for help. When he does not know the answer, he goes and finds out, or points you to who knows.',
        source: 'Colleague',
      },
    ],
  },
  close: {
    title: 'Let’s talk.',
    lead: 'If you are building a product team, or you want to dig into a decision I made, write to me. I have also left the full résumé as a PDF. I answer in English or Portuguese.',
    signoff: 'Thanks for reading this far.',
    ctaResume: 'Download my résumé (PDF)',
    copy: 'Copy email',
    copied: 'Copied!',
    copyFailed: 'I could not copy it. I selected the address for you to copy.',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    location: 'Florianópolis, SC, Brazil',
    builtWith: 'Built by me with React, Vite and Tailwind.',
    rights: '© 2026 Lucas Casanova',
  },
}

export const EMAIL = 'contato.lcasanova@gmail.com'
export const LINKEDIN = 'https://www.linkedin.com/in/casanovahs/'
/* O perfil de onde saem os repositórios pessoais dele, este site inclusive. */
export const GITHUB = 'https://github.com/cas0la'

const dictionary: Record<Locale, Copy> = { pt, en }

export function copyFor(locale: Locale): Copy {
  return dictionary[locale]
}
