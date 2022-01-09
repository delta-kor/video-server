import dotenv from 'dotenv';
import App from './app';
import Controller from './classes/controller.class';
import BuilderService from './modules/builder/builder.service';
import CategoryController from './modules/category/category.controller';
import CategoryService from './modules/category/category.service';
import DeliverService from './modules/deliver/deliver.service';
import EnvController from './modules/env/env.controller';
import EnvService from './modules/env/env.service';
import FeedController from './modules/feed/feed.controller';
import FeedService from './modules/feed/feed.service';
import MusicController from './modules/music/music.controller';
import MusicService from './modules/music/music.service';
import ThumbnailController from './modules/thumbnail/thumbnail.controller';
import VideoController from './modules/video/video.controller';
import VideoService from './modules/video/video.service';
import Service from './services/base.service';
import ServiceProvider from './services/provider.service';

dotenv.config();

const port = parseInt(process.env.PORT!) || 3000;

const app = new App(port);
const services: typeof Service[] = [
  BuilderService,
  EnvService,
  DeliverService,
  VideoService,
  CategoryService,
  MusicService,
  FeedService,
];

app.on('load', () => console.log('Loaded application'));
app.on('connect', () => console.log('Connected to database'));
app.on('start', port => console.log(`Server started in port ${port}`));

app
  .connect()
  .then(() => ServiceProvider.load(services))
  .then(() => {
    const controllers: Controller[] = [
      new EnvController(),
      new ThumbnailController(),
      new VideoController(),
      new CategoryController(),
      new MusicController(),
      new FeedController(),
    ];
    return app.load(controllers);
  })
  .then(() => app.start());
