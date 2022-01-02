import dotenv from 'dotenv';
import App from './app';
import Controller from './classes/controller.class';
import VideoController from './modules/video/video.controller';
import VideoService from './modules/video/video.service';
import Service from './services/base.service';
import ServiceProvider from './services/provider.service';

dotenv.config();

const port = parseInt(process.env.PORT!) || 3000;

const services: typeof Service[] = [VideoService];
ServiceProvider.load(services);

const controllers: Controller[] = [new VideoController()];

const app = new App(port);

app.on('load', () => console.log('Loaded application'));
app.on('connect', () => console.log('Connected to database'));
app.on('start', port => console.log(`Server started in port ${port}`));

app.load(controllers).then(() => app.start());
