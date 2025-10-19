import style from "@/styles/components/Atoms/box";
import { Component } from "@angular/core";

@Component({
  selector: "app-box",
  template: ` <div [class]="style">
    <ng-content />
  </div>`,
})
export class BoxComponent {
  protected readonly style = style;
}
