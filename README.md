
<p align="center" width="20%">
    <img src="https://raw.githubusercontent.com/seezaara/SVGChart/main/doc/shot.png"> 
</p>

## SVGChart

- 🚀 Zero dependencies
- 🎨 SVG rendering
- 📈 Multiple datasets
- 📉 Straight or smooth curves
- 💡 Interactive value tooltips
- 🎯 Custom point styling
- 🎭 Shadow DOM isolation
- ✨ Clip-path area fills
- ⚡ Responsive (ResizeObserver)
- 🪶 Lightweight (6.6kb)

## Installation

Simply include the script.

```html
<script src="SVGChart.js"></script>
```

## Basic Usage

```html
<div id="chart"></div>

<script>
const chart = Chart(
    document.getElementById("chart"),
    [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May"
    ]
);

chart.add({
    list: [20,35,18,42,28],

    line:{
        color:"#5B8DEF",
        width:3,
        curve:.6
    }
});
</script>
```

# Creating a chart

```javascript
const chart = Chart(element, labels, options);
```

## Parameters

| Name | Type | Description |
|------|------|-------------|
| element | HTMLElement | Target container |
| labels | Array | X-axis labels |
| options | Object | Global chart options |

# Global Options

```javascript
{
    style:"",
    hide:"",
    range:function(value){}
}
```

## style

Inject custom CSS into the chart Shadow DOM.

```javascript
style:`
.chartp{
    --pointer:#ff0000;
}
`
```

## hide

Always display the tooltip for a specific point.

Example

```javascript
hide:"(3)"
```

## range

Customize values shown on the left axis.

```javascript
range(value){
    return "$"+value;
}
```

# Adding a dataset

```javascript
chart.add(options)
```

Example

```javascript
chart.add({

    list:[10,30,20,50,35],

    line:{
        color:"#00AAFF",
        width:3,
        curve:.6
    }

});
```

# Dataset Options

## list

Required

```javascript
list:[]
```

Numeric values.

Length **must equal** label count.

## line

Configures the SVG line.

```javascript
line:{
    color:"#4A8FFF",
    width:3,
    curve:.5,
    style:""
}
```

### color

Stroke color.

### width

Line thickness.

### curve

Smoothness.

```
0 = straight

0.3 = soft

0.6 = smooth

1 = very smooth
```

### style

Extra CSS.

Example

```javascript
style:`
filter:drop-shadow(0 0 8px #4A8FFF);
`
```

## clip

Creates a clipping path for area fills.

```javascript
clip:true
```

or

```javascript
clip:-1
```

## clip_style

Style applied to clipped area.

Example

```javascript
clip_style:`
background:
    linear-gradient(
        to top,
        rgba(0,120,255,.35),
        transparent
    );
`
```

## value_show

Customize tooltip values.

```javascript
value_show(value,label){

    return label+": $"+value;

}
```

# Point Styling

Every point can be customized.

## pointer

```javascript
pointer:`
height:80%;
`
```

## pointer_hover

```javascript
pointer_hover:`
height:90%;
`
```

## value

Tooltip style.

```javascript
value:`
background:#333;
color:white;
`
```

## value_hover

Tooltip while hovering.

## spot

The point indicator.

```javascript
spot:`
background:red;
padding:7px;
`
```

## spot_hover

Hovered point indicator.

# Multiple datasets

```javascript
chart.add({
    list:[10,20,30,25,40],

    line:{
        color:"#4A8FFF"
    }
});

chart.add({
    list:[15,10,40,35,45],

    line:{
        color:"#FF5C5C"
    }
});
```

# Remove datasets

Remove last dataset

```javascript
chart.remove();
```

Remove dataset by index

```javascript
chart.remove(0);
```

# Refresh

Re-render the chart.

```javascript
chart.refresh();
```

# Styling

SVGChart exposes CSS variables.

```css
.chartp{

    --pointer:#4A8FFF;

    --line:rgba(0,0,0,.08);

    --bakcground-value:#222;

    --color-value:#fff;

}
```

# licence
fully free to use and change
 <p>
    <img width="32px" src="https://raw.githubusercontent.com/seezaara/RocketV2ray/main/doc/logo.png"><a href="https://www.youtube.com/@seezaara">seezaara youtube</a>
<br>
    <img width="32px" src="https://raw.githubusercontent.com/seezaara/RocketV2ray/main/doc/logo.png"><a href="https://t.me/seezaara">seezaara telegram</a>
</p> 
