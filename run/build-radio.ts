import crypto from 'crypto';
import ffmpeg from 'fluent-ffmpeg';
import { promises as fs } from 'fs';
import path from 'path';
import { RadioFileItem } from '../src/modules/builder/builder.interface';

const buildFile = path.join(__dirname, '../build', 'radio-data.json');
const radioPath = path.join(__dirname, '../build', 'radio');

const AlbumMap = new Map();
AlbumMap.set('C', 'COLOR*IZ');
AlbumMap.set('H', 'HEART*IZ');
AlbumMap.set('B', 'BLOOM*IZ');
AlbumMap.set('D', 'Oneiric Diary');
AlbumMap.set('R', 'One-reeler / Act IV');

fs.readdir(radioPath).then(async files => {
  const fileMap: Map<string, RadioFileItem> = new Map();
  for (const file of files) {
    const split = file.split('_');

    const albumId = split[0];
    const title = split[1].split('.')[0];
    const id = crypto
      .createHash('md5')
      .update(title + albumId)
      .digest('hex')
      .slice(0, 8);

    const album = AlbumMap.get(albumId);
    if (!album) throw new Error(`Unknown album id : ${albumId}`);

    const filePath = path.join(radioPath, file);
    const duration = await new Promise<number>(resolve => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) throw new Error(err);
        const duration = metadata.format.duration;
        if (!duration) throw new Error(`Invalid duration in ${file}`);
        resolve(Math.round(duration));
      });
    });

    fileMap.set(id, { id, fileName: file, title, album, duration });
  }

  const result: RadioFileItem[] = Array.from(fileMap.values());
  fs.writeFile(buildFile, JSON.stringify(result, null, 2)).then(() => {
    console.log('Finished');
    process.exit();
  });
});
