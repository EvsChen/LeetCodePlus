import { TIMER_ID } from './constants';
import './styles/popup.css';

const TIMER_FONT_SIZE = 14;

chrome.storage.sync.get('color', function(data) {
  // changeColor.style.backgroundColor = data.color;
  // changeColor.setAttribute('value', data.color);
});

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

const showTimer = document.getElementById('showTimer');
showTimer.addEventListener('change', evt => {
  const ifShow = evt.target.checked;
  const code = setTimerFontSize(ifShow ? TIMER_FONT_SIZE : 0);
  executeInCurrentTab(code);
});

const optionLink = document.getElementById('option-link');
optionLink.onclick = () => chrome.runtime.openOptionsPage();


