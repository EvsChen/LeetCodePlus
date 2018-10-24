import React from 'react';
import {getProblemStorageKey, getRecordObject, setRecordObject, $$, pad2Left}
  from '../util/helper';
import {BUTTON_CLASS} from '../util/constants';

const RESULT_SELECTOR = `[class^='result'] [class^='result']`;
const TIMER_ID = 'timer';

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      min: 0,
      sec: 0,
      paused: false,
    };
  }

  componentDidMount() {
    this.startInterval();
    this.registerDataSaver();
  }

  startInterval() {
    const timerInterval = setInterval(() => {
      let {min, sec} = this.state;
      if (sec === 59) {
        sec = 0;
        min++;
      } else sec++;
      this.setState({sec, min});
    }, 1000);
    this.setState({timerInterval});
  }

  stopInterval() {
    clearInterval(this.state.timerInterval);
    this.setState({timerInterval: null});
  }

  registerDataSaver() {
    const submitButton = document.querySelectorAll(
        `[class^='action'] button`)[1];
    if (!submitButton) return;
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
          .then((resultState) => {
            const {min, sec, timerInterval} = this.state;
            if (resultState.startsWith('Success')) {
              const finishTime = min * 60 + sec;
              clearInterval(timerInterval);
              const index = getProblemStorageKey();
              getRecordObject(index)
                  .then((record) => {
                    if (record && record.best > finishTime) {
                      record.best = finishTime;
                      setRecordObject(index, record);
                    } else setRecordObject(index, {best: finishTime});
                  });
            }
          });
    };
  }

  togglePause = () => {
    const paused = this.state.paused;
    paused ? this.startInterval() : this.stopInterval();
    this.setState({paused: !paused});
  }

  render() {
    const {min, sec, paused} = this.state;
    // <div className={BUTTON_CLASS}>&#9724;</div>
    return (
      <React.Fragment>
        <span id={TIMER_ID}> {pad2Left(min)}:{pad2Left(sec)}</span>
        <div
          className={BUTTON_CLASS}
          id="timer-toggle"
          onClick={this.togglePause}
        >
          {paused ? '\u25BA' : '\u2759\u2759'}
        </div>
      </React.Fragment>
    );
  }
}

export default Timer;
