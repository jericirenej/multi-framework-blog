# Styles package

Contains Tailwind style references for reuse among frameworks.

## Setup

Consumer project must ensure that Tailwind will source the styles located here. This can be achieved by the following statement in the main CSS file that is also responsible for importing Tailwind:

```css
@source "path/to/styles/workspace";
```
