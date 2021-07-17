<?php
/**
 * This program returns gene summary from BAR file system.
 * Author: Asher
 * Date: January, 2018
 * Usage: http://bar.utoronto.ca/webservices/bar_araport/gene_summary_by_locus.php?locus=At1g01010
 */
require_once('functions.php');

/**
 * Output the final results.
 * @param $features
 */
function output_results($features) {
    $output['status'] = 'success';
    $output['result'] = $features;
    echo json_encode($output);
    exit;
}

/**
 * This function returns functional annotation data.
 * @param $locus string AGI id
 * @param $conn
 * @return mixed
 */
function get_description_data($locus, $conn) {
    # Variables
    $data = [];
    $locus = $locus . ".1";

	# Currently we do not have data table functional_descripton for new eplant. So return empty strings for front end.
	$data['type'] = 'gene'; # I guess gene by default
	$data['brief_description'] = '';
	$data['computational_description'] = '';
	$data['curator_summary'] = '';
	return $data;
	
    # functional annotation table requires utf-8 charset because of special character in names.
    if (mysqli_set_charset($conn, 'utf8')) {
        # OK.
    } else {
        output_error('Failed to set character set to utf-8');
    }

    $sql = "SELECT Type, Short_description, Curator_summary, Computational_description FROM TAIR10_functional_descriptions WHERE Model_name = '$locus'";
    $sql_output = mysqli_query($conn, $sql);

    # Error checking
    if (!$sql_output) {
        mysqli_close($conn);
        output_error("SQL query failed!");
    }

    # Get Data
    if (mysqli_num_rows($sql_output) > 0 ) {
        while ($row = mysqli_fetch_assoc($sql_output)) {
            $data['type'] = $row['Type'];
            $data['brief_description'] = $row['Short_description'];
            $data['computational_description'] = $row['Computational_description'];
            $data['curator_summary'] = $row['Curator_summary'];
        }
    }

    # Switch back
    if (mysqli_set_charset($conn, 'latin1')) {
        # OK.
    } else {
        output_error('Failed to set character set to utf-8');
    }

    return $data;
}

/**
 * This function get gene alias data. If none is found, data object with empty synonyms would be returned.
 * @param $locus string Gene IDs
 * @param $conn
 * @param $data mixed Data object so far
 * @return mixed
 */
function get_alias_data($locus, $conn, $data) {

    $data['synonyms'] = [];

	# No gene aliases yet for Tomato
	$data['name'] = '';
	$data['symbol'] = '';
	return $data;

    $sql = "SELECT symbol, synonyms FROM gene_alias WHERE gene = '$locus'";
    $sql_output = mysqli_query($conn, $sql);

    # Error checking
    if (!$sql_output) {
        mysqli_close($conn);
        output_error("SQL query failed!");
    }

    # Get data
    if (mysqli_num_rows($sql_output) > 0 ) {
        while ($row = mysqli_fetch_assoc($sql_output)) {
            # For some reason Araport only using one of the many symbols of a given gene.
            if (isset($data['symbol'])) {
                # Do nothing
            }  else {
                $data['symbol'] = $row['symbol'];
            }

            # Name: The first in the list for some unknown reason.
            if (isset($data['name'])) {

            } else {
                $data['name'] = $row['synonyms'];
            }

            # Add synonyms (They are symbols for some reason)
            if (in_array($row['symbol'], $data['synonyms'])) {
                # Do nothing
            } else {
                array_push($data['synonyms'], $row['symbol']);
            }
        }
    }

    return $data;
}

/**
 * This function adds gff3 data to data object. It returns an empty array if gene is not in gff3 table.
 * @param $locus string AGI.
 * @param $conn
 * @param $data mixed The data object so far
 * @return mixed
 */
function get_gff3_data($locus, $conn, $data) {

    $sql = "SELECT SeqID, Start, End, Strand FROM gff3_v3 WHERE type = 'gene' AND geneID = '$locus'";
    $sql_output = mysqli_query($conn, $sql);

    # Error checking
    if (!$sql_output) {
        mysqli_close($conn);
        output_error("SQL query failed!");
    }

    # Add data
    if (mysqli_num_rows($sql_output) > 0 ) {
        while ($row = mysqli_fetch_assoc($sql_output)) {
            # For some reason Araport only using one of the many symbols of a given gene.
            $data['length'] = (int) $row['End'] - (int) $row['Start'] + 1;
            $data['chromosome_start'] = $row['Start'];
            $data['chromosome_end'] = $row['End'];
            $data['strand'] = $row['Strand'];
            $data['location'] = $row['SeqID'];
            $data['locus'] = $locus;
        }
    }

    return $data;
}

/**
 * This function gets and compiles all data
 * @param $locus string AGI id.
 */
function get_data($locus) {
    $results = [];

    // Create a connection
    $conn = connect_db();
    $locus = mysqli_real_escape_string($conn, $locus);

    # Now get data
    $data = get_description_data($locus, $conn);

    # Get alias data
    $data = get_alias_data($locus, $conn, $data);

    # Get GFF3 data
    $data = get_gff3_data($locus, $conn, $data);

    array_push($results, $data);

    mysqli_close($conn);
    output_results($results);
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
