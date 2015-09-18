# Tooltips plugin
Tooltips plugin is a jQuery plugin, that converts standard Google Charts tooltips into user friendly. It                 converts urls in chart data into tags like: `<img>`, `<audio>`, `<video>` and `<a>`.

## Features
- Single-line plugin integration
- Click through tooltip, if datapoint is not selected
- Supported protocols: `https`, `http` and `ftp`.
- Supported file extensions: `gif`, `jpg`, `jpeg`, `tiff`, `png`, `mp3`, `m4a`, `ogg`, `mp4` and `webm`.
- Integrated error case processing

You can take a look at below at how this plugin is already working in production!

## Images
<iframe frameborder="0" scrolling="no" width="600" height="375" src="https://www.blowchart.com/embed/cbbbjQ?width=600"></iframe>

## Audio
<iframe frameborder="0" scrolling="no" width="600" height="375" src="https://www.blowchart.com/embed/cbbbjR?width=600"></iframe>

## Usage example
To use this plugin, all you need to do is add this line right before calling Google Chart's `draw()` method:

```javascript
$.tooltips( data, chart, options );
```
Note, that all arguments are required.

## Here's full code example:
```javascript
$( function() {
    // Load the Visualization API and the piechart package.
    google.load( "visualization", "1.0", {
        "packages": [ "corechart" ],
        "callback": function() {
            // Create the data table.
            var data = new google.visualization.DataTable();
            data.addColumn( "string", "Topping" );
            data.addColumn( "number", "Slices" );
            data.addRows( [
                [ "Mushrooms https://upload.wikimedia.org/wikipedia/commons/b/b8/Mushroom_-_unidentified.jpg", 3 ],
                [ "Onions http://media.mercola.com/assets/images/food-facts/onion-healthy-recipes.jpg", 1 ],
                [ "Olives http://www.gourmetsleuth.com/images/default-source/dictionary/spanish-olives.jpg?sfvrsn=6", 1 ],
                [ "Zucchini https://u.osu.edu/buckmdblog/files/2015/05/zucchini-ym5607.jpg", 1 ],
                [ "Pepperoni http://www.salumeriabiellese.com/images/big/Pepperoni.jpg", {
                    v: 2,
                    f: "two"
                } ]
            ] );

            // Set chart options
            var options = {
                "title": "How Much Pizza I Ate Last Night"
            };

            // Instantiate and draw our chart, passing in some options.
            var chart = new google.visualization.PieChart( $( "#chart-example" )[ 0 ] );

            // Call tooltips plugin
            $.tooltips( data, chart, options );

            // Draw chart
            chart.draw( data, options );
        }
    } );
} );
```

## Installation instructions
```bash
npm install tooltips
```
