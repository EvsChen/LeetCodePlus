import './styles/options.css';
import { secondsToStr, trimPrefix, buildUrlFromName, addPrefix } from './helper';

function appendRow(target, key, best) {
  const node = document.createElement('tr');
  node.className = 'storage-row';
  const dashedName = trimPrefix(key);
  const url = buildUrlFromName(dashedName);
  node.innerHTML = `
    <td class="index">
      <a href="${url}" target="_blank">${dashedName}</a>
    </td>
    <td class="time">${secondsToStr(best)}</td>
    <td class="action">
      <button id="${dashedName}">Delete</button>
    </td> 
  `;
  target.appendChild(node);
}

function clearTable() {
  document.getElementById('storage').innerHTML = '';
}

function buildTable() {
  const storageTable = document.getElementById('storage');
  chrome.storage.sync.get(null, res => {
    for (let key in res) {
      if (key.startsWith('LEETCODEPLUS')) {
        const best = res[key].best;
        appendRow(storageTable, key, best);
      }
    }
  });
}

buildTable();

// event delegator
document.getElementById('storage').onclick = evt => {
  const target = evt.target;
  if (target.nodeName === 'BUTTON') {
    // tr -> td -> button
    const index = addPrefix(target.id);
    chrome.storage.sync.remove(index, () => {
      clearTable();
      buildTable();
    });
  }
}

