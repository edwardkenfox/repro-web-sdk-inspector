console.log('hi from detector')

window.addEventListener('message', e => {
  chrome.runtime.sendMessage(e.data)
})

function detect(win) {
  setTimeout(() => {
    win.postMessage({
      reproDetected: !!window.reproio,
      reproio: JSON.stringify(reproio._clipJSON),
    }, '*')
  }, 100)
}

// inject the hook
if (document instanceof HTMLDocument) {
  installScript(detect)
}

function installScript(fn) {
  const source = ';(' + fn.toString() + ')(window)'

  const script = document.createElement('script')
  script.textContent = source
  document.documentElement.appendChild(script)
  script.parentNode.removeChild(script)
}
