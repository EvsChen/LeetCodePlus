const SELECTOR = {
  TITLE: 'h1',
  LANG_SELECT: '[class^=\'select\']',
  PROBLEM_SET_LABEL: 'td .label',
  EDITOR: '.CodeMirror',
};

const BUTTON_CLASS = 'LCP_button';

const AUTO_COMPLETE_ID = 'auto-complete';
const KEY = {
  ARROW_DOWN: 'ArrowDown',
  ARROW_UP: 'ArrowUp',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_LEFT: 'ArrowLeft',
  BACKSPACE: 'Backspace',
  ESCAPE: 'Escape',
  ENTER: 'Enter',
  SPACE: ' ',
  TAB: 'Tab',
};
const STORAGE_PREFIX = 'LEETCODEPLUS_';
const OPTION_PREFIX = 'LCPOPTION_';
const OPTIONS_KEYS = {
  HIDE_DIFFICULTY: `${OPTION_PREFIX}hideDifficulty`,
  SHOW_TIMER: `${OPTION_PREFIX}showTimer`,
  SHOW_BEST: `${OPTION_PREFIX}showBest`,
  SHOW_MD: `${OPTION_PREFIX}showMd`,
  AUTO_COMPLETE: `${OPTION_PREFIX}autoComplete`,
};

const MIN_ENTRY_LENGTH = 3;
const AUTO_COMPLETE_START = 1;

const CLASS = {
  SELECTED_SUGGESTION_ITEM: 'selected',
};

const INIT_OPTIONS = {
  [OPTIONS_KEYS.HIDE_DIFFICULTY]: true,
  [OPTIONS_KEYS.SHOW_TIMER]: true,
  [OPTIONS_KEYS.SHOW_BEST]: true,
  [OPTIONS_KEYS.SHOW_MD]: true,
  [OPTIONS_KEYS.AUTO_COMPLETE]: true,
};

export {
  SELECTOR, AUTO_COMPLETE_ID, KEY, BUTTON_CLASS,
  STORAGE_PREFIX, OPTION_PREFIX, OPTIONS_KEYS, INIT_OPTIONS,
  MIN_ENTRY_LENGTH, AUTO_COMPLETE_START,
  CLASS,
};
