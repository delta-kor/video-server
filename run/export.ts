import 'dotenv/config';
import * as fs from 'fs';
import mongoose from 'mongoose';
import Video from '../src/modules/video/video.interface';
import VideoModel from '../src/modules/video/video.model';

console.log('Starting process');

const databaseUrl = process.env.DB_PATH as string;
mongoose.connect(databaseUrl).then(async () => {
  console.log('Database connected');

  const videos: Video[] = await VideoModel.find();

  let result: string = '';
  for (const video of videos) {
    const line: string[] = [];
    line.push(video.id);
    line.push(video.title);
    line.push(video.description);
    line.push(...video.category);
    line.push(video.date.toLocaleDateString('ko'));
    line.push(video.cdnId);
    const lineString = line.join('\t');
    result += lineString + '\n';
  }

  fs.writeFile('exports.tsv', result, () => {
    console.log('Finished process');
    process.exit();
  });
});
