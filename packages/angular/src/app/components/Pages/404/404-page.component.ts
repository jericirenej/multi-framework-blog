import style from "@/styles/components/Pages/404";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { NotFoundComponent } from "../../Organisms/NotFound/not-found.component";

@Component({
  selector: "app-404-page",
  imports: [NotFoundComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<main [class]="style.main">
    <div [class]="style.notFoundWrapper">
      <app-not-found (navigateEvent)="handleRedirect()" />
    </div>
  </main>`,
})
export class NotFoundPage {
  protected readonly style = style;
  protected router = inject(Router);

  async handleRedirect() {
    await this.router.navigateByUrl("/");
  }
}
