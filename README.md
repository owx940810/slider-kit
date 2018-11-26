# slider-kit
responsive and touch-enabled slider plugin

## Usage

### html

head
```
// include libraries
<link rel="stylesheet" href="/path/to/slider-kit.css" />
<script src="/path/to/slider-kit.js"></script>
```

body
```
<div class="slider-wrapper">
  <div class="slider-items">
    <a class="slider-item" href="your-link-here"><img src="your-image-url-here" draggable="false"/></a>
    <a class="slider-item" href="your-link-here"><img src="your-image-url-here" draggable="false"/></a>
  </div>

  // optional buttons and pagination
  <button class="slider-button-left"></button>
  <button class="slider-button-right"></button>
  <div class="slider-paginations"></div>
</div>
```

### js
to instantiate sliderkit on all sliders

```
new Sliderkit()
```

to instatiate sliderkit on single element

```
let element = window['your-element-id']
new Sliderkit(element)
```
