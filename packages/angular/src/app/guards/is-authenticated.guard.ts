import { isPlatformServer } from "@angular/common";
import { inject, PLATFORM_ID, TransferState } from "@angular/core";
import { Router, type CanActivateFn } from "@angular/router";
import { AuthenticationService } from "../services/is-authenticated.service";
import { ME_DATA_KEY } from "./transfer-state.keys";

/** Get authentication state from the API server. This should be done on each request. */
export const authenticationStateGuard = async () => {
  const platformId = inject(PLATFORM_ID);
  const transferState = inject(TransferState);
  const authenticationService = inject(AuthenticationService);

  if (isPlatformServer(platformId)) {
    const me = await authenticationService.check();
    transferState.set(ME_DATA_KEY, me);
    return true;
  }

  await authenticationService.check();
  return true;
};

export const loginGuard: CanActivateFn = () => {
  return inject(AuthenticationService).me() !== null
    ? inject(Router).navigate(["/"])
    : true;
};

export const authGuard: CanActivateFn = () => {
  return inject(AuthenticationService).me() !== null
    ? true
    : inject(Router).navigate(["/"]);
};
