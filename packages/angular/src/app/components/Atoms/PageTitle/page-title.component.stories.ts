import type { Meta, StoryObj } from "@storybook/angular";
import { PageTitleComponent } from "./page-title.component";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "storybook-page-title",
  imports: [PageTitleComponent],
  template: `<app-page-title>{{ title() }}</app-page-title>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class PageTitleWrapperComponent {
  readonly title = input.required<string>();
}

const meta = {
  title: "Atoms/PageTitle",
  component: PageTitleWrapperComponent,
  args: { title: "Page title" },
} satisfies Meta<PageTitleWrapperComponent>;

export default meta;

export const PageTitle: StoryObj = {};
