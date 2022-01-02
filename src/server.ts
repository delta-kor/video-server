import dotenv from 'dotenv';
import App from './app';

dotenv.config();

const port = parseInt(process.env.PORT!) || 3000;
const controllers = [];

const app = new App(port);

app.on('load', () => console.log('Loaded application'));
app.on('start', port => console.log(`Server started in port ${port}`));

app.load().then(() => app.start());
