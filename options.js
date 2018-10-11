const pad2Left = str => `0${str}`.slice(-2);

const secondsToStr = secondsInNumber => {
  const second = secondsInNumber % 60;
  const min = (secondsInNumber - second) / 60;
  return `${pad2Left(min)}:${pad2Left(second)}`;
};

function appendRow(target, index, best) {
  const node = document.createElement('tr');
  node.className = 'storage-row';
  node.innerHTML = `
    <td class="index">${index}</td>
    <td class="time">${secondsToStr(best)}</td>
    <td class="action">
      <button>Delete</button>
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
      if (key.startsWith('LEETCODE')) {
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
    const index = target.parentElement.querySelector('.index').innerText;
    chrome.storage.sync.remove(index, () => {
      clearTable();
      buildTable();
    });
  }
}

