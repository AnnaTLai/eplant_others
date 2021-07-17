<?php
/**
 * This file contains function for Araport API replacement.
 * Author: Asher
 * Date: January, 2018
 */

/**
 * This function test input data. This function is from w3c schools.
 * @param $data string from url
 * @return string html processed
 */
function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

/**
 * This function Validates gene IDs.
 * @param $locus string Gene ID
 * @return bool true if gene is valid
 */
function is_locus_valid($locus) {
    if (preg_match('/^Potri.\d+g\d+$/i', $locus)) {
        return true;
    } else {
        output_error('Gene is invalid');
    }
}

/**
 * If the web service failed!
 * @param $message string The error string
 */
function output_error($message) {
    $output['wasSuccessful'] = false;
    $output['error'] = $message;
    $output['statusCode'] = 500;
    echo json_encode($output);
    exit();
}

/**
 * Connect the database
 * @return mysqli connection
 */
function connect_db() {
    $conn = mysqli_connect('localhost', 'hans', 'un1pr0t', 'eplant_poplar');

    if ($conn) {
        return $conn;
    } else {
        output_error('Failed to connect to the database!');
    }
}

/**
 * This function simplifies strand calculation
 * @param $strand string This is + or -
 * @return string This is '1' or '-1'
 */
function get_strand($strand) {
    if ($strand === '+') {
        return '1';
    } else {
        return '-1';
    }
}
