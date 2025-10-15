import { Component, computed, input } from "@angular/core";
import {
  AbstractButtonComponent,
  ButtonComponent,
} from "../../Atoms/Button/button.component";
import { SpinnerComponent } from "../../Atoms/Spinner/spinner.component";

@Component({
  selector: "app-submit-button",
  imports: [ButtonComponent, SpinnerComponent],
  styles: `
    app-spinner {
      opacity: 1;
      width: auto;
      padding-left: 1rem;
      transform: scaleX(1);
      transition: all 0.3s ease;
      @starting-style {
        opacity: 0;
        transform: scaleX(0);
        padding-left: 0;
      }
    }
  `,
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
      <div class="flex">
        <span>{{ label() }}</span>
        @if (isSubmitting()) {
          @defer (on timer(400ms)) {
            <app-spinner />
          }
        }
      </div>
    </app-button>
  `,
})
export class SubmitButtonComponent extends AbstractButtonComponent {
  readonly label = input.required<string>();
  readonly isSubmitting = input.required<boolean>();
  override readonly type = input<"button" | "submit" | "reset">("submit");
  protected isDisabled = computed(() => this.disabled() || this.isSubmitting());
}
