<?php
/**
 * This program returns gene RIFs from the BAR system.
 * This is a drop in replacement for Araport gene RIFs API
 * Author: Asher
 * Date: January, 2018
 * Usage: http://bar.utoronto.ca/webservices/bar_araport/generifs_by_locus.php?locus=At1g01010
 */
require_once('functions.php');

/**
 * Output the final results
 * @param $features
 */
function output_results($features) {
    $output['status'] = 'success';
    $output['result'] = $features;
    echo json_encode($output);
    exit;
}

/**
 * Gets gene RIFs data from databases.
 * @param $locus string AGI id
 * @return array
 */
function get_data($locus) {
    # The location of the DNA sequences.
    $conn = connect_db();
    $results = [];

    # Query gene rifs database
    $sql = "SELECT pubmed, RIF FROM geneRIFs WHERE gene = '$locus'";
    $sql_output = mysqli_query($conn, $sql);

    # Error checking
    if (!$sql_output) {
        mysqli_close($conn);
        output_error("SQL query failed!");
    }

    # Get data
    if (mysqli_num_rows($sql_output) > 0) {
        while ($row = mysqli_fetch_assoc($sql_output)) {
            $features['publication']['pubmed_id'] = $row['pubmed'];
            $features['locus'] = $locus;
            $features['annotation'] = $row['RIF'];

            # Push this feature
            array_push($results, $features);
        }
    }

    mysqli_close($conn);
    return $results;
}

/**
 * The main function
 */
function main() {
    header('Content-Type: application/json');

    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        if (! empty($_GET['locus'])) {
            $locus = test_input($_GET['locus']);

            if (is_locus_valid($locus)) {
                $features = get_data($locus);
                output_results($features);
            } else {
                output_error('Locus is invalid!');
            }
        } else {
            output_error('No Locus provided');
        }
    }
}

// Call main function
main();
