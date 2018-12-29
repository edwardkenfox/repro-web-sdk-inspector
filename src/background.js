const saveToClipboard = str => {
  var textArea = document.createElement('textarea');
  textArea.style.cssText = 'position:absolute;left:-100%';

  document.body.appendChild(textArea);

  textArea.value = str;
  textArea.select();
  document.execCommand('copy');

  document.body.removeChild(textArea);
}

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
    chrome.storage.local.get({ clipJSON: null }, result => {
      const map = result.clipJSON || {}
      map[req.origin] = JSON.parse(req.clipJSON)
      chrome.storage.local.set({ clipJSON: map });
    })
  } else if (req.copyToClipBoad) {
    saveToClipboard(req.text);
  }
})

chrome.webRequest.onBeforeRequest.addListener((details) => {
  if (details.url.includes('clip-transporter.reproio.com/active/upload') && details.method === 'POST') {
    if (!details.initiator) return false

    const body = Decoder.decode(details.requestBody.raw[0].bytes)
    const clip = JSON.parse(body).clip
    const origin = (new URL(details.initiator)).origin

    if (clip.custom_event.length > 0) {
      chrome.storage.local.get({ events: null }, result => {
        const map = result.events || {}
        map[origin] = map[origin] === undefined ? [] : map[origin]
        map[origin].push(clip.custom_event)
        chrome.storage.local.set({ events: map });
      })
    }
    if (clip.web_messages.length > 0) {
      chrome.storage.local.get({ web_messages: null }, result => {
        const map = result.web_messages || {}
        map[origin] = map[origin] === undefined ? [] : map[origin]
        map[origin].push(clip.web_messages)
        chrome.storage.local.set({ web_messages: map });
      })
    }
    if (Object.keys(clip.user).length > 0) {
      chrome.storage.local.get({ user: null }, result => {
        const map = result.user || {}
        map[origin] = map[origin] === undefined ? [] : map[origin]
        map[origin] = clip.user
        chrome.storage.local.set({ user: map });
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
