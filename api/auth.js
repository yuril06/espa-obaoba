// Login do painel /admin (Decap CMS) com uma senha só, sem conta no GitHub.
// Senha certa -> o painel recebe um passe temporário (não a chave do GitHub).
// As chamadas ao GitHub passam por api/github.js, que confere o passe.
//
// Variáveis na Vercel: ADMIN_PASSWORD (senha da escola) e GITHUB_TOKEN.
const { issue, sameText } = require("./_session");

const shell = (body) => `<!doctype html>
<html lang="pt-BR"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>Entrar no painel · Espaço Baobá</title>
<style>
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #1e6b4b; font: 17px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; color: #2b1a12; }
  main { width: min(380px, calc(100% - 32px)); background: #faf6ef; border-radius: 24px; padding: 32px 28px; text-align: center; }
  img { width: 96px; height: 96px; mix-blend-mode: multiply; }
  h1 { margin: 12px 0 4px; font: 600 1.5rem/1.2 Georgia, serif; }
  p { margin: 0 0 20px; color: #6b574b; font-size: .95rem; }
  label { display: block; text-align: left; font-weight: 600; font-size: .9rem; margin-bottom: 6px; }
  input { width: 100%; box-sizing: border-box; min-height: 52px; padding: 10px 16px; border: 2px solid #e5dccd; border-radius: 14px; font: inherit; background: #fff; }
  input:focus { outline: none; border-color: #1e6b4b; }
  button { margin-top: 16px; width: 100%; min-height: 52px; border: 0; border-radius: 999px; background: #1e6b4b; color: #fff; font: 600 1rem system-ui, sans-serif; cursor: pointer; }
  button:hover { background: #15523a; }
  .erro { margin: 14px 0 0; color: #b42318; font-weight: 600; }
</style></head><body><main>${body}</main></body></html>`;

const form = (error) => shell(`
  <img src="/assets/img/logo.jpg" alt="Espaço Baobá" width="96" height="96">
  <h1>Painel do blog</h1>
  <p>Digite a senha da escola para entrar.</p>
  <form method="post" action="/api/auth">
    <label for="senha">Senha</label>
    <input id="senha" name="senha" type="password" autocomplete="current-password" required autofocus>
    <button type="submit">Entrar</button>
    ${error ? `<p class="erro" role="alert">${error}</p>` : ""}
  </form>`);

// Decap CMS hand-off: this popup tells the panel window it is logged in.
const done = (origin, pass) => shell(`
  <h1>Entrando…</h1><p>Esta janela fecha sozinha.</p>
  <script>
  (function () {
    var origin = ${JSON.stringify(origin)};
    var message = "authorization:github:success:" + ${JSON.stringify(JSON.stringify({ token: pass, provider: "github" }))};
    function receive(e) {
      if (e.origin !== origin) return;
      window.opener.postMessage(message, origin);
      window.removeEventListener("message", receive, false);
    }
    window.addEventListener("message", receive, false);
    window.opener.postMessage("authorizing:github", origin);
  })();
  </script>`);

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  if (!process.env.ADMIN_PASSWORD || !process.env.GITHUB_TOKEN) {
    res.status(500).send(shell("<h1>Falta configurar</h1><p>Defina ADMIN_PASSWORD e GITHUB_TOKEN nas variáveis de ambiente da Vercel.</p>"));
    return;
  }
  if (req.method !== "POST") {
    res.status(200).send(form());
    return;
  }
  const senha = (req.body && req.body.senha) || "";
  if (!sameText(senha, process.env.ADMIN_PASSWORD)) {
    await new Promise((r) => setTimeout(r, 1200)); // slows down guessing
    res.status(401).send(form("Senha incorreta. Tente de novo."));
    return;
  }
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  res.status(200).send(done(`https://${host}`, issue()));
};
