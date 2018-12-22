console.log('hi from popup')

chrome.runtime.onMessage.addListener((req, sender) => {
  if (req.msg === "reproio_init") {
    const data = JSON.parse(req.data.reproio)
    // console.log(req.data.reproio, data)
    document.getElementById('token').innerText = data.clip.token
    document.getElementById('idfv').innerText = data.clip.idfv
    document.getElementById('user_id').innerText = data.clip.user_annotation || 'none'
    document.getElementById('sdk_version').innerText = data.clip.sdk_version || 'none'
  }
});
