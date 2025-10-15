import { HttpErrorResponse } from "@angular/common/http";
import { DestroyRef, inject, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormBuilder, type FormGroup } from "@angular/forms";
import {
  catchError,
  distinctUntilChanged,
  filter,
  finalize,
  from,
  of,
  switchMap,
  take,
  tap,
  type Observable,
  type Subscription,
} from "rxjs";
import { FormRegisterService } from "./form-register.service";

export type ResultStatus =
  | { status: "unsubmitted" | "submitting" }
  | { status: "error"; message: string }
  | { status: "success"; value: unknown };

@Injectable()
export abstract class AbstractFormService<FormType extends FormGroup> {
  protected readonly formRegisterService = inject(FormRegisterService);
  protected _form: ReturnType<typeof this.buildForm> | null = null;
  protected readonly fb = inject(FormBuilder);
  readonly resultStatus = signal<ResultStatus>({ status: "unsubmitted" });
  formWatcher: Subscription | undefined;
  protected destroyRef = inject(DestroyRef);

  defaultErrorMessage: string = "Submission failed";
  initialFormValue: ReturnType<FormType["getRawValue"]> | undefined = undefined;

  abstract buildForm(
    initialValues?: ReturnType<FormType["getRawValue"]>,
  ): FormType;

  get form() {
    if (this._form !== null) return this._form;
    return this.initializeForm();
  }

  protected initializeForm() {
    this._form = this.buildForm(this.initialFormValue);
    this.formWatcher?.unsubscribe();
    this.formWatcher = this.form.valueChanges
      .pipe(
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr),
        ),
        filter(() => this.resultStatus().status !== "unsubmitted"),
        tap(() => {
          this.resultStatus.set({ status: "unsubmitted" });
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
    return this._form;
  }

  protected abstract submitHandler(): Observable<unknown>;

  protected callSubmitHandler() {
    return of(null)
      .pipe(
        tap(() => {
          this.form.disable();
          this.resultStatus.set({ status: "submitting" });
        }),
        switchMap(() =>
          this.submitHandler().pipe(
            switchMap((result) => {
              if (result instanceof Response && !result.ok) {
                return from(result.text()).pipe(
                  tap((errMessage) => {
                    throw new Error(errMessage);
                  }),
                );
              }
              return of(result);
            }),
            tap((value) => {
              this.resultStatus.set({ status: "success", value });
              this.initialFormValue =
                this.form.getRawValue() as typeof this.initialFormValue;
              this.form.markAsPristine();
            }),
            catchError((err) => {
              this.resultStatus.set({
                status: "error",
                message: this.handleError(err),
              });
              throw err;
            }),
            finalize(() => {
              this.form.enable();
            }),
            take(1),
          ),
        ),
      )
      .subscribe();
  }
  protected handleError(err: unknown): string {
    return err instanceof HttpErrorResponse
      ? typeof err.error === "string"
        ? err.error
        : err.message
      : err instanceof Error
        ? err.message
        : this.defaultErrorMessage;
  }

  submit() {
    const ref = this.formRegisterService.ref;
    if (!ref) {
      console.warn("Form ref should to be registered");
    }
    this.form.markAllAsDirty();
    if (this.form.invalid) {
      const el = ref?.nativeElement.querySelector<HTMLElement>(".ng-invalid");
      el?.focus();
      return;
    }
    this.callSubmitHandler();
  }
}
