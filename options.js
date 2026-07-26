const groups = {
  Mac: { meta: "Command", alt: "Option", ctrl: "Control", shift: "Shift" },
  "Windows / Linux": { os: "Windows", alt2: "Alt", ctrl2: "Control", shift2: "Shift" },
};

chrome.storage.local.get({ mod: "meta" }, ({ mod }) => {
  for (const group in groups) {
    document.body.append(Object.assign(document.createElement("h2"), { textContent: group }));
    for (const value in groups[group]) {
      const checked = value == mod ? "checked" : "";
      document.body.insertAdjacentHTML("beforeend", `<label><input name=mod type=radio value=${value} ${checked}> ${groups[group][value]}</label><br>`);
    }
  }
  onchange = (event) => chrome.storage.local.set({ mod: event.target.value });
});