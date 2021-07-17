<?php
/**
 * This program returns publications from the BAR system.
 * Author: Asher
 * Date: January, 2018
 * Usage: http://bar.utoronto.ca/webservices/bar_araport/publications_by_locus.php?locus=At1g01010
 */
require_once('functions.php');

/**
 * Output final results
 * @param $features array Array of features
 */
function output_results($features) {
    $output['status'] = 'success';
    $output['result'] = $features;
    echo json_encode($output);
    exit;
}

/**
 * Get publications data from the database
 * @param $locus string AGI ID
 * @return array
 */
function get_data($locus) {
    # The location of the DNA sequences.
    $conn = connect_db();
    $results = [];

    # Pulications table requires utf-8 charset because of special character in names.
    if (mysqli_set_charset($conn, 'utf8')) {
        # OK.
    } else {
        output_error('Failed to set character set to utf-8');
    }

    $sql = "SELECT gene, author, year, journal, title, pubmed FROM publications WHERE gene = '$locus'";
    $sql_output = mysqli_query($conn, $sql);

    # Error checking
    if (!$sql_output) {
        mysqli_close($conn);
        output_error("SQL query failed!");
    }

    # Get data
    if (mysqli_num_rows($sql_output) > 0) {
        while ($row = mysqli_fetch_assoc($sql_output)) {
            $features['first_author'] = $row['author'];
            $features['year'] = (int) $row['year'];
            $features['journal'] = $row['journal'];
            $features['title'] = $row['title'];
            $features['pubmed_id'] = $row['pubmed'];

            # Push this feature
            array_push($results, $features);
        }
    }

    # close connection
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
