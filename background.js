chrome.runtime.onMessage.addListener((m) => chrome.tabs.create({ url: m.url, active: m.active }));
