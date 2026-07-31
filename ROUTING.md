# Rotas

O site nasceu de uma página só e ganhou roteador em 31/07/2026, quando a página
interna do case do Inteligência Comercial passou a existir.

| Rota | Página | O que é |
| --- | --- | --- |
| `/` | `src/pages/Home.tsx` | Hero, Cases, Sobre, Contato |
| `/cases/inteligencia-comercial` | `src/pages/CaseInteligenciaComercial.tsx` | O case conduzido do marco zero, em profundidade |
| qualquer outra | `src/pages/NotFound.tsx` | Endereço que não existe |

## O que precisa acompanhar uma rota nova

1. **`id="top"` na primeira seção.** O pulo de conteúdo do cabeçalho aponta para
   `#top` em toda rota. Sem ele o link de teclado morre.
2. **Entrada em `App.tsx`**, acima do `path="*"`.
3. **Nada no `vercel.json`.** O rewrite é curinga: toda rota cai no
   `index.html` e quem decide é o roteador no navegador. É esse arquivo que faz o
   F5 em `/cases/...` funcionar — sem ele o servidor procura um arquivo nesse
   caminho e devolve 404 antes de o React existir.

## Âncora entre rotas

Link para seção da home a partir de outra rota é `/#secao`, e quem rola até lá é
o `ScrollManager`. Dentro da própria home continua sendo âncora crua (`#secao`),
onde o Lenis faz a rolagem suave sozinho.

## O que o roteador **não** resolveu

- **Título e `description` por rota.** Eles continuam saindo do `LocaleProvider`,
  que só conhece o idioma. A página do case compartilha o título da home.
- **Prévia de link (Open Graph) por rota.** Robô de preview não executa JS, então
  toda rota mostra a prévia estática do `index.html`. Resolver os dois exige
  prerender.
