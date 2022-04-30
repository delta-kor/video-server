import 'dotenv/config';
import ffmpeg from 'fluent-ffmpeg';
import mongoose from 'mongoose';
import path from 'path';
import DeliverService from '../src/modules/deliver/deliver.service';
import EnvService from '../src/modules/env/env.service';
import Video from '../src/modules/video/video.interface';
import VideoModel from '../src/modules/video/video.model';
import Service from '../src/services/base.service';
import ServiceProvider from '../src/services/provider.service';

console.log('Starting process');

const databaseUrl = process.env.DB_PATH as string;
mongoose.connect(databaseUrl).then(async () => {
  console.log('Database connected');

  const services: typeof Service[] = [EnvService, DeliverService];
  await ServiceProvider.load(services);
  console.log('Service loaded');

  const deliverService: DeliverService = ServiceProvider.get(DeliverService);

  const thumbnailPath = path.join(__dirname, '../build', 'thumb');

  const videos: Video[] = await VideoModel.find();
  for (const video of videos) {
    const id = video.id;
    const cdnUrl = await deliverService.getCdnInfo(video.cdnId, 720);

    await new Promise<void>(resolve => {
      // @ts-ignore
      ffmpeg.ffprobe(cdnUrl, (err, metadata) => {
        const duration = metadata.format.duration!;
        const roundedDuration = Math.round(duration);

        // @ts-ignore
        ffmpeg(cdnUrl)
          .thumbnail({
            timestamps: [duration * 0.3, duration * 0.4],
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
