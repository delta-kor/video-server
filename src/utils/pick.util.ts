function pickItem<T>(set: Set<T>): T {
  const items = Array.from(set);
  const picked = items[Math.floor(Math.random() * items.length)];
  set.delete(picked);
  return picked;
}

export default pickItem;
