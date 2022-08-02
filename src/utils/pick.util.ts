function pickFromSetAndDelete<T>(data: Set<T>): T {
  const items = Array.from(data);
  const picked = items[Math.floor(Math.random() * items.length)];
  data.delete(picked);
  return picked;
}

function pickFromArray<T>(data: T[]): T {
  return data[Math.floor(Math.random() * data.length)];
}

export { pickFromSetAndDelete, pickFromArray };
