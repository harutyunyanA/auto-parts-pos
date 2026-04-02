export function throwError(message: string, code: string, statusCode: number) {
  throw { message, code, statusCode: statusCode ?? undefined };
}
