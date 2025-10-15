import { inject, Injectable } from "@angular/core";
import { Validators, type FormBuilder } from "@angular/forms";
import { delay, map, of } from "rxjs";
import { ApiService } from "../../../services/api.service";
import { AbstractFormService } from "../../../services/form.service";

function buildForm(fb: FormBuilder) {
  return fb.group({
    username: fb.control("", {
      nonNullable: true,
      validators: Validators.required,
    }),
    password: fb.control("", {
      nonNullable: true,
      validators: Validators.required,
    }),
  });
}

export type LoginForm = ReturnType<typeof buildForm>;

@Injectable()
class LoginFormService extends AbstractFormService<LoginForm> {
  protected apiService = inject(ApiService);
  override defaultErrorMessage = "Username or password incorrect";
  buildForm() {
    return buildForm(this.fb);
  }
  submitHandler() {
    return this.apiService.login(this.form.getRawValue());
  }

  get username() {
    return this.form.controls.username;
  }
  get password() {
    return this.form.controls.password;
  }
}

export default LoginFormService;

export const mockLogin = (shouldSucceed = true) => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    login(..._parameters: Parameters<ApiService["login"]>) {
      return of([]).pipe(
        delay(1000),
        map(() => {
          if (shouldSucceed) return "success";
          throw new Error("Something went wrong");
        }),
      );
    },
  };
};
