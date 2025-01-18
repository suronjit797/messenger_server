export type IErrorMessage = {
  path: string | number
  message: string
}

export type IErrorResponse = {
  success: boolean
  message: string
  errorMessages: IErrorMessage[]
  stack?: unknown
}
