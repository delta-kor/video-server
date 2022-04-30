import { promises as fs } from 'fs';
import path from 'path';
import NotFoundException from '../../exceptions/not-found.exception';
import Service from '../../services/base.service';
import { FileItem, RadioFileItem } from './builder.interface';

class BuilderService extends Service {
  private readonly videoFile: Map<string, FileItem> = new Map();
  private readonly radioFile: Map<string, RadioFileItem> = new Map();

  public async load(): Promise<void> {
    const buildDataFile = await fs.readFile(path.join('build', 'data.json'));
    const buildData: FileItem[] = JSON.parse(buildDataFile.toString());

    for (const file of buildData) {
      this.videoFile.set(file.id, file);
    }

    const radioBuildDataFile = await fs.readFile(path.join('build', 'radio-data.json'));
    const radioBuildData: RadioFileItem[] = JSON.parse(radioBuildDataFile.toString());

    for (const file of radioBuildData) {
      this.radioFile.set(file.id, file);
    }
  }

  public getThumbnailData(id: string): string {
    const file = this.videoFile.get(id);
    if (!file) throw new NotFoundException();

    const duration = file.duration;
    const select = file.select;

    const fileName = `${id}.${duration}.${select}.jpg`;
    return path.join(__dirname, '../../../', 'build', 'thumb', fileName);
  }

  public getVideoDuration(id: string): number {
    const file = this.videoFile.get(id);
    if (!file) throw new NotFoundException();

    return file.duration;
  }

  public getRadioDuration(id: string): number {
    const file = this.radioFile.get(id);
    if (!file) throw new NotFoundException();

    return file.duration;
  }
}

export default BuilderService;
