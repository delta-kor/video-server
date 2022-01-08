import { promises as fs } from 'fs';
import path from 'path';
import NotFoundException from '../../exceptions/not-found.exception';
import Service from '../../services/base.service';
import { FileItem } from './builder.interface';

class BuilderService extends Service {
  private readonly file: Map<string, FileItem> = new Map();

  public async load(): Promise<void> {
    const buildDataFile = await fs.readFile(path.join('build', 'data.json'));
    const buildData: FileItem[] = JSON.parse(buildDataFile.toString());

    for (const file of buildData) {
      this.file.set(file.id, file);
    }
  }

  public getThumbnailData(id: string): string {
    const file = this.file.get(id);
    if (!file) throw new NotFoundException();

    const duration = file.duration;
    const select = file.select;

    const fileName = `${id}.${duration}.${select}.jpg`;
    return path.join(__dirname, '../../../', 'build', 'thumb', fileName);
  }

  public getDuration(id: string): number {
    const file = this.file.get(id);
    if (!file) throw new NotFoundException();

    return file.duration;
  }
}

export default BuilderService;
