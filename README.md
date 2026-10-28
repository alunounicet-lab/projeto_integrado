# EventSync

Plataforma acadêmica para descobrir, organizar e participar de eventos. Esta versão implementa a **Fase 1** em HTML, CSS e JavaScript, sem backend obrigatório. A interface segue o design “Jovem e Vibrante B” e as imagens PNG em `references/`.

## Executar

Na raiz do projeto:

```bash
python3 -m http.server 8000
```

Abra [http://localhost:8000](http://localhost:8000). Use um servidor estático; abrir `index.html` diretamente como arquivo pode limitar recursos do navegador. Não há instalação de dependências.

## O que funciona

- **Explorar:** seis eventos fictícios com datas futuras relativas ao primeiro acesso, busca por título, local e categoria, chips de filtro e estado vazio.
- **Detalhes:** URL com hash para cada evento, descrição, data, local, mapa opcional e confirmação ou cancelamento de presença.
- **Criar:** validação de campos, data futura, capa JPG/PNG/WebP opcional de até 1 MB, visibilidade pública ou privada e coordenadas opcionais. Após salvar, o detalhe abre automaticamente.
- **Meus Eventos:** abas Participando e Organizando; eventos criados pela identidade local podem ser editados.
- **Notificações:** sino interno para evento público criado e alterações de data/local em eventos confirmados; mensagens podem ser marcadas como lidas.
- **Persistência:** eventos, presenças e notificações ficam em `localStorage` sob `eventsync:state:v1`. Alterações entre abas da mesma origem são atualizadas por `BroadcastChannel` e pelo evento `storage`.
- **Restaurar dados:** em **Sobre**, o botão restaura os dados fictícios após confirmação.

As capas dos dois primeiros eventos usam as imagens das prévias fornecidas em `references/`. As demais capas têm ilustrações CSS locais. O mapa Leaflet usa OpenStreetMap nos detalhes quando há coordenadas; se a biblioteca ou os tiles não carregarem, a localização textual continua disponível.

## Real e simulado

As interações, a validação, a persistência neste navegador e a atualização entre abas são reais. A identidade **Participante Demo**, os eventos iniciais e as notificações são dados de demonstração. Não há login, envio de e-mails, sincronização entre dispositivos, backend nem controle de acesso real. Um evento privado fica fora da listagem pública e seu link funciona apenas com os dados deste navegador.

Fontes Google e Leaflet são carregados por CDN; as fontes têm fallback local e a página funciona sem o mapa. Para uma apresentação sem rede, hospede as dependências localmente.

## Roteiro rápido para a aula

1. Em Explorar, busque “música”, use um chip e abra um evento.
2. Confirme presença e confira a aba Participando.
3. Crie um evento, abra seu detalhe e edite data ou local em Organizando.
4. Abra uma segunda aba da mesma URL para mostrar a atualização local e as notificações.
5. Abra um evento com coordenadas para ver o mapa. Em Sobre, restaure os dados para repetir a apresentação.

## Verificação da Fase 1

Capturas de revisão estão em `screenshots/`: home em 1440×900 e 390×844, detalhes, criação e resultado do teste funcional. O teste em Firefox headless verificou busca, chips, detalhes, RSVP, criação, edição, Organizando, notificação e persistência após recarregar. Revise manualmente interações de teclado, upload, mapa e visual em outros navegadores.

## Próximas fases

Web Component, Web Worker e Notifications API ficam para a Fase 2. SSE e backend são opcionais na Fase 3. Nenhum deles é simulado como funcionalidade de produção nesta fase.

## Equipe de desenvolvimento

- Antonio Edivan da Silva do Nascimento
- João Elyezio
- Weverson de Oliveira Barros
- Antthony Matthews
