// Ponte entre o painel /admin e o GitHub. O painel manda o passe temporário;
// aqui conferimos o passe e chamamos o GitHub com a chave que fica só no servidor.
// Só o repositório do site pode ser lido ou alterado por aqui.
const { valid } = require("./_session");

const REPO = process.env.SITE_REPO || "yuril06/espa-obaoba";

module.exports = async (req, res) => {
  const auth = req.headers.authorization || "";
  const pass = auth.replace(/^(token|Bearer)\s+/i, "");
  if (!valid(pass)) {
    res.status(401).json({ message: "Sessão expirada. Saia e entre de novo no painel." });
    return;
  }

  const { path = "", ...query } = req.query;
  const route = Array.isArray(path) ? path.join("/") : path;
  const allowed = route === "user" || route === `repos/${REPO}` || route.startsWith(`repos/${REPO}/`);
  if (!allowed) {
    res.status(403).json({ message: "Acesso não permitido." });
    return;
  }

  const qs = new URLSearchParams(query).toString();
  const url = `https://api.github.com/${route}${qs ? `?${qs}` : ""}`;
  const hasBody = !["GET", "HEAD"].includes(req.method);

  const r = await fetch(url, {
    method: req.method,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: req.headers.accept || "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "espaco-baoba-painel",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: hasBody ? (typeof req.body === "string" ? req.body : JSON.stringify(req.body || {})) : undefined,
  });

  res.status(r.status);
  for (const h of ["content-type", "link", "etag", "last-modified"]) {
    const v = r.headers.get(h);
    if (v) res.setHeader(h, v);
  }
  res.setHeader("Cache-Control", "no-store");
  res.send(Buffer.from(await r.arrayBuffer()));
};
