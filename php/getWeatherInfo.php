<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);
$api_key = 'xxx';

$executionStartTime = microtime(true);
//$_POST['city'] = ($_POST['city'] === "") ? 'London' : $_POST['city'];
if(!$_POST) {
    $_POST['city'] = 'London';
}
$url = "https://api.weatherapi.com/v1/current.json?key=${api_key}&q={$_POST['city']}&aqi=no";
//$url = 'http://localhost/threeapis/src/countryNames.json';

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['location'] = $decode['location'];
$output['weather'] = $decode['current'];
$output['post'] = $_POST;

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);