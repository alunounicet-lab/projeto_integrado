# Instruções permanentes do Codex — EventSync

## Missão
Evoluir o repositório existente `alunounicet-lab/projeto_integrado` para um MVP demonstrável em sala de aula. A interface **Jovem e Vibrante B** definida em `DESIGN.md` é o alvo visual. Consulte `REQUIREMENTS.md` para escopo e `IMPLEMENTATION_PLAN.md` para prioridades. Utilize as referências de `references/` quando disponíveis.

## Estado do repositório na inspeção (28/10/2026)
- `index.html`: página única com hero, catálogo de eventos, mapa, formulário de criação e formulário de inscrição para e-mail; a marca visual atual é "Conecta Eventos".
- `styles.css`: identidade em verde/creme, layout responsivo e estilos do Leaflet.
- `app.js`: busca, filtro, dois mapas Leaflet, criação via POST `/api/events`, consulta via GET `/api/events`, cadastro via POST `/api/subscriptions`.
- `README.md`: já descreve o projeto como EventSync e lista os eixos acadêmicos.
- Não foi encontrada implementação de backend na branch `main` examinada. Verifique novamente o workspace local antes de agir: pode haver arquivos/branches não publicados.

## Regras inegociáveis
1. **Inspecione o workspace antes de alterar.** Execute `git status`, entenda arquivos locais, mudanças não commitadas e comandos existentes. Não sobrescreva trabalho de colegas nem apague recursos sem justificativa.
2. Trabalhe em branch própria, por exemplo `feat/eventsync-visual-b`. Não faça commit, push ou merge sem instrução explícita do usuário.
3. Prefira a stack existente (HTML, CSS e JavaScript vanilla, Leaflet). Não introduza React/Vue, bundler, banco de dados ou infraestrutura sem necessidade comprovada.
4. **Todos os fluxos centrais devem funcionar sem backend** em `DEMO_MODE`, com dados persistidos em `localStorage` e dados iniciais fictícios. Caso o backend esteja disponível, mantenha uma camada de serviços que possa alternar entre modo demo e API; nunca mascarar erro da API como sucesso real.
5. Não implementar pagamentos, QR code, chat, gestão de ingressos, dashboards ou autenticação complexa.
6. Adotar a marca **EventSync** em interface, títulos e mensagens, sem apagar créditos dos integrantes no README.
7. Exibir dados e estados coerentes: nunca prometer envio real de e-mails ou atualizações multiusuário se forem apenas simulações.
8. Preservar navegação por teclado, semântica HTML, foco visível, `aria-live`, labels, contraste e `prefers-reduced-motion`.
9. Manter a atribuição OpenStreetMap correta. O mapa é progressivo: página funciona mesmo se Leaflet/tile falhar.
10. Só considere uma tarefa concluída depois de testar sua interação, responsividade e ausência de erros no console. Descreva precisamente o que é real, local ou simulado.

## Fluxo de trabalho
- Leia nesta ordem: `AGENTS.md`, `DESIGN.md`, `REQUIREMENTS.md`, `IMPLEMENTATION_PLAN.md`.
- Comece por home e navegação com dados demo, depois detalhes/RSVP, criação e Meus Eventos, e por fim notificações e demonstrações técnicas.
- Faça mudanças incrementais e reutilize funções existentes quando fizer sentido.
- Faça captura de tela em 1440×900 e 390×844 se tiver browser automation disponível, e compare com os arquivos `references/*.svg` e o guia visual; ajuste CSS em iterações. SVGs são guias de composição, não screenshots exatos.
- Se não houver automação de navegador, registre isso e forneça passos objetivos para revisão manual.
- Ao concluir cada fase, informe arquivos alterados, comportamentos verificados, limitações e próximos passos.
