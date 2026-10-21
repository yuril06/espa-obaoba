// Passes temporários do painel /admin. O passe é assinado no servidor e não contém
// nenhuma chave do GitHub: só a data de validade. Trocar a senha encerra todas as sessões;
// trocar a chave do GitHub não.
const crypto = require("crypto");

const DAYS = 7;

const key = () =>
  crypto.createHash("sha256")
    .update(`baoba-session:${process.env.ADMIN_PASSWORD}`)
    .digest();

const sign = (payload) => crypto.createHmac("sha256", key()).update(payload).digest("base64url");

exports.issue = () => {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + DAYS * 864e5 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
};

exports.valid = (token) => {
  if (!token || !token.includes(".")) return false;
  const [payload, sig] = token.split(".");
  const good = Buffer.from(sign(payload));
  const given = Buffer.from(sig || "");
  if (good.length !== given.length || !crypto.timingSafeEqual(good, given)) return false;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString()).exp > Date.now();
  } catch {
    return false;
  }
};

exports.sameText = (a, b) => {
  const x = crypto.createHash("sha256").update(String(a)).digest();
  const y = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
};
