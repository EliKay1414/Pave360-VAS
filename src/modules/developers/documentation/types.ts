export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

export type ApiTag =
  | "All"
  | "Messages"
  | "Inbound MO"
  | "USSD"
  | "Sender IDs"
  | "Webhooks"
  | "Account"

export interface ApiEndpointParam {
  name: string
  in: "header" | "query" | "path"
  required: boolean
  type: string
  description: string
  example?: string
}

export interface ApiEndpointResponse {
  status: number
  description: string
  exampleBody?: string
}

export interface ApiEndpoint {
  id: string
  method: HttpMethod
  path: string
  tag: Exclude<ApiTag, "All">
  summary: string
  description: string
  parameters: ApiEndpointParam[]
  requestBodyExample?: string
  responses: ApiEndpointResponse[]
}
