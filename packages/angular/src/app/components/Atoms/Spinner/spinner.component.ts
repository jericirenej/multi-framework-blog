import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "app-spinner",
  templateUrl: "./spinner.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: inline-block;
    }
  `,
})
export class SpinnerComponent {
  readonly duration = input<string, string | number>("1.5s", {
    transform: (val) => (typeof val === "number" ? `${val}ms` : val),
  });
  readonly color = input("currentColor");
}
