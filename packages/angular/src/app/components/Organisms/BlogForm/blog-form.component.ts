import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  type OnInit,
} from "@angular/core";
import { outputFromObservable, toObservable } from "@angular/core/rxjs-interop";
import { ReactiveFormsModule } from "@angular/forms";
import { FormWrapperComponent } from "../../Molecules/FormWrapper/form-wrapper.component";
import { FormInputComponent } from "../FormInput/form-input.component";
import { AbstractBlogFormService, type BlogValues } from "./blog-form.service";

@Component({
  selector: "app-blog-form",
  imports: [FormWrapperComponent, ReactiveFormsModule, FormInputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./blog-form.component.html",
  styles: `
    .title {
      display: block;
      width: 100%;
    }
    ::ng-deep .title app-input {
      display: block;
    }
    ::ng-deep .title app-input input {
      display: block;
      width: 100%;
    }
  `,
})
export class BlogFormComponent implements OnInit {
  readonly successLabel = input.required<string>();
  readonly submitLabel = input.required<string>();
  readonly defaultErrorMessage = input<string>();
  readonly data = input<BlogValues>();
  /** Actual page should provide the concrete create/update blog form service handler  */
  protected readonly formService = inject(AbstractBlogFormService);

  protected get form() {
    return this.formService.form;
  }
  protected readonly resultStatus = this.formService.resultStatus;

  readonly status = outputFromObservable(toObservable(this.resultStatus));

  readonly goBack = output();
  ngOnInit(): void {
    this.formService.initialFormValue = this.data();
    this.formService.defaultErrorMessage =
      this.defaultErrorMessage() ?? this.formService.defaultErrorMessage;
  }
}
