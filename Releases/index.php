﻿<!DOCTYPE html>
<?php session_start(); ?>
<?php header('Content-Type: text/html; charset=ISO-8859-15'); ?>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <!-- CSS -->
        <link href="css/metro-bootstrap.css" rel="stylesheet">
        <link href="css/jquery/ui-lightness/jquery-ui-1.10.4.custom.min.css" rel="stylesheet">
        <link href="css/jquery/ui-lightness/jquery-ui-1.10.4.custom.min.css" rel="stylesheet">
        <link href="css/style.css" rel="stylesheet">

        <!-- JQuery -->
        <script src="js/jquery/jquery.min.js"></script>
        <script src="js/jquery/jquery-ui.custom.min.js"></script>

        <!-- Metro UI -->
        <script src="min/metro.min.js"></script>

        <!-- Other JS -->
        <script src="js/indexScripts.js"></script>
        <script src="js/scripts.js"></script>

        <?php
        if (!isset($_SESSION['user'])) {
            header("Location: login.php");
        }
        ?>

    </head>
    <body class="metro">
        <div id="wrapper">
            <?php include_once("includes/header.html"); ?>    

            <div id="panels" style="width:1000px; margin:auto">
                <div id="top-panels" style="max-height: 500px; width: 100%">
                    <h1>Select Experiment</h1>
                    <div class="accordion" data-role="accordion" style="width:49%; float:left; display: inline;">
                        <div id="institute" class="accordion-frame">
                            <a href="#" class="active heading">Institution</a>
                            <div class="content">
                                <div class="input-control text" data-role="input-control">
                                    <input id="institution-search" type="text">
                                    <button class="btn-search"></button>
                                </div>
                                <div class="listview-outlook" data-role="listview" style="max-height: 250px; overflow:auto">
                                    <div id="institute-list" class="list-group ">
                                        <div id="select-institution" class="group-content">

                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                        <div id="organization" class="accordion-frame">
                            <a href="#" class="heading">Organization</a>
                            <div class="content">
                                <div class="input-control text" data-role="input-control">
                                    <input id="organization-search" type="text">
                                    <button class="btn-search"></button>
                                </div>
                                <div class="listview-outlook" data-role="listview" style="max-height: 250px; overflow:auto">
                                    <div id="organization-list" class="list-group ">
                                        <div id="select-organization"class="group-content">

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="scientist" class="accordion-frame">
                            <a href="#" class="heading">Scientist</a>
                            <div class="content">
                                <div class="input-control text" data-role="input-control">
                                    <input id="scientist-search" type="text">
                                    <button class="btn-search"></button>
                                </div>
                                <div class="listview-outlook" data-role="listview" style="max-height: 250px; overflow:auto">
                                    <div id="scientist-list" class="list-group ">
                                        <div id="select-scientist" class="group-content">

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="left-panel" style="margin-left: 20px; width:49%; float:left; display: inline;">
                        <div class="input-control text" data-role="input-control">
                            <input id="experiment-search" type="text">
                            <button class="btn-search"></button>
                        </div>	

                        <div class="listview-outlook" data-role="listview">
                            <div id="experiment-list" class="list-group ">
                                <div id="select-experiment" class="group-content">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="clear: both"></div>
                <div id="bottom-panels" style="max-height: 300px; width: 100%; margin: 20px 0;">
                    <div id="bottom-left-panel" style="float: left; width: 49%">
                        <h2 id="experiment-title"></h2>
                        <p id="experiment-text"></p>
                        <p id="experiment-info"></p>
                    </div>
                    <div id="bottom-right-panel" style="width: 49%; float: right; bottom: 0">


                        

                    </div>
                </div>
            </div>
            <?php include_once("includes/footer.html"); ?>
        </div>
    </body>
</html>