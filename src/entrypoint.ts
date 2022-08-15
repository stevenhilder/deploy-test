// Node.js build-in modules:
import * as http from 'node:http';
import * as zlib from 'node:zlib';

// Local dependencies:
import { Profile, Profiler } from './Profiler';

const server: http.Server = http.createServer((request: http.IncomingMessage, response: http.ServerResponse): void => {
	console.log(`Request received for ${ request.url }\n`);
	response.writeHead(404);
	response.end();

	const matches: RegExpMatchArray | null = /^\/profile\/(\d+)$/.exec(request.url as string);
	if (matches !== null) {
		const duration: number = parseInt(matches[0]);
		const profiler: Profiler = new Profiler;
		profiler.start().then(
			(): void => void setTimeout(
				(): void => void profiler.stop().then(
					(profile: Profile): void => void process.stdout.write(
						(zlib.brotliCompressSync(JSON.stringify(profile)).toString('base64').match(/.{1,120}/g) || [])
							.map((line: string): string => `${ line }\n`)
							.join('')
					),
				),
				duration,
			),
		);
	}
});

server.listen(80);
