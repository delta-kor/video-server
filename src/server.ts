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
import LiveGateway from './modules/live/live.gateway';
import ChatService from './modules/live/service/chat.service';
import CinemaService from './modules/live/service/cinema.service';
import LiveService from './modules/live/service/live.service';
import SocketService from './modules/live/service/socket.service';
import LogController from './modules/log/log.controller';
import LogService from './modules/log/log.service';
import MusicController from './modules/music/music.controller';
import MusicService from './modules/music/music.service';
import PlaylistController from './modules/playlist/playlist.controller';
import PlaylistService from './modules/playlist/playlist.service';
import RadioController from './modules/radio/radio.controller';
import RadioService from './modules/radio/radio.service';
import RecommendController from './modules/recommend/recommend.controller';
import EmotionService from './modules/recommend/service/emotion.service';
import RecommendService from './modules/recommend/service/recommend.service';
import SearchController from './modules/search/search.controller';
import SearchService from './modules/search/search.service';
import ShipmentController from './modules/shipment/shipment.controller';
import ShipmentService from './modules/shipment/shipment.service';
import ThumbnailController from './modules/thumbnail/thumbnail.controller';
import UserController from './modules/user/user.controller';
import UserService from './modules/user/user.service';
import VideoController from './modules/video/video.controller';
import VideoService from './modules/video/video.service';
import Service from './services/base.service';
import ServiceProvider from './services/provider.service';

dotenv.config();

const port = parseInt(process.env.PORT!) || 3000;

const app = new App(port);
const services: typeof Service[] = [
  EnvService,
  LogService,
  DeliverService,
  VideoService,
  CategoryService,
  MusicService,
  CalendarService,
  EmotionService,
  RecommendService,
  SearchService,
  SocketService,
  CinemaService,
  UserService,
  PlaylistService,
  BuilderService,
  RadioService,
  ChatService,
  LiveService,
  AdService,
  ShipmentService,
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
      new LogController(),
      new VideoController(),
      new ThumbnailController(),
      new CategoryController(),
      new MusicController(),
      new CalendarController(),
      new PlaylistController(),
      new RecommendController(),
      new SearchController(),
      new RadioController(),
      new UserController(),
      new AdController(),
      new ShipmentController(),
    ];
    return app.load(controllers, gateway);
  })
  .then(() => app.start());
