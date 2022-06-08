((async () => {
	try {

		// Node.js built-in modules:
		import fs from 'node:fs';
		import path from 'node:path';

		// NPM dependencies:
		import createApplication from 'express';

		const application: Application = createApplication();
		const port: number = 80;

		const deployment_info: string = fs.readFileSync(path.resolve(__dirname, '..', '..', '.oci', 'deployment.json'), 'utf8');

		application.get('/', (request: Request, response: Response) => {
			const body: string = `Hello, World!\n\n${ JSON.stringify(JSON.parse(deployment_info), null, '\t') }`;
			response.writeHead(200, {
				'Connection': 'close',
				'Content-Length': Buffer.byteLength(body.length, 'utf8'),
				'Content-Type': 'text/plain; charset=UTF-8',
			});
			response.send(body);
		});

		const server = app.listen(port, () => {
			process.stderr.write(`HTTP server listening on port ${ port }...\n`);
		});

		const shutdown: () => void = (signal: string) => () => {
			process.stderr.write(`\r${ signal } received: closing HTTP server...\n`);
			setTimeout(() => {
				server.close(() => {
					process.stderr.write('...HTTP server closed.\n');
				});
			}, 10);
		};

		process.on('SIGINT', shutdown('SIGINT'));
		process.on('SIGTERM', shutdown('SIGTERM'));
		app.get('/shutdown', (request: Request, response: Response) => {
			const body: string = 'Shutting down...';
			response.writeHead(200, {
				'Connection': 'close',
				'Content-Length': Buffer.byteLength(body.length, 'utf8'),
				'Content-Type': 'text/plain; charset=UTF-8',
			});
			response.send(body);
			setTimeout(() => shutdown('Shutdown request'), 10);
		});
	} catch (error: Error | string) {
		process.stderr.write(`${ error instanceof Error ? error.message : error }\n`);
	} finally {
		process.exit(1);
	}
}))();
