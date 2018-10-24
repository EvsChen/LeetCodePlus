import React from 'react';
import ReactDOM from 'react-dom';

import {$new} from './util/helper';
import Timer from './components/Timer';

const TIMER_ID = 'timer';
const TIMERBOX_ID = 'timerbox';

/**
 * @param {DOMNode} nodeToAppend - the node element to append to
 * @param {string} [id = 'timer'] - id of the timer
 * @return {void}
 */
function initTimer(nodeToAppend, id = TIMER_ID) {
  if (!nodeToAppend) return;
  const timerBox = $new('div');
  timerBox.id = TIMERBOX_ID;
  nodeToAppend.appendChild(timerBox);
  ReactDOM.render(
      React.createElement(Timer),
      document.getElementById(TIMERBOX_ID)
  );
}

export {initTimer};
