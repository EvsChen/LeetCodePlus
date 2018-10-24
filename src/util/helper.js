import {STORAGE_PREFIX, OPTION_PREFIX, KEY, OPTIONS_KEYS} from './constants';

const pad2Left = (str) => str.length > 2 ? str : `0${str}`.slice(-2);

const strToSeconds = (str) => {
  const [min, second] = str.split(':');
  return parseInt(min, 10) * 60 + parseInt(second, 10);
};

const secondsToStr = (secondsInNumber) => {
  const second = secondsInNumber % 60;
  const min = (secondsInNumber - second) / 60;
  return `${pad2Left(min)}:${pad2Left(second)}`;
};

const $$ = (sel) => document.querySelector(sel);

const $new = (nodeName) => document.createElement(nodeName);

const addPrefix = (str) => `${STORAGE_PREFIX}${str}`;

const addOptionPrefix = (str) => `${OPTION_PREFIX}${str}`;

const trimPrefix = (str) => {
  if (!str.startsWith(STORAGE_PREFIX)) return str;
  return str.slice(STORAGE_PREFIX.length);
};

const isNumberLetter = (str) => /^[a-z1-9A-Z]$/.test(str);

const isAllowedInVariable = (char) => {
  return !/[\s;\.,\\/]/.test(char);
};

const isFunctionKey = (key) => {
  const functionKey = {
    [KEY.ENTER]: true,
    [KEY.TAB]: true,
    [KEY.ESCAPE]: true,
    [KEY.ARROW_UP]: true,
    [KEY.ARROW_DOWN]: true,
  };
  return !!functionKey[key];
};

/**
 * build problem url from dashed name
 * @param {string} dashedName - dashed name of the problem
 */
const buildUrlFromName = (dashedName) => `https://leetcode.com/problems/${dashedName}/description/`;

const execPageScript = (filepath) => {
  const s = document.createElement('script');
  s.src = chrome.extension.getURL(filepath);
  s.onload = function() {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(s);
};


/**
 * Get the problem object from chrome sync storage
 * @param {string} key - storage key for the problem
 * @return {Promise} promise of the object retrieval
 */
const getRecordObject = (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(key, (res) => {
      resolve(res[key]);
    });
  });
};

const setRecordObject = (index, object) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(
        {[index]: object},
        () => {
          resolve();
          console.log(`Record for ${index} has been updated`);
        });
  });
};

/**
 * Get the dashed name of the problem
 * @return {string} dashedName: tree-inorder-traversal
 */
const getDashedProblemName = () => {
  const problemUrl = window.location.toString();
  return problemUrl.split('/').filter((str) => str.indexOf('-') !== -1)[0];
};

const getProblemStorageKey = () => addPrefix(getDashedProblemName());

/**
 * Get the options the user set in option page
 * @return {Object} defaultOptions
 */
function getDefaultOptions() {
  const {SHOW_BEST, SHOW_MD, SHOW_TIMER, HIDE_DIFFICULTY, AUTO_COMPLETE} = OPTIONS_KEYS;
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(
        [SHOW_BEST, SHOW_MD, SHOW_TIMER, HIDE_DIFFICULTY, AUTO_COMPLETE],
        (res) => resolve(res)
    );
  });
}

export {
  pad2Left, strToSeconds, secondsToStr,
  addPrefix, trimPrefix, buildUrlFromName, getDashedProblemName, getProblemStorageKey,
  addOptionPrefix, isNumberLetter, isFunctionKey, isAllowedInVariable,
  execPageScript, getDefaultOptions, getRecordObject, setRecordObject,
  $$, $new,
};
