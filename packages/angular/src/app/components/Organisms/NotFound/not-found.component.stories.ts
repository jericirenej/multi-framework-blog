import {
  applicationConfig,
  type Meta,
  type StoryObj,
} from "@storybook/angular";
import { NotFoundComponent } from "./not-found.component";
import { provideRouter } from "@angular/router";

const meta = {
  title: "Organisms/NotFound",
  component: NotFoundComponent,
  argTypes: { navigateEvent: { action: "Navigate action" } },
  decorators: [applicationConfig({ providers: [provideRouter([])] })],
} satisfies Meta<NotFoundComponent>;

export default meta;
export const NotFound: StoryObj<NotFoundComponent> = {};
