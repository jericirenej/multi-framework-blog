import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from "@angular/core";
import { outputFromObservable, toObservable } from "@angular/core/rxjs-interop";
import { ReactiveFormsModule } from "@angular/forms";
import { FormWrapperComponent } from "../../Molecules/FormWrapper/form-wrapper.component";
import { FormInputComponent } from "../FormInput/form-input.component";
import LoginFormService from "./login-form.service";

@Component({
  selector: "app-login-form",
  imports: [FormWrapperComponent, ReactiveFormsModule, FormInputComponent],
  providers: [LoginFormService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./login-form.component.html",
})
export class LoginFormComponent {
  protected readonly formService = inject(LoginFormService);

  protected form = this.formService.form;
  protected readonly resultStatus = this.formService.resultStatus;

  readonly status = outputFromObservable(toObservable(this.resultStatus));

  readonly goBack = output();
}
