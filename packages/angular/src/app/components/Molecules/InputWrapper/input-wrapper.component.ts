import { AsyncPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import type { AbstractControl } from "@angular/forms";
import { v4 } from "uuid";
import { ParseErrorPipe } from "../../../pipes/parse-error.pipe";
import { IdService } from "../../../services/id.service";
import { ErrorComponent } from "../../Atoms/Error/error.component";

@Component({
  selector: "app-input-wrapper",
  templateUrl: "./input-wrapper.component.html",
  imports: [ErrorComponent, ParseErrorPipe, AsyncPipe],
  providers: [IdService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputWrapperComponent {
  readonly errId = v4();
  readonly control = input.required<AbstractControl>();
  protected readonly idService = inject(IdService);
}
