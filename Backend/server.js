const http = require('http');
const app = require('./app');
const logger = require('./logger');

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);


server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});