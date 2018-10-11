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

export default {
  pad2Left, strToSeconds, secondsToStr
};