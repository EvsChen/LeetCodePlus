import {$$} from './util/helper';
import {BUTTON_CLASS} from './util/constants';

const SELECTOR = {
  SIDEBAR: '.side-bar-list',
  DIFFICULTY_LABEL: '[class^=\'difficulty\']',
  SUBMISSION: '[class^=\'submission\']',
};

const BUTTON_ID = 'hider-button';

export function initHider(nodeToAppend, ifHide) {
  if (!nodeToAppend) {
    return;
  }
  const buttonDiv = document.createElement('div');
  buttonDiv.className = BUTTON_CLASS;
  buttonDiv.innerText = ifHide ? 'Show Difficulty' : 'Hide Difficulty';
  buttonDiv.onclick = toggleDifficulty;
  buttonDiv.id = BUTTON_ID;
  nodeToAppend.appendChild(buttonDiv);
  if (ifHide) {
    toggleDifficulty();
  }
}

function toggleDifficulty() {
  // change to more robust structure
  if (!$$(SELECTOR.DIFFICULTY_LABEL)) {
    return;
  }
  const difficultyLabel = $$(SELECTOR.DIFFICULTY_LABEL);
  const hide = difficultyLabel.style.visibility === 'hidden';
  difficultyLabel.style.visibility = hide ? 'visible' : 'hidden';
  const submissionChildren = $$(SELECTOR.SUBMISSION).children;
  Array.from(submissionChildren).forEach((node) => {
    node.style.visibility = hide ? 'visible' : 'hidden';
  });
  document.getElementById(BUTTON_ID).innerText = hide ? 'Hide Difficulty' : 'Show Difficulty';
}
