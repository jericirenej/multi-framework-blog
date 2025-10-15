import type { UserWithExpirationDto } from "@/api/schemas";
import {
  computed,
  inject,
  Injectable,
  REQUEST,
  signal,
  TransferState,
  type Signal,
} from "@angular/core";
import { differenceInSeconds } from "date-fns";
import {
  lastValueFrom,
  map,
  of,
  switchMap,
  take,
  tap,
  type Observable,
} from "rxjs";
import { ME_DATA_KEY } from "../guards/transfer-state.keys";
import { ApiService, getJWT } from "./api.service";

abstract class AuthenticationServiceToken {
  protected abstract _me: Signal<UserWithExpirationDto | null>;
  readonly me = computed(() => this._me());

  readonly authenticated = computed(() => !!this.me());

  abstract check(): Promise<UserWithExpirationDto | null>;
  abstract logout(): Observable<boolean>;
}

/** To be used within guards and other services involved in verifying the user's authorization status.
 * Should not be consumed by components. */
@Injectable({ providedIn: "root" })
export class AuthenticationService extends AuthenticationServiceToken {
  protected readonly apiService = inject(ApiService);
  protected readonly request = inject(REQUEST);

  protected _me = signal<UserWithExpirationDto | null>(
    inject(TransferState).get(ME_DATA_KEY, null),
  );

  /** - If user data is available and session expiration is more than one minute,
   * returns the user data.
   * - If session will expire in less than one minute, logs out and returns null.
   * - Otherwise, performs authentication check. If user is authenticated, API is queried
   * for user data which is set in service and returned. If user is not authenticated,
   * returns and sets null */
  check(): Promise<UserWithExpirationDto | null> {
    return lastValueFrom(
      of(this.me()).pipe(
        switchMap((me) => {
          if (!me) {
            return this.apiService.authenticated(getJWT(this.request)).pipe(
              switchMap(({ authenticated }) => {
                if (authenticated && this.me() === null) {
                  return this.apiService.me(getJWT(this.request));
                }
                return of(null);
              }),
            );
          }
          if (differenceInSeconds(me.exp * 1000, Date.now()) < 60) {
            return this.apiService.logout().pipe(map(() => null));
          }
          return of(me);
        }),
        tap((me) => {
          if (JSON.stringify(me) !== JSON.stringify(this.me())) {
            this._me.set(me);
          }
        }),
        take(1),
      ),
    );
  }
  logout() {
    return this.apiService.logout().pipe(
      tap(() => {
        this._me.set(null);
      }),
    );
  }
}

export class MockAuthenticationService extends AuthenticationServiceToken {
  protected _me = signal<UserWithExpirationDto | null>(null);
  setMe(val: UserWithExpirationDto | null) {
    this._me.set(val);
  }

  check(): Promise<UserWithExpirationDto | null> {
    return Promise.resolve(this._me());
  }

  logout(): Observable<boolean> {
    this.setMe(null);
    return of(true);
  }
}
