import {
  secondsToStr, $$, getProblemStorageKey,
  execPageScript, getDefaultOptions, getRecordObject,
} from './util/helper';
import {SELECTOR, OPTIONS_KEYS} from './util/constants';
import {initMarkdownGenerator} from './markdown';
import {initHider} from './difficlutyHider';
import {initTimer} from './timer';
import './styles/problem.css';

// CONST
const RECORD_ID = 'timer-record';
const TOOLBAR_CLASS = 'toolbar';

/**
 * @param {DOMElement} nodeToAppend
 */
function initRecord(nodeToAppend) {
  const problemIndex = getProblemStorageKey();
  getRecordObject(problemIndex).then((record) => {
    if (record && record.best) {
      const recordNode = document.createElement('span');
      recordNode.innerText = `Best: ${secondsToStr(record.best)}`;
      recordNode.id = RECORD_ID;
      nodeToAppend.appendChild(recordNode);
    }
  });
}

/**
 * @param {DOMElement} afterTarget
 */
function init(afterTarget) {
  const editor = $$(SELECTOR.EDITOR);
  const CodeMirror = editor.CodeMirror;
  const toolBarDiv = document.createElement('div');
  toolBarDiv.className = TOOLBAR_CLASS;
  afterTarget.after(toolBarDiv);
  getDefaultOptions()
      .then((options) => {
        const {SHOW_BEST, SHOW_MD, SHOW_TIMER, HIDE_DIFFICULTY, AUTO_COMPLETE}
            = OPTIONS_KEYS;
        initHider(toolBarDiv, options[HIDE_DIFFICULTY]);
        if (options[SHOW_MD]) {
          initMarkdownGenerator(CodeMirror, toolBarDiv);
        }
        if (options[SHOW_TIMER]) {
          initTimer(toolBarDiv);
        }
        if (options[SHOW_BEST]) {
          initRecord(toolBarDiv);
        }
        if (options[AUTO_COMPLETE]) {
          execPageScript('editorEvent.js');
        }
      });
}

const main = () => {
  const mainInterval = setInterval(() => {
    const afterTarget = $$(SELECTOR.LANG_SELECT);
    if (afterTarget) {
      clearInterval(mainInterval);
      init(afterTarget);
    }
  }, 500);
};

main();
