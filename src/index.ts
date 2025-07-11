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
        
        //Mark as Checked with Full Typing
        const checkedRequest = request as Types.Core.CheckedRequest;

        const url = new URL(checkedRequest.url);
        console.log(`Logging request bound for ${url.hostname} for Worker: ${checkedRequest.origin}`);

        //Log to Analytics Engine
		this.env.AED.writeDataPoint({
            blobs: [url.hostname, url.pathname],
            doubles: [1]
        });
        
        //Return the Fetch
        return fetch(
            checkedRequest.url, {
                method: checkedRequest.method,
                headers: checkedRequest.headers,
                body: checkedRequest.body,
                cf: {
                    //Default: 12 Hour TTL
                    cacheTtl: checkedRequest.cache ?? 43200
                }
            }
        );
	}

    //Just to stop Cloudflare complaining
    async fetch(request: Request): Promise<Response> {
        return new Response(null, { status: 404 })
    }
}