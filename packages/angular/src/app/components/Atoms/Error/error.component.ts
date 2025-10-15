import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "app-error",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (errors()) {
      <small
        [title]="errors()"
        class="block cursor-default truncate text-red-600"
      >
        {{ errors() }}
      </small>
    }
  `,
})
export class ErrorComponent {
  readonly errors = input<string | undefined | null>();
}
