function pickItem<T>(data: Set<T>): T {
  const items = Array.from(data);
  const picked = items[Math.floor(Math.random() * items.length)];
  data.delete(picked);
  return picked;
}

export default pickItem;
