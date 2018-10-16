import TurndownService from 'turndown';

import {
  pad2Left, strToSeconds, secondsToStr, $$, addPrefix,
  execPageScript, getDefaultOptions, getRecordObject, setRecordObject
} from './util/helper';
import { SELECTOR, TIMER_ID, SUBMIT_RESULT_STATE, OPTIONS_KEYS } from './util/constants';
import './styles/problem.css';

const turndownService = new TurndownService();
// the html tags that the md parser will keep unchanged
turndownService.keep(['pre']);
// turndownService.addRule('codeblock', {
//   filter: ['pre'],
//   replacement: content => `
//   <pre><code>
//     ${content}
//   </code></pre>
//   `
// });

// CONST
const RECORD_ID = 'timer-record';
const MARKDOWN_GEN_ID = 'markdown-gen';
const BUTTON_CLASS = 'LCP_button';
const TOOLBAR_CLASS = 'toolbar';
const HIDER_CONTAINER_CLASS = 'hider-container';

// utility
/**
 * Get the dashed name of the problem
 * @returns {string} dashedName: tree-inorder-traversal
 */
const getDashedProblemName = () => {
  const problemUrl = window.location.toString();
  return problemUrl.split('/').filter(str => str.indexOf('-') !== -1)[0];
};

/**
 * Get the storage key for the problem
 */
const getProblemIndex = () => {
  // const index = document.querySelector('.question-title h3').innerText.split('.')[0];
  return addPrefix(getDashedProblemName());
};

// main 
/**
 * @param {DOMNode} nodeToAppend - the node element to append to
 * @param {string} [id = 'timer'] - id of the timer
 */
function initTimer(nodeToAppend, id = TIMER_ID) {
  const timer = document.createElement('span');
  timer.innerText = '00:00';
  timer.id = id;
  nodeToAppend.appendChild(timer);
}

function initRecord(nodeToAppend) {
  const problemIndex = getProblemIndex();
  getRecordObject(problemIndex).then(record => {
    if (record && record.best) {
      const recordNode = document.createElement('span');
      recordNode.innerText = `Best: ${secondsToStr(record.best)}`;
      recordNode.id = RECORD_ID;
      nodeToAppend.appendChild(recordNode);
    }
  });
}

function runTimer() {
  return setInterval(() => {
    const timer = document.getElementById('timer');
    let [min, second] = timer.innerText.split(':');
    if (second < 59) {
      second = parseInt(second, 10) + 1;
    }
    else {
      min = parseInt(min, 10) + 1;
      second = '00';
    }
    timer.innerText = `${pad2Left(min)}:${pad2Left(second)}`;
  }, 1000);
}

function registerDataSaver(timerInterval) {
  const submitButton = document.querySelectorAll('.action button')[1];
  if (submitButton) {
    submitButton.onclick = () => {
      checkSubmitResult()
        .then(resultState => {
          if (resultState === SUBMIT_RESULT_STATE.ACCEPTED) {
            const finishTime = strToSeconds(document.getElementById('timer').innerText);
            console.log(`finish time is ${finishTime}`);
            clearInterval(timerInterval);
            const index = getProblemIndex();
            getRecordObject(index)
              .then(record => {
                if (record && record.best > finishTime) {
                  record.best = finishTime;
                  setRecordObject(index, record);
                }
                else {
                  setRecordObject(index, { best: finishTime });
                }
              });
          }
        })
    }
  }
}

function checkSubmitResult() {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const result = document.getElementById('result-state');
      if (result && 
          result.innerText !== SUBMIT_RESULT_STATE.PENDING && 
          result.innerText !== SUBMIT_RESULT_STATE.JUDGING) {
        resolve(result.innerText);
        clearInterval(interval);
      }
    }, 500);
  });
}

/**
 * @param {DOMNode} nodeToAppend the DOM node to append the generator button
 */
function initMarkdownGenerator(nodeToAppend) {
  const button = document.createElement('button')
  button.innerText = 'Markdown ⤓';
  button.id = MARKDOWN_GEN_ID;
  button.className = BUTTON_CLASS;
  button.onclick = generateMarkdown;
  nodeToAppend.appendChild(button);
}

/**
 * @param {string} filename - the downloaded file name
 * @param {string} md - the complete md doc in string
 */
function donwloadMD(filename, md) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(md));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

/**
 * generate the markdown string 
 * @returns {string} res - the complete md doc in string
 */
function generateMarkdown() {
  const title = document.querySelector(SELECTOR.TITLE);
  const problemUrl = window.location.toString();
  const problemDesc = document.querySelector("div[class^='question-description']");
  const lang = document.querySelector('.Select-value').innerText;
  const descInMd = turndownService.turndown(problemDesc);
  const solutionInMd = generateSolutionMd(lang);
  let res = `
  # [${title.innerText}](${problemUrl})

  ${descInMd}

  Solution in ${lang}:
  ${solutionInMd}
  `;
  donwloadMD(`${getDashedProblemName()}.md`, res);
  return res;
}

/**
 * build the solution string in md
 * @param {string} lang - language name of the solution, e.g. 'JavaScript'
 */
function generateSolutionMd(lang) {
  const lines = document.getElementsByClassName('CodeMirror-line');
  let res = '';
  Array.from(lines).forEach(node => {
    // handle unexpected red point
    const text = String.fromCodePoint(
      ...node.innerText.split('').map(c => c.codePointAt(0) === 160 ? 32 : c.codePointAt(0))
    );
    res = 
    `${res}
    ${text}`;
  });
  res = `
  \`\`\`\`${lang.toLowerCase()}
  ${res}
  \`\`\`\`
  `;
  return res;
}

function initHider(ifHide) {
  if (ifHide) {
    toggleDifficulty();
  }
  const sidebar = document.querySelector(SELECTOR.SIDEBAR);
  const sidebarItem = document.querySelector(`${SELECTOR.SIDEBAR} li`);
  const buttonDiv = document.createElement('div');
  const width = sidebarItem.offsetWidth;
  const height = sidebarItem.offsetHeight;
  buttonDiv.className = HIDER_CONTAINER_CLASS;
  buttonDiv.style.width = `${width}px`;
  buttonDiv.style.height = `${3 * height}px`;
  buttonDiv.style.lineHeight = `${3 * height}px`;
  buttonDiv.innerText = 'Show/Hide Difficulty';
  buttonDiv.onclick = toggleDifficulty;
  sidebar.prepend(buttonDiv);
}

function toggleDifficulty() {
  const style = $$(SELECTOR.DIFFICULTY_LABEL).style.display === 'none' ? 'block' : 'none';
  $$(SELECTOR.DIFFICULTY_LABEL).style.display = style;
  $$(SELECTOR.TOTAL_ACCEPTED).style.display = style;
  $$(SELECTOR.TOTAL_SUBMISSIONS).style.display = style;
}

function init(afterTarget) {
  const toolBarDiv = document.createElement('div');
  toolBarDiv.className = TOOLBAR_CLASS;
  afterTarget.after(toolBarDiv);
  getDefaultOptions()
    .then(options => {
      const { SHOW_BEST, SHOW_MD, SHOW_TIMER, HIDE_DIFFICULTY, AUTO_COMPLETE } = OPTIONS_KEYS;
      initHider(options[HIDE_DIFFICULTY]);
      if (options[SHOW_MD]) {
        initMarkdownGenerator(toolBarDiv);
      }
      if (options[SHOW_TIMER]) {
        initTimer(toolBarDiv);
        const timerInterval = runTimer();
        registerDataSaver(timerInterval);
      }
      if (options[SHOW_BEST]) {
        initRecord(toolBarDiv);
      }
      if (options[AUTO_COMPLETE]) {
        execPageScript('editorEvent.js');
      }
    });
}

const mainInterval = setInterval(() => {
  const afterTarget = $$(SELECTOR.LANG_SELECT);
  if (afterTarget) {
    clearInterval(mainInterval);
    init(afterTarget);
  }
}, 500);