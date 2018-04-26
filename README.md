# RateMeUp!

Before you go-go! This jQuery plugin turns number inputs into nice rating widgets.

## Depencies

[jQuery (v1.6+)](https://jquery.com)

## Quick start

Link the main CSS and JS files:
```html
<link rel="stylesheet" href="path-to-ratemeup/ratemeup.css" />
<script type="text/javascript" src="path-to-ratemeup/ratemeup.js"></script>
```

RateMeUp works on `input[type="number"]` elements. 
The input must have a `min`, `max` and `step` attribute in order to initialize correctly. 
The `step` value must be an integer or equal to 0.25 or 0.5.
```html
<input type="number" min="1" max="10" step="0.5" />
```

Initialize RateMeUp:
```javascript
$('input-number-selector').ratemeup();
```