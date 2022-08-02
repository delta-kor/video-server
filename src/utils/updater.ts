import { Document } from 'mongoose';

class Updater<T> {
  private readonly document: any;

  constructor(document: Document) {
    this.document = document;
  }

  public update(dto: Partial<T>, ...keys: (keyof T)[]): this {
    for (const key of keys) {
      if (typeof dto[key] !== 'undefined') this.document[key] = dto[key];
    }

    return this;
  }

  public async save(): Promise<Document> {
    return this.document.save();
  }
}

export default Updater;
