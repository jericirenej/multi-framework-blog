import type { UserWithExpirationDto } from "@/api/schemas";
import { makeStateKey } from "@angular/core";

export const ME_DATA_KEY = makeStateKey<UserWithExpirationDto>("me");
