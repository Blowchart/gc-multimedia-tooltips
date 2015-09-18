(function( $ ) {
    /**
     * Plugin initialization
     *
     * @param data {object} Data, that is going to be visualized
     * @param chart {object} Google Charts object
     * @param options {object} Google Charts options object
     */
    $.tooltips = function( data, chart, options ) {

        // Output warnings in console, if any of parameters is not passed

        if (typeof data != "object") {
            console.warn( "Chart data is not passed to plugin or is incorrect type" );
        }
        else if (typeof chart != "object") {
            console.warn( "Google Chart object is not passed to plugin or is incorrect type" );
        }
        else if (typeof options != "object") {
            console.warn( "Chart options argument is not passed to plugin or is incorrect type" );
        }
        else {
            // Initialize class

            var tooltips = new Tooltips();

            tooltips.type = chart.gh;
            tooltips.chartClass = chart;
            tooltips.chartDomElement = $( chart.ma );
            tooltips.setOriginalData( data );
            tooltips.parseTooltips();

            // Override options

            options = $.extend( options, {
                tooltip: {
                    isHtml: true,
                    trigger: "both"
                }
            } );

            // Add tooltip events

            google.visualization.events.addListener( chart, "select", function() {
                if (!tooltips.leaveSelectedDatapoint) {
                    var selectedItem = chart.getSelection()[ 0 ];
                    tooltips.toggleTooltip( selectedItem, "select" );
                }
                else {
                    chart.setSelection( [ tooltips.leaveSelectedDatapoint ] );
                }
            } );

            google.visualization.events.addListener( chart, "onmouseover", function( hoveredItem ) {
                if (!$( "." + tooltips.tooltipClass + ".selected:hover", tooltips.chartDomElement ).length && hoveredItem) {
                    tooltips.toggleTooltip( hoveredItem, "mouseover" );
                }
            } );

            google.visualization.events.addListener( chart, "onmouseout", function() {
                var selectedItem = chart.getSelection()[ 0 ];
                tooltips.toggleTooltip( selectedItem, "mouseout" );
            } );

            // Disallow clicking through selected tooltip
            tooltips.chartDomElement.on( "click", function( e ) {
                if ($( "." + tooltips.tooltipClass + ".selected", tooltips.chartDomElement ).length) {
                    var area = tooltips._calculateTooltipArea( $( "." + tooltips.tooltipClass + ".selected", tooltips.chartDomElement ) );
                    if (!!(e.pageX > area.left && e.pageX < area.right && e.pageY > area.top && e.pageY < area.bottom)) {
                        tooltips.leaveSelectedDatapoint = tooltips.chartClass.getSelection()[ 0 ];
                    }
                    else {
                        tooltips.leaveSelectedDatapoint = false;
                    }
                }
                else {
                    tooltips.leaveSelectedDatapoint = false;
                }
            } );

            return tooltips;
        }
    };

    // Tooltip class

    function Tooltips() {
        // Original data
        this.originalData = {};
        // Parsed data
        this.data = {};
        // Chart type
        this.type;
        // Flag to leave selected data point
        this.leaveSelectedDatapoint = false;
        // Tooltip class
        this.tooltipClass = "chart-tooltip";
        // Chart DOM element
        this.chartDomElement;
        // Google Charts class
        this.chartClass;

        /**
         * Calculates tooltip area
         *
         * @param $tooltip {object} Tooltip jQuery object
         * @returns {{bottom: Number, height: Number, left: Number, right: Number, top: Number, width: Number}}
         * @private
         */
        this._calculateTooltipArea = function( $tooltip ) {
            var offset = $tooltip.offset();
            var boundingClient = $tooltip[ 0 ].getBoundingClientRect();

            var scroll = {
                "left": offset.left - boundingClient.left,
                "top": offset.top - boundingClient.top
            };

            return {
                "bottom": boundingClient.bottom + scroll.top,
                "height": boundingClient.height,
                "left": boundingClient.left + scroll.left,
                "right": boundingClient.right + scroll.left,
                "top": boundingClient.top + scroll.top,
                "width": boundingClient.width
            };
        };
    }

    /**
     * Parses links into HTML tags
     *
     * @param content {string} Content to be parsed
     * @returns {*}
     */
    Tooltips.prototype.parseContent = function( content ) {
        if (typeof content == "string" && content.length) {
            var exp;

            exp = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
            // Find all links
            content = content.replace( exp, function( match ) {
                var source, found;
                // Replace image links to <img>
                if ((/\.(gif|jpg|jpeg|tiff|png)/i).test( match )) {
                    return "<div class='chart-parsed-img-wrapper loading'><a href='" + match + "' title='" + match.replace( /"/g, "\"" ) + "' target='_blank' class='chart-parsed-img'><img src='" + match + "' alt='" + match.replace( /"/g, "\"" ) + "' /></a></div>"
                }
                // Replace audio links to <audio>
                else if ((found = (/\.(mp3|m4a|ogg)/i).exec( match )) && found.length == 2) {
                    switch (found[ 1 ]) {
                        case "mp3":
                            source = "<source src='" + match + "' type='audio/mpeg'>";
                            break;
                        case "m4a":
                            source = "<source src='" + match + "' type='audio/mp4'>";
                            break;
                        case "ogg":
                            source = "<source src='" + match + "' type='audio/ogg'>";
                            break;
                    }

                    return "<div class='chart-parsed-audio-wrapper loading'><audio controls class='chart-parsed-audio'>" + source + "Unable to play audio</audio><a href='" + match + "' title='" + match.replace( /"/g, "\"" ) + "' target='_blank' class='chart-parsed-url'>open url</a></div>"
                }
                // Replace video links to <video>
                else if ((found = (/\.(webm|mp4)/i).exec( match )) && found.length == 2) {
                    switch (found[ 1 ]) {
                        case "mp4":
                            source = "<source src='" + match + "' type='video/mp4'>";
                            break;
                        case "webm":
                            source = "<source src='" + match + "' type='video/webm'>";
                            break;
                    }

                    return "<div class='chart-parsed-video-wrapper loading'><video controls class='chart-parsed-video'>" + source + "Unable to play video</video><a href='" + match + "' title='" + match.replace( /"/g, "\"" ) + "' target='_blank' class='chart-parsed-url'>open url</a></div>"
                }
                // Replace links to <a>
                else {
                    return "<a href='" + match + "' title='" + match.replace( /"/g, "\"" ) + "' target='_blank' class='chart-parsed-url'>" + match + "</a>";
                }
            } );
        }

        return content;
    };

    /**
     * Generates parsed tooltips object
     */
    Tooltips.prototype.parseTooltips = function() {
        var context = this;
        var mergeData = [ "pie", "geo", "bubble", "scatter" ].indexOf( this.type ) > -1;

        context.originalData.rows.forEach( function( row, ri ) {
            var rowData = {};
            var tooltipContent = "";
            var labelColContent = "";

            row.c.forEach( function( col, ci ) {
                if (typeof context.originalData.cols[ ci ] != "undefined" && context.originalData.cols[ ci ].label) {
                    var originalValue = (col.f ? col.f : col.v);
                    var value = originalValue;

                    if (context.originalData.cols[ ci ].type == "string") {
                        value = context.parseContent( value );
                        if (value != originalValue && value.substring( value.length - 1 ) == "…") {
                            value = value.substring( 0, value.length - 1 );
                        }
                    }

                    if (ci > 0) {
                        var label = context.originalData.cols[ ci ].label;
                        label = (!mergeData ? context.parseContent( label ) : label);

                        if (label == context.originalData.cols[ ci ].label) {
                            value = "<p><b>" + label + ":</b> " + value + "</p>";
                        }
                        else {
                            if (label.substring( label.length - 1 ) == "…") {
                                value = label.substring( 0, label.length - 1 );
                            }
                            else {
                                value = label;
                            }
                        }

                        value = (!mergeData ? labelColContent + value : value);
                    }
                    else {
                        value = "<p>" + value + "</p>";

                        labelColContent = value;
                    }

                    rowData[ ci ] = value;

                    if (mergeData) {
                        tooltipContent += value;
                    }
                }
            } );

            if (mergeData) {
                for (var rdi = 0; rdi < Object.keys( rowData ).length; rdi++) {
                    rowData[ rdi ] = tooltipContent;
                }
            }

            context.data[ ri ] = rowData;
        } );
    };

    /**
     * Toggles tooltip
     *
     * @param datapoint {object} Data point on Google Chart
     * @param event {string} Event triggered
     */
    Tooltips.prototype.toggleTooltip = function( datapoint, event ) {
        var context = this;
        var selectedItem = context.chartClass.getSelection()[ 0 ];

        if (event == "select") {
            // Stop audio playback
            $( ".chart-parsed-audio, .chart-parsed-video" ).each( function( index, element ) {
                element.pause();
            } );
        }

        $( "." + context.tooltipClass, context.chartDomElement ).addClass( "hidden" );
        $( "." + context.tooltipClass, context.chartDomElement ).removeClass( "hovered selected" );

        if (typeof datapoint == "object" && datapoint && typeof datapoint.row != "undefined" && typeof datapoint.column != "undefined") {

            var row = parseInt( datapoint.row );
            var col = datapoint.column ? datapoint.column : 0;

            if (typeof context.data[ row ] != "undefined") {
                var $gcTooltip = $( ".google-visualization-tooltip:" + (selectedItem && selectedItem.row > row ? "first" : "last"), context.chartDomElement );
                context.chartDomElement.off( "mousemove" );

                if ($gcTooltip.length) {
                    var $tooltip = $( "." + context.tooltipClass + "[data-id='" + row + ":" + col + "']", context.chartDomElement );

                    if (!$tooltip.length) {
                        $tooltip = $( "<div class='" + context.tooltipClass + "' data-id='" + row + ":" + col + "'>" + context.data[ row ][ col ] + "</div>" );
                        var gcTooltipOffset = $gcTooltip.offset();
                        var gcTooltipHeight = $gcTooltip.outerHeight();

                        $gcTooltip.after( $tooltip );
                        var tooltipHeight = $tooltip.outerHeight();

                        var newPos = gcTooltipOffset.top + (gcTooltipHeight - tooltipHeight);
                        newPos = (newPos < context.chartDomElement.offset().top ? context.chartDomElement.offset().top : newPos);
                        gcTooltipOffset.top = newPos;

                        $tooltip.offset( gcTooltipOffset );
                        $gcTooltip.remove();

                        // Show loader, when loading images
                        if ($( ".chart-parsed-img-wrapper.loading", $tooltip ).length) {
                            $( ".chart-parsed-img-wrapper img", $tooltip ).on( "load", function() {
                                $( this ).parents( ".chart-parsed-img-wrapper:first" ).removeClass( "loading" );
                            } ).on( "error", function() {
                                $( this ).parents( ".chart-parsed-img-wrapper:first" ).removeClass( "loading" ).addClass( "chart-parsed-img-fail" );
                                $( this ).parents( ".chart-parsed-img-wrapper:first" ).html( "<span>Image failed to load<br /><a href='" + $( this ).attr( "src" ) + "' target='_blank'>open url</a></span>" );
                            } );
                        }

                        // Show loader, when loading audio
                        if ($( ".chart-parsed-audio-wrapper.loading", $tooltip ).length) {
                            $( ".chart-parsed-audio-wrapper audio", $tooltip )[ 0 ].addEventListener( "loadeddata", function() {
                                $( this ).parents( ".loading:first" ).removeClass( "loading" );
                            } );

                            $( ".chart-parsed-audio-wrapper audio", $tooltip )[ 0 ].addEventListener( "error", function( e ) {
                                var url = $( this ).find( "source" ).attr( "src" );
                                $( this ).parents( ".chart-parsed-audio-wrapper:first" ).removeClass( "loading" ).addClass( "chart-parsed-audio-fail" );
                                $( this ).parents( ".chart-parsed-audio-wrapper:first" ).html( "<span>Audio failed to load<br /><a href='" + url + "' target='_blank'>open url</a></span>" );
                            }, true );
                        }

                        // Show loader, when loading video
                        if ($( ".chart-parsed-video-wrapper.loading", $tooltip ).length) {
                            $( ".chart-parsed-video-wrapper video", $tooltip )[ 0 ].addEventListener( "loadeddata", function() {
                                $( this ).parents( ".loading:first" ).removeClass( "loading" );
                            } );

                            $( ".chart-parsed-video-wrapper video", $tooltip )[ 0 ].addEventListener( "error", function() {
                                var url = $( this ).find( "source" ).attr( "src" );
                                $( this ).parents( ".chart-parsed-video-wrapper:first" ).removeClass( "loading" ).addClass( "chart-parsed-video-fail" );
                                $( this ).parents( ".chart-parsed-video-wrapper:first" ).html( "<span>Video failed to load<br /><a href='" + url + "' target='_blank'>open url</a></span>" );
                            }, true );
                        }
                    }
                    else {
                        $gcTooltip.addClass( "hidden" );
                        $tooltip.removeClass( "hidden" );
                    }

                    if (event == "select" || event == "mouseout") {
                        if (selectedItem && datapoint && selectedItem.row == datapoint.row && selectedItem.column == datapoint.column) {
                            $tooltip.addClass( "selected" );
                        }
                    }

                    if (event == "mouseover") {
                        if (datapoint) {
                            var area = context._calculateTooltipArea( $tooltip );

                            context.chartDomElement.on( "mousemove", function( e ) {
                                if (selectedItem && datapoint && selectedItem.row == datapoint.row && selectedItem.column == datapoint.column) {
                                    context.toggleTooltip( datapoint, "select" );
                                }
                                else {
                                    if (e.pageX > area.left && e.pageX < area.right && e.pageY > area.top && e.pageY < area.bottom) {
                                        $tooltip.addClass( "hovered" );
                                    }
                                    else {
                                        $tooltip.removeClass( "hovered" );
                                    }
                                }
                            } );
                            context.chartDomElement.mousemove();
                        }
                    }
                }
            }
        }
    };

    Tooltips.prototype.setOriginalData = function( data ) {
        this.originalData = {"cols": data.Ff, "rows": data.Gf};
    };

}( jQuery ));
