export type Request = {
    url : string | undefined,
    method : "GET" | "POST" | "PUT" | "DELETE" | undefined,
    headers : HeadersInit | undefined,
    body : string | undefined,
    origin : string | undefined,
    cache : number | undefined
}

export type CheckedRequest = Request & {
    url : string,
    method : "GET" | "POST" | "PUT" | "DELETE",
    origin : string
}