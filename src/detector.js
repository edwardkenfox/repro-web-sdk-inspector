// Check existence of reproio tracker object in the main page context
// Sends message to background script with clipJSON as payload
const detectReproWebSDK = (win) => {
  // Delay to wait for installScript to finish
  setTimeout(() => {
    win.postMessage({
      reproDetected: !!window.reproio,
      clipJSON: !!window.reproio ? JSON.stringify(window.reproio._clipJSON) : '',
      initial: true,
      origin: location.origin,
    }, '*')
  }, 100)

  // Poll tracker object state to reflect changes to properties like user_annotation
  const i = setInterval(() => {
    win.postMessage({
      reproDetected: !!window.reproio,
      clipJSON: !!window.reproio ? JSON.stringify(window.reproio._clipJSON) : '',
      origin: location.origin,
    }, '*')
  }, 2000)
}

// Inject script to DOM to get value of reproio tracker object in the main page context
const installScript = (fn) => {
  const source = ';(' + fn.toString() + ')(window)'
  const script = document.createElement('script')
  script.textContent = source
  document.documentElement.appendChild(script)
  script.parentNode.removeChild(script)
}

window.addEventListener('message', e => {
  chrome.runtime.sendMessage(e.data)
})

if (document instanceof HTMLDocument) {
  installScript(detectReproWebSDK)
}
