interface Timemap<T> {
  [key: number]: T;
}

function getCurrentTimeItem<T>(timemap: Timemap<T>, current: number): T {
  const keys = Object.keys(timemap).map(Number);
  const index = keys.findIndex(key => key > current);

  const closestKey = index === -1 ? keys[keys.length - 1] : keys[index - 1];

  return timemap[closestKey];
}

export default getCurrentTimeItem;
