const SELECTOR = {
  TITLE: '.question-title h3',
  LANG_SELECT: '.language-select-wrapper',
  SIDEBAR: '.side-bar-list',
  DIFFICULTY_LABEL: '.difficulty-label',
  TOTAL_ACCEPTED: '.side-bar-list li:nth-of-type(2) span.pull-right',
  TOTAL_SUBMISSIONS: '.side-bar-list li:nth-of-type(3) span.pull-right',
  EDITOR: '.CodeMirror'
};
const TIMER_ID = 'timer';
const AUTO_COMPLETE_ID = 'auto-complete';
const KEY = {
  BACKSPACE: 'Backspace'
};
const STORAGE_PREFIX = 'LEETCODEPLUS_';
const SUBMIT_RESULT_STATE = {
  ACCEPTED: 'Accepted',
  PENDING: 'Pending',
  JUDGING: 'Judging'
};

export { 
  SELECTOR, TIMER_ID, AUTO_COMPLETE_ID, KEY, STORAGE_PREFIX,
  SUBMIT_RESULT_STATE
};