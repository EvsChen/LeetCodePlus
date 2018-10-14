import { INIT_OPTIONS } from './util/constants';

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set(INIT_OPTIONS);
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              hostContains: 'leetcode',
              pathContains: 'problems'
            },
        })],
        actions: [
          new chrome.declarativeContent.ShowPageAction()
        ]
      }
    ]);
  });
});