import { Component } from "@angular/core";

@Component({
  selector: "app-box",
  template: ` <div
    class="border-1 shadow-xs rounded-xl border-neutral-400 p-3 shadow-neutral-400"
  >
    <ng-content />
  </div>`,
})
export class BoxComponent {}
