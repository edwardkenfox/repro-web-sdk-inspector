const Decoder = new TextDecoder('utf-8')

chrome.runtime.onMessage.addListener((req, sender) => {
  if (sender.tab && req.reproDetected) {
    if (req.initial) {
      chrome.browserAction.setIcon({
        tabId: sender.tab.id,
        path: {
          19: 'images/logo-active-19px.png',
          38: 'images/logo-active-38px.png',
        }
      })

      chrome.browserAction.setPopup({
        tabId: sender.tab.id,
        popup: req.reproDetected ? 'views/detected.html' : 'views/not_detected.html'
      })
    }
    chrome.storage.local.set({'clipJSON': JSON.parse(req.clipJSON)});
  }
})

chrome.webRequest.onBeforeRequest.addListener((details) => {
  if (details.url.includes('clip-transporter.reproio.com/active/upload') && details.method === 'POST') {
    const body = Decoder.decode(details.requestBody.raw[0].bytes)
    const clip = JSON.parse(body).clip

    if (clip.custom_event.length > 0) {
      chrome.storage.local.get(['events'], (result) => {
        const events = result.events || []
        events.push(clip.custom_event)
        chrome.storage.local.set({ events });
      })
    }
    if (clip.web_messages.length > 0) {
      chrome.storage.local.get(['web_messages'], (result) => {
        const web_messages = result.web_messages || []
        web_messages.push(clip.web_messages)
        chrome.storage.local.set({ web_messages });
      })
    }
    if (Object.keys(clip.user).length > 0) {
      chrome.storage.local.set({ user: clip.user });

      chrome.storage.local.get(['user'], (result) => {
        const userProfiles = Object.keys(result.user).length !== 0 ? result.user : {}
        const val = Object.assign({}, userProfiles, clip.user)
        chrome.storage.local.set({ user: val });
      })
    }
  }
}, {
  urls: ['<all_urls>']
}, ['requestBody']);


// TODO: リクエストが成功したら◯つける、みたいなのやりたい
chrome.webRequest.onCompleted.addListener((details) => {
  if (details.url.includes('clip-transporter.reproio.com/active/upload') && details.method === 'POST') {
  }
}, {
  urls: ['<all_urls>']
}, []);
