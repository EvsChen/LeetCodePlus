// CONST
const SUBMIT_RESULT_STATE = {
  ACCEPTED: 'Accepted',
  PENDING: 'Pending',
  JUDGING: 'Judging'
};

const TIMER_ID = 'timer';

// utility
const getProblemIndex = () => {
  const index = document.querySelector('.question-title h3').innerText.split('.')[0];
  return `LEETCODEPLUS_${index}`;
}

const getRecordObject = index => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(index, res => {
      console.log(res);
      resolve(res[index]);
    });
  })  
};

const setRecordObject = (index, object) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(
      { [index]: object }, 
      () => {
        resolve();
        console.log(`Record for ${index} has been updated`)
    });  
  });
};

const pad2Left = str => `0${str}`.slice(-2);

const strToSeconds = str => {
  const [min, second] = str.split(':');
  return parseInt(min, 10) * 60 + parseInt(second, 10);
};

const secondsToStr = secondsInNumber => {
  const second = secondsInNumber % 60;
  const min = (secondsInNumber - second) / 60;
  return `${pad2Left(min)}:${pad2Left(second)}`;
}

// main 
/**
 * @param {DOMNode} nodeToAfter - the node element to append to
 * @param {string} [id = 'timer'] - id of the timer
 */
function initTimer(nodeToAfter, id = TIMER_ID) {
  const timer = document.createElement('span');
  timer.innerText = '00:00';
  timer.id = id;
  const problemIndex = getProblemIndex();
  getRecordObject(problemIndex).then(record => {
      if (record && record.best) {
      const recordNode = document.createElement('span');
      recordNode.innerText = `Best: ${secondsToStr(record.best)}`;
      recordNode.style.color = 'green';
      recordNode.style.marginLeft = '10px';
      nodeToAfter.after(recordNode);
      nodeToAfter.after(timer);
    }
    else {
      nodeToAfter.after(timer);
    }
  });
}

function runTimer() {
  return setInterval(() => {
    const timer = document.getElementById('timer');
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
}

function registerDataSaver(timerInterval) {
  const submitButton = document.querySelectorAll('.action button')[1];
  if (submitButton) {
    submitButton.onclick = () => {
      checkSubmitResult()
        .then(resultState => {
          if (resultState === SUBMIT_RESULT_STATE.ACCEPTED) {
            const finishTime = strToSeconds(document.getElementById('timer').innerText);
            console.log(`finish time is ${finishTime}`);
            clearInterval(timerInterval);
            const index = getProblemIndex();
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
        })
    }
  }
}

function checkSubmitResult() {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const result = document.getElementById('result-state');
      if (result.innerText !== SUBMIT_RESULT_STATE.PENDING && result.innerText !== SUBMIT_RESULT_STATE.JUDGING) {
        resolve(result.innerText);
        clearInterval(interval);
      }
    }, 500);
  });
}

const mainInterval = setInterval(() => {
  const title = document.querySelector('.question-title h3');
  if (title) {
    clearInterval(mainInterval);
    initTimer(title);
    const timerInterval = runTimer();
    registerDataSaver(timerInterval);
  }
}, 500);