# Multimedia tooltips for Google Charts
Multimedia tooltips for Google Charts is a jQuery plugin, that enhances standard Google Charts tooltips.

The plugin's function is to convert URLs in the chart data into HTML tags like: `<img>`, `<audio>`, `<video>` and `<a>` and render them inside the Google Charts tooltips.

## Features
- Single-line plugin integration.
- Click through tooltip, if datapoint is not selected.
- Supported protocols: `https`, `http` and `ftp`.
- Supported file extensions: `gif`, `jpg`, `jpeg`, `tiff`, `png`, `mp3`, `m4a`, `ogg`, `mp4` and `webm`.
- Integrated error case processing.

Check the [demo site](#demo) to see an example.

**[See the demo](#demo)**

## Usage example
To use this plugin, all you need to do is add this line right before calling Google Chart's `draw()` method:

```javascript
$.tooltips( data, chart, options );
```

Note, that all arguments are required. Also it is important to define variables before passing them to <code>$.tooltips</code>, some of them are overrided when plugin is initialized.

### Here's full code example:
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
bower install gc-multimedia-tooltips
```
