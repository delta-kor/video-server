import { promises as fs } from 'fs';
import path from 'path';
import NotFoundException from '../../exceptions/not-found.exception';
import Service from '../../services/base.service';
import ServiceProvider from '../../services/provider.service';
import MusicService from '../music/music.service';
import PlaylistService from '../playlist/playlist.service';
import Radio from '../radio/radio.interface';
import { FileItem, RadioFileItem } from './builder.interface';

class BuilderService extends Service {
  private readonly playlistService: PlaylistService = ServiceProvider.get(PlaylistService);
  private readonly musicService: MusicService = ServiceProvider.get(MusicService);

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
    if (id.length === 6) {
      const file = this.videoFile.get(id);
      if (!file) throw new NotFoundException();

      const duration = file.duration;
      const select = file.select;

      const fileName = `${id}.${duration}.${select}.jpg`;
      return path.join(__dirname, '../../../', 'build', 'thumb', fileName);
    }

    if (id.length === 8) {
      void this.playlistService.read(id);
      const fileName = `${id}.png`;
      return path.join(__dirname, '../../../', 'build', 'playlist', fileName);
    }

    if (id.length === 10) {
      void this.musicService.getOneAlbum(id);
      const fileName = `${id}.png`;
      return path.join(__dirname, '../../../', 'build', 'album', fileName);
    }

    throw new NotFoundException();
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

  public getAllRadioData(): Radio[] {
    const files = Array.from(this.radioFile.values());
    const radios: Radio[] = [];
    for (const file of files)
      radios.push({
        id: file.id,
        title: file.title,
        album: file.album,
        duration: file.duration,
        lyrics: file.lyrics || null,
      });
    return radios;
  }
}

export default BuilderService;
