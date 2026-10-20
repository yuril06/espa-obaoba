# Site do Espaço Baobá

Página da escola + blog para as famílias + painel para a escola publicar artigos sozinha.

## Rodar no computador

```bash
npm install
npm start          # site em http://localhost:8080
npm run cms        # em outro terminal: painel em http://localhost:8080/admin/
```

No computador o painel entra direto (botão **Entrar**) e grava os artigos na pasta `blog/posts`.

## Onde fica cada coisa

| O quê | Onde |
|---|---|
| Página inicial | `index.html` |
| Artigos do blog (um arquivo por artigo) | `blog/posts/*.md` |
| Número do WhatsApp, telefone, e-mail | `_data/site.json` e `assets/script.js` (linha 4) |
| Cabeçalho, rodapé, layout dos artigos | `_includes/` |
| Configuração do painel | `admin/config.yml` |
| Fotos enviadas pelo painel | `assets/img/blog/` |

Todo artigo ganha automaticamente um botão de WhatsApp com a mensagem
"Olá! Li o artigo “(título)” no site do Baobá e tenho uma dúvida."
Artigos do tema **Saúde** ganham o aviso "não substitui a avaliação do pediatra".

## Colocar no ar com o login da escola

O site é gerado com `npm run build` (pasta `_site`). Para a diretora entrar no painel
pela internet, é preciso escolher como ela faz login e trocar o bloco `backend`
em `admin/config.yml`:

- **Netlify (e-mail e senha):** publicar o repositório no Netlify, ativar Identity e
  Git Gateway, e convidar o e-mail da escola. Ela entra em `seusite/admin/` com e-mail e senha.
  Conferir antes se o Netlify Identity continua disponível para sites novos.
- **Login com GitHub (qualquer hospedagem):** criar uma conta GitHub gratuita para a escola,
  adicioná-la como colaboradora do repositório e usar `backend: name: github` com um
  serviço de autenticação OAuth (ex.: Vercel ou Cloudflare Worker).

Cada artigo publicado vira um commit no repositório e o site é regerado sozinho em 1 a 2 minutos.
