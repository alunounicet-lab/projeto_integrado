# Plano incremental para Codex

## Diagnóstico obrigatório
- Execute `git status --short`, examine arquivos novos/alterados e confirme branch. **Não substitua modificações locais dos colegas.**
- Leia HTML/CSS/JS/README existentes; liste o que será reaproveitado e o que será refatorado.
- Confirme se há backend local ainda não commitado. No GitHub `main` analisado só havia `README.md`, `index.html`, `styles.css` e `app.js`.
- Se houver mudanças locais significativas, proponha primeiro um plano compatível antes de editar áreas conflitantes.

## Fase 1 — Interface e modo demo (prioridade máxima)
- Unificar branding para EventSync e aplicar tokens de `DESIGN.md`.
- Reorganizar navegação para Explorar / Criar / Meus Eventos / Detalhes e sino global. Pode ser SPA leve com History API/hash routing; escolha solução que funcione bem no servidor estático e com atualização de página.
- Implementar fonte de dados local estável (`localStorage`) com seeds e operações CRUD de evento, RSVP, notificações.
- Garantir home com cards fotográficos ou assets locais de fallback, hero, busca, chips, empty/loading states.
- Implementar detalhes, criação e Meus Eventos. Preservar Leaflet para detalhes; mapa deve ser carregado só ao abrir detalhe e conter fallback.
- Alterar/retirar fluxo legado `/api/subscriptions` da interface principal: não afirmar que envia emails reais.
- Produzir comandos de execução claros no README.

## Fase 2 — UX e padrões web
- Transformar pelo menos um elemento em Web Component nativo (preferir `event-card`).
- Implementar Web Worker para busca/filtro, com fallback e debounce adequado.
- BroadcastChannel para sincronizar duas abas; eventos que chegam devem atualizar storage/UI sem loop infinito.
- Notifications API opt-in + sino interno. Não pedir autorização ao carregar.
- Garantir teclado, textos acessíveis e layout 390px, 768px e 1440px.

## Fase 3 — Tempo real entre usuários (se necessário para avaliação)
- Implementar backend mínimo Node.js/Express com `/api/events`, `/api/events/:id`, `/api/participations` e `/api/stream` (SSE). SSE deve transmitir mudanças reais entre clientes conectados ao servidor, com reconexão e cleanup de conexões.
- Priorizar simplicidade: armazenamento em memória ou arquivo JSON para demonstração local, explicando reinicialização dos dados; não adicionar Postgres sem necessidade.
- Modo demo local continua funcionando se API estiver indisponível. Indicar qual modo está ativo no README.
- Só adicionar WebSocket quando houver exigência explícita de demonstrar os três mecanismos separadamente.

## Critérios de pronto
- `git diff` revisável, sem remoção acidental de código.
- Sem erro JS na inicialização; não há chamadas contínuas a `/api/*` em modo demo.
- 6 eventos futuros, busca, categorias, detalhes, criação, RSVP, cancelamento, edição, abas e notificações funcionam.
- Dois tabs sincronizam alterações; refresh mantém dados.
- Interface em 390×844, 768×1024, 1440×900; sem overflow horizontal e sem navbar escondendo conteúdo.
- Se browser automation disponível, capturas documentadas em `screenshots/`; comparar com SVGs e iterar.
- README final inclui setup, decisões, roteiro de aula e distinção **real vs simulado**.

## Modelo de relato de cada fase
- Arquivos alterados
- Funcionalidades finalizadas
- Comandos/testes executados e resultados
- Diferenças em relação ao design
- Pendências para a próxima fase
