import { STORAGE_PREFIX, OPTION_PREFIX, KEY } from './constants';

const pad2Left = str => `0${str}`.slice(-2);

const strToSeconds = str => {
  const [min, second] = str.split(':');
  return parseInt(min, 10) * 60 + parseInt(second, 10);
};

const secondsToStr = secondsInNumber => {
  const second = secondsInNumber % 60;
  const min = (secondsInNumber - second) / 60;
  return `${pad2Left(min)}:${pad2Left(second)}`;
};

const $$ = sel => document.querySelector(sel);

const $new = nodeName => document.createElement(nodeName);

const addPrefix = str => `${STORAGE_PREFIX}${str}`;

const addOptionPrefix = str => `${OPTION_PREFIX}${str}`;

const trimPrefix = str => {
  if (!str.startsWith(STORAGE_PREFIX)) return str;
  return str.slice(STORAGE_PREFIX.length);
}

const isNumberLetter = str => /^[a-z1-9A-Z]$/.test(str);

const isFunctionKey = key => {
  const functionKey = {
    [KEY.ENTER]: true,
    [KEY.TAB]: true,
    [KEY.ESCAPE]: true,
    [KEY.ARROW_UP]: true,
    [KEY.ARROW_DOWN]: true
  };
  return !!functionKey[key];
}

/**
 * build problem url from dashed name
 * @param {string} dashedName - dashed name of the problem
 */
const buildUrlFromName = dashedName => `https://leetcode.com/problems/${dashedName}/description/`;

const execPageScript = filepath => {
  const s = document.createElement('script');
  s.src = chrome.extension.getURL(filepath);
  s.onload = function() {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(s);
}

export {
  pad2Left, strToSeconds, secondsToStr,
  addPrefix, trimPrefix, buildUrlFromName,
  addOptionPrefix, isNumberLetter, isEditKey, isFunctionKey,
  execPageScript,
  $$, $new
};