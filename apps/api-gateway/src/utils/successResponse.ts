export class SuccessResponse {
    private status = "success";
    public statusCode: 200 | 201 | 204; // More applicable values could be added if required
    public message: string;
    public data?: unknown;
  
    constructor(statusCode: 200 | 201 | 204, message: string, data?: unknown) {
      this.statusCode = statusCode;
      this.message = message;
      this.data = data;
    }
  }