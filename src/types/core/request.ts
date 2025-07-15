export type Request = {
    url : string,
    method : "GET" | "POST" | "PUT" | "DELETE",
    origin : string,
    
    headers? : HeadersInit | undefined,
    body? : string | undefined,
    cache? : number
}