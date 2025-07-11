import * as Types from '@Types';
import { WorkerEntrypoint } from 'cloudflare:workers';

export default class RequestLogger extends WorkerEntrypoint<Env> {
	async request(request : Types.Core.Request) {
		if(request === undefined || request.url === undefined || request.method === undefined || request.origin == undefined) {
			return new Response(null, { status: 400 });
		}
        
        const checkedRequest = request as Types.Core.CheckedRequest;
        
        const url = new URL(checkedRequest.url);
        console.log(`Logging request bound for ${url.hostname} for Worker: ${checkedRequest.origin}`);
		this.env.AED.writeDataPoint({
            blobs: [url.hostname, url.pathname],
            doubles: [1]
        });
        
        return await fetch(
            checkedRequest.url, {
                method: checkedRequest.method,
                headers: checkedRequest.headers,
                body: checkedRequest.body,
                cf: {
                    cacheTtl: checkedRequest.cache ?? 43200
                }
            }
        );
	}

    async fetch(request: Request): Promise<Response> {
        return new Response(null, { status: 404 })
    }
}