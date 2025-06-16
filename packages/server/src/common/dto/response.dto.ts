/*
 * @Description:
 * @Author: huangzhiwei
 * @Date: 2025-06-14 14:58:24
 * @Email: huangzhiwei4@joyy.sg
 * @LastEditTime: 2025-06-14 14:58:31
 */
export class ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;

  constructor(code: number, message: string, data: T) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  static success<T>(data: T, message: string = '操作成功'): ApiResponse<T> {
    return new ApiResponse(0, message, data);
  }

  static error(
    message: string = '操作失败',
    code: number = 1,
  ): ApiResponse<null> {
    return new ApiResponse(code, message, null);
  }
}
