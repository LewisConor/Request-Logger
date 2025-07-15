import * as Types from '@Types';
import { WorkerEntrypoint } from 'cloudflare:workers';

//Worker Entrypoint
export default class RequestLogger extends WorkerEntrypoint<Env> {
    //RPC Function
	async request(request : Types.Core.Request) {
        //Check if we have the Core of the Request Object
		if(request === undefined || request.url === undefined || request.method === undefined || request.origin == undefined) {
			return new Response(null, { status: 400 });
		}
        
        const url = new URL(request.url);
        console.log(`Logging request bound for ${url.hostname} for Worker: ${request.origin}`);

        //Log to Analytics Engine
		this.env.AED.writeDataPoint({
            indexes: [url.hostname],
            blobs: [url.pathname, request.origin],
            doubles: [1]
        });
        
        //Return the Fetch
        return fetch(
            request.url, {
                method: request.method,
                headers: request.headers,
                body: request.body,
                cf: {
                    //Default: 12 Hour TTL
                    cacheTtl: request.cache ?? 43200
                }
            }
        );
	}

    //Just to stop Cloudflare complaining
    async fetch(request: Request): Promise<Response> {
        return new Response(null, { status: 404 })
    }
}