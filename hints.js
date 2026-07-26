const HINT_CHARS = "fjdkslaurieowhgmvcn";
const TARGETS = "a[href],button,input,textarea,select,[role=textbox]";

let hints = [], typed = "", action = "j", modifier = "meta";

chrome.storage.local.get({ mod: modifier }, ({ mod }) => modifier = mod);
chrome.storage.onChanged.addListener(({ mod }) => mod && (modifier = mod.newValue));

addEventListener("keydown", (event) => {
  if (handleShortcut(event)) return;
  if (!hints.length) return;
  if (event.key == "Escape") return event.preventDefault(), clearHints();
  if (event.key == "Backspace") typed = typed.slice(0, -1);
  else if (HINT_CHARS.includes(event.key.toLowerCase())) typed += event.key.toLowerCase();
  else return;
  event.preventDefault();
  updateMatches();
}, true);

function handleShortcut(event) {
  const key = event.code.slice(3).toLowerCase();
  if (!modifierIsDown(event) || !"jkl".includes(key)) return false;
  event.preventDefault();
  hints.length ? clearHints() : showHints(key);
  return true;
}

function showHints(key) {
  clearHints(); typed = ""; action = key;
  const targets = [...document.querySelectorAll(TARGETS)].filter(isVisible);
  const size = Math.max(1, Math.ceil(Math.log(targets.length) / Math.log(HINT_CHARS.length)));
  targets.forEach((target, index) => addHint(target, makeLabel(index, size)));
}

function addHint(target, id) {
  const box = target.getBoundingClientRect(), hint = document.createElement("b");
  hint.textContent = id.toUpperCase();
  hint.style.cssText = `position:fixed;z-index:2147483647;left:${Math.max(0, box.left)}px;top:${Math.max(0, box.top + box.height / 2)}px;transform:translateY(-50%);background:#ff0;color:#000;border:1px solid #000;padding:1px 3px;font:700 12px monospace`;
  document.documentElement.append(hint);
  hints.push({ id, target, hint });
}

function updateMatches() {
  const matches = hints.filter((h) => h.id.startsWith(typed));
  hints.forEach((h) => h.hint.style.opacity = h.id.startsWith(typed) ? 1 : .25);
  if (matches.length == 1 && matches[0].id == typed) activate(matches[0].target), clearHints();
}

function makeLabel(n, size, label = "") {
  for (; size--; n = Math.floor(n / HINT_CHARS.length)) label = HINT_CHARS[n % HINT_CHARS.length] + label;
  return label;
}

function isVisible(el) {
  const r = el.getBoundingClientRect();
  return r.width && r.height && r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth;
}

function modifierIsDown(event) {
  const key = modifier.replace(/\d/, "");
  return key == "os" ? event.metaKey : event[key + "Key"];
}

function activate(el) {
  action == "j" || !el.href ? (el.focus(), el.click()) : chrome.runtime.sendMessage({ url: el.href, active: action == "l" });
}

function clearHints() {
  hints.forEach((h) => h.hint.remove());
  hints = [];
}
