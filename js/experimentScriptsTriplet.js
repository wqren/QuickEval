// global variables
var originalDivClone;
var leftDivClone;
var rightDivClone;
var firstInstruction = 0;

$(document).ready(function () {

    (function () {
        var $section = $('#set2, #set1');
        $section.find('.panzoom').panzoom({
            $zoomIn: $section.find(".zoom-in"),
            $zoomOut: $section.find(".zoom-out"),
            $zoomRange: $section.find(".zoom-range"),
            $reset: $section.find(".reset"),
            $set: $section.find('.parent > div'),
            minScale: 1,
            maxScale: 1
        }).panzoom('zoom');
    })();


    $('#panzoom-reset').click(function() {
        $("#set1 .panzoom, #set2 .panzoom, #set3 .panzoom").panzoom("resetPan");
    });


    //-------Based on http://www.learningjquery.com/2009/02/slide-elements-in-different-directions/ ------

    $('#toggle-button').click(function () {
        toggleSlide();
    });

    //----------------------------------------------------


    //Listeners for arrow-keys and enter for finishing:
    $(document).keydown(function (e) {
        if (e.keyCode == 38) {                          //Selects none of the reproductions.
            $('#button-none').trigger('click');
        }
        else if (e.keyCode == 37) {                     //Selects the left reproduction.
            $('#left-reproduction').trigger('click');
            $('#button-next').trigger('click');
        }
        else if (e.keyCode == 39) {                     //Select the right reproduction.
            $('#right-reproduction').trigger('click');
            $('#button-next').trigger('click');
        }
        else if(e.keyCode == 13)    {                   //Allows user to exit the experiment with enter-key when experiment is performed.
            var check = $('#popupButtons #quit').is(":visible");
            if (check) {                                   //Checks if buttons is activated and visible to user.
                $('#popupButtons #quit').trigger('click');  //Quits finished experiment.
            }
        }
    });

    //-------------------------------------------

    $('#original-link').on('click', function () {                //sends user to new tab where picture may be seen in full
        var newWindow = window.open("pictureViewer.php");        //opening new document
        var url = $('#original-link').attr('href');              //fetching url of picture
        newWindow.data = url;
        newWindow.colour = $('body').css("background-color");
    });

    $('#left-reproduction-link').on('click', function () {        //sends user to new tab where picture may be seen in full
        var newWindow = window.open("pictureViewer.php");         //opening new document
        var url = $('#left-reproduction-link').attr('href');      //fetching url of picture
        newWindow.data = url;
        newWindow.colour = $('body').css("background-color");
    });

    $('#middle-reproduction-link').on('click', function () {        //sends user to new tab where picture may be seen in full
        var newWindow = window.open("pictureViewer.php");           //opening new document
        var url = $('#middle-reproduction-link').attr('href');      //fetching url of picture
        newWindow.data = url;
        newWindow.colour = $('body').css("background-color");
    });

    $('#right-reproduction-link').on('click', function () {         //sends user to new tab where picture may be seen in full
        var newWindow = window.open("pictureViewer.php");           //opening new document
        var url = $('#right-reproduction-link').attr('href');       //fetching url of picture
        newWindow.data = url;
        newWindow.colour = $('body').css("background-color");
    });

    //---------------------------------------------

    $('#instruction-continue').hide();
    getExperimentIdPost();
    postStartData(experimentId);
    deleteOldResults(experimentId);
    startNewExperimentForObserver(experimentId);
    nextComparison();
    // disableNextButton();
    IESpecific();
    allowTies();
    getSpecificExperimentData(experimentId);

    //----------------------------------------------


    $('#continue2').click(function () {
        if (firstInstruction == 0) {
            nextComparison();
            firstInstruction = 1;
        }
    });

    $('#button-none').click(function () {
        nextComparison();
    });

    $('#quit').click(function () {       //If user confirms cancel he is returned to main page
        window.location = 'index.php';
    });

    $('#instruction-continue').click(function () {
        nextComparison();
        $('#toggle-button').trigger('click');
        $('#instruction-continue').hide();
    });

});

//-------------------------------------------------------


/**
 * Check if either of the reproductions is selected and then updates none button.
 * @returns {undefined}
 */
function reproductionSelected() {
    if (!$('#left-reproduction').hasClass("main")
    && !$('#right-reproduction').hasClass("main")
    && !$('#middle-reproduction').hasClass("main")) {
        activateNoneButton();
    } else {
        disableNoneButton();
    }

    if ($('#left-reproduction').hasClass("main")
    || $('#right-reproduction').hasClass("main")
    || $('#middle-reproduction').hasClass("main")) {
        activateNextButton();
    } else {
        disableNextButton();
    }
}


/**
 * Resets the selection indicator for next step.
 * @returns {undefined}
 */
function resetSelected() {
    $('#right-reproduction').removeClass('main');
    $('#left-reproduction').removeClass('main');
    activateNoneButton();
    disableNextButton();
}

/**
 * Function checks if experiment allows ties between reproductions.
 * If it isn't allowed it hides the none button.
 * @returns {undefined}
 */
function allowTies() {
    $.ajax({
        url: 'ajax/observer/getIfAllowTies.php',
        async: false,
        data: {'experimentId': experimentId},
        type: 'post',
        dataType: 'json',
        success: function (data) {
            if (data[0].allowTies == 0) {       //ties not allowed, therefore hides none button.
                $('#button-none').hide();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("Error");
            console.log(xhr.status);
            console.log(thrownError);
        }
    });
}

/**
 * Disables the next button.
 * @returns {undefined}
 */
function disableNextButton() {
    $('#button-next-triplet').addClass('greyout');
    $('#button-next-triplet').attr('disabled', 'disabled');
}

/**
 * Activates next button.
 * @returns {undefined}
 */
function activateNextButton() {
    $('#button-next-triplet').removeClass('greyout');
    $('#button-next-triplet').removeAttr('disabled');
}

/**
 * Disables 'choose none' button.
 * @returns {undefined}
 */
function disableNoneButton() {
    $('#button-none').addClass('greyout');
    $('#button-none').attr('disabled', 'disabled');
}

/**
 * Activates 'choose none' button.
 * @returns {undefined}
 */
function activateNoneButton() {
    $('#button-none').removeClass('greyout');
    $('#button-none').removeAttr('disabled');
}

/**
 * Open and closes instruction panel which slides in and out.
 * @returns {undefined}
 */
function toggleSlider() {
    if (slider.classList.contains('opened')) {
        slider.classList.remove('opened');
        slider.classList.add('closed');
    } else {
        slider.classList.remove('closed');
        slider.classList.add('opened');
    }
}

var runned = 0;

/**
 * Checks whether user has chosen left or right reproduction and updates DB before loading next
 * @returns {undefined}
 */
function nextComparison() {
    var choose;
    var pictureOrderId;

    if ($('#left-reproduction').hasClass('main')) {         //user choose left
        choose = "null";
        pictureOrderId = $('#left-reproduction-link').attr('pictureOrderId');

        postResults("pair", pictureOrderId, choose);
    }

    if ($('#middle-reproduction').hasClass('main')) {        //user choose middle
        choose = "null";
        pictureOrderId = $('#middle-reproduction-link').attr('pictureOrderId');

        postResults("pair", pictureOrderId, choose);
    }

    if ($('#right-reproduction').hasClass('main')) {        //user choose right
        choose = "null";
        pictureOrderId = $('#right-reproduction-link').attr('pictureOrderId');

        postResults("pair", pictureOrderId, choose);
    }

    if (!$('#left-reproduction').hasClass('main') && !$('#right-reproduction').hasClass('main') && !$('#middle-reproduction').hasClass('main') && runned == 1) {      //user chose none
        choose = "1";
        pictureOrderId = $('#left-reproduction-link').attr('pictureorderid');
        postResults("pair", pictureOrderId, choose);
    }

    var data = getNextInExperimentForObserver();
    nextStep(data);

    runned = 1;
}

/**
 * Function post whether or which picture is chosen into reults in DB.
 * @param {type} type is the type of experiment
 * @param {type} pictureOrderId order of the chosen picture, identifies left or right
 * @param {type} choose whether user chose none, 1 i none
 * @returns {undefined}
 */
function postResults(exType, pictureOrderId, choose) {
    $.ajax({
        url: 'ajax/observer/insertChosenIntoResult.php',
        async: false,
        data: {
            'type': "pair",
            'experimentId': experimentId,
            'pictureOrderId': pictureOrderId,
            'chooseNone': choose,
        },
        type: 'post',
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
 * Sets original picture.
 * @param {type} $imageUrlOriginal original picture.
 * @returns {undefined}
 */
function setOriginal(originalImageUrl) {               //mangler hent original
    $.ajax({
        url: 'ajax/observer/getShowOriginal.php',
        async: false,
        data: { 'experimentId': experimentId },
        type: 'post',
        dataType: 'json',
        success: function (data) {
            if (data[0].showOriginal == 0) {
                removeOriginal();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("Error");
            console.log(xhr.status);
            console.log(thrownError);
        }
    });
    $('#original').find('img').attr('src', originalImageUrl);
    $('#original-link').attr('href', originalImageUrl); //Adding right top corner link
}

/**
 * Removes middle container if original is not being used for comparison,
 * and add a class for repositioning the reproductions.
 * @returns {undefined}
 */
function removeOriginal() {
    $('#original').remove();
    $('#experiment-container').removeAttr("style");
    $('#experiment-container').addClass('remove-original');
    $('#original-tag').remove();
}

/**
 * Receives object with data about experiment of reproductions and instructions.
 * Dependent of what object contains it either display reproduction, loads instruction
 * or if finished sends user back to front page.
 * @param {type} $imageUrl1 first/left reproduction picture
 * @param {type} $imageUrl2 second/right reproducation picture
 * @returns {undefined}
 */
function nextStep(receivedObject) {
    var instruction;
    var data = receivedObject;

    if (data['type'] == "experimentinstruction") {     //object contains and instruction
        instruction = data['experimentinstruction'];
        setInstruction(instruction);
        onlyInstruction();
    }

    if (data['type'] == "pictureQueue") {             //received array contains data about the reproduction
        var originalUrl = data[1]['originalUrl'].url; //getting url of original image

        panningCheck(originalUrl);
        setOriginal(originalUrl); // calls function for setting image.
        setPictures(data);
        setOriginal();
    }

    if (data['type'] == "finished") {           //user is finished
        experimentComplete(experimentId);
        $('#contactArea').empty();

        $('#button-next').text('Quit');
        activateNextButton();
        $('#button-next').show();

        $('#contactArea').append("You have finished, thank you for your time <br><br> Click Quit to return to front page.");
        $('#continue').hide();
        $('#popupButtons').css("margin-left", "46%");
        $('#cancel-experiment').trigger('click');
    }

    console.log("Next step ok");
}

/**
 * Sets left and right reproductions.
 * @param {type} object contains data about reproductions.
 * @returns {undefined}
 */
function setPictures(object) {
    var data = object;

    var pictureOrderIdLeft = data[1].pictureOrderId;
    var pictureOrderIdMiddle = data[2].pictureOrderId;
    var pictureOrderIdRight = data[3].pictureOrderId;

    var imageUrlLeft = data[1].url;
    var imageUrlMiddle = data[2].url;
    var imageUrlRight = data[3].url;

    $('#left-reproduction').find('img').attr('src', imageUrlLeft);
    $('#middle-reproduction').find('img').attr('src', imageUrlMiddle);
    $('#right-reproduction').find('img').attr('src', imageUrlRight);

    $('#left-reproduction-link').attr('href', imageUrlLeft);
    $('#middle-reproduction-link').attr('href', imageUrlMiddle);
    $('#right-reproduction-link').attr('href', imageUrlRight);

    $('#left-reproduction-link').attr('pictureOrderId', pictureOrderIdLeft);
    $('#middle-reproduction-link').attr('pictureOrderId', pictureOrderIdMiddle);
    $('#right-reproduction-link').attr('pictureOrderId', pictureOrderIdRight);
}

/**
 * Receives a string containing instruction and fills exisiting p-tag
 * @param {type} $instruction contains instruction for particular step in experiment
 * @returns {undefined}
 */
function setInstruction(instruction) {
    //console.log("Setting instruction");
    //$('#instruction').text(instruction);
    $('#contactArea2').empty();
    $('#contactArea2').append("<br/><strong>Instruction</strong><br/><br/>");
    $('#contactArea2').append(instruction);
}

/**
 * Loads an instruction into popup and displays it.
 * @returns {undefined}
 */
function onlyInstruction() {
    $('#contactArea').empty();
    $('#contactArea').append("You have finished, thank you for your time <br><br> Click Quit to return to front page.");
    centerPopup2(); //centering with css
    loadPopup2(); //load popup
    $('#instruction-continue').show();
}