import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  type ElementRef,
  input,
  model,
  viewChild,
} from "@angular/core";

@Component({
  selector: "app-dialog",
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./dialog.component.html",
})
export class DialogComponent {
  readonly title = input<string>();
  readonly show = model(true);

  protected readonly ref =
    viewChild.required<ElementRef<HTMLDialogElement>>("ref");

  protected handleModal(show: boolean) {
    const ref = this.ref();
    if (show && !ref.nativeElement.open) {
      ref.nativeElement.showModal();
    }
    if (!show && ref.nativeElement.open) {
      ref.nativeElement.close();
    }
  }
  constructor() {
    effect(() => {
      this.handleModal(this.show());
    });
  }
}
