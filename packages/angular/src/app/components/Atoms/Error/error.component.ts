import style from "@/styles/components/Atoms/error";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "app-error",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (errors()) {
      <small [title]="errors()" [class]="style">
        {{ errors() }}
      </small>
    }
  `,
})
export class ErrorComponent {
  protected readonly style = style;
  readonly errors = input<string | undefined | null>();
}
