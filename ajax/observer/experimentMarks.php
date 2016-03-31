<?php

require_once "../../classes/DB.php";

$picture_id = isset($_POST['picture_id']) ? $_POST['picture_id'] : "0";
$experiment_id = $_POST["experiment_id"];
$marked_pixels = $_POST['mark'];
$remark = $_POST['remark'];

$response = DB::instance()->run_query(
    "INSERT INTO artifactmark (picture_id, experiment_id, marked_pixels, remark) VALUES (?, ?, ?, ?)", [
        $picture_id,
        $experiment_id,
        $marked_pixels,
        $remark
    ]
);

?>