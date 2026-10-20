// Login do painel /admin (Decap CMS) pelo GitHub, passo 2:
// troca o código do GitHub por um token e entrega ao painel pela janela de login.

const page = (origin, status, content) => `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><title>Entrando…</title></head>
<body><p>Entrando no painel…</p>
<script>
(function () {
  var origin = ${JSON.stringify(origin)};
  var message = "authorization:github:${status}:" + ${JSON.stringify(JSON.stringify(content))};
  function receive(e) {
    if (e.origin !== origin) return;
    window.opener.postMessage(message, origin);
    window.removeEventListener("message", receive, false);
  }
  window.addEventListener("message", receive, false);
  window.opener.postMessage("authorizing:github", origin);
})();
</script></body></html>`;

module.exports = async (req, res) => {
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const origin = `https://${host}`;
  const send = (status, content) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Set-Cookie", "decap_state=; Path=/api; Max-Age=0");
    res.status(200).send(page(origin, status, content));
  };

  const { code, state } = req.query;
  const cookie = (req.headers.cookie || "").split(/;\s*/).find((c) => c.startsWith("decap_state="));
  if (!code || !state || !cookie || cookie.split("=")[1] !== state) {
    send("error", { message: "Login expirado ou inválido. Feche esta janela e tente de novo." });
    return;
  }

  try {
    const r = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${origin}/api/callback`,
      }),
    });
    const data = await r.json();
    if (!data.access_token) {
      send("error", { message: data.error_description || "O GitHub não autorizou o login." });
      return;
    }
    send("success", { token: data.access_token, provider: "github" });
  } catch (err) {
    send("error", { message: "Não foi possível falar com o GitHub. Tente de novo." });
  }
};
