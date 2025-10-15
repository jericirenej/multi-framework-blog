import { type ElementRef, Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class FormRegisterService {
  protected _ref: ElementRef<HTMLFormElement> | null = null;
  set ref(ref: ElementRef<HTMLFormElement> | null) {
    this._ref = ref;
  }
  get ref() {
    return this._ref;
  }
}
