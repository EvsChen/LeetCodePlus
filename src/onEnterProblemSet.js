import {OPTIONS_KEYS} from './util/constants';
import {getDefaultOptions} from './util/helper';

const mainInterval = setInterval(() => {
  const ths = document.querySelectorAll('th');
  if (ths.length > 0) {
    clearInterval(mainInterval);
    getDefaultOptions()
        .then((options) => {
          if (options[OPTIONS_KEYS.HIDE_DIFFICULTY]) {
            Array.from(document.querySelectorAll('th')).forEach((th, index) => {
              const text = th.innerText.toLowerCase().trim();
              if (text === 'acceptance' || text === 'difficulty') {
                document.styleSheets[0].insertRule(
                    `tr td:nth-of-type(${index + 1}) {font-size: 0}`
                );
              }
            });
          }
        });
  }
}, 500);
