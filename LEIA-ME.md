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

## No ar (Vercel + login com GitHub)

Site: https://espaco-baoba.vercel.app — a Vercel gera o site com `npm run build` e publica `_site`
(`vercel.json`). O login do painel são as funções `api/auth.js` e `api/callback.js`.

1. **App de login no GitHub:** github.com → *Settings* → *Developer settings* → *OAuth Apps* →
   *New OAuth App*:
   - Homepage URL: `https://espaco-baoba.vercel.app`
   - Authorization callback URL: `https://espaco-baoba.vercel.app/api/callback`
   Depois clique em *Generate a new client secret*. Copie o *Client ID* e o *Client secret*.
2. **Variáveis na Vercel:** projeto → *Settings* → *Environment Variables*:
   - `GITHUB_CLIENT_ID` = Client ID
   - `GITHUB_CLIENT_SECRET` = Client secret
   Salve e faça um *Redeploy* (aba *Deployments* → ⋯ → *Redeploy*).
3. **Acesso da diretora:** ela cria uma conta grátis em github.com; no repositório →
   *Settings* → *Collaborators* → *Add people* → usuário dela. Ela aceita o convite no e-mail.
4. **Entrar:** https://espaco-baoba.vercel.app/admin/ → *Entrar com GitHub*.

Cada artigo publicado vira um commit no repositório e a Vercel publica o site de novo
sozinha em 1 a 2 minutos.

**Domínio próprio:** ao ligar o domínio na Vercel, troque o endereço nos dois campos do app
do GitHub (passo 1) e o `base_url` em `admin/config.yml`.
