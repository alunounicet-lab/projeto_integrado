# EventSync — Design System B: Jovem e Vibrante

## Objetivo visual
Aplicação leve, acolhedora, alegre e contemporânea, como uma agenda de eventos culturais e universitários. **Não** parecer dashboard corporativo. São referências de composição, não cópias de imagens geradas no chat. Consultar os SVGs em `references/`.

## Marca e linguagem
- Nome visível: **eventsync.** em minúsculas como logotipo tipográfico, com ícone de calendário/coração; título do documento: `EventSync — Descubra, organize e participe`.
- Frase hero: **Seu próximo rolê começa aqui!**
- Apoio: `Shows, encontros, workshops e experiências para você aproveitar.`
- CTA principal: `+ Criar evento` e `Confirmar minha presença`.
- Tom: jovem mas legível, adequado à sala de aula; sem gírias em erros ou instruções técnicas.

## Tokens
| Token | Valor | Uso |
|---|---|---|
| `--color-coral` | `#FB5166` | destaques e detalhes, **não** botão branco/texto normal sem checar contraste |
| `--color-coral-action` | `#B91F42` | CTA com texto branco, estado normal acessível |
| `--color-coral-hover` | `#9F1636` | hover CTA |
| `--color-violet` | `#8957E8` | seções/ícones decorativos |
| `--color-orange` | `#FFAE43` | microdestaques |
| `--color-background` | `#FFF7F3` | fundo principal |
| `--color-paper` | `#FFFFFF` | cartões/formulários |
| `--color-ink` | `#252139` | texto principal |
| `--color-muted` | `#655E70` | texto secundário |
| `--color-border` | `#F0E2E0` | bordas |
| `--color-success` | `#237445` | confirmação |
| `--shadow-card` | `0 12px 36px rgba(37,33,57,.08)` | hover e superfície elevada |

Tipografia: Poppins (títulos, pesos 600/700/800), Inter (corpo, 400/500/600). Usar `font-display: swap` ou pilhas locais. Escala sugerida: hero 48–64px desktop / 34–42px mobile, H1 interna 34–42px, H2 26–32px, texto 15–16px, auxiliar 12–14px. Line-height corpo 1.5–1.65. Evitar textos minúsculos de 9–11px no produto final.

Medidas: container `max-width:1200px`, padding lateral 32px desktop e 18–20px mobile; grade 3 colunas ≥1100px, 2 entre 700–1099px, 1 abaixo de 700px. Gaps 24px; cartões radius 18–20px; botões radius 12px e altura min 44–48px; inputs min 46px; banner radius 24px. Espaçamento base 8px (8/16/24/32/48/64).

## Componentes
1. **Header**: logo esquerda, links Explorar/Meus Eventos, sino com contador, CTA Criar. Desktop amplo; mobile logo/sino + bottom nav.
2. **Hero**: fundo `#FFF0E8` com composição leve coral/violeta/laranja, grande título, descrição e campo de busca branco destacado. Não criar hero genérico com gradiente escuro.
3. **Chips de categoria**: Todos, Música, Tecnologia, Cultura, Educação e Outros. Selecionado em coral-action com texto branco; demais fundo claro e texto grafite.
4. **Card de evento**: capa horizontal 16:9 ou 5:3; categoria/data em destaque, título, local, CTA/ver detalhes; imagem fallback com ilustração CSS/ícone se offline; altura e cortes consistentes.
5. **Formulário**: superfície branca, labels visíveis, erros inline, campos 100% no mobile. Upload de capa opcional e categoria/visibilidade.
6. **Painel de sino**: popover/dialog acessível com mensagens novas, horário e link relacionado; fechar por Escape e ação explícita.
7. **Toast**: sucesso/erro com `role=status` ou `role=alert` adequado; não depender só do toast para confirmar estado.
8. **Bottom nav mobile**: Explorar, Criar, Meus, Perfil (Perfil pode ser substituído por `Sobre`/identidade demo, sem simular login inexistente). Respeitar safe area e não cobrir CTAs.

## Páginas / views
### Explorar
- Hero com busca, chips de categoria e título `Eventos em destaque ✦`.
- Cards alimentados pela mesma fonte de dados, ordenados por data futura; evento passado não deve ser exibido como próximo.
- Empty state com limpar filtros; estado loading e fallback de erro.
- **Mudança em relação ao repositório atual**: a seção `map-panel` não deve dominar a home; mapa fica nos detalhes, podendo manter link discreto `Ver no mapa`.

### Detalhes
- Capa larga, título, categoria, data, hora, local, descrição, mapa Leaflet opcional e CTA `Confirmar minha presença`.
- Depois de confirmar: estado `Presença confirmada` + ação `Cancelar participação`.
- Evento privado: não aparece na listagem pública; no MVP, somente acesso com link de convite/token local de demonstração, sinalizado como simulação se não houver backend.

### Criar evento
- Cabeçalho `Criar novo evento ✦`; upload de imagem opcional, título obrigatório, descrição, data/hora futura, local, categoria, visibilidade.
- Coordenadas opcionais em seção `Definir no mapa` recolhível; não exigir lat/lng para publicar.
- Após salvar, navegue para detalhe do novo evento. Erros próximos aos campos.

### Meus Eventos
- Título `Meus eventos ♥`, abas `Participando` / `Organizando`; card compacto com data/status/ação.
- Editar/excluir evento criado somente em modo demo com identidade local simples; não inventar autenticação real.

### Notificações
- Sino global; novos eventos públicos e alterações de eventos confirmados. Distinção visual lido/não lido e contador. Solicitar permissão da Notifications API somente após interação do usuário.

## Responsivo e acessibilidade
Breakpoints 700px e 1100px como referências, não dogmas. Não usar somente cor para comunicar estado. Alvo de toque >=44px recomendado. `:focus-visible` forte. `prefers-reduced-motion: reduce`. Links reais para navegação; botões para ações. `aria-current` navegação, `aria-selected` abas, mensagens de validação associadas a campos. A funcionalidade de confirmação e a busca devem operar apenas por teclado.

## Imagens
Evitar URLs de imagens aleatórias que podem quebrar na aula. Usar assets locais WebP/AVIF otimizados (ou SVGs ilustrativos originais de fallback). Não reutilizar imagens encontradas na internet sem direito de uso. Capa `object-fit:cover` e `loading=lazy` fora do hero. `alt` descritivo quando a imagem comunica conteúdo; decorativa com alt vazio.

## Meta de fidelidade
A prioridade é preservar: 1) hierarquia (hero, busca, chips e grid); 2) paleta; 3) tipografia; 4) espaçamento; 5) cartões com imagem; 6) responsividade; 7) interação. Os mockups SVG podem variar em textos e imagens reais, mas a organização visual deve ser próxima.
