import styles from "@/styles/components/Molecules/formWrapper";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import type { ResultStatus } from "../../../../services/form.service";

@Component({
  selector: "app-form-result-status",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let result = resultStatus();
    @switch (result.status) {
      @case ("success") {
        <p [class]="styles.successText">
          {{ successLabel() }}
        </p>
      }
      @case ("error") {
        <p [class]="styles.errorText">
          {{ result.message }}
        </p>
      }
    }
  `,
})
export class ResultStatusComponent {
  protected readonly styles = styles.status;
  readonly resultStatus = input.required<ResultStatus>();
  readonly successLabel = input.required<string>();
}
