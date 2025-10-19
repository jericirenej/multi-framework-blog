import styles from "@/styles/components/Molecules/formWrapper";
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  type ElementRef,
  inject,
  input,
  type OnDestroy,
  output,
  viewChild,
} from "@angular/core";
import { type FormGroup, ReactiveFormsModule } from "@angular/forms";
import { FormRegisterService } from "../../../services/form-register.service";
import type { ResultStatus } from "../../../services/form.service";
import { ButtonComponent } from "../../Atoms/Button/button.component";
import { SubmitButtonComponent } from "../SubmitButton/submit-button.component";
import { ResultStatusComponent } from "./ResultStatus/result-status.component";

@Component({
  selector: "app-form-wrapper",
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    SubmitButtonComponent,
    ResultStatusComponent,
  ],
  templateUrl: "./form-wrapper.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormWrapperComponent implements OnDestroy {
  protected readonly styles = styles;
  readonly submitLabel = input.required<string>();
  readonly formGroup = input.required<FormGroup>();
  readonly resultStatus = input.required<ResultStatus>();
  readonly showGoBack = input<boolean>(true);
  readonly successLabel = input.required<string>();
  /** Should the first available input be focused when the component loads?
   * Defaults to `true`. */
  readonly focusOnRender = input<boolean>(true);

  readonly submitAction = output();
  readonly goBack = output();

  protected readonly formRef =
    viewChild.required<ElementRef<HTMLFormElement>>("ref");
  protected readonly formRegisterService = inject(FormRegisterService);

  constructor() {
    afterNextRender(() => {
      this.formRegisterService.ref = this.formRef();
      if (this.focusOnRender()) {
        this.formRef()
          .nativeElement.querySelector<HTMLElement>(".ng-pristine")
          ?.focus();
      }
    });
  }
  ngOnDestroy(): void {
    this.formRegisterService.ref = null;
  }

  onSubmit() {
    this.submitAction.emit();
  }
}
