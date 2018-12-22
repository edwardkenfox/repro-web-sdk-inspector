console.log('hi from background: top')

chrome.runtime.onMessage.addListener((req, sender) => {
  // if (sender.tab && req.reproDetected) {
  if (sender.tab) {
    console.log('req.reproDetected', req.reproDetected, req.reproio)
    // chrome.browserAction.setIcon({
    //   tabId: sender.tab.id,
    //   path: {
    //     16: `icons/16${suffix}.png`,
    //     48: `icons/48${suffix}.png`,
    //     128: `icons/128${suffix}.png`
    //   }
    // })
    chrome.browserAction.setPopup({
      tabId: sender.tab.id,
      popup: req.reproDetected ? `detected.html` : `not_detected.html`
    }, () => {
      console.log('sent something_completed')
      chrome.runtime.sendMessage({
        msg: "reproio_init",
        data: {
          reproio: req.reproio
        }
      });
    })
  }
})
