const express = require('express');
const app = express();
const port = 8080;

app.get('/', (_, response) => void response.send('Hello, World!\n'));

const server = app.listen(port, () => {
	process.stderr.write(`HTTP server listening on port ${ port }...\n`);
});

const shutdown = signal => () => {
	process.stderr.write(`\r${ signal } received: closing HTTP server...\n`);
	setTimeout(() => {
		server.close(() => {
			process.stderr.write('...HTTP server closed.\n');
		});
	}, 10);
};

process.on('SIGINT', shutdown('SIGINT'));
process.on('SIGTERM', shutdown('SIGTERM'));
app.get('/shutdown', () => {
	response.send('Shutting down...\n');
	shutdown('Shutdown request');
});
