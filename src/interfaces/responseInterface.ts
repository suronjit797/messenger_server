export type TPayload<T> = {
  statusCode: number
  success: boolean
  message?: string | null
  data: T | null
  meta?: {
    page: number
    limit: number
    total: number
  }
}

export type TResponse<T> = {
  success: boolean
  message?: string | null
  result: T | null
  meta?: {
    page: number
    limit: number
    total: number
  }
}
