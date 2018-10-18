import { pad2Left, getProblemStorageKey, strToSeconds, getRecordObject, setRecordObject, $$ } from './util/helper';

const TIMER_ID = 'timer';
const RESULT_SELECTOR = "[class^='result'] [class^='result']";

/**
 * @param {DOMNode} nodeToAppend - the node element to append to
 * @param {string} [id = 'timer'] - id of the timer
 */
function initTimer(nodeToAppend, id = TIMER_ID) {
  if (!nodeToAppend) { return; }
  const timer = document.createElement('span');
  timer.innerText = '00:00';
  timer.id = id;
  nodeToAppend.appendChild(timer);
  const timerInterval = runTimer();
  registerDataSaver(timerInterval);
  return timerInterval;
}

function runTimer() {
  const interval = setInterval(() => {
    const timer = document.getElementById(TIMER_ID);
    if (!timer) {
      // can't find timer due to some reason;
      clearInterval(interval);
      
    }
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
  return interval;
}

function registerDataSaver(timerInterval) {
  const submitButton = document.querySelectorAll("[class^='action'] button")[1];
  if (!submitButton) { return; }
  submitButton.onclick = () => {
    new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        const result = $$(RESULT_SELECTOR);
        if (result) {
          resolve(result.innerText);
          clearInterval(interval);
        }
      }, 500);
    })
      .then(resultState => {
        if (resultState.startsWith('Success')) {
          const finishTime = strToSeconds(document.getElementById(TIMER_ID).innerText);
          console.log(`finish time is ${finishTime}`);
          clearInterval(timerInterval);
          const index = getProblemStorageKey();
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
      });
  }
}

export { initTimer };