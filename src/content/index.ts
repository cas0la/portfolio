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
  /**
   * Os módulos que existiam neste marco, no marco de lançamento.
   *
   * **Esta lista é o argumento da estação, e o argumento é a subtração.** Cinco
   * itens em maio de 2025, três telas em produção depois — quem varre a faixa da
   * esquerda para a direita vê dois desaparecerem sem que nenhuma frase precise
   * dizer isso. Era a fase que faltava na cronologia: o site contava a ideação, os
   * rascunhos e a produção, e pulava o lançamento inteiro.
   *
   * Mesmo desenho da lista de `pains` — fio à esquerda, um item por linha — com a
   * cor trocada. Roxo é a dor que motivou; royal é o que foi construído, e royal já
   * é a cor das datas do painel.
   */
  modules?: string[]
  /** O número que fecha a linha, com a fonte declarada. */
  score?: { value: string; label: string; source: string; min: string; max: string }
  /**
   * Fim do intervalo, quando o marco é um período e não uma data.
   *
   * Produção não foi um dia: os três módulos entraram um a um entre setembro de
   * 2025 e março de 2026. Datar isso como "Set 2025" contaria que os três subiram
   * juntos, que é uma afirmação mais forte e falsa.
   *
   * São dois campos porque o painel desenha dois `<time datetime>` de verdade. Uma
   * única etiqueta escrita "Set 2025 – Mar 2026" dentro de um `datetime` de mês só
   * seria marcação mentindo sobre o próprio conteúdo.
   */
  until?: string
  untilIso?: string
}

export type Piece = {
  name: string
  detail: string
  /**
   * De que problema o módulo nasceu, em prosa.
   *
   * **Cada módulo carrega a própria jornada agora.** Antes a página tinha um bloco
   * `origin` solto que contava só a da Cotação Ágil e um tradeoff que falava só de
   * Objetivos e Sugestões: dois textos de módulo posando de texto de produto, e os
   * outros dois módulos sem história nenhuma. Aqui a jornada fica colada no módulo
   * que ela explica.
   */
  journey?: string[]
  /**
   * As decisões do módulo, cada uma com a tela em que ela aparece.
   *
   * **Decisão, não funcionalidade.** Cada item nomeia uma escolha e o que ela
   * descartou; "o módulo tem OCR" é funcionalidade e não entra. É o princípio 1 do
   * PRODUCT.md — um caso sem trade-off explícito não está pronto — aplicado no
   * nível do módulo em vez de só no nível do case.
   *
   * A tela é **parte da decisão e não ilustração dela**: é a prova de que a escolha
   * chegou a existir em produto. Por isso `src` mora aqui e não numa galeria
   * separada.
   */
  decisions?: { title: string; body: string }[]
  /**
   * A jornada do módulo em telas, no slider.
   *
   * **Saiu de dentro das decisões e virou peça própria.** Cada decisão carregava uma
   * captura, e isso prendia a jornada a três telas — enquanto a Cotação Ágil tem seis
   * estados que só fazem sentido em ordem: três formatos de entrada, os ajustes, o
   * processamento e a conferência. Amarrar tela a decisão obrigava a escolher entre
   * contar a decisão e mostrar o fluxo.
   *
   * `caption` é o passo, não a explicação. O porquê fica nas decisões, acima; aqui a
   * legenda só diz onde no fluxo aquela tela acontece, senão o slider vira um segundo
   * texto competindo com o primeiro.
   */
  screens?: { src: string; alt: string; caption: string }[]
  /**
   * Os números que o módulo sustenta.
   *
   * **O primeiro é o principal e sai em corpo de display.** A ordem da lista é
   * hierarquia, não cronologia: quem escreve põe primeiro o número que o módulo
   * usaria para se defender sozinho.
   *
   * Virou lista porque um módulo tem mais de um resultado, e o anterior (`count`,
   * um número só) obrigava a escolher o mais vistoso e jogar fora os que provavam
   * a mesma coisa por outro ângulo.
   *
   * `source` é por número e não por seção. A nota de rodapé única dizia "Power BI e
   * Mixpanel" para tudo, o que é verdade para parte e mentira para o resto — os
   * números de OCR saem de release note, não de painel. Onde `source` falta, o
   * rodapé da seção ainda responde.
   */
  results?: { value: string; unit: string; source?: string }[]
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
  /**
   * Escopo e resultado, em cápsulas.
   *
   * `measured` marca o que é número apurado, e é ele que ganha royal e algarismo
   * tabular. Antes isso era adivinhado por `/\d/` sobre o valor, e "SaaS B2B" e
   * "E2E" têm dígito dentro do nome — as duas saíam coloridas como se fossem
   * medição. Ver `StatPill` para o registro inteiro.
   */
  highlights?: { value: string; label?: string; measured?: boolean }[]
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
  /**
   * Como o escopo continuou sendo decidido depois que o produto subiu.
   *
   * **Este é o único bloco em nível de case, e por isso ele existe.** A jornada de
   * cada módulo conta de onde aquele módulo veio; este conta o método que decidiu
   * o que entrava em todos eles. Foi o que sobrou de legítimo no nível do produto
   * quando as origens desceram para os módulos.
   */
  discovery?: { title: string; body: string[]; results?: Piece['results'] }
  /**
   * A prova de efetividade, no fim da página.
   *
   * **Aqui é o único lugar onde números de origens diferentes se encostam**, e é de
   * propósito: satisfação medida em pesquisa, adoção medida em operação e uso medido
   * em produto dizem coisas diferentes, e a força está em elas concordarem. Nos
   * módulos cada número prova um módulo; aqui eles provam o produto.
   *
   * Cada linha declara a própria fonte, sem exceção — é o fecho do case e é onde um
   * número sem procedência estraga os outros por associação.
   */
  /**
   * Onde os três módulos se encontram: a saída para o checkout da plataforma de
   * vendas.
   *
   * **Existe como seção porque não é atributo de módulo nenhum.** Cada um dos três
   * tem a própria saída, e escrever isso três vezes dentro dos módulos faria parecer
   * três integrações parecidas em vez de uma decisão de arquitetura tomada uma vez.
   * É também o desfecho do achado do último metro, que abre a jornada de Objetivos:
   * o problema era de produto, e a resposta teve que ser de produto.
   */
  convergence?: {
    title: string
    body: string[]
    items: { name: string; detail: string }[]
  }
  proof?: { title: string; lead: string; results: NonNullable<Piece['results']> }
  /*
   * `origin` MORREU AQUI, e o que ele fazia continua vivo.
   *
   * Era uma seção solta desta página, com título próprio, contando de onde a
   * Cotação Ágil tinha vindo. O texto está inteiro em `Piece.journey` do módulo que
   * ele explica. A seção caiu porque a página passou a separar as jornadas por
   * módulo: um bloco de origem no nível do case dizia, pela posição, que aquela era
   * *a* origem do produto, quando é a de um módulo entre três.
   */
  /**
   * A mesma tela em cinco momentos, na página interna.
   *
   * **É a única peça do site que argumenta por comparação.** A faixa de evolução
   * data marcos e mostra três capturas soltas de módulos diferentes; aqui é sempre
   * a tela inicial, e o que muda entre uma e a seguinte é o argumento. Sem o
   * mesmo assunto nas cinco, viraria galeria.
   *
   * `change` é uma linha só, e é o que mudou daquele passo para o anterior — não
   * uma descrição do que a tela tem. Descrição o leitor tira da imagem sozinho.
   *
   * **Não tem data.** As versões do Figma dão a ordem, não o mês, e o painel logo
   * acima já data a cronologia. Rótulo com data inventada seria pior que rótulo
   * sem data.
   */
  uiEvolution?: {
    title: string
    lead: string
    steps: { version: string; src: string; alt: string; change: string }[]
  }
  /**
   * O custo da decisão. Nativo da caixa de peças, não pendurado no fim.
   *
   * **Virou lista de parágrafos e não uma frase.** Um tradeoff honesto tem dois
   * tempos — o que eu descobri e o que eu deixei de fazer por causa disso — e os
   * dois num parágrafo só viram uma frase longa em que o segundo tempo chega como
   * apêndice do primeiro.
   */
  tradeoff?: string[]
  /**
   * Case em construção pública.
   *
   * **Substituiu as notas em primeira pessoa que diziam o que faltava.** Elas
   * eram honestas e custavam caro: "não tenho material visual publicável deste
   * trabalho" transforma um case em confissão, e quem lê está avaliando, não
   * auditando. Uma marca de estado diz a mesma verdade — isto ainda não está
   * pronto — sem entregar o motivo nem pedir desculpa por ele.
   *
   * A marca vive na assinatura de papel, não em pílula colorida: badge de status
   * é o vocabulário de SaaS que o DESIGN.md recusa desde a primeira rodada.
   */
  wip?: boolean
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

/**
 * Uma marca da faixa de credenciais.
 *
 * **O logo é opcional de propósito.** Marca registrada de terceiro é arquivo que
 * só o autor pode fornecer, e enquanto ele não chega o nome composto em tipografia
 * ocupa o lugar — mesma regra da capa de case, que sem arquivo mostra um
 * placeholder que se assume placeholder em vez de arte de preenchimento.
 *
 * Os SVGs vão em `public/assets/marcas/`. Eles são pintados em preto e desbotados
 * por CSS, então a cor do arquivo original não importa; o que importa é vir em SVG,
 * com fundo transparente e a marca ocupando a caixa inteira, sem margem embutida.
 */
export type Brand = {
  name: string
  /** Caminho do arquivo. Ausente, o nome vira a marca. */
  logo?: string
  /**
   * Como a marca vira monocromática.
   *
   * `flat` é o padrão e achata tudo em preto, que é o que dá uma faixa de uma cor
   * só. Ele funciona quando a marca é uma silhueta: qualquer arte com fundo
   * transparente sai como recorte preto, seja o original de uma cor ou de seis.
   *
   * `gray` existe para a exceção em que **a cor é a marca**. O Banco do Brasil é
   * um quadrado azul com a marca em amarelo por dentro; achatado, o amarelo
   * encosta no azul e sobra um quadrado preto. Escala de cinza preserva a
   * diferença de luminância entre os dois e a marca continua legível.
   */
  tone?: 'flat' | 'gray'
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
    /**
     * Marca de case em construção, ao lado da assinatura de papel.
     *
     * Fica igual nos dois idiomas de propósito: "WIP" é sigla corrente em
     * português e em inglês, e traduzir para "Em construção" alongaria a linha da
     * assinatura só do lado PT, desalinhando os dois cards.
     */
    wipLabel: string
    /**
     * O que a capa de case em construção diz, no lugar da arte.
     *
     * Aqui a frase é traduzida, ao contrário da `wipLabel`: a capa tem 16:10 de
     * largura para gastar, e "Em construção" por extenso é mais claro que a sigla
     * para quem cai direto no card sem ter lido a assinatura de papel.
     */
    coverConstruction: string
    openCase: string
    /** Avisa que o link sai do site. Entra só no rótulo acessível. */
    newTab: string
    items: Build[]
  }
  /**
   * A página interna de case, que passou a existir com o roteador em 31/07/2026.
   *
   * Só os rótulos moram aqui. **O conteúdo do case continua no item de `builds`**,
   * e é de propósito: o mesmo produto é contado em dois lugares com profundidades
   * diferentes, e duplicar a narrativa num segundo objeto garantiria que um dos
   * dois envelhecesse sozinho.
   */
  casePage: {
    /** Volta para a seção de cases da home, não para o topo dela. */
    back: string
    timelineTitle: string
    piecesTitle: string
    /** De onde vêm os números dos módulos. Regra dura: número sem fonte não entra. */
    numbersSource: string
    journeyPrev: string
    journeyNext: string
    tradeoffTitle: string
    closingTitle: string
    closingBody: string
    closingCta: string
    /** A rota que não existe. */
    notFoundTitle: string
    notFoundBody: string
    notFoundCta: string
  }
  brands: {
    /** Oração em primeira pessoa, como todo título de seção. */
    title: string
    /**
     * A linha que diz em que qualidade cada marca entra. Ela não é enfeite: uma
     * faixa de logos sem essa ressalva afirma, por associação, que ele trabalhou
     * *em* todas elas. Princípio 2 do PRODUCT.md, evidência real ou silêncio.
     */
    lead: string
    items: Brand[]
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
    ctaResume: 'Currículo (PDF)',
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
     * **A segunda frase saiu em 31/07/2026**, e o incômodo do autor tinha três
     * causas somadas. Ela era cortesia pura, e cortesia não é informação. Ela
     * enfraquecia o fecho: o parágrafo vinha terminando em "o que não saiu como eu
     * esperava", que é a frase que compra confiança, e a cortesia entrava por cima
     * dela para não dizer nada. E ela **prometia uma navegação que não existe** —
     * "entrar pelo que te interessar" supõe três portas abertas, e hoje só o case
     * de destaque tem página. Ela já passou por "Abre o que te interessar", que era
     * imperativo seco, e por "Fica à vontade", que era o oposto; o problema nunca
     * esteve no tom.
     *
     * Uma frase só, terminando na admissão. Sem travessão, pela regra de voz do
     * autor.
     */
    lead: 'Em cada um eu conto o começo, a decisão que mudou o rumo e o que veio depois, inclusive o que não saiu como eu esperava.',
    rolesLabel: 'O que eu fiz',
    timelineLabel: 'Como o produto evoluiu',
    highlightsLabel: 'Escopo e resultado',
    openFull: 'Ver o case completo',
    piecesLabel: 'Módulos',
    wipLabel: 'WIP',
    coverConstruction: 'Em construção',
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
         * quem avalia. "Três módulos em produção" é conclusão, e conclusão fecha o
         * assunto em vez de abrir.
         *
         * **A versão anterior contava uma cena e não contava um trabalho.** Ela
         * abria com o vendedor parado dentro da farmácia sem preço, sem estoque e
         * sem histórico, e pulava direto para os três módulos no ar. O que faltava
         * era exatamente o que separa produto de encomenda: **a hipótese do cliente
         * estava errada, e foi campo que provou isso.** O autor trouxe o material
         * em 31/07/2026 e é a fonte de tudo o que este parágrafo afirma.
         *
         * Três coisas precisavam caber, e cada frase carrega uma:
         *
         * 1. **O pedido veio com diagnóstico pronto.** A distribuidora nomeou
         *    "execução fragmentada". Dizer isso primeiro é o que faz a correção
         *    seguinte valer alguma coisa.
         * 2. **A correção custou um ano e foi feita com gente de verdade.** "Grupos
         *    focais de regiões e carteiras diferentes" é a prova de método, e é
         *    específico o bastante para ser conferido numa entrevista. "Pesquisa
         *    com usuários" seria a mesma frase sem nada dentro.
         * 3. **O que apareceu no lugar.** Faltava desempenho na mão, que é o que a
         *    cápsula "Mobile first" diz em duas palavras, e sobrava tempo em cotação
         *    e portfólio, que é de onde vieram dois dos três módulos.
         *
         * **"O que sobreviveu a esse ano" fecha de propósito.** Um ano de teste
         * implica coisa cortada, e a frase admite isso sem precisar listar. É
         * também o gancho honesto para a página interna, onde o `tradeoff` ainda
         * está vazio e é o único bloqueio real dela.
         *
         * O parágrafo dobrou de tamanho, e o teto de três linhas que o autor pediu
         * antes cai junto. Foi troca consciente: ele pediu melhora considerável e
         * entregou substância que não cabia no teto anterior.
         */
        body: 'A distribuidora chegou com o diagnóstico pronto: execução fragmentada da equipe de vendas. Um ano de experimentação em campo, com grupos focais de regiões e carteiras diferentes, apontou outra coisa. O vendedor não estava sem indicação: estava sem o próprio desempenho na mão, e perdia o dia respondendo cotação e mostrando portfólio. Os três módulos em produção hoje são o que sobreviveu a esse ano.',
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
         * para a capa marca **86**. O site diz "+85" nos dois lugares — pílula e
         * medidor do painel — por escolha dele, que é arredondar para baixo: a
         * afirmação continua verdadeira e não precisa ser revista quando o número
         * oscilar, e um número exato num medidor convida a conferência que ninguém
         * pode fazer. Antes daqui a pílula dizia "NPS 80+", que era o que o
         * `curriculo-base.md` sustentava.
         *
         * O currículo base e os dois publicados foram alinhados em "+85" junto com
         * esta edição. **Os currículos por empresa já enviados continuam em "NPS
         * 80+" de propósito:** eles são o registro do que o recrutador recebeu, e
         * reescrever um documento entregue é perder o registro.
         *
         * **"Mobile first" entrou no lugar de "E2E", a pedido do autor.** A troca
         * melhora a fileira por outro motivo além do pedido: "E2E" era a única
         * cápsula que afirmava sem mostrar, e a fileira de papéis logo acima já
         * prova a mesma coisa item a item, de discovery a instrumentação. "Mobile
         * first" é fato de forma do produto, como "SaaS B2B" ao lado.
         *
         * **A fileira tem duas bandas, e a ordem é a divisão.** Primeiro os quatro
         * rótulos de escopo em tinta, depois os três números apurados em royal. A
         * primeira tentativa foi manter tudo numa linha só; ela custava rótulo
         * ("de conversão" ia embora) e ainda ficava a poucos pixels de quebrar.
         * Acrescentar cápsulas em vez de encurtar transforma a segunda linha em
         * decisão: quem varre a fileira lê o que o produto é e depois o que ele
         * entregou, e a cor já separava os dois grupos sem ajuda da posição.
         *
         * **"IA em produção" e não "AI-driven".** O fato é o mesmo e é sustentado —
         * dois dos três módulos rodam IA generativa, um em OCR e outro em
         * recomendação. "Em produção" diz onde a IA está, que é a parte difícil e a
         * parte verificável; "-driven" é postura e não sobreviveria à primeira
         * pergunta de quem entrevista. A versão em inglês diz "AI in production"
         * pela mesma razão.
         *
         * **"+20 melhorias" ficou de fora.** O autor sugeriu, e o número não tem
         * fonte em nenhum documento que eu tenha. Fora isso, melhoria sem janela de
         * tempo é a métrica mais fraca da fileira: convida a pergunta "vinte em
         * quanto tempo, de quantas?" ao lado de três números que resistem sozinhos.
         * Com a janela ("+20 melhorias em 12 meses") ela entra.
         */
        highlights: [
          { value: 'SaaS B2B' },
          { value: 'Mobile first' },
          { value: 'Data driven' },
          { value: 'IA em produção' },
          { value: '400+', label: 'usuários', measured: true },
          { value: 'NPS +85', measured: true },
          { value: '80%+', label: 'de conversão', measured: true },
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
          /*
           * A estação que faltava, e faltava a fase inteira.
           *
           * A cronologia ia da ideação e dos dois rascunhos direto para produção,
           * pulando o lançamento. O produto subiu em maio de 2025 com **cinco
           * módulos** e foi apresentado ao mercado no fórum do setor em junho.
           *
           * **Os nomes são os do deck de lançamento**, não uma releitura de hoje:
           * é o que estava escrito quando a decisão foi tomada, e é o que sustenta a
           * subtração que a faixa mostra sem dizer — cinco aqui, três telas depois.
           * "Central de novidades" saiu do produto em abril de 2026, com número de
           * task; "Página do cliente" foi absorvida.
           */
          {
            iso: '2025-05',
            when: 'Mai 2025',
            title: 'Lançamento',
            note: 'Cinco módulos no ar, e a apresentação para o mercado no fórum do setor, em junho.',
            modules: [
              'Metas',
              'Oportunidade de venda',
              'Catálogo de produtos',
              'Página do cliente',
              'Central de novidades',
            ],
          },
          {
            iso: '2025-09',
            when: 'Set 2025',
            untilIso: '2026-04',
            until: 'Abr 2026',
            title: 'Em produção',
            /*
             * A janela fecha em abril de 2026 porque é lá que a produção deixa de
             * ser piloto. Antes disso eram usuários focais em acesso antecipado; em
             * abril a primeira operação vira a chave para as seis regionais dela.
             *
             * **Não virou estação própria de propósito.** A faixa reserva 248px de
             * arte por estação acima de `lg`, e a virada não tem imagem nem lista
             * que a sustente sem inventar artefato. Esticar a janela existente diz a
             * mesma coisa e mantém os três mockups, que são a arte mais forte do
             * painel.
             */
            note: 'Três módulos no ar em 5 operações. Em abril a primeira delas passa dos 15 usuários do acesso antecipado para mais de 200, nas seis regionais.',
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
            /* A procedência é o Formbricks, informada pelo autor, e traz junto a
               janela de medição. Ela **fica**: o site declara origem em todo número
               que publica, e NPS sem fonte nem data pesa menos justamente para quem
               sabe ler NPS. Eu já errei esta linha uma vez, atribuindo ao Mixpanel —
               o Mixpanel mede uso da plataforma. */
            score: {
              value: '+85',
              label: 'NPS do produto',
              source: 'Medido no Q3/2026 via Formbricks',
              min: '-100',
              max: '100',
            },
          },
        ],
        /*
         * ONDE ENTRAM OS NÚMEROS QUE FALTAM. O autor vai preencher; a estrutura já
         * espera por eles e nada aqui precisa ser reescrito quando chegarem.
         *
         * - **`source` vazio em três resultados**: "400+ cotações/mês", "300+
         *   catálogos/90 dias" e "~200 pedidos/dia" não apareceram em documento
         *   nenhum — nem na varredura do repositório, nem no export do ClickUp.
         *   Fonte provável é Power BI, que não é acessível daqui. Enquanto `source`
         *   faltar, o rodapé da seção responde por eles.
         * - **Cotação Ágil e Objetivos podem receber mais resultados.** É só somar
         *   itens em `results`; a lista não tem teto de layout.
         * - **Catálogo Digital ganhou `journey` em 31/07/2026.** Ela não é achado de
         *   origem, como nos outros dois: é o problema que o módulo encontrou depois
         *   de existir, o PDF que envelhece contra o link que se atualiza. A fonte
         *   está na nota junto ao módulo. Se algum dia aparecer a pesquisa que
         *   explica por que ele nasceu, ela entra antes destes dois parágrafos.
         */
        /*
         * ORDEM CANÔNICA, definida pelo autor: Objetivos e Sugestões, Cotação Ágil,
         * Catálogo Digital. Antes a lista abria pela Cotação Ágil, que é o módulo com
         * mais prova. A ordem do produto vence a ordem do orgulho: Objetivos nasceu
         * primeiro e é dele que sai o achado que explica os outros dois.
         *
         * **As decisões são leitura minha sobre evidência documentada**, e o autor
         * precisa confirmar o enquadramento. O fato de cada uma existe em fonte: o
         * último metro está no slide "Período de testes" do deck de mai/2025; o
         * checkout na plataforma de vendas é doc de produto no ClickUp; os cinco
         * tipos de objetivo estão na documentação de jul/2026; foto, áudio, status de
         * processamento e disponibilidade real são release notes (v0.2.6, v0.4.4,
         * v0.5.1); catálogo web, PDF e detalhes são PRO-247, 248 e 249. O que eu
         * escrevi por cima é **por que** cada uma foi uma escolha e não uma obviedade
         * — e é isso que ele confirma ou corrige.
         */
        pieces: [
          {
            name: 'Objetivos e Sugestões',
            detail:
              'Histórico do ponto de venda vira sugestão de mix e meta. É o módulo de IA do produto.',
            /*
             * Este parágrafo era a abertura do `tradeoff`. Ele mudou de lugar porque
             * é achado de pesquisa **deste módulo**, e não decisão de produto: o que
             * é decisão de produto ficou na seção de tradeoff, que agora abre por
             * conta própria em vez de depender desta frase como antecedente.
             */
            journey: [
              'A pesquisa do período de testes me deu a resposta mais desconfortável que ela podia dar: as sugestões estavam certas, e o vendedor não usava. Com o carrinho pronto para exportar, ele preferia refazer o pedido à mão na plataforma de vendas. O que faltava não era inteligência, era o último metro do caminho.',
            ],
            decisions: [
              {
                title: 'Parei de melhorar a sugestão',
                body: 'O caminho óbvio depois daquela pesquisa era mexer no algoritmo, porque é o que um módulo de IA convida a fazer. Só que a evidência dizia o contrário: a sugestão já estava aderente e mesmo assim morria no carrinho. Investir em acerto de recomendação teria melhorado o número que já estava bom e deixado intacto o que impedia o pedido de sair.',
              },
              {
                title: 'Trouxe o contexto de crédito para dentro da sugestão',
                body: 'Sugerir mix sem dizer se o cliente pode comprar transfere para o vendedor uma conferência que ele faria em outro sistema, e é nessa troca de tela que o pedido se perde. Limite de crédito, inadimplência e positivação passaram a chegar junto com a sugestão, no mesmo cartão.',
              },
              {
                title: 'Abri a meta por fabricante em vez de somar tudo',
                body: 'Uma barra de venda total diz que se está atrás, e não onde. Quebrar por indústria custa densidade na tela e obriga a manter meta por fabricante, mas é a única forma de a informação virar próxima visita. Foi por esse caminho que os tipos de objetivo chegaram a cinco — e que a estrutura de metas passou a ser montada por cliente, com categoria nova entrando como módulo em vez de exigir uma versão do produto.',
              },
            ],
            screens: [
              {
                src: '/assets/cases/ic/jornadas/obj-0.jpg',
                alt: 'Tela inicial da plataforma, com o cartão Objetivos e Sugestões listando os cinco objetivos e o progresso de cada um.',
                caption: 'A home abre pelas metas do vendedor',
              },
              {
                src: '/assets/cases/ic/jornadas/obj-1.jpg',
                alt: 'Tela de Venda Total, com a barra de progresso do vendedor contra a meta do período.',
                caption: 'O objetivo do período, medido contra a meta',
              },
              {
                src: '/assets/cases/ic/jornadas/obj-2.jpg',
                alt: 'Tela de Venda Indústria, com uma barra de progresso por fabricante mostrando o valor vendido contra a meta de cada um.',
                caption: 'A mesma meta aberta por fabricante',
              },
              {
                src: '/assets/cases/ic/jornadas/obj-3.jpg',
                alt: 'Tela de Sugestão de Pedido, com o cliente no topo, o limite de crédito em 65%, a marca de não positivado e a lista de produtos sugeridos.',
                caption: 'A sugestão do cliente, com crédito e positivação junto',
              },
              {
                src: '/assets/cases/ic/jornadas/obj-4.jpg',
                alt: 'Tela de adicionar produtos à sugestão, com busca e a lista de itens disponíveis.',
                caption: 'O vendedor completa o que a sugestão não trouxe',
              },
              {
                src: '/assets/cases/ic/jornadas/obj-5.jpg',
                alt: 'Tela de pedido finalizado, confirmando que a sugestão virou pedido sem sair da plataforma.',
                caption: 'O pedido sai daqui, sem redigitar em outro sistema',
              },
            ],
            results: [
              { value: '~200', unit: 'pedidos por dia saem das sugestões' },
              {
                value: '5',
                unit: 'tipos de objetivo, de venda total a produtos por PDV',
                source: 'Documentação de produto, jul/2026',
              },
            ],
          },
          {
            name: 'Cotação Ágil',
            detail:
              'A lista do cliente entra por foto e vira cotação por OCR, sem digitação e sem comparar condição a condição na mão.',
            /*
             * A jornada saiu do bloco `origin`, que era uma seção solta desta
             * página. Ver a nota que ficou lá para o que foi confirmado pelo autor
             * (ele não estava no evento) e para o que ficou de fora de propósito.
             */
            journey: [
              'Em agosto de 2025 o produto foi para um encontro do setor. Eu desenhei a ferramenta, testei antes e acompanhei o uso em tempo real à distância, com quem estava no estande me contando o que acontecia a cada atendimento. A cena que voltava era sempre a mesma. O gerente regional atendia com uma planilha de dez páginas de SKU na mão, o cliente apontava o que queria, e o pedido era transcrito item a item na plataforma de vendas. A conexão do estande caía, e quando caía a cotação ficava guardada para o back-office lançar depois.',
              'As oportunidades que saíram desse mapa viraram o módulo, uma a uma: ler a planilha por OCR em vez de digitar, escolher a tabela de preço sem perguntar, e emendar no pedido sem redigitar nada.',
            ],
            decisions: [
              {
                title: 'Aceitei o papel do jeito que ele chega',
                body: 'A alternativa barata era pedir um arquivo limpo, em formato definido. Isso teria empurrado o trabalho de volta para o cliente, que é exatamente quem não ia fazer. Aceitar foto torta, lista manuscrita e planilha de dez páginas colocou o custo do desalinho no produto, onde ele podia ser resolvido uma vez em vez de a cada cotação.',
              },
              {
                title: 'Mostrei a espera em vez de esconder',
                body: 'Extrair, casar produto e buscar preço leva tempo, e a saída usual é a tela travada com um giro no meio. Optamos por dar estado ao processamento e devolver o vendedor para a lista enquanto isso roda. Custa uma tela a mais e um estado a mais para manter; evita o vendedor achar que quebrou e começar de novo na frente do cliente.',
              },
              {
                title: 'Nada vira pedido sem passar pelo olho do vendedor',
                body: 'Com extração por IA a tentação é fechar o ciclo sozinho e mostrar o resultado pronto. A cotação passou a exibir o que foi lido item a item, com o que está sem estoque marcado e o preço à vista, para o vendedor auditar antes de exportar. É mais um passo no fluxo, e é o passo que faz ele confiar no que a máquina leu.',
              },
            ],
            screens: [
              {
                src: '/assets/cases/ic/jornadas/cot-1.jpg',
                alt: 'Tela de importação de arquivos, com a área de envio e a lista de formatos aceitos.',
                caption: 'Entrada por arquivo: foto, planilha ou PDF',
              },
              {
                src: '/assets/cases/ic/jornadas/cot-2.jpg',
                alt: 'Tela de gravação de áudio em andamento, com a forma de onda e o tempo corrido.',
                caption: 'Entrada por áudio, para quem dita a lista',
              },
              {
                src: '/assets/cases/ic/jornadas/cot-3.jpg',
                alt: 'Tela de preenchimento manual de produtos, já com itens digitados.',
                caption: 'Entrada manual, quando não há o que enviar',
              },
              {
                src: '/assets/cases/ic/jornadas/cot-4.jpg',
                alt: 'Tela de ajustes antes do processamento, com as opções de tratamento da cotação.',
                caption: 'Os ajustes antes de mandar processar',
              },
              {
                src: '/assets/cases/ic/jornadas/cot-5.jpg',
                alt: 'Tela de processamento da cotação, com as etapas de identificação do cliente e verificação de preços.',
                caption: 'O processamento com estado, em vez de tela travada',
              },
              {
                src: '/assets/cases/ic/jornadas/cot-6.jpg',
                alt: 'Tela de detalhes da cotação, com o resumo do cliente, o total de unidades e a lista de produtos cotados, um deles marcado como sem estoque.',
                caption: 'A conferência item a item, antes de virar pedido',
              },
            ],
            results: [
              { value: '400+', unit: 'cotações respondidas por mês' },
              { value: '80%+', unit: 'de conversão em pedido' },
              { value: '1h+', unit: 'poupada por cotação, de 50 a 100 itens' },
              {
                value: '47',
                unit: 'itens lidos de uma foto manuscrita, contra 4 antes',
                source: 'Release v0.2.6',
              },
            ],
          },
          {
            name: 'Catálogo Digital',
            detail:
              'Preço e estoque em tempo real no lugar do catálogo impresso, com visibilidade sobre o que o cliente olhou.',
            /*
             * **A jornada do Catálogo deixou de faltar, e a fonte é o manual do
             * produto** (`prd-docs/nf-ic/clickup-export/docs/manuais-de-uso/`,
             * variantes "com preço" e "sem preço", export de 31/07/2026). Ele é
             * quem registra, com todas as letras, cada fato dos dois parágrafos:
             *
             * - o link web aparece rotulado "recomendado" e o PDF como "arquivo
             *   estático, útil para impressão ou registro, mas não reflete
             *   atualizações após o download";
             * - no encerramento, "o link web fica indisponível imediatamente para
             *   todos os clientes; PDFs já compartilhados continuam acessíveis, mas
             *   não refletem atualizações de preço e disponibilidade";
             * - na edição, "as alterações refletem imediatamente no link web; o PDF
             *   gerado anteriormente não é atualizado automaticamente";
             * - os três sinais de retorno (interesses, acessos, tempo ativo) e a
             *   nota de que a contagem de acessos é real, "não uma estimativa";
             * - "envie o link antes da visita: quando o cliente já explorou o
             *   catálogo, a conversa começa pelos produtos de interesse".
             *
             * **O que não foi escrito, porque não tem fonte:** um achado de campo
             * de origem, do tipo que Objetivos e Cotação Ágil têm. Não existe
             * documento contando por que o módulo nasceu, e a jornada aqui é o
             * problema que ele encontrou depois de existir. Isso é honesto e é
             * diferente dos outros dois; se houver a pesquisa de origem, ela entra
             * antes destes dois parágrafos.
             *
             * **Pendente de confirmação do autor:** o enquadramento é leitura minha
             * sobre o manual, como nas decisões. Os fatos têm fonte; chamar a
             * assimetria de retorno de "a diferença que mais pesou" é meu.
             */
            journey: [
              'O catálogo saiu com duas formas de chegar ao cliente, link web e PDF, e elas não envelhecem igual. O PDF sai do produto e não volta: no dia seguinte o preço mudou, o item acabou, e o arquivo segue circulando dizendo o contrário. O encerramento é onde isso fica mais claro. Quando o vendedor encerra um catálogo, o link fica indisponível na hora, e o PDF que ele já enviou continua aberto, com preço velho, fora do alcance de qualquer correção.',
              'A diferença que mais pesou, porém, não é a de conteúdo, é a de retorno. O link conta quem abriu, por quanto tempo o catálogo ficou de pé e qual produto o cliente marcou; o PDF não devolve nada. E o retorno muda a visita: quando o link vai antes, o vendedor chega sabendo o que o cliente já olhou, e ++a conversa começa pelos produtos marcados em vez de começar do portfólio inteiro++.',
            ],
            decisions: [
              {
                title: 'O catálogo deixou de ser um documento',
                body: 'Manter o PDF e só automatizar a geração era o caminho curto, e ele preserva o problema: no dia seguinte o preço está velho e ninguém sabe. O catálogo passou a ser endereço com preço e estoque lidos na hora do acesso, com validade declarada. O PDF continua existindo para quem precisa dele, agora como saída e não como o produto.',
              },
              {
                title: 'Montar virou escolher, não diagramar',
                body: 'A montagem podia ter virado um editor, com ordem, capa e seções. Preferimos restringir a seleção de produtos ao que o vendedor de fato atende e deixar o resto por conta do sistema. Perde-se liberdade de composição; ganha-se catálogo montado entre uma visita e outra em vez de à noite.',
              },
              {
                title: 'Devolvi ao vendedor o que o cliente olhou',
                body: 'Catálogo compartilhado costuma terminar no envio, e o que acontece depois é silêncio. Passar a registrar acesso, tempo ativo e produto marcado como interesse transformou o material em sinal de próxima conversa. É também a parte que exigiu decidir o que não mostrar: o dado volta como interesse do cliente, nunca como vigilância de navegação.',
              },
            ],
            screens: [
              {
                src: '/assets/cases/ic/jornadas/cat-1.jpg',
                alt: 'Lista de catálogos do vendedor, cada um com nome, período e situação de publicação.',
                caption: 'Os catálogos do vendedor, com prazo e situação',
              },
              {
                src: '/assets/cases/ic/jornadas/cat-2.jpg',
                alt: 'Tela de criação de catálogo, com a seleção de produtos e a configuração de período e disponibilidade.',
                caption: 'A montagem: escolher produtos e prazo',
              },
              {
                src: '/assets/cases/ic/jornadas/cat-3.jpg',
                alt: 'Tela de detalhes de um catálogo publicado, com as estatísticas de interesses, acessos e tempo ativo.',
                caption: 'O que voltou: acessos, interesses e tempo ativo',
              },
              {
                src: '/assets/cases/ic/jornadas/cat-4.jpg',
                alt: 'Catálogo aberto no navegador do cliente, em telefone, com os produtos, preço e a ação de marcar interesse.',
                caption: 'O que o cliente abre, no navegador dele',
              },
              {
                src: '/assets/cases/ic/jornadas/cat-5.jpg',
                alt: 'Catálogo já autenticado no navegador do cliente, com os produtos por indústria, preço a partir de e o coração para marcar interesse.',
                caption: 'Autenticado, ele vê preço e marca o que interessa',
              },
            ],
            results: [{ value: '300+', unit: 'catálogos compartilhados em 90 dias' }],
          },
        ],
        /*
         * Fonte: o mapa de jornada as-is do encontro do setor (out/2025), que
         * registra planilha de dez páginas de SKU, transcrição manual do pedido na
         * plataforma de vendas, conexão instável no estande e o back-office como
         * plano B. As três frases do segundo parágrafo são, uma a uma, as
         * "oportunidades" listadas naquele mesmo mapa.
         *
         * **Ele não estava no evento, e o texto não finge que estava.** Confirmado
         * por ele: concebeu a ferramenta, testou antes e acompanhou o desempenho em
         * tempo real à distância, com quem atendia no estande reportando o uso. A
         * versão anterior dizia "eu fui atrás de como o atendimento acontecia", que
         * é observação em primeira mão e não foi o que aconteceu. Observação
         * mediada, dita como método, vale mais que presença inventada — e ninguém
         * pergunta "onde você estava" para quem descreve o próprio arranjo.
         *
         * **O que ficou de fora de propósito:** que aquele foi o mês de maior volume
         * de commits do repositório. É verdade e não é prova de nada que um PM queira
         * apresentar — convida "commit mede o quê?" ao lado de números que se
         * defendem sozinhos.
         */
        /*
         * As cinco telas saem do Figma (MVP 0.1, 0.3, 0.5 e go-live) e da
         * documentação de produto (a atual). Cortadas em 780x1688, que é o
         * viewport de 390x844 em 2x — a mesma proporção das capturas que já estavam
         * no painel.
         *
         * **O dado nas telas é simulado**, confirmado pelo autor: os nomes de rede
         * de farmácia, os CNPJs e os valores por indústria são preenchimento de
         * protótipo. Foi o que liberou publicar sem borrão. Se algum dia entrar
         * captura de ambiente real aqui, a regra da lista de proibições volta a
         * valer inteira.
         */
        uiEvolution: {
          title: 'Eu refiz a tela inicial quatro vezes',
          lead: 'A tela inicial é onde um produto declara o que ele acha que importa. Em cada versão ela declarou uma coisa diferente.',
          steps: [
            {
              version: 'MVP 0.1',
              src: '/assets/cases/ic/evolucao/v01.jpg',
              alt: 'Primeira versão da tela inicial, com marca verde, saudação ao vendedor e uma lista de clientes identificados por CNPJ, cada um com a contagem de SKUs para reposição.',
              change:
                'A home é a lista de clientes, e o produto é o pedido ideal de cada um.',
            },
            {
              version: 'MVP 0.3',
              src: '/assets/cases/ic/evolucao/v03.jpg',
              alt: 'Segunda versão, ainda verde, com as abas Pedidos Ideais, Catálogo de Produtos e Clientes acima da mesma lista.',
              change:
                'Entram catálogo e novidades, mas a lista continua sendo a estrutura.',
            },
            {
              version: 'MVP 0.5',
              src: '/assets/cases/ic/evolucao/v05.jpg',
              alt: 'Terceira versão, com a marca roxa e laranja, mostrando cartões de Total de Vendas, Venda por Indústria, Mix de Produtos e Positivação de PDV, e uma barra de abas embaixo.',
              change:
                'A marca muda e a home deixa de ser lista: passa a ser painel de objetivos.',
            },
            {
              version: 'Go-live',
              src: '/assets/cases/ic/evolucao/golive.jpg',
              alt: 'Versão do go-live, com o cartão Objetivos e Sugestões trazendo a quebra por indústria, e abaixo os cartões de Cotação Ágil e Catálogo Digital.',
              change:
                'Cada módulo ganha cartão próprio, e a cotação passa a começar por conversa.',
            },
            {
              version: 'Hoje',
              src: '/assets/cases/ic/evolucao/atual.jpg',
              alt: 'Tela atual, com cinco objetivos medidos em barra de progresso: venda total, venda indústria aberta por fabricante, positivação de produtos, positivação de clientes e produtos por PDV.',
              change:
                'Os objetivos viram cinco, e cada um passa a mostrar o quanto já andou.',
            },
          ],
        },
        /*
         * O método que decidiu o escopo, informado pelo autor em jul/2026.
         *
         * **As três fontes vão nomeadas uma a uma, e não como "discovery contínuo".**
         * O nome do método é o que qualquer PM escreve; dizer o que cada frente pega
         * que as outras não pegam é o que mostra que ele foi de fato operado.
         *
         * O número de melhorias é o de `PRODUCT.md` ("20+ melhorias lançadas em 3
         * meses"), e entra sem `source` pelo mesmo motivo dos outros três: a
         * procedência é Power BI, que não é acessível daqui.
         *
         * **Não afirma proporção.** A versão que eu escrevi primeiro dizia que "a
         * maior parte" das melhorias nasceu de pedido de usuário, e isso é uma
         * quantificação que ninguém mediu. O que ele confirmou é a origem do
         * processo, não a fatia — e o princípio 2 do PRODUCT.md ("evidência real ou
         * silêncio") derruba a fatia.
         */
        discovery: {
          title: 'Eu nunca decidi sozinho o que entrava',
          body: [
            'Depois que o produto subiu, a fila de melhorias parou de sair de reunião de roadmap. Passei a manter grupo aberto com os vendedores que usam a plataforma todo dia, a entrevistar quem tinha acabado de usar, e a olhar o dado de uso ao lado dos dois.',
            'Cada frente pega o que as outras não pegam. O grupo traz o incômodo que ninguém abre chamado para relatar. A entrevista mostra onde a pessoa hesita, que é diferente de onde ela reclama. O dado diz quantos passam pelo mesmo ponto, e é ele que separa o caso isolado do problema que vale corrigir. ++Foi assim que a fila do que entrar deixou de ser minha opinião.++',
          ],
          results: [{ value: '20+', unit: 'melhorias lançadas em 3 meses' }],
        },
        /*
         * Fontes, nesta ordem: o deck de lançamento de maio/2025, slide "Período de
         * testes", que registra literalmente que o vendedor preferia refazer o pedido
         * à mão **mesmo com o carrinho pronto** e que as sugestões estavam aderentes;
         * o roadmap do mesmo deck, que anunciava roteirização e assistente de cobrança
         * para o mesmo ano; o código de cobrança no repositório desde set/2025; e o
         * roadmap de hoje, que devolve os dois para o fim de 2026.
         *
         * **A causa é dele e não é a que eu tinha escrito.** A primeira versão dizia
         * que corrigir o último metro da sugestão consumiu os outros dois módulos.
         * Ele corrigiu: os dois foram adiados para polir e evoluir os três que já
         * rodavam em produção. O tradeoff verdadeiro é profundidade contra largura,
         * e não um módulo devorando os vizinhos — o que é uma decisão mais defensável
         * e, por isso mesmo, precisa ser contada como decisão e não como acidente.
         *
         * Os nomes são os que o produto usa hoje ("Roteiro Ideal", "Assistente de
         * Cobrança"), não os do deck de 2025 ("roteirização"). Aqui não vale a regra
         * da estação de lançamento, que preserva o vocabulário da época: aquela faixa
         * data o que foi anunciado, este bloco fala do que está no produto agora.
         *
         * **Este parágrafo errou duas vezes em direções opostas, e o meio é o certo.**
         * A primeira versão dizia "parado no repositório desde então", inferido das
         * datas de commit do `bill`. Eu corrigi para "prontos e desligados" ao ver
         * tela, rota, menu e `enabledModules` no código, e ao ver os dois ligados na
         * captura do manual. Ele corrigiu de volta: as telas do manual são ambiente
         * simulado, e os módulos foram estruturados sem nunca serem finalizados nem
         * publicados. Estruturado não é pronto, e código no repositório não prova
         * produção — foi essa a distância que eu não vi.
         *
         * O primeiro parágrafo abre pelo desconforto e não pelo mérito. Tradeoff que
         * começa se defendendo não é tradeoff, é conquista disfarçada.
         */
        convergence: {
          title: 'As três saídas dão no mesmo lugar',
          body: [
            'O último metro que a pesquisa apontou nunca foi problema de um módulo só. Sugestão, cotação e catálogo terminavam cada um no seu canto, e os três cobravam do vendedor a mesma redigitação na plataforma de vendas para virar pedido.',
            'Resolver isso uma vez, no lugar certo, valia mais que resolver três vezes na interface. Hoje qualquer um dos três desemboca no mesmo checkout com o carrinho montado — e é essa integração que faz o produto ser ferramenta de venda em vez de três relatórios bem desenhados.',
          ],
          items: [
            {
              name: 'Sugestão de pedido',
              detail: 'o carrinho sugerido para o cliente vai inteiro para o checkout.',
            },
            {
              name: 'Cotação Ágil',
              detail: 'a cotação já conferida vira carrinho sem redigitar item nenhum.',
            },
            {
              name: 'Catálogo Digital',
              detail:
                'os produtos que um CNPJ marcou como interesse viram carrinho daquele cliente.',
            },
          ],
        },
        proof: {
          title: 'O que sobrou de medido',
          lead: 'Três origens diferentes, e é por concordarem que elas valem: satisfação vem de pesquisa com quem usa, adoção vem da operação, e o uso vem do produto instrumentado.',
          results: [
            {
              value: '+85',
              unit: 'de NPS do produto, numa escala de -100 a 100',
              source: 'Formbricks, Q3/2026',
            },
            {
              value: '400+',
              unit: 'vendedores usando em operação',
              source: 'Power BI, jul/2026',
            },
            {
              value: '5',
              unit: 'operações migradas em 6 meses',
              source: 'Power BI, jul/2026',
            },
            {
              value: '15 → 200+',
              unit: 'usuários na primeira operação, do acesso antecipado às seis regionais',
              source: 'Power BI, abr/2026',
            },
          ],
        },
        tradeoff: [
          'Os três módulos foram os que eu escolhi aprofundar, e aprofundar significou não abrir duas frentes novas.',
          'A escolha custou o que eu mesmo tinha anunciado no lançamento. Roteiro Ideal e Assistente de Cobrança estavam prometidos para o mesmo ano. Os dois chegaram a ser estruturados, com tela desenhada e código escrito, e nenhum dos dois foi finalizado nem chegou a produção. Dezoito meses depois é que voltaram para o plano.',
        ],
      },
      {
        id: 'electrolux-cuida',
        tier: 'major',
        step: '02',
        name: 'Electrolux Cuida',
        org: 'Electrolux',
        tag: 'UX Research',
        body: 'Pesquisa de usuário como parte da estruturação do research de produtos digitais da Electrolux, área que até então olhava só para produto industrial.',
        wip: true,
      },
      {
        id: 'unicesumar-mundo-azul',
        tier: 'major',
        step: '03',
        name: 'Mundo Azul',
        /* Duas marcas, porque foram duas: a Unicesumar como cliente e a Brivia
           como parceira do projeto. Confirmado pelo autor em 31/07/2026. */
        org: 'Unicesumar e Brivia',
        tag: 'UX Research e Product Design',
        body: 'Pesquisa de usuário conduzida como designer principal da conta.',
        wip: true,
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
  casePage: {
    /* "Voltar para os cases" e não "Voltar": o rótulo precisa dizer onde a pessoa
       cai, porque ela pode ter chegado aqui por link direto e nunca ter visto a
       home. O alvo é `/#cases`, a seção, e não o topo. */
    back: 'Voltar para os cases',
    timelineTitle: 'Como o produto evoluiu',
    piecesTitle: 'Eu levei três módulos até produção',
    numbersSource:
      'Os números sem fonte própria são de julho de 2026, apurados em Power BI e Mixpanel.',
    journeyPrev: 'Tela anterior',
    journeyNext: 'Próxima tela',
    tradeoffTitle: 'O que essa decisão custou',
    closingTitle: 'Quer entrar no detalhe?',
    closingBody:
      'Posso contar como cada uma dessas decisões foi tomada, o que eu mediria de novo e o que eu faria diferente.',
    closingCta: 'Falar comigo',
    notFoundTitle: 'Essa página não existe.',
    notFoundBody: 'O endereço pode ter mudado de lugar. Os cases estão todos na home.',
    notFoundCta: 'Voltar para o começo',
  },
  /*
   * A ordem é a que o autor ditou, e não é alfabética nem cronológica. Mantida
   * como veio: mexer nela sem motivo é decidir por ele uma hierarquia que ele já
   * decidiu.
   *
   * **Os endereços que ele passou ficam aqui como referência de onde achar a
   * marca**, e não viram link na página: link de saída numa faixa de credenciais
   * tira do site quem está justamente avaliando o site.
   * Electrolux `loja.electrolux.com.br` · Banco do Brasil `bb.com.br` · Bradesco
   * `banco.bradesco` · Nexfar `nexfar.com.br` · Unicesumar `unicesumar.edu.br` ·
   * myTapp `mytapp.com.br` · Brivia `brivia.com.br` · Garupa `garupa.com.vc`.
   *
   * **A Brivia não aparece em `curriculo/`, e o autor explicou por quê** (31/07/2026):
   * ela foi a parceira do projeto da Unicesumar, que ele tocou como contratado. O
   * currículo credita esse trabalho ao período da Garupa Design
   * (`curriculo-base.md:83`), que é o vínculo empregatício, e a parceira não
   * aparece em lugar nenhum.
   *
   * **Pendência do princípio 5:** ou a linha do currículo passa a mencionar a
   * Brivia, ou fica a divergência de um nome que só existe no site. É decisão do
   * autor, e o currículo não foi tocado.
   *
   * Foi essa conversa que corrigiu a ressalva abaixo do título: ela dizia
   * "parcerias de projeto", que não descreve trabalho como contratado.
   */
  brands: {
    title: 'Marcas com as quais eu já trabalhei',
    lead: 'Funcionário em umas, agência ou contratado em outras. Oito contextos de negócio, e em nenhum deles o problema já chegava formulado.',
    items: [
      { name: 'Electrolux', logo: '/assets/marcas/electrolux.svg' },
      // Duas cores que carregam a marca inteira: o achatamento em preto devolvia
      // um quadrado sólido. Esta é a única que anda em escala de cinza.
      { name: 'Banco do Brasil', logo: '/assets/marcas/bb.svg', tone: 'gray' },
      { name: 'Bradesco', logo: '/assets/marcas/bradesco.png' },
      { name: 'Nexfar', logo: '/assets/marcas/nexfar.png' },
      { name: 'Unicesumar', logo: '/assets/marcas/unicesumar.svg' },
      { name: 'myTapp', logo: '/assets/marcas/mytapp.svg' },
      { name: 'Brivia', logo: '/assets/marcas/brivia.svg' },
      { name: 'Garupa Design', logo: '/assets/marcas/garupa.svg' },
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
     * **A pendência da relação de trabalho foi resolvida pelo autor em 31/07/2026.**
     * O relatório da avaliação não identifica quem escreveu o quê; ele identifica.
     * Os genéricos "Colega de trabalho" e "Ex-líder" viraram par direto, par
     * indireto, ex-líder e ex-liderado, cada um com a empresa ao lado.
     *
     * **Nome de colega continua proibido, e não é isso que mudou.** O que entrou é a
     * relação e o lugar, que é o que dá peso ao relato: "par direto" e "ex-liderado"
     * dizem de que ângulo a pessoa viu o trabalho, e "colega de trabalho" não dizia.
     * Quem escreveu segue anônimo.
     */
    testimonials: [
      {
        quote:
          'Quando a solução parte dele, ela costuma ganhar tração entre os colegas. Não é influência pela imposição, é pela confiança que o time tem na leitura dele.',
        source: 'Par direto, Nexfar',
      },
      {
        quote: 'Te vejo como um profissional que, acima de tudo, é Sênior em aprender.',
        source: 'Ex-líder, Garupa Design',
      },
      {
        quote: 'Sempre senti que podia chegar em ti e abrir sobre a realidade.',
        source: 'Ex-liderado, Garupa Design',
        featured: true,
      },
      {
        quote:
          'Atua de forma proativa ao trazer e testar ferramentas, especialmente com o uso de IA e automação, contribuindo para ganhos de eficiência do time.',
        source: 'Par indireto, Nexfar',
      },
      {
        quote:
          'O Casanova não espera ser chamado pra ajudar. Quando não sabe a resposta, vai atrás ou indica quem sabe.',
        source: 'Par indireto, Nexfar',
      },
      {
        quote: 'Adotamos os padrões que você definiu como processo de pesquisa.',
        source: 'Design Manager, Electrolux',
      },
    ],
  },
  close: {
    title: 'Vamos conversar.',
    lead: 'Se você está montando um time de produto, ou quer entender melhor alguma decisão que eu tomei, me escreve. Também deixei o currículo completo em PDF. Respondo em português ou inglês.',
    signoff: '',
    ctaResume: 'Currículo (PDF)',
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
    ctaResume: 'Résumé (PDF)',
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
    lead: 'In each one I walk through the start, the decision that changed course and what came after, including what did not go the way I hoped.',
    rolesLabel: 'What I did',
    timelineLabel: 'How the product evolved',
    highlightsLabel: 'Scope and outcome',
    openFull: 'Read the full case',
    piecesLabel: 'Modules',
    wipLabel: 'WIP',
    coverConstruction: 'In progress',
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
        body: 'The distributor arrived with the diagnosis already made: fragmented execution across the sales team. A year of field experimentation, with focus groups from different regions and customer bases, pointed somewhere else. Reps were not short on recommendations. They were short on seeing their own numbers at hand, and lost the day answering quotes and walking clients through the catalog. The three modules live today are what survived that year.',
        roles: [
          'Continuous discovery',
          'Vision and strategy',
          'Roadmap',
          'Specs and handoff',
          'Instrumentation',
          'Interface design',
        ],
        highlights: [
          { value: 'B2B SaaS' },
          { value: 'Mobile first' },
          { value: 'Data driven' },
          { value: 'AI in production' },
          { value: '400+', label: 'users', measured: true },
          { value: 'NPS +85', measured: true },
          { value: '80%+', label: 'conversion', measured: true },
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
          /* Ver a nota na versão em português para por que esta estação entrou. */
          {
            iso: '2025-05',
            when: 'May 2025',
            title: 'Launch',
            note: 'Five modules live, and the market presentation at the industry forum in June.',
            modules: [
              'Goals',
              'Sales opportunity',
              'Product catalog',
              'Client page',
              'News center',
            ],
          },
          {
            iso: '2025-09',
            when: 'Sep 2025',
            untilIso: '2026-04',
            until: 'Apr 2026',
            title: 'Live',
            note: 'Three modules shipped across 5 customer operations. In April the first of them goes from the 15 early-access users to more than 200, across all six regions.',
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
              value: '+85',
              label: 'Product NPS',
              source: 'Measured in Q3/2026 via Formbricks',
              min: '-100',
              max: '100',
            },
          },
        ],
        /* Ver a nota na versão em português para o que ainda falta preencher aqui:
        /* Ver a nota na versão em português: ordem canônica, e por que as decisões
           são leitura minha sobre evidência documentada. */
        pieces: [
          {
            name: 'Objetivos e Sugestões',
            detail:
              'The point of sale’s history becomes product mix suggestions and sales targets. This is the product’s AI module.',
            journey: [
              'The research from the test period gave me the most uncomfortable answer it could have: the suggestions were right, and reps were not using them. With the cart ready to export, they would rather rebuild the order by hand in the sales platform. What was missing was not intelligence. It was the last stretch of the path.',
            ],
            decisions: [
              {
                title: 'I stopped improving the suggestion',
                body: 'The obvious move after that research was to work on the algorithm, because that is what an AI module invites you to do. The evidence said otherwise: the suggestion was already on target and still died in the cart. Investing in recommendation accuracy would have improved the number that was already good and left untouched the thing stopping the order.',
              },
              {
                title: 'I pulled credit context into the suggestion',
                body: 'Suggesting a mix without saying whether the client can buy hands the rep a check they would run in another system, and that screen switch is where the order gets lost. Credit limit, overdue balance and coverage now arrive alongside the suggestion, on the same card.',
              },
              {
                title: 'I broke the target down by manufacturer instead of summing it',
                body: 'A total-sales bar says you are behind, not where. Breaking it down by manufacturer costs screen density and forces us to maintain a target per manufacturer, but it is the only way the information turns into a next visit. That path is how the goal types grew to five, and how the target structure became something assembled per customer, with a new category arriving as a module instead of requiring a release.',
              },
            ],
            screens: [
              {
                src: '/assets/cases/ic/jornadas/obj-0.jpg',
                alt: 'Platform home screen, with the Goals and Suggestions card listing all five goals and the progress on each.',
                caption: 'The home opens on the rep’s targets',
              },
              {
                src: '/assets/cases/ic/jornadas/obj-1.jpg',
                alt: 'Total Sales screen, with the rep’s progress bar against the period target.',
                caption: 'The period target, measured against goal',
              },
              {
                src: '/assets/cases/ic/jornadas/obj-2.jpg',
                alt: 'Sales by Manufacturer screen, with a progress bar per manufacturer showing amount sold against each target.',
                caption: 'The same target, broken down by manufacturer',
              },
              {
                src: '/assets/cases/ic/jornadas/obj-3.jpg',
                alt: 'Order Suggestion screen, with the client at the top, credit limit at 65%, a not-yet-covered marker and the list of suggested products.',
                caption: 'The client’s suggestion, with credit and coverage alongside',
              },
              {
                src: '/assets/cases/ic/jornadas/obj-4.jpg',
                alt: 'Screen for adding products to the suggestion, with search and the list of available items.',
                caption: 'The rep fills in what the suggestion missed',
              },
              {
                src: '/assets/cases/ic/jornadas/obj-5.jpg',
                alt: 'Completed order screen, confirming the suggestion became an order without leaving the platform.',
                caption: 'The order leaves from here, with no retyping',
              },
            ],
            results: [
              { value: '~200', unit: 'orders a day come from the suggestions' },
              {
                value: '5',
                unit: 'goal types, from total sales to products per store',
                source: 'Product documentation, Jul 2026',
              },
            ],
          },
          {
            name: 'Cotação Ágil',
            detail:
              'The customer’s list goes in as a photo and comes out as a quote via OCR, with no typing and no comparing terms by hand.',
            journey: [
              'In August 2025 the product went to an industry gathering. I designed the tool, tested it beforehand and followed usage in real time from a distance, with the people working the stand telling me what happened on every visit. The scene coming back was always the same. The regional manager served clients holding a ten-page spreadsheet of SKUs, the client pointed at what they wanted, and the order was transcribed line by line into the sales platform. The connection at the stand kept dropping, and when it dropped the quote was set aside for the back office to enter later.',
              'The opportunities that came out of that map became the module, one by one: read the spreadsheet with OCR instead of typing it, pick the price table without asking, and carry straight into the order without retyping anything.',
            ],
            decisions: [
              {
                title: 'I took the paper the way it arrives',
                body: 'The cheap alternative was to ask for a clean file in a defined format. That would have pushed the work back onto the customer, who is exactly the person not going to do it. Accepting a crooked photo, a handwritten list and a ten-page spreadsheet put the cost of the mess inside the product, where it could be solved once instead of on every quote.',
              },
              {
                title: 'I showed the wait instead of hiding it',
                body: 'Extracting, matching products and fetching prices takes time, and the usual answer is a frozen screen with a spinner. We gave processing a real state and handed the rep back to the list while it runs. It costs one more screen and one more state to maintain; it avoids the rep assuming it broke and starting over in front of the client.',
              },
              {
                title: 'Nothing becomes an order without the rep seeing it',
                body: 'With AI extraction the temptation is to close the loop alone and present a finished result. The quote now shows what was read line by line, with out-of-stock items marked and the price visible, so the rep can audit it before exporting. It is one more step in the flow, and it is the step that makes them trust what the machine read.',
              },
            ],
            screens: [
              {
                src: '/assets/cases/ic/jornadas/cot-1.jpg',
                alt: 'File import screen, with the upload area and the list of accepted formats.',
                caption: 'File input: photo, spreadsheet or PDF',
              },
              {
                src: '/assets/cases/ic/jornadas/cot-2.jpg',
                alt: 'Audio recording in progress, with the waveform and elapsed time.',
                caption: 'Audio input, for reps who dictate the list',
              },
              {
                src: '/assets/cases/ic/jornadas/cot-3.jpg',
                alt: 'Manual product entry screen, already filled with items.',
                caption: 'Manual entry, when there is nothing to upload',
              },
              {
                src: '/assets/cases/ic/jornadas/cot-4.jpg',
                alt: 'Adjustment screen before processing, with the quote handling options.',
                caption: 'The adjustments before sending it to process',
              },
              {
                src: '/assets/cases/ic/jornadas/cot-5.jpg',
                alt: 'Quote processing screen, with the steps of client identification and price checking.',
                caption: 'Processing with real state, instead of a frozen screen',
              },
              {
                src: '/assets/cases/ic/jornadas/cot-6.jpg',
                alt: 'Quote detail screen, with the client summary, total units and the list of quoted products, one of them marked out of stock.',
                caption: 'The line-by-line audit, before it becomes an order',
              },
            ],
            results: [
              { value: '400+', unit: 'quotes answered per month' },
              { value: '80%+', unit: 'converted into orders' },
              { value: '1h+', unit: 'saved per quote, at 50 to 100 items' },
              {
                value: '47',
                unit: 'items read from a handwritten photo, against 4 before',
                source: 'Release v0.2.6',
              },
            ],
          },
          {
            name: 'Catálogo Digital',
            detail:
              'Real-time price and stock replacing the printed catalog, with visibility into what the customer actually looked at.',
            /* Ver a nota de fontes na versão em português deste módulo. */
            journey: [
              'The catalog shipped with two ways of reaching the customer, a web link and a PDF, and they do not age the same way. The PDF leaves the product and never comes back: the next day the price has changed, the item is out of stock, and the file keeps circulating saying otherwise. Closing a catalog is where this shows most clearly. When the rep closes one, the link goes down immediately, and the PDF he already sent stays open, with stale prices, out of reach of any correction.',
              'The difference that weighed most, though, is not one of content, it is one of return. The link counts who opened it, how long the catalog stayed up and which product the customer flagged; the PDF returns nothing. And that return changes the visit: when the link goes out beforehand, the rep arrives knowing what the customer already looked at, and ++the conversation starts from the flagged products instead of from the whole portfolio++.',
            ],
            decisions: [
              {
                title: 'The catalog stopped being a document',
                body: 'Keeping the PDF and only automating its generation was the short path, and it preserves the problem: the next day the price is stale and nobody knows. The catalog became an address, with price and stock read at the moment of access and a declared validity. The PDF still exists for whoever needs it, now as an export rather than as the product.',
              },
              {
                title: 'Building became choosing, not laying out',
                body: 'Assembly could have become an editor, with ordering, a cover and sections. We chose to restrict product selection to what the rep actually serves and let the system handle the rest. You lose compositional freedom; you gain a catalog built between two visits instead of at night.',
              },
              {
                title: 'I gave the rep back what the customer looked at',
                body: 'A shared catalog usually ends at the send, and what happens next is silence. Recording access, time active and products marked as interest turned the material into a signal for the next conversation. It is also the part that required deciding what not to show: the data comes back as customer interest, never as browsing surveillance.',
              },
            ],
            screens: [
              {
                src: '/assets/cases/ic/jornadas/cat-1.jpg',
                alt: 'The rep’s catalog list, each entry showing name, period and publication status.',
                caption: 'The rep’s catalogs, with deadline and status',
              },
              {
                src: '/assets/cases/ic/jornadas/cat-2.jpg',
                alt: 'Catalog creation screen, with product selection and the configuration of period and availability.',
                caption: 'Building it: pick products and a period',
              },
              {
                src: '/assets/cases/ic/jornadas/cat-3.jpg',
                alt: 'Detail screen for a published catalog, with interest, view and time-active stats.',
                caption: 'What came back: views, interests and time active',
              },
              {
                src: '/assets/cases/ic/jornadas/cat-4.jpg',
                alt: 'The catalog open in the customer’s phone browser, with products, price and the action to mark interest.',
                caption: 'What the customer opens, in their own browser',
              },
              {
                src: '/assets/cases/ic/jornadas/cat-5.jpg',
                alt: 'The authenticated catalog in the customer’s browser, with products grouped by manufacturer, starting price and a heart to mark interest.',
                caption: 'Once in, they see prices and flag what they want',
              },
            ],
            results: [{ value: '300+', unit: 'catalogs shared in 90 days' }],
          },
        ],
        /* Ver a nota na versão em português para de onde vêm as cinco telas e por
           que elas vão sem borrão. */
        uiEvolution: {
          title: 'I rebuilt the home screen four times',
          lead: 'The home screen is where a product states what it thinks matters. In each version it stated something different.',
          steps: [
            {
              version: 'MVP 0.1',
              src: '/assets/cases/ic/evolucao/v01.jpg',
              alt: 'First version of the home screen, in green branding, with a greeting and a list of clients identified by tax ID, each showing how many SKUs need restocking.',
              change:
                'The home is the client list, and the product is an ideal order for each one.',
            },
            {
              version: 'MVP 0.3',
              src: '/assets/cases/ic/evolucao/v03.jpg',
              alt: 'Second version, still green, with Ideal Orders, Product Catalogue and Clients tabs above the same list.',
              change: 'Catalogue and news arrive, but the list is still the structure.',
            },
            {
              version: 'MVP 0.5',
              src: '/assets/cases/ic/evolucao/v05.jpg',
              alt: 'Third version, in purple and orange branding, showing cards for total sales, sales by manufacturer, product mix and store coverage, with a bottom tab bar.',
              change:
                'The branding changes and the home stops being a list: it becomes a goals panel.',
            },
            {
              version: 'Go-live',
              src: '/assets/cases/ic/evolucao/golive.jpg',
              alt: 'Go-live version, with the Goals and Suggestions card showing the breakdown by manufacturer, and Cotação Ágil and Catálogo Digital cards below it.',
              change:
                'Each module gets its own card, and quoting now starts as a conversation.',
            },
            {
              version: 'Today',
              src: '/assets/cases/ic/evolucao/atual.jpg',
              alt: 'Current screen, with five goals tracked as progress bars: total sales, sales broken down by manufacturer, product coverage, client coverage and products per store.',
              change: 'Goals grow to five, and each one now shows how far along it is.',
            },
          ],
        },
        /* Ver a nota na versão em português: por que as três frentes vão nomeadas
           uma a uma e por que o texto não afirma proporção. */
        discovery: {
          title: 'I never decided alone what went in',
          body: [
            'Once the product was live, the improvement queue stopped coming out of roadmap meetings. I kept a standing group with the reps who use the platform every day, interviewed people right after they used it, and read the usage data alongside both.',
            'Each front catches what the others miss. The group surfaces the friction nobody files a ticket about. The interview shows where someone hesitates, which is not where they complain. The data says how many people hit the same spot, and that is what separates one bad day from a problem worth fixing. ++That is how the queue stopped being my opinion.++',
          ],
          results: [{ value: '20+', unit: 'improvements shipped in 3 months' }],
        },
        convergence: {
          title: 'All three exits lead to the same place',
          body: [
            'The last stretch the research pointed at was never a single module’s problem. Suggestion, quote and catalog each ended in their own corner, and all three charged the rep the same retyping in the sales platform to become an order.',
            'Solving that once, in the right place, was worth more than solving it three times in the interface. Today any of the three lands in the same checkout with the cart already built — and that integration is what makes this a selling tool rather than three well-drawn reports.',
          ],
          items: [
            {
              name: 'Order suggestion',
              detail: 'the cart suggested for the client goes to checkout as it is.',
            },
            {
              name: 'Cotação Ágil',
              detail: 'the audited quote becomes a cart with no line retyped.',
            },
            {
              name: 'Catálogo Digital',
              detail:
                'the products a customer marked as interest become that customer’s cart.',
            },
          ],
        },
        proof: {
          title: 'What held up under measurement',
          lead: 'Three different sources, and they count because they agree: satisfaction comes from surveying the people who use it, adoption comes from the operation, and usage comes from the instrumented product.',
          results: [
            {
              value: '+85',
              unit: 'product NPS, on a -100 to 100 scale',
              source: 'Formbricks, Q3/2026',
            },
            {
              value: '400+',
              unit: 'reps using it in live operations',
              source: 'Power BI, Jul 2026',
            },
            {
              value: '5',
              unit: 'operations migrated in 6 months',
              source: 'Power BI, Jul 2026',
            },
            {
              value: '15 → 200+',
              unit: 'users at the first operation, from early access to all six regions',
              source: 'Power BI, Apr 2026',
            },
          ],
        },
        tradeoff: [
          'The three modules were the ones I chose to go deeper on, and going deeper meant not opening two new fronts.',
          'That choice cost what I had announced at launch myself. Roteiro Ideal and Assistente de Cobrança were promised for the same year. Both got as far as being structured, with screens designed and code written, and neither was finished or reached production. It took eighteen months for them to come back on the plan.',
        ],
      },
      {
        id: 'electrolux-cuida',
        tier: 'major',
        step: '02',
        name: 'Electrolux Cuida',
        org: 'Electrolux',
        tag: 'UX research',
        body: 'User research as part of standing up digital-product research at Electrolux, an area that until then only looked at industrial products.',
        wip: true,
      },
      {
        id: 'unicesumar-mundo-azul',
        tier: 'major',
        step: '03',
        name: 'Mundo Azul',
        /* Duas marcas, porque foram duas: a Unicesumar como cliente e a Brivia
           como parceira do projeto. Confirmado pelo autor em 31/07/2026. */
        org: 'Unicesumar and Brivia',
        tag: 'UX research and product design',
        body: 'User research run as lead designer on the account.',
        wip: true,
      },
      /* Ver a nota na versão em português: os dois cases de UI pura saíram. */
    ],
  },
  casePage: {
    back: 'Back to the cases',
    timelineTitle: 'How the product evolved',
    piecesTitle: 'I took three modules to production',
    numbersSource:
      'Figures without their own source are from July 2026, measured in Power BI and Mixpanel.',
    journeyPrev: 'Previous screen',
    journeyNext: 'Next screen',
    tradeoffTitle: 'What that decision cost',
    closingTitle: 'Want to go deeper?',
    closingBody:
      'I can walk you through how each of these decisions was made, what I would measure again and what I would do differently.',
    closingCta: 'Talk to me',
    notFoundTitle: 'This page does not exist.',
    notFoundBody: 'The address may have moved. Every case lives on the home page.',
    notFoundCta: 'Back to the start',
  },
  /* Ver a nota de ordem, endereços e a pendência da Brivia na versão em português. */
  brands: {
    title: 'Brands I have worked with',
    lead: 'On staff at some, agency or contractor at others. Eight business contexts, and in none of them did the problem arrive already framed.',
    items: [
      { name: 'Electrolux', logo: '/assets/marcas/electrolux.svg' },
      // Duas cores que carregam a marca inteira: o achatamento em preto devolvia
      // um quadrado sólido. Esta é a única que anda em escala de cinza.
      { name: 'Banco do Brasil', logo: '/assets/marcas/bb.svg', tone: 'gray' },
      { name: 'Bradesco', logo: '/assets/marcas/bradesco.png' },
      { name: 'Nexfar', logo: '/assets/marcas/nexfar.png' },
      { name: 'Unicesumar', logo: '/assets/marcas/unicesumar.svg' },
      { name: 'myTapp', logo: '/assets/marcas/mytapp.svg' },
      { name: 'Brivia', logo: '/assets/marcas/brivia.svg' },
      { name: 'Garupa Design', logo: '/assets/marcas/garupa.svg' },
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
        source: 'Direct peer, Nexfar',
      },
      {
        quote: 'I see you as someone who is, above all, senior at learning.',
        source: 'Former manager, Garupa Design',
      },
      {
        quote:
          'I always felt I could come to you and be honest about where things really stood.',
        source: 'Former report, Garupa Design',
        featured: true,
      },
      {
        quote:
          'He proactively brings in and tests tools, especially using AI and automation, contributing to efficiency gains for the team.',
        source: 'Indirect peer, Nexfar',
      },
      {
        quote:
          'Casanova does not wait to be asked for help. When he does not know the answer, he goes and finds out, or points you to who knows.',
        source: 'Indirect peer, Nexfar',
      },
      {
        quote: 'We adopted the standards you defined as our research process.',
        source: 'Design Manager, Electrolux',
      },
    ],
  },
  close: {
    title: 'Let’s talk.',
    lead: 'If you are building a product team, or you want to dig into a decision I made, write to me. I have also left the full résumé as a PDF. I answer in English or Portuguese.',
    signoff: '',
    ctaResume: 'Résumé (PDF)',
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
