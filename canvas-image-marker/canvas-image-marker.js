(function($) {
    'use strict';

    var initCanvasMarkerTool = function() {
        var canvas = $('<canvas>');
        var ctx = canvas[0].getContext('2d');
        var annotation = $('.annotation');
        var annotationText = $('#annotationText');
        var canvasContainer = $('.canvas-container');
        var image;
        var points = [];
        var savedShapes = [];
        var deleteArea = [];

        var TOOL = "MARKER";

		var matrixCanvas = document.getElementById('matrix');
		var matrixCtx = matrixCanvas.getContext('2d');


        $(document).ready( function() {
            setCanvasImage();
            $(canvasContainer).append(canvas); /* append the resized canvas to the DOM */
            canvas.on('mousedown', startdrag);
            canvas.on('mouseup', stopdrag);
            canvas.on('mousedown', click);

            $('#undo').on('click', undo);
            $('#delete-tool').on('click', setTool);
            $('.fillAlg').on('click', calcPolygonPoints);
            $('#saveAnnotation').on('click', saveAnnotation);
            $('#closeAnnotation').on('click', closeAnnotation);

            // params: element which will be moved, element which is dragable
            makeDraggable( ".annotation", "#annotationButtons" );
        });

        var setCanvasImage = function() {
            image = new Image();

            var resize = function() {
                canvas.attr('height', image.height).attr('width', image.width);
            };

            $(image).load(resize);
            image.src = canvasContainer.attr('data-image-url');

            if (image.loaded)
                resize();

            canvas.css({ background: 'url(' + image.src + ')' });
        };

		var Shape = function(points, annotation)
        {
            this.points = points;
            this.annotation = annotation;
            this.fill;

            this.setFill = function()
            {
                this.fill = calcFill(this);
            }
        };

        var click = function(e) {
            // var mouseX  = e.offsetX;
            // var mouseY  = e.offsetY;
            //
            // ctx.lineWidth = 2;
            //
            // for (var k = 0; k < savedShapes.length; k++) {
            //     ctx.beginPath();
            //     ctx.moveTo(savedShapes[k].points.x, savedShapes[k].points.y);
            //
            //     for (var d = 0; d < savedShapes[k].points.length; d++) {
            //         ctx.lineTo(savedShapes[k].points[d].x, savedShapes[k].points[d].y);
            //     }
            //
            //     if (ctx.isPointInPath(mouseX, mouseY)) {
            //         openAnnotation(mouseY, mouseX, k);
            //         break; /* we found the clicked polygon, no need to loop through the rest */
            //     }
            //     ctx.closePath();
            // }
        };

        var stopdrag = function(e) {
            $(this).off('mousemove');
            /* we're done drawing, save the shape */
            saveShape(e);
        };

        var startdrag = function() {
            $(this).on('mousemove', mousedrag);
        };

        /**
         * Calls the drawing function each time the mouse
         * has been dragged a certain distance.
         *
         * @return {boolean} false
         */
        var mousedrag = function(e) {
            e.preventDefault();

            var dis;
            var x = e.offsetX;
            var y = e.offsetY;

            for (var i = 0; i < points.length; i++) {
                dis = Math.sqrt(Math.pow(x - points[i].x, 2) + Math.pow(y - points[i].y, 2));
                if ( dis < 6 ) {
                    // return if we do not have enough distance
                    return false;
                }
            }

            points.push({ x: Math.round(x), y: Math.round(y) });

            draw();

            return false;
        };

        /**
         * Takes the values from the points and savedShapes array,
         * and draws it on the canvas.
         *
         * @return void
         */
        var draw = function() {
            /* clear the canvas each time */
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            drawSavedShapesEnd();

            // if (points.length > 0) {
            //     ctx.fillStyle = 'rgba(0, 0, 100, 0.3)';
            //     ctx.strokeStyle = 'rgb(0, 0, 100)';
            //     ctx.lineWidth = 2;
            //
            //     ctx.beginPath();
            //     ctx.moveTo(points[0].x, points[0].y);
            //
            //     for (var i = 0; i < points.length; i++) {
            //         if (points.length > 1) {
            //             ctx.lineTo(points[i].x, points[i].y);
            //         }
            //     }
            //
            //     ctx.fill();
            //     ctx.stroke();
            // }

            if (TOOL == "MARKER") {
                if (points.length > 0) {
                    ctx.fillStyle = 'rgba(0, 0, 100, 0.3)';
                    ctx.strokeStyle = 'rgb(0, 0, 100)';
                    ctx.lineWidth = 2;

                    ctx.beginPath();
                    ctx.moveTo(points[0].x, points[0].y);

                    for (var i = 0; i < points.length; i++) {
                        if (points.length > 1) {
                            ctx.lineTo(points[i].x, points[i].y);
                        }
                    }

                    ctx.fill();
                    ctx.stroke();
                }
            } else if (TOOL == "DELETE") {
                deleteArea.push( new Shape(points, "") );
                deleteArea[deleteArea.length-1].setFill();

                // for each point in the delete shape look for a match in existing shapes
                for (var i = 0; i < deleteArea[0].fill.length; i++) {
                    for (var j = 0; j < savedShapes.length; j++) {
                        for (var k = 0; k < savedShapes[j].fill.length; k++) {

                            if ( savedShapes[j].fill[k].x == deleteArea[0].fill[i].x &&
                                 savedShapes[j].fill[k].y == deleteArea[0].fill[i].y ) {

                                savedShapes[j].fill.splice(k, 1);

                                break; /* we found a match */
                            }

                        }
                    }
                }

                deleteArea = [];
            }

        };

        /**
         * Switch between the marker or delete tool.
         * If the tool is MARKER set it as DELETE, else set it as MARKER.
         */
        var setTool = function() {
            (TOOL == "MARKER") ? TOOL = "DELETE" : TOOL = "MARKER";
        };

        var drawSavedShapes = function() {
            if (savedShapes.length > 0) {
                ctx.fillStyle = 'rgba(0, 100, 0, 0.5)';
                ctx.strokeStyle = 'rgba(0, 100, 0, 0.5)';
                ctx.lineWidth = 2;

                for (var k = 0; k < savedShapes.length; k++) {
                    ctx.beginPath();
                    ctx.moveTo(savedShapes[k].points.x, savedShapes[k].points.y);

                    for (var d = 0; d < savedShapes[k].points.length; d++) {
                        ctx.lineTo(savedShapes[k].points[d].x, savedShapes[k].points[d].y);
                    }
                    ctx.closePath();
                    ctx.fill();
                    // ctx.stroke();
                }
            }
        };

		var drawSavedShapesEnd = function() {
            if (savedShapes.length > 0) {
                ctx.fillStyle = 'rgba(0, 100, 0, 0.5)';
                ctx.strokeStyle = 'rgba(0, 100, 0, 0.5)';
                ctx.lineWidth = 2;

                for (var k = 0; k < savedShapes.length; k++) {
                    for (var d = 0; d < savedShapes[k].fill.length; d++) {
                        ctx.fillRect(savedShapes[k].fill[d].x, savedShapes[k].fill[d].y, 1, 1);
                    }
                }
            }
        };

        /**
         * Save the shape by putting all the points from the points array into the savedShape array,
         * and then emptying the points array.
         *
         * @return void
         */
        var saveShape = function(e) {
            // only save the shape if we have atleast 3 points
            if (points.length > 2) {
                if (TOOL == "MARKER") {
                    // save all the x and y coordinates as well as any comment
                    savedShapes.push( new Shape(points, "") );
                    savedShapes[savedShapes.length-1].setFill();
                } else if (TOOL == "DELETE") {
                    deleteArea.push( new Shape(points, "") );
                    deleteArea[deleteArea.length-1].setFill();

                    // for each point in the delete shape look for a match in existing shapes
                    for (var i = 0; i < deleteArea[0].fill.length; i++) {
                        for (var j = 0; j < savedShapes.length; j++) {
                            for (var k = 0; k < savedShapes[j].fill.length; k++) {

                                if ( savedShapes[j].fill[k].x == deleteArea[0].fill[i].x &&
                                     savedShapes[j].fill[k].y == deleteArea[0].fill[i].y ) {

                                    savedShapes[j].fill.splice(k, 1);

                                    break; /* we found a match */
                                }

                            }
                        }
                    }

                    deleteArea = [];
                }
            }

            points = []; /* remove the current shape now that it's saved */

            draw();
            drawSavedShapesEnd();
        };

        /**
         * Delete one shape, by removing the last array element.
         *
         * @return void
         */
        var undo = function() {

            (points.length > 0) ? points = [] : savedShapes.pop();

            draw();
        };

        var reset = function() {
            points = [];
            savedShapes = [];

            draw();
        };

        /**
         * Get the value from the data-id attribute of the annotation container,
         * and update the savedShape at the corresponding array index.
         */
        var saveAnnotation = function(e) {
            e.preventDefault();

            var shapeID = annotation.attr('data-id');
            var annoText = $.trim(annotationText.val());

            /* get the annotation text and update the saved shape with that id */
            savedShapes[shapeID].annotation = annoText;

            closeAnnotation(e);
        };

        /**
         * Open and display the annotation box at the user's mouse position.
         * As well as displaying any previous set annotation text.
         */
        var openAnnotation = function(mouseY, mouseX, shapeIndex) {
            annotation.css({
                'display': 'block',
                'top': ( mouseY - (annotation.outerHeight() + 9) ) + "px",
                'left': ( mouseX - (annotation.outerWidth() / 2) ) + "px"
            });
            annotation.attr('data-id', shapeIndex);
            annotationText.val(savedShapes[shapeIndex].annotation);
        };

        var closeAnnotation = function(e) {
            e.preventDefault();
            annotation.css('display', 'none');
        };


/*---------------------------------------------------------------------------
							Fill Algorithm for Polygon
-----------------------------------------------------------------------------*/
		
		$('#hueLevel').change(function() { $(this).next().text( $(this).val() ); });
		$('#satLevel').change(function() { $(this).next().text( $(this).val() ); });
		
		function writeToFile(arr)
		{
			var array = JSON.stringify(arr);

			$.ajax
			({
				url: "writeDataToFile.php",
				data: { array: array },
				type: "POST"
			})
			.done(function(data)
			{
				alert(data);
			});
		}

		/**
		 *  Create a matrix of the experiment image with marked points as data.
		 *	@param  {array}  The array with marked points.
		 *	@return {array}	 The matrix.
		 */
		function createMatrix(data)
		{
			var t0 = performance.now();
			var matrix = [];

			// Init matrix: Very good performance:
			for (var i = 0; i < 800; i++)
			{
				matrix[i] = [];
				for (var j = 0; j < 533; j++)
				{
					matrix[i][j] = {val: 0};
				}
			}

			var t1 = performance.now();
			console.log('Init matrix:' + Math.round(t1 - t0) / 1000 + ' seconds.');

			var t2 = performance.now();

			// Calc matrix: Very good Performance:
			for(var i = 0; i < data.length; i++)
			{
				matrix[ data[i][0] ][ data[i][1] ].val++;
			}

			var t3 = performance.now();
			console.log('Calc matrix:' + Math.round(t3 - t2) / 1000 + ' seconds.');

			return matrix;
		}

		/**
		 *  Generate color for the heatmap.
		 *	@param  {Int}	  The current intersection value for the pixel.
		 *	@param  {Int}	  The highest value of intersections.
		 *	@return {String}  color in hsl format.
		 */
		function heatmapColor(cur, max, scaleType, huePassed, satPassed)
		{
			var valPerc = (cur / max);
			var color;
			
			function hueScale()
			{
				var hueLow = 125;						// Green value in hue scale
				var hue = hueLow - (hueLow * valPerc);
				color = 'hsl(' + hue + ',50%,50%)';
				return color;
			}
			
			function grayScale(hue, sat)
			{
				var shade = valPerc * 100;
				var hueStd = 0;
					
				var color = 'hsl(' + hue + ',' + sat + '%,' + shade + '%)';
	
				return color;
			}
			
			switch(scaleType)
			{
				case 0: return grayScale(huePassed, satPassed);
				case 1: return hueScale();
			}
			
		}

		/**
		 *  Draw the matrix in canvas as heatmap.
		 *	@param  {array}	  The matrix data to draw.
		 *	@return {Void}.
		 */
		function drawMatrixCanvas(data, hue, sat, scaleType)
		{
			var t0 = performance.now();
			var maxVal = 0;

			// Get max intersection value:
			for(var i = 0; i < data.length; i ++)
			{
				for(var j= 0; j < data[i].length; j ++)
				{
					if(i == 0)
						maxVal = data[i][j].val;
					else
					{
						if(data[i][j].val > maxVal)
							maxVal = data[i][j].val;
					}
				}
			}

			// Draw matrix with heatmap:
			for(var i = 0; i < data.length; i++)
			{
				for(var j= 0; j < data[i].length; j ++)
				{
					if(data[i][j].val > 0)
					{
						var point = [i,j];
						matrixCtx.fillStyle = heatmapColor(data[i][j].val, maxVal, scaleType, hue, sat);
						matrixCtx.fillRect( point[0], point[1], 1, 1 );
					}
				}
			}

			var t1 = performance.now();
			console.log('Render matrix:' + Math.round(t1 - t0) / 1000 + ' seconds.');


		}

		// Render matrix in html table,
		// (!) not finished.
		function drawMatrixTable(matrixData)
		{
			$('body').remove('#matrixTable');
			$('body').append('<table id = "matrixTable" style = "font-size: 25%;"></table>');

			var table = $('#matrixTable');

			var tableData = "";

			var flag;

			for(var i = 0; i < matrixData.length-1; i++ )
			{
				if( i % 800 == 0 )
				{
					flag = i;
					tableData += "<tr>";
				}

				if(matrixData[i].val > 0)
					tableData += '<td style = "color: #fff;">'+matrixData[i].val+'</td>';
				else
					tableData += '<td>0</td>';

				if ( i != flag && i % 800 == 0 )
					tableData += "</tr>";
			}

			table.html(tableData);


		}

		/**
		 *  Remove duplicates from the matrix array.
		 *	Used for multidimensional arrays.
		 *	@param  {Array}	  The current matrix.
		 *	@return {Boolean} Returns an unique matrix.
		 */
		function removeDupeVerts(dataArray)
		{
			// This method is more effective rather than using For or For-each loops
			// URL: http://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array
			// Answear by: georg | paragraph "Unique by..."
			// Fetched: 02.03.2016, 00:30.

			function uniqBy(a, key)
			{
				var seen = {};
				return a.filter(function(item)
				{
					var k = key(item);
					return seen.hasOwnProperty(k) ? false : (seen[k] = true);
				});
			}
			return uniqBy(dataArray, JSON.stringify);
		}

		/**
		 * Fill Algorithm | Ray-casting
		 * @param	{Array}	   Point(x,y) to check if it intersects with the polygon.
		 * @param	{Array}	   The rectangle area container for the polygon.
		 * @return 	{Boolean}  Returns true if the point is inside the polygon.
		 */
		function pointInsidePolygon(point, vertices)
		{
			// ray-casting algorithm based on
			// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

			var px = point[0], py = point[1];

			var inside = false;
			var j = vertices.length - 1;

			var xi, yi, xj, yj;

			for (var i = 0; i < vertices.length; i++)
			{
				var xi = vertices[i][0], yi = vertices[i][1];
				var xj = vertices[j][0], yj = vertices[j][1];

				var intersect = ((yi > py) != (yj > py))
					&& (px < (xj - xi) * (py - yi) / (yj - yi) + xi);

				if (intersect)
					inside = !inside;

				j = i;
			}
			return inside;
		}

		/**
		 * Calculate a rectangle of the polygon.
		 * Optimizing purposes to avoid iterating the whole image matrix for each polygon.
		 * @param  { Object }  Polygon object to calculate its rectangle.
		 * @return { Array }   The vertices of the calculated rectangle.
		 */
		function polygonToRectangle(polygon)
		{
			// Return lowest value in array:
			Array.min = function( array ){ return Math.min.apply( Math, array ); };

			// Return highest value in array:
			Array.max = function( array ){ return Math.max.apply( Math, array ); };

			var x = [], y = [];

			for(var i = 0; i < polygon.length; i ++)
			{
				x.push(polygon[i][0]);
				y.push(polygon[i][1]);
			}

			var rectVertices = [ Array.min(x), Array.min(y), Array.max(x), Array.max(y) ];

			return rectVertices;
		}

		/**
		 * Convert the polygon object vertices to array.
		 * @param  {Object}  polygon object.
		 * @return {Array}   polygon's vertices (x,y).
		 */
		function convertPolygonCoordToArray(polygon)
		{
			var array = [];
			var tempArr = [];
			for(var i = 0; i < polygon.points.length; i++)
			{
				tempArr = [polygon.points[i].x, polygon.points[i].y];
				array.push(tempArr);
			}
			return array;
		}

		/**
		 * Calculate total pixel points for all polygons.
		 * Estimates from the current savedShapes.
		 * @return {Array} Array of every marked pixel.
		 */
		var calcPolygonPoints = function()
		{
			if(savedShapes.length > 0) 												// Atleast one polygon exists:
			{
				var hue = $('#hueLevel').val();
				var sat = $('#satLevel').val();
				var scale = 0;
				
				var t0 = performance.now();
				var allMarkedPoints = [];											// Store all marked pixels.

				for (var i = 0; i < savedShapes.length; i++)
				{
					for(var j = 0; j < savedShapes[i].fill.length; j ++)
					{
						allMarkedPoints.push([savedShapes[i].fill[j].x, savedShapes[i].fill[j].y] );
					}
				}

				//console.log('Before removing dupes: ' + allMarkedPoints.length);
				//allMarkedPoints = removeDupeVerts(allMarkedPoints);					// Remove duplicated vertices.
				//console.log('After removing dupes: ' + allMarkedPoints.length);
				
				if( $('#hueScale[type=checkbox]').is(':checked') )
					scale = 1;
					
				
				var matrix = createMatrix(allMarkedPoints);							// Array with all matrixes and intersect value.
				drawMatrixCanvas(matrix, hue, sat, scale);

				//drawMatrixTable(matrix);

				var t1 = performance.now();
				console.log("Fill polygon took " + Math.round(t1 - t0) / 1000 + " seconds. \n\n");

				return allMarkedPoints;
			}
			else
				alert('Please create a polygon');
		}

		/**
		 * Calculate all points inside a shape.
		 * @param  {Object}  A shape to find all marked pixels.
		 * @return {Array}   Array of every marked pixel for this shape.
		 */
		function calcFill(shape)
        {
			var polygonRect = [];									// Keeps the polygon rectangle vertices.
			var tempPolygonArr  = [];								// Keeps a polygon's coordinates in a 2D array.

			var fillArray = [];
            tempPolygonArr = convertPolygonCoordToArray(shape); 	// Convert to array.
            polygonRect = polygonToRectangle(tempPolygonArr);		// Return array of vertices from the polygon's rectangle.
                                                                    // All 4 vertices of the rectangle:
            var rect_p1 = polygonRect[0], rect_p2 = polygonRect[1],
                rect_p3 = polygonRect[2], rect_p4 = polygonRect[3];

                                                                        // Find all the points that are inside the polygon:
            for(var i = rect_p1; i < rect_p3; i ++ )
            {
                for(var j = rect_p2; j < rect_p4; j++)
                {
                    var point = [i,j];          						// Check this point.

                    if( pointInsidePolygon(point, tempPolygonArr) ) {	// The point is inside the polygon:
                        fillArray.push( {x:i, y:j} );
                    }
                }
            }

            return fillArray;
        }


/*---------------------------------------------------------------------------
							END: Fill Algorithm for Polygon
-----------------------------------------------------------------------------*/
        /**
         * Make any element draggable.
         *
         * @param {string} id or class name of html element which is grabable
         * @param {string} id or class name of html element to be moved
         */
         var makeDraggable = function(grabable, moveable) {
             var grabable = $(grabable);

             grabable.on('mousedown', moveable, function() {
                 grabable.addClass('draggable').parents().on('mousemove', function(e) {
                     e.preventDefault();

                     var draggable = $('.draggable');
                     var y = e.pageY - draggable.outerHeight() / 2;
                     var x = e.pageX - draggable.outerWidth() / 2;

                     /* put the mouse at the center of the moveable object and keep
                      * it there as we move the mouse, until we release the mouse button */
                     draggable.offset({ top: y, left: x }).on('mouseup', function() {
                         $(grabable).removeClass('draggable');
                     });
                 });
             }).on('mouseup', function() {
                 $('.draggable').removeClass('draggable');
             });
         };

    }; // end of init()


    /* Let's go. */
    $(document).ready(function() {
        initCanvasMarkerTool();
    });

})(jQuery);
