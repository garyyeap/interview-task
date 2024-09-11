export const formatedTimeToSeconds = (function () {
  const cachedTime = {};

  return function (time) {
    if (cachedTime[time]) return cachedTime[time];

    const [hours, minutes, seconds] = time.split(':').map(Number);
    cachedTime[time] = hours * 3600 + minutes * 60 + seconds;

    return cachedTime[time];
  }
})();  

  