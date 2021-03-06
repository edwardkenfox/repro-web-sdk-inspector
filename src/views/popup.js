//
// DOM manipulation functions
//
const updateClip = clip => {
  const properties = ['token', 'idfv', 'user_annotation', 'sdk_version', 'ip_address', 'device', 'network', 'os', 'os_version', 'browser', 'browser_version', 'user_agent', 'push_enabled']
  properties.forEach(prop => {
    document.getElementById(prop).innerText = clip[prop]
  })
}
const appendLog = (type, content) => {
  const table = document.getElementById('log')

  const row = table.insertRow(1);
  let cell = row.insertCell(0);
  let text = document.createTextNode(content);
  cell.appendChild(text);

  cell = row.insertCell(0);
  text = document.createTextNode(type);
  cell.appendChild(text);
}
const removeStorage = () => {
  chrome.storage.local.remove('clipJSON')
  chrome.storage.local.remove('events')
  chrome.storage.local.remove('web_messages')
  chrome.storage.local.remove('user')
}


//
// Set initial value
//
chrome.storage.local.get('clipJSON', (result) => {
  if (!result.clipJSON) return false;

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => {
    const origin = (new URL(tabs[0].url)).origin
    if (!result.clipJSON[origin]) return false

    updateClip(result.clipJSON[origin].clip)
  })
});
chrome.storage.local.get('events', (result) => {
  if (!result.events) return false;

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => {
    const origin = (new URL(tabs[0].url)).origin
    if (!result.events[origin]) return false

    result.events[origin].forEach(event => {
      appendLog('Event', JSON.stringify(event))
    })
  })
});
chrome.storage.local.get('web_messages', (result) => {
  if (!result.web_messages) return false;

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => {
    const origin = (new URL(tabs[0].url)).origin
    if (!result.web_messages[origin]) return false

    result.web_messages[origin].forEach(msg => {
      appendLog('Message', JSON.stringify(msg))
    })
  })
});
chrome.storage.local.get('user', (result) => {
  if (!result.user) return false;

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => {
    const origin = (new URL(tabs[0].url)).origin
    if (!result.user[origin]) return false

    Object.keys(result.user[origin]).forEach(profileKey => {
      appendLog('User Profile', `${profileKey}: ${JSON.stringify(result.user[origin][profileKey])}`)
    })
  })
});

//
// Observe changes to storage which is triggered by upload requests
//
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace !== 'local') return false;
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => {
    const origin = (new URL(tabs[0].url)).origin
    for (key in changes) {
      switch (key) {
        case 'clipJSON':
          const value = changes['clipJSON'].newValue[origin];
          if (!value) continue;

          updateClip(value.clip)
          break;
        case 'events':
          const events = changes['events'].newValue[origin]
          if (!events) continue;

          events.forEach(event => {
            appendLog('Event', JSON.stringify(event))
          })
          break;
        case 'web_messages':
          const messages = changes['web_messages'].newValue[origin]
          if (!messages) continue;

          messages.forEach(msg => {
            appendLog('Message', JSON.stringify(msg))
          })
          break;
        case 'user':
          const userProfiles = changes['user'].newValue[origin]
          if (!userProfiles) continue;

          Object.keys(userProfiles).forEach(profileKey => {
            appendLog('User Profile', `${profileKey}: ${JSON.stringify(result.user[profileKey])}`)
          })
          break;
        default:
          break;
      }
    }
  })
});

//
// Attach events
//
document.getElementById('delete').addEventListener('click', () => {
  removeStorage()
  window.close()
})

const els = document.getElementsByClassName('copy')
for (let i = 0; i < els.length; i++) {
  let text = ''
  els[i].addEventListener('click', ev => {
    const targetId = ev.currentTarget.getAttribute('value')
    text = document.getElementById(targetId).innerText
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      chrome.runtime.sendMessage({
        text: text,
        copyToClipBoad: true,
      });
    });
  })
}

window.addEventListener('keydown', ev => {
  if (ev.keyCode !== 9) return false;

  const target = [...document.querySelectorAll('.mdl-layout__tab')].find(el => {
    return !el.classList.contains('is-active')
  })
  target.click();
})
