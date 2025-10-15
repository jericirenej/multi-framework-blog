import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";

abstract class LocationServiceToken {
  abstract get url(): string;
}

@Injectable({ providedIn: "root" })
export class LocationService extends LocationServiceToken {
  protected readonly router = inject(Router);
  get url() {
    return this.router.url;
  }
}

export class MockLocationService extends LocationServiceToken {
  constructor(protected _url = "/") {
    super();
  }
  get url() {
    return this._url;
  }
  set url(val: string) {
    this._url = val;
  }
}
