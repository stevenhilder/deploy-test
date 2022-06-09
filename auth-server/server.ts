// Node.js built-in modules:
import * as fs from 'fs';
import * as path from 'path';

// NPM dependencies:
import { Application, Request, Response } from 'express';
import createApplication = require('express');

((async () => {
	try {
		const application: Application = createApplication();
		const port: number = 80;
		const deployment_info: string = fs.readFileSync(path.resolve(__dirname, '..', '..', '.oci', 'deployment-info.json'), 'utf8');

		application.get('/', (request: Request, response: Response): void => {
			const body: string = `Hello, World!\n\n${ JSON.stringify(JSON.parse(deployment_info), null, '\t') }`;
			response.writeHead(200, {
				'Connection': 'close',
				'Content-Length': Buffer.byteLength(body, 'utf8').toString(),
				'Content-Type': 'text/plain; charset=UTF-8',
			});
			response.send(body);
		});

		const server = application.listen(port, () => {
			process.stderr.write(`HTTP server listening on port ${ port }...\n`);
		});

		const shutdown = (signal: string) => () => {
			process.stderr.write(`\r${ signal } received: closing HTTP server...\n`);
			setTimeout(() => {
				server.close(() => {
					process.stderr.write('...HTTP server closed.\n');
				});
			}, 10);
		};

		process.on('SIGINT', shutdown('SIGINT'));
		process.on('SIGTERM', shutdown('SIGTERM'));
		application.get('/shutdown', (request: Request, response: Response) => {
			const body: string = 'Shutting down...';
			response.writeHead(200, {
				'Connection': 'close',
				'Content-Length': Buffer.byteLength(body, 'utf8').toString(),
				'Content-Type': 'text/plain; charset=UTF-8',
			});
			response.send(body);
			setTimeout(() => shutdown('Shutdown request'), 10);
		});
	} catch (error: unknown) {
		process.stderr.write(`${ error instanceof Error ? error.message : error as string }\n`);
	} finally {
		process.exit(1);
	}
}))();
