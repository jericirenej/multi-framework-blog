import { Component, output } from "@angular/core";
import type { Meta, StoryObj } from "@storybook/angular";
import { IntersectionEventComponent } from "./intersection-event.component";

@Component({
  selector: "storybook-intersection-event",
  imports: [IntersectionEventComponent],
  template: ` <div class="h-[200px] overflow-y-auto bg-neutral-200">
    <div class="h-[400px] w-full"></div>
    <app-intersection-event (trigger)="trigger.emit()"
      ><div class="bg-inherit">Trigger block</div></app-intersection-event
    >
  </div>`,
})
class IntersectionTriggerWrapperComponent {
  readonly trigger = output();
}

const meta = {
  title: "Atoms/IntersectionEvent",
  component: IntersectionTriggerWrapperComponent,
  argTypes: { trigger: { action: "In viewport" } },
} satisfies Meta<IntersectionTriggerWrapperComponent>;

export default meta;
export const IntersectionStory: StoryObj<IntersectionTriggerWrapperComponent> =
  { name: "IntersectionEvent" };
