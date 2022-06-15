import 'dotenv/config';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import DeliverService from '../src/modules/deliver/deliver.service';
import EnvService from '../src/modules/env/env.service';
import Video from '../src/modules/video/video.interface';
import VideoModel from '../src/modules/video/video.model';
import Service from '../src/services/base.service';
import ServiceProvider from '../src/services/provider.service';

console.log('Starting process');

const cachePath = path.join(__dirname, '../build', 'data.json');
const buildCacheFile = fs.readFileSync(cachePath);
const buildCache = JSON.parse(buildCacheFile.toString());

const databaseUrl = process.env.DB_PATH as string;
mongoose.connect(databaseUrl).then(async () => {
  console.log('Database connected');

  const services: typeof Service[] = [EnvService, DeliverService];
  await ServiceProvider.load(services);
  console.log('Service loaded');

  const deliverService: DeliverService = ServiceProvider.get(DeliverService);

  const thumbnailPath = path.join(__dirname, '../build', 'thumb');

  const videos: Video[] = await VideoModel.find();

  videoLoop: for (const video of videos) {
    for (const item of buildCache) {
      if (item.id === video.id) continue videoLoop;
    }

    const id = video.id;
    const cdnUrl = await deliverService.getCdnInfo(video.cdnId, 720);

    await new Promise<void>(resolve => {
      ffmpeg.ffprobe(cdnUrl.url, (err, metadata) => {
        if (err) throw err;

        const duration = metadata.format.duration!;
        const roundedDuration = Math.round(duration);

        const limitedDuration = Math.min(duration, 60 * 5);

        ffmpeg(cdnUrl.url)
          .thumbnail({
            timestamps: [limitedDuration * 0.3, limitedDuration * 0.4],
            filename: `${id}.${roundedDuration}.%i.jpg`,
            folder: thumbnailPath,
            size: '720x405',
          })
          .on('end', () => {
            console.log(`Loaded ${video.title} from ${video.description}`);
            resolve();
          });
      });
    });
  }

  process.exit();
});
