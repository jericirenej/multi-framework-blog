import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { NotFoundComponent } from "../../Organisms/NotFound/not-found.component";
import { Router } from "@angular/router";

@Component({
  selector: "app-404-page",
  imports: [NotFoundComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<main class="flex justify-center">
    <div class="mt-52">
      <app-not-found (navigateEvent)="handleRedirect()" />
    </div>
  </main>`,
})
export class NotFoundPage {
  protected router = inject(Router);

  async handleRedirect() {
    await this.router.navigateByUrl("/");
  }
}
