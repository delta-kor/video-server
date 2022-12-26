class ArrayMap<K, V> {
  private map: Map<K, Set<V>>;

  constructor() {
    this.map = new Map();
  }

  public add(key: K, value: V): this {
    if (!this.map.has(key)) this.map.set(key, new Set());
    this.map.get(key)!.add(value);

    return this;
  }

  public delete(key: K, value: V): this {
    if (this.map.has(key)) this.map.get(key)!.delete(value);

    return this;
  }

  public remove(key: K): this {
    this.map.delete(key);

    return this;
  }

  public total(): number {
    return this.map.size;
  }

  public size(key: K): number {
    const set = this.map.get(key);
    if (!set) return 0;
    return set.size;
  }

  public get(key: K): V[] | undefined {
    const set = this.map.get(key);
    if (!set) return undefined;

    return [...set];
  }

  public getAll(): [K, V[]][] {
    const result: [K, V[]][] = [];
    this.map.forEach((value, key) => result.push([key, [...value]]));

    return result;
  }
}

export default ArrayMap;
