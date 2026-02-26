# `Programs`

Renders a list of Programs in a slideshow format.

It uses `react-responsive-carousel` to render the Programs in a slider.

## Usage

```jsx
import { Programs } from 'components';

const MyPrograms = () => (
  <Programs programs={programs?.nodes} />
);
```

## Props

The `Programs` component accepts the following props:

### programs

The array of program nodes to be rendered as a slideshow.

Type: `Program[]`
Required: Yes
