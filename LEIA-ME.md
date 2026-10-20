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

## Colocar no ar (Netlify + login com GitHub)

O repositório já tem o `netlify.toml` (gera com `npm run build` e publica `_site`)
e o painel já aponta para `yuril06/espa-obaoba`.

1. **Publicar no Netlify:** app.netlify.com → *Add new project* → *Import from Git* →
   GitHub → escolha `espa-obaoba` → *Deploy*. Anote o endereço (ex.: `espaco-baoba.netlify.app`).
2. **Criar o app de login no GitHub:** github.com → *Settings* → *Developer settings* →
   *OAuth Apps* → *New OAuth App*:
   - Homepage URL: o endereço do Netlify
   - Authorization callback URL: `https://api.netlify.com/auth/done`
   Gere um *Client secret* e copie o *Client ID* e o *Client secret*.
3. **Ligar o login no Netlify:** no projeto → *Project configuration* → *Access & security* →
   *OAuth* → *Install provider* → GitHub → cole o Client ID e o Client secret.
4. **Dar acesso à diretora:** ela cria uma conta gratuita em github.com; no repositório →
   *Settings* → *Collaborators* → *Add people* → o usuário dela. Ela aceita o convite no e-mail.
5. **Pronto:** ela entra em `https://(endereço)/admin/` → *Entrar com GitHub*.

Cada artigo publicado vira um commit no repositório e o Netlify publica o site de novo
sozinho em 1 a 2 minutos.

O Netlify Identity (login por e-mail e senha) foi descontinuado em 2025 e não deve ser usado.
