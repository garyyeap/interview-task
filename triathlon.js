export const isValidTotalTime = (timeInSeconds) => {
  const maxTotalTime = 17 * 3600; // 17 hours
  const minTotalTime = 60 * 60; // 60 mins

  return timeInSeconds >= minTotalTime && timeInSeconds <= maxTotalTime;
};

export const isValidBikeTime = (timeInSeconds) => {
  const minTotalTime = 24 * 60; // 24 mins
  const maxTotalTime = 10.5 * 3600; // 10 hours 30 mins

  return timeInSeconds >= minTotalTime && timeInSeconds <= maxTotalTime;
};

export const isValidRunTime = (timeInSeconds) => { 
  const minTotalTime = 14 * 60; // 14 mins
  const maxTotalTime = 6.5 * 3600; // 6 hours 30 mins

  return timeInSeconds >= minTotalTime && timeInSeconds <= maxTotalTime;
};

export const isValidSwimTime = (timeInSeconds)  =>{
  const minTotalTime = 8 * 60; // 8 mins
  const maxTotalTime = 2 * 3600 + 20 * 60; // 2 hours 20 mins

  return timeInSeconds >= minTotalTime && timeInSeconds <= maxTotalTime;
};