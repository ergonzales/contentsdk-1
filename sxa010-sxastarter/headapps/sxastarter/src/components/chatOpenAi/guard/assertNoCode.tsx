import { isCodeLike } from "../helpers/helpers";

export function assertNoCode(text: string) {
  if (isCodeLike(text)) {
    const err = new Error("CODE_NOT_ALLOWED");
    (err as any).statusCode = 400;
    throw err;
  }
}
