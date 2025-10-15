import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { type FormControl, ReactiveFormsModule } from "@angular/forms";
import {
  InputComponent,
  type SimpleInputType,
} from "../../Molecules/Input/input.component";
import { InputWrapperComponent } from "../../Molecules/InputWrapper/input-wrapper.component";

@Component({
  selector: "app-form-input",
  imports: [InputWrapperComponent, InputComponent, ReactiveFormsModule],
  template: `
    <app-input-wrapper [control]="control()">
      <app-input [type]="type()" [label]="label()" [formControl]="control()" />
    </app-input-wrapper>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormInputComponent {
  readonly control = input.required<FormControl>();
  readonly type = input<SimpleInputType>("text");
  readonly label = input.required<string>();
}
