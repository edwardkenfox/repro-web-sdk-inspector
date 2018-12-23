// TODO: もろもろリファクタ

// Set initial value
chrome.storage.local.get(['clipJSON'], (result) => {
  const data = result.clipJSON
  document.getElementById('token').innerText = data.clip.token
  document.getElementById('idfv').innerText = data.clip.idfv
  document.getElementById('user_id').innerText = data.clip.user_annotation || 'none'
  document.getElementById('sdk_version').innerText = data.clip.sdk_version || 'none'
});

chrome.storage.local.get(['events'], (result) => {
  const list = document.getElementById('logs')
  result.events.forEach(event => {
    const item = document.createElement('li')
    item.innerText = JSON.stringify(event)
    list.append(item)
  })
});

chrome.storage.local.get(['web_messages'], (result) => {
  const list = document.getElementById('logs')
  result.web_messages.forEach(msg => {
    const item = document.createElement('li')
    item.innerText = JSON.stringify(msg)
    list.append(item)
  })
});

chrome.storage.local.get(['user'], (result) => {
  const list = document.getElementById('logs')
  Object.keys(result.user).forEach(key => {
    const item = document.createElement('li')
    item.innerText = `${key}: ${JSON.stringify(result.user[key])}`
    list.append(item)
  })
});

// Observe changes to storage which is triggered by upload requests
chrome.storage.onChanged.addListener((changes, namespace) => {
  console.log('changed!', changes)
  if (namespace !== 'local') return false;

  for (key in changes) {
    const list = document.getElementById('logs')

    switch (key) {
      case 'clipJSON':
        const data = changes['clipJSON'].newValue
        document.getElementById('token').innerText = data.clip.token
        document.getElementById('idfv').innerText = data.clip.idfv
        document.getElementById('user_id').innerText = data.clip.user_annotation || 'none'
        document.getElementById('sdk_version').innerText = data.clip.sdk_version || 'none'
        break;
      case 'events':
        const events = changes['events'].newValue
        events.forEach(event => {
          const item = document.createElement('li')
          item.innerText = JSON.stringify(event)
          list.append(item)
        })
        break;
      case 'web_messages':
        const messages = changes['web_messages'].newValue
        messages.forEach(msg => {
          const item = document.createElement('li')
          item.innerText = JSON.stringify(msg)
          list.append(item)
        })
        break;
      case 'user':
        const userProfiles = changes['user'].newValue
        Object.keys(userProfiles).forEach(profileKey => {
          const item = document.createElement('li')
          item.innerText = `${profileKey}: ${JSON.stringify(userProfiles[profileKey])}`
          list.append(item)
        })
        break;
      default:
        break;
    }
  }
});
