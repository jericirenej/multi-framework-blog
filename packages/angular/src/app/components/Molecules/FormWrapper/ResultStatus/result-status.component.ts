import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import type { ResultStatus } from "../../../../services/form.service";

@Component({
  selector: "app-form-result-status",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let result = resultStatus();
    @switch (result.status) {
      @case ("success") {
        <p class="text-xs text-green-600">
          {{ successLabel() }}
        </p>
      }
      @case ("error") {
        <p class="text-xs text-red-600">
          {{ result.message }}
        </p>
      }
    }
  `,
})
export class ResultStatusComponent {
  readonly resultStatus = input.required<ResultStatus>();
  readonly successLabel = input.required<string>();
}
