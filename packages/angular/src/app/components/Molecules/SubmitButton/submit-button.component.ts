import styles from "@/styles/components/Molecules/submitButton";
import { Component, computed, input } from "@angular/core";
import {
  AbstractButtonComponent,
  ButtonComponent,
} from "../../Atoms/Button/button.component";
import { SpinnerComponent } from "../../Atoms/Spinner/spinner.component";

@Component({
  selector: "app-submit-button",
  imports: [ButtonComponent, SpinnerComponent],
  template: `
    <app-button
      [type]="type()"
      [variant]="variant()"
      (click)="clicked.emit()"
      [disabled]="isDisabled()"
      [title]="
        isDisabled()
          ? 'Please make changes to the form in order to be able to submit'
          : null
      "
    >
      <div [class]="style.contentWrapper">
        <span>{{ label() }}</span>
        @if (isSubmitting()) {
          @defer (on timer(400ms)) {
            <app-spinner [class]="style.spinnerTransition" />
          }
        }
      </div>
    </app-button>
  `,
})
export class SubmitButtonComponent extends AbstractButtonComponent {
  protected readonly style = styles;
  readonly label = input.required<string>();
  readonly isSubmitting = input.required<boolean>();
  override readonly type = input<"button" | "submit" | "reset">("submit");
  protected isDisabled = computed(() => this.disabled() || this.isSubmitting());
}
