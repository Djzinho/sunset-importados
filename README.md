# Sunset Importados

Site institucional da Sunset Importados, preparado para deploy como **Static Site no Render**.

## Deploy no Render

1. Suba este projeto para um repositório GitHub.
2. No Render, escolha **New > Blueprint** e conecte o repositório.
3. O arquivo `render.yaml` na raiz configura o Static Site e o domínio `sunsetimportados.com.br`.
4. Após o primeiro deploy, confirme no painel do Render os registros DNS solicitados para o domínio.

Também é possível criar manualmente como **Static Site** com:
- Build Command: `echo "Sunset Importados - static site ready"`
- Publish Directory: `site`

## Estrutura

- `/` Home
- `/iphones/`
- `/troque-seu-iphone/`
- `/dispositivos/`
- `/a-sunset/`
- `/contato/`
- `/privacidade/`
- `/termos/`

O site não usa banco de dados, login, checkout ou estoque fictício. A conversão é feita por WhatsApp com mensagens contextualizadas.
