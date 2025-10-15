import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import navigateOnSuccess from "../../../helpers/navigate-on-success";
import type { ResultStatus } from "../../../services/form.service";
import { LoginFormComponent } from "../../Organisms/LoginForm/login-form.component";
import { PageWrapperComponent } from "../../Templates/PageWrapper/page-wrapper.component";

@Component({
  selector: "app-login-page",
  imports: [PageWrapperComponent, LoginFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-wrapper pageTitle="Login">
      <app-login-form (status)="handleStatus($event)" (goBack)="goBack()" />
    </app-page-wrapper>
  `,
})
export class LoginPageComponent {
  protected readonly router = inject(Router);

  protected handleStatus(result: ResultStatus) {
    navigateOnSuccess({ router: this.router, path: "/", result });
  }
  goBack() {
    void this.router.navigate(["/"]);
  }
}
