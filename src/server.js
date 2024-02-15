import http from 'http';
import config from './config/config.js'; 
import app from './app.js';
import { init } from './socket.js';
import { init2 } from './db/mongodb.js';

const server = http.createServer(app);
const PORT = config.port;
init(server);
await init2();

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 
