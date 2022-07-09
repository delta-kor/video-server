import dotenv from 'dotenv';
import App from './app';
import Controller from './classes/controller.class';
import AdController from './modules/ad/ad.controller';
import AdService from './modules/ad/ad.service';
import BuilderService from './modules/builder/builder.service';
import CalendarController from './modules/calendar/calendar.controller';
import CalendarService from './modules/calendar/calendar.service';
import CategoryController from './modules/category/category.controller';
import CategoryService from './modules/category/category.service';
import DeliverService from './modules/deliver/deliver.service';
import EnvController from './modules/env/env.controller';
import EnvService from './modules/env/env.service';
import FeedController from './modules/feed/feed.controller';
import EmotionService from './modules/feed/service/emotion.service';
import FeedService from './modules/feed/service/feed.service';
import LiveGateway from './modules/live/live.gateway';
import ChatService from './modules/live/service/chat.service';
import CinemaService from './modules/live/service/cinema.service';
import LiveService from './modules/live/service/live.service';
import SocketService from './modules/live/service/socket.service';
import UserService from './modules/live/service/user.service';
import MusicController from './modules/music/music.controller';
import MusicService from './modules/music/music.service';
import RadioController from './modules/radio/radio.controller';
import RadioService from './modules/radio/radio.service';
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
  CalendarService,
  EmotionService,
  FeedService,
  RadioService,
  SocketService,
  CinemaService,
  UserService,
  ChatService,
  LiveService,
  AdService,
];

const gateway = LiveGateway;

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
      new CalendarController(),
      new FeedController(),
      new RadioController(),
      new AdController(),
    ];
    return app.load(controllers, gateway);
  })
  .then(() => app.start());
