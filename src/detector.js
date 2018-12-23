const detect = (win) => {
  const i = setInterval(() => {
    win.postMessage({
      reproDetected: !!window.reproio,
      clipJSON: JSON.stringify(reproio._clipJSON),
    }, '*')
  }, 2000)
  if (!window.reproio) clearInterval(i);
}

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
  installScript(detect)
}
