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
  /** Duration in seconds */
  readonly duration = input<number>(1.5);
  readonly color = input("currentColor");
}
