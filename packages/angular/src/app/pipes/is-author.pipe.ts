import { inject, Pipe, type PipeTransform } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { map } from "rxjs";
import { AuthenticationService } from "../services/is-authenticated.service";

@Pipe({ name: "isAuthor" })
export class IsAuthorPipe implements PipeTransform {
  protected readonly me$ = toObservable(inject(AuthenticationService).me);
  transform<Blog extends { author_id: string }>(value: Blog) {
    return this.me$.pipe(map((me) => value.author_id === me?.id));
  }
}
