export function ls(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}

export function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* storage unavailable */ }
}

export function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export function yesterdayStr() {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

export function fmtDate(dateStr, lang, months) {
  const [y, m, d] = dateStr.split("-");
  return lang === "ar"
    ? `${d} ${months[parseInt(m) - 1]} ${y}`
    : `${months[parseInt(m) - 1]} ${d}, ${y}`;
}

export function fmtAmt(n, sym, lang, code) {
  const s = Number(n).toLocaleString(lang === "ar" ? "ar-SA" : "en-US");
  return lang === "ar" ? `${s} ${sym}` : `${s} ${code || sym}`;
}

export function getDaysInMonth(y, m) {
  return new Date(y, m + 1, 0).getDate();
}

export function getWeekStartStr(startDay = 1) {
  const d = new Date();
  const day = d.getDay();
  const diff = (day - startDay + 7) % 7;
  d.setDate(d.getDate() - diff);
  return d.toISOString().split("T")[0];
}

export function fmtShortDate(dateStr, lang, months) {
  const [, m, d] = dateStr.split("-");
  return lang === "ar"
    ? `${parseInt(d)} ${months[parseInt(m) - 1]}`
    : `${months[parseInt(m) - 1]} ${parseInt(d)}`;
}
