const { createApp } = require('./app');
const { config } = require('./config');

const app = createApp();

app.listen(config.port, () => {
    process.stdout.write(`API listening on http://localhost:${config.port}\n`);
});
