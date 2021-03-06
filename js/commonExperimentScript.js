var experimentId;

$(document).ready(function () {
    $(".fullscreen").on('click', function () {
        goFullscreen();

    });
    $(".fullscreenExit").on('click', function () {
        exitFullscreen();
    });
});

/**
 * Posts end time when experiment is finished.
 * @param {type} experimentId
 * @returns {undefined}
 */
function experimentComplete(experimentId) {
    var buffer = getDateTime();

    $.ajax
    ({
        url: 'ajax/observer/updateExperimentResultData.php',
        async: false,
        type: 'POST',
        data: {
            "endTime": buffer,
            "experimentId": experimentId
        },
        success: function (data) {
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("Error");
            console.log(xhr.status);
            console.log(thrownError);
        }
    });
}

/**
 * Posta start time and meta data when starting the experiment.
 * @param {type} experimentId
 * @returns {undefined}
 */
function postStartData(experimentId) {
    var dimension = viewport();

    $.ajax
    ({
        url: 'ajax/observer/insertExperimentResultData.php',
        async: false,
        data: {
            'os': getOs(),
            'xDimension': dimension['width'],
            'yDimension': dimension['height'],
            'startTime': getDateTime(),
            'experimentId': experimentId
        },
        type: 'post',
        success: function (data) {

        },
        error: function (request, status, error) {
        }
    });
}

/**
 * Get's the dimensions of the viewport.
 * @returns {viewport.Anonym$0}
 */
function viewport() {
    var e = window;
    var a = 'inner';
    if (!('innerWidth' in window)) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return {width: e[a + 'Width'], height: e[a + 'Height']};
}

/**
 * Formats time values and appends zero where it is needed.
 * @param {type} number the value
 * @param {type} length length of the value
 * @returns {pad.str|String}
 */
function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

/**
 * Format times and returns value
 * @param {type} time in milliseconds
 * @returns {String} contains the whole time format
 */
function formatTime(time) {
    var min = parseInt(time / 6000),
        sec = parseInt(time / 100) - (min * 60),
        hundredths = pad(time - (sec * 100) - (min * 6000), 2);
    return (min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2) + ":" + hundredths;
}

/**
 * Returns operating system.
 * @returns {String}
 */
function getOs() {
    var OSName = "unknown OS";
    if (navigator.appVersion.indexOf("Win") != -1)
        OSName = "Windows";
    if (navigator.appVersion.indexOf("Mac") != -1)
        OSName = "MacOS";
    if (navigator.appVersion.indexOf("X11") != -1)
        OSName = "UNIX";
    if (navigator.appVersion.indexOf("Linux") != -1)
        OSName = "Linux";

    return OSName;
}


/**
 * http://stackoverflow.com/questions/10211145/getting-current-date-and-time-in-javascript
 * @author Daniel Lee
 * @returns {String} date and time
 */
function getDateTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (month.toString().length == 1) {
        var month = '0' + month;
    }
    if (day.toString().length == 1) {
        var day = '0' + day;
    }
    if (hour.toString().length == 1) {
        var hour = '0' + hour;
    }
    if (minute.toString().length == 1) {
        var minute = '0' + minute;
    }
    if (second.toString().length == 1) {
        var second = '0' + second;
    }
    var dateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    return dateTime;
}

/**
 * Getting sent experiment ID from POST
 * @returns {undefined}
 */
function getExperimentIdPost() {
    $.ajax
    ({
        url: 'ajax/observer/getPostData.php',
        async: false,
        data: {},
        dataType: 'json',
        success: function (data) {
            experimentId = data;
        },
        error: function (request, status, error) {
            alert("Whoopsi!\n Something went wrong.\n\nClose this to be returned to front page.");
            window.location = 'index.php';
        }
    });
}

/**
 * Hides/show fullscreen buttons whether user are using IE.
 * http://jsfiddle.net/9zxvE/383/
 * @returns {undefined}
 */
function IESpecific() {
    var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
    var isFirefox = typeof InstallTrigger !== 'undefined'; // Firefox 1.0+
    var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    // At least Safari 3+: "[object HTMLElementConstructor]"
    var isChrome = !!window.chrome && !isOpera; // Chrome 1+
    var isIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6

    if (isFirefox) {
        $('.image-position').switchClass("image-position", "image-position-moz", 0);
        $('.panner-side-right').switchClass("panner-side-right", "panner-side-right-moz", 0);
    }

    if (isIE == true) {

        $('#enter-fullscreen').addClass('iefix').remove();
        $('#exit-fullscreen').addClass('iefix').remove();
        $('#ie-info-fullscreen').show();

        $('#button-finished').removeClass('button-finished');
        $('#button-finished').addClass('button-finished-IE');

        $('.image-position').each(function (i, obj) {
            $(this).removeClass('image-position');
            $(this).addClass('image-position-IE');
        });

        $('#popupButtons2').addClass('popupButton-important-IE');
        $('#rating').css("width", "65%");
        $('.panner-side-left').switchClass("panner-side-left", "panner-side-left-ie", 0);
        $('.panner-side-right').switchClass("panner-side-right", "panner-side-right-ie", 0);

    }
    else {
        $('#ie-info-fullscreen').hide();
    }
}

/**
 * Retrieves data about experiment. That includes:
 * -isPublic
 * -backgrounColour
 * -showOriginal
 * -timer
 * @param {type} experimentId
 * @returns {undefined}
 */
function getSpecificExperimentData(experimentId) {
    $.ajax
    ({
        url: 'ajax/observer/getSpecificExperimentData.php',
        async: false,
        data: {'experimentId': experimentId},
        dataType: 'json',
        type: 'post',
        success: function (data) {

            if (data[0]['isPublic'] == '1 = Public') {
            }
            else {
                console.log("Experiment is NOT public");
            }

            if (data[0].timer == 0) {
                $('#time').hide();
            }

            if (data[0].showOriginal == 0) {
                $('#original').remove();
                $('#original-tag').remove();
                $('#reproduction').css("margin-left", "20%");
                $('#left-reproduction').css("margin-left", "20%");
                $('#drop-left').css("margin-left", "23.5%");
                $('#drop-right').css("margin-left", "3%");
                $('#button-finished').css("margin-top", "30%");
            }

            if (data[0].backgroundColour != null)
                setBackgroundColour(data[0].backgroundColour);

        },
        error: function (request, status, error) {

        }
    });
}

/*------------------------------- http://code-tricks.com/fullscreen-browser-window-with-jquery/ --------------------------------------*/

/**
 * Enables fullscreens mode
 * @returns {undefined}
 */
function goFullscreen() {
    var docElement, request;
    docElement = document.documentElement;
    request = docElement.requestFullScreen || docElement.webkitRequestFullScreen || docElement.mozRequestFullScreen || docElement.msRequestFullScreen;
    if (typeof request != "undefined" && request) {
        request.call(docElement);
    }
}

/**
 * Exits fullscreen mode
 * @returns {undefined}
 */
function exitFullscreen() {
    var docElement, request;
    docElement = document;
    request = docElement.cancelFullScreen || docElement.webkitCancelFullScreen || docElement.mozCancelFullScreen || docElement.msCancelFullScreen || docElement.exitFullscreen;
    if (typeof request != "undefined" && request) {
        request.call(docElement);
    }
}

/*-------------------------------------------------------------------------------------------------------------------------------------------*/


/**
 * Changes background colour for the experiment.
 * @param {type} colour
 * @returns {undefined}
 */
function setBackgroundColour(colour) {
    $('body').css('background-color', '' + colour + '!important');
}

/**
 * Checks if user has taken the experiment earlier.
 * @returns {undefined}
 */
function checkIfExperimentTaken() {
    $.ajax
    ({
        url: 'ajax/observer/getShowTimer.php',
        async: false,
        data: {'experimentId': experimentId},
        type: 'post',
        dataType: 'json',
        success: function (data) {

        },
        error: function (request, status, error) {

        }
    });
}

/**
 * Disables panning.
 */
function disablePanning() {
    var $elem;

    $elem = $('#pan1, #pan2, #pan3');

    $elem.panzoom("reset");
    $elem.panzoom("reset", false);
    $elem.panzoom("reset", {
        disableZoom: true
    });
}

function adjustScaling()    {
    var $elem;

    $elem = $('#pan1, #pan2, #pan3');


    $elem.panzoom("option", {
        increment: 0.4,
        minScale: 0.1,
        maxScale: 6,
        duration: 500,
        $reset: $("a.reset-panzoom, button.reset-panzoom")
    });

    //$elem.panzoom("resetZoom");
    //$elem.panzoom("resetZoom", false);
    //$elem.panzoom("resetZoom", {
    //    animate: false,
    //    silent: true,
    //    zoom: 3
    //});

    console.log("adjusting scaling");
}

//

/**
 * Checks dimensions of picture, and if picture is small enough to disable panning
 * @param originalUrl location/adress of the original picture.
 */
function panningCheck(originalUrl) {
    var img = new Image();

    img.onload = function () {
        //console.log("Image dimensions: " + this.width + 'x' + this.height);
        if (this.width < 500 && this.height < 500)
            disablePanning();
    }
    img.src = originalUrl;


}

