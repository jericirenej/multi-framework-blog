import type { Router } from "@angular/router";
import type { ResultStatus } from "../services/form.service";
import { delay, of, switchMap, take } from "rxjs";

export default ({
  router,
  result,
  path,
}: {
  router: Router;
  result: ResultStatus;
  path: string;
}) => {
  if (result.status !== "success") return;
  of(null)
    .pipe(
      delay(1000),
      switchMap(() => router.navigate([path])),
      take(1),
    )
    .subscribe();
};
