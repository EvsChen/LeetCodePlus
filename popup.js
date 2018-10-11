let hideInfo = document.getElementById('hideInfo');
let showTimer = document.getElementById('showTimer');

const SELECTOR = {
  DIFFICULTY_LABEL: '.difficulty-label',
  TOTAL_ACCEPTED: '.side-bar-list li:nth-child(3) span.pull-right',
  TOTAL_SUBMISSIONS: '.side-bar-list li:nth-child(4) span.pull-right'
};

const TIMER_ID = 'timer';

chrome.storage.sync.get('color', function(data) {
  // changeColor.style.backgroundColor = data.color;
  // changeColor.setAttribute('value', data.color);
});

function buildDisplayDOMCode(style) {
  // TODO: need better selector for submission number
  return `
    document.querySelector('${SELECTOR.DIFFICULTY_LABEL}').style.display = '${style}';
    document.querySelector('${SELECTOR.TOTAL_ACCEPTED}').style.display = '${style}';
    document.querySelector('${SELECTOR.TOTAL_SUBMISSIONS}').style.display = '${style}';
  `;
}

function setTimerFontSize(fontSize) {
  return `
    document.getElementById('${TIMER_ID}').style.fontSize = '${fontSize}px'
  `;
}

function executeInCurrentTab(code) {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.tabs.executeScript(tabs[0].id, { code });
  });
}

showTimer.addEventListener('change', evt => {
  const ifShow = evt.target.checked;
  const code = setTimerFontSize(ifShow ? 14 : 0);
  executeInCurrentTab(code);
})

hideInfo.addEventListener('change', evt => {
  const ifHide = evt.target.checked;
  const code = buildDisplayDOMCode(ifHide ? 'none' : 'block');
  executeInCurrentTab(code);
});
