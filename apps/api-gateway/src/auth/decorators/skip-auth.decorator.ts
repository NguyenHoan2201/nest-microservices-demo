import { SetMetadata } from "@nestjs/common";

export const IS_SKIP_AUTH_KEY = "isSkipAuth";
export const SkipAuth = () => SetMetadata(IS_SKIP_AUTH_KEY, true);