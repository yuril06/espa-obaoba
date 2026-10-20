// Login do painel /admin (Decap CMS) pelo GitHub, passo 1:
// manda a pessoa para a tela de autorização do GitHub.
const crypto = require("crypto");

module.exports = (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    res.status(500).send("Falta configurar GITHUB_CLIENT_ID nas variáveis de ambiente da Vercel.");
    return;
  }
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const state = crypto.randomBytes(16).toString("hex");
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `https://${host}/api/callback`,
    scope: "repo,user",
    state,
  });
  res.setHeader("Set-Cookie", `decap_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`);
  res.writeHead(302, { Location: `https://github.com/login/oauth/authorize?${params}` });
  res.end();
};
