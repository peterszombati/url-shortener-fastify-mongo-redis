export class ResponseError extends Error {
   statusCode?: number
   data: any
   result: any

   constructor({statusCode, data, result, message}: {
      statusCode?: number,
      data?: any,
      result?: any,
      message?: string
   }) {
      super(message || '')
      this.statusCode = statusCode
      this.data = data
      this.result = result
   }
}