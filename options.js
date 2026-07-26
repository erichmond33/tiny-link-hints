const groups = {
  Mac: { meta: "Command", alt: "Option", ctrl: "Control", shift: "Shift" },
  "Windows / Linux": { os: "Windows", alt2: "Alt", ctrl2: "Control", shift2: "Shift" },
};

chrome.storage.local.get({ mod: "meta" }, ({ mod }) => {
  for (const group in groups) {
    document.body.append(Object.assign(document.createElement("h2"), { textContent: group }));
    for (const value in groups[group]) {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.name = "mod";
      input.type = "radio";
      input.value = value;
      input.checked = value == mod;
      label.append(input, ` ${groups[group][value]}`);
      document.body.append(label, document.createElement("br"));
    }
  }
  onchange = (event) => chrome.storage.local.set({ mod: event.target.value });
});
