const Encoder = new TextDecoder("utf-8")

// // Clear stored data
// chrome.storage.local.remove('clipJSON', () => {})
// chrome.storage.local.set({ 'clipJSON': {}});

// chrome.storage.local.remove('events', () => {})
// chrome.storage.local.set({ 'events': []});

// chrome.storage.local.remove('web_messages', () => {})
// chrome.storage.local.set({ 'web_messages': []});

// chrome.storage.local.remove('user', () => {})
// chrome.storage.local.set({ 'user': {}});

chrome.runtime.onMessage.addListener((req, sender) => {
  if (sender.tab && req.reproDetected) {
    chrome.storage.local.set({'clipJSON': JSON.parse(req.clipJSON)});

    // TODO: run setIcon & setPopup only on initial execution
    chrome.browserAction.setIcon({
      tabId: sender.tab.id,
      path: {
        19: "images/logo-active-19px.png",
        38: "images/logo-active-38px.png",
      }
    })

    chrome.browserAction.setPopup({
      tabId: sender.tab.id,
      popup: req.reproDetected ? 'views/detected.html' : 'views/not_detected.html'
    })
  }
})

chrome.webRequest.onBeforeRequest.addListener((details) => {
  if (details.url.includes("https://clip-transporter.reproio.com/active/upload") && details.method === "POST") {
    const body = Encoder.decode(details.requestBody.raw[0].bytes)
    const clip = JSON.parse(body).clip

    // TODO: refactor
    if (clip.custom_event.length > 0) {
      chrome.storage.local.get(['events'], (result) => {
        const events = result.events
        events.push(clip.custom_event)
        chrome.storage.local.set({ events });
      })
    }
    if (clip.web_messages.length > 0) {
      chrome.storage.local.get(['web_messages'], (result) => {
        const web_messages = result.web_messages
        web_messages.push(clip.web_messages)
        chrome.storage.local.set({ web_messages });
      })
    }
    if (Object.keys(clip.user).length > 0) {
      chrome.storage.local.set({ user: clip.user });
    }
  }
}, {
  urls: ["<all_urls>"]
}, ["requestBody"]);


// TODO: リクエストが成功したら◯つける、みたいなのやりたい
chrome.webRequest.onCompleted.addListener((details) => {
  if (details.url.includes("https://clip-transporter.reproio.com/active/upload") && details.method === "POST") {
  }
}, {
  urls: ["<all_urls>"]
}, []);
