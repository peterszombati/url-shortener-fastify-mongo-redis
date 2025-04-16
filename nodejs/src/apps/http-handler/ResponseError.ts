export class ResponseError extends Error {
  statusCode?: number;
  data: any;
  result: any;

  constructor(
    params:
      | {
          statusCode?: number;
          data?: any;
          result?: any;
          message?: string;
        }
      | undefined = undefined,
  ) {
    super(params?.message || '');
    if (params) {
      this.statusCode = params.statusCode;
      this.data = params.data;
      this.result = params.result;
    }
  }
}
