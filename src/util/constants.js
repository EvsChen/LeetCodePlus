const SELECTOR = {
  TITLE: '.question-title h3',
  LANG_SELECT: '.language-select-wrapper',
  SIDEBAR: '.side-bar-list',
  DIFFICULTY_LABEL: '.difficulty-label',
  PROBLEM_SET_LABEL: 'td .label',
  TOTAL_ACCEPTED: '.side-bar-list li:nth-of-type(2) span.pull-right',
  TOTAL_SUBMISSIONS: '.side-bar-list li:nth-of-type(3) span.pull-right',
  EDITOR: '.CodeMirror'
};
const TIMER_ID = 'timer';
const AUTO_COMPLETE_ID = 'auto-complete';
const KEY = {
  ARROW_DOWN: 'ArrowDown',
  ARROW_UP: 'ArrowUp',
  BACKSPACE: 'Backspace',
  ESCAPE: 'Escape',
  ENTER: 'Enter',
  SPACE: ' ',
  TAB: 'Tab'
};
const STORAGE_PREFIX = 'LEETCODEPLUS_';
const OPTION_PREFIX = 'LCPOPTION_';
const SUBMIT_RESULT_STATE = {
  ACCEPTED: 'Accepted',
  PENDING: 'Pending',
  JUDGING: 'Judging'
};
const OPTIONS_KEYS = {
  HIDE_DIFFICULTY: `${OPTION_PREFIX}hideDifficulty`,
  SHOW_TIMER: `${OPTION_PREFIX}showTimer`,
  SHOW_BEST: `${OPTION_PREFIX}showBest`,
  SHOW_MD: `${OPTION_PREFIX}showMd`,
  AUTO_COMPLETE: `${OPTION_PREFIX}autoComplete`
};

const EDITOR_MODES = {
  JAVASCRIPT: 'text/javascript',
  PYTHON: 'text/x-python',
  JAVA: 'text/x-java',
  CPP: 'text/x-c++src'
};

const TOKEN_TYPE = {
  KEYWORD: 'keyword',
  // def in js
  DEF: 'def',
  // variable in cpp
  VARIABLE: 'variable',
  OPERATOR: 'operator',
  PROPERTY: 'property'
};

const MIN_ENTRY_LENGTH = 3;
const AUTO_COMPLETE_START = 2;

const CLASS = {
  SELECTED_SUGGESTION_ITEM: 'selected'
};

const INIT_OPTIONS = {
  [OPTIONS_KEYS.HIDE_DIFFICULTY]: true,
  [OPTIONS_KEYS.SHOW_TIMER]: true,
  [OPTIONS_KEYS.SHOW_BEST]: true,
  [OPTIONS_KEYS.SHOW_MD]: true,
  [OPTIONS_KEYS.AUTO_COMPLETE]: true
};

export { 
  SELECTOR, TIMER_ID, AUTO_COMPLETE_ID, KEY,
  STORAGE_PREFIX, OPTION_PREFIX, OPTIONS_KEYS, INIT_OPTIONS,
  SUBMIT_RESULT_STATE,
  TOKEN_TYPE, EDITOR_MODES, MIN_ENTRY_LENGTH, AUTO_COMPLETE_START,
  CLASS
};