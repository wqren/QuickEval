<?php
 
$foo = $_POST['matrix'];

$file = fopen("matrix.csv", "w");

fwrite($file, $foo); 

echo "matrix CSV written!";
