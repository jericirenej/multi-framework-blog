import { Injectable } from "@angular/core";
import { v4 } from "uuid";

/** Provides consumers with a unique, singleton UUID (v4). */
@Injectable()
export class IdService {
  protected _id = v4();
  get id() {
    return this._id;
  }
}
