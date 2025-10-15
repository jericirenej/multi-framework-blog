import { Pipe, type PipeTransform } from "@angular/core";
import type { AbstractControl } from "@angular/forms";
import { distinctUntilChanged, map } from "rxjs";
import { parseErrors } from "../helpers/form-error-parser";

@Pipe({ name: "parseError" })
export class ParseErrorPipe implements PipeTransform {
  transform(control: AbstractControl) {
    return control.events.pipe(
      map(() => (control.pristine ? undefined : parseErrors(control.errors))),
      distinctUntilChanged(),
    );
  }
}
