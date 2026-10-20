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

## No ar (Vercel) — a escola entra só com senha

Site: https://espaco-baoba.vercel.app — a Vercel gera o site com `npm run build` e publica `_site`
(`vercel.json`).

Como o login funciona: a diretora abre `/admin/`, clica em **Entrar no painel** e digita a senha.
O painel recebe um passe que vale 7 dias (`api/auth.js`). Tudo o que ele grava passa por
`api/github.js`, que confere o passe e usa a chave do GitHub guardada só na Vercel. Essa ponte
só alcança este repositório.

Configuração (uma vez só, feita pelo desenvolvedor):

1. **Chave do GitHub:** github.com → *Settings* → *Developer settings* → *Personal access tokens* →
   *Fine-grained tokens* → *Generate new token*:
   - Repository access: *Only select repositories* → `espa-obaoba`
   - Permissions → Repository permissions → **Contents: Read and write**
   - Validade: a mais longa disponível (anote a data para renovar)
2. **Variáveis na Vercel:** projeto → *Settings* → *Environment Variables*:
   - `GITHUB_TOKEN` = a chave do passo 1
   - `ADMIN_PASSWORD` = a senha da escola (longa, ex.: três palavras e um número)
   Salve e faça *Redeploy* (aba *Deployments* → ⋯ → *Redeploy*).
3. **Entregar para a escola:** o endereço https://espaco-baoba.vercel.app/admin/ e a senha.

Trocar a senha = mudar `ADMIN_PASSWORD` na Vercel e fazer Redeploy (quem estava logado sai).
Fotos enviadas pelo painel: até uns 3 MB cada.

**Domínio próprio:** ao ligar o domínio na Vercel, troque `base_url` e `api_root` em `admin/config.yml`.
