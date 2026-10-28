# EventSync — Requisitos e escopo de demonstração

## Premissa
Trabalho acadêmico demonstrado localmente em sala; não é produto comercial. Preferir fluxos completos simples a funcionalidades grandes incompletas.

## Histórias de usuário e aceite
**R1 — Explorar**: visitante vê eventos futuros públicos, busca por título/local/categoria, seleciona chip, abre detalhe. Busca sem resultados mostra estado vazio. **Aceite**: pelo menos 6 eventos fictícios com datas futuras relativas ao dia da demonstração.

**R2 — Detalhes**: cada evento tem URL/navegação identificável, descrição, data/hora, local e confirmação. **Aceite**: abrir detalhe a partir de card, voltar e confirmar presença.

**R3 — Criar**: preencher título, descrição, data/hora, local, categoria, visibilidade e imagem opcional. **Aceite**: evento aparece no lugar correto e persiste ao recarregar. Validação impede envio inválido. Imagem pode ser prévia local (tamanho limitado) com fallback.

**R4 — Participação**: uma identidade de demonstração fixa é suficiente; confirmação persiste, pode ser desfeita, não duplica. **Aceite**: evento aparece/sai da aba Participando.

**R5 — Meus Eventos**: abas Participando e Organizando, detalhes e edição básica de eventos criados. **Aceite**: criar, editar data/local, e ver atualização nos detalhes.

**R6 — Notificações**: sino exibe novos eventos públicos e mudanças relevantes em eventos confirmados, permite marcar como lido. **Aceite**: atualização aparece imediatamente na aba atual após ação local; demonstrar em duas abas via BroadcastChannel. Não alegar notificação entre dispositivos em modo demo.

**R7 — Mapa**: nos detalhes, exibir mapa Leaflet quando coordenadas existirem; caso contrário, mostrar local textual. **Aceite**: sem mapa/sem internet, a informação principal continua disponível.

**R8 — Acessibilidade**: labels, foco, contraste, navegação por teclado, textos de estado. **Aceite**: explorar, criar e confirmar por teclado, testar em 390px de largura.

## Eixos tecnológicos exigidos
| Eixo | Demonstração mínima honesta |
|---|---|
| Acessibilidade/UX | HTML semântico, foco visível, labels, validação e contraste WCAG AA para textos normais |
| Tempo real/reatividade | Estado UI reativo após criar/editar/confirmar, sem reload |
| BroadcastChannel | Sincronização entre duas abas na mesma origem; persistir e atualizar mensagens |
| SSE | **Fase opcional com backend Node**: endpoint de eventos e `EventSource`, capaz de propagar alteração entre dois navegadores distintos |
| WebSocket | Se professor exigir WebSocket *além* do uso de SSE/BroadcastChannel, demonstrar canal simples separado; não fingir que são equivalentes |
| Edge/performance/green | Cache estático, lazy loading, WebP/AVIF local, CSS/JS sem framework pesado, explicar trade-off CDN/edge no README |
| Web Components | `event-card` ou `notification-bell` como Custom Element reutilizável (pelo menos um real) |
| Web Workers | Worker dedicado a filtro/ordenação de eventos com fallback síncrono em ambientes incompatíveis; documentar que a escala do MVP não exige worker |
| Notifications API | Pedir permissão só por clique; alertas locais em navegador compatível, nunca exigir permissão para usar o app |

## Limites intencionais
Sem pagamento, ingressos, QR codes, chat, ranking, área administrativa, publicação de e-mails reais, login de produção ou autorização robusta. Privado = não listado e acessível no modo demo por link/token de convite; não prometer confidencialidade forte.

## Dados e modo demo
- Inicializar dados fictícios somente se storage vazio; datas relativas ao dia atual para não expirar.
- Armazenar eventos, presenças e notificações sob chaves prefixadas `eventsync:`.
- Identidade local `Participante Demo` é uma convenção de apresentação, não login real.
- Incluir botão discreto `Restaurar dados de demonstração` em área Sobre/Configurações, com confirmação.
- Eventualmente oferecer interface `EventService` com duas implementações `LocalDemoService` e `ApiService`, sem misturar fetch com renderização.
- Suportar execução local por servidor estático (não abrir somente via `file://` se workers/módulos exigirem servidor).

## Roteiro de apresentação (3–5 minutos)
1. Abrir Explorar, buscar `música`, filtrar e entrar no detalhe.
2. Confirmar presença; mostrar Participando.
3. Criar evento, retornar à home, abrir detalhe e editar horário.
4. Abrir segunda aba; mostrar sincronização via BroadcastChannel.
5. Mostrar mapa no detalhe, componente customizado e worker nas DevTools; permitir notificação do navegador somente por clique.
6. Se o backend SSE estiver implementado, abrir segundo navegador para mostrar eventos em tempo real entre clientes.
