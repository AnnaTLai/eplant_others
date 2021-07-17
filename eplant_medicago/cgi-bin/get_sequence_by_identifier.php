<?php
/**
 * This program returns gene sequence from BAR file system.
 * This is a drop in replacement for Araport gene_sequence_by_identifier API
 * Author: Asher
 * Date: January, 2018
 * Usage: http://bar.utoronto.ca/webservices/bar_araport/get_sequence_by_identifier.php?locus=At1g01010
 */
require_once('functions.php');

/**
 * The output function
 * @param $features mixed
 */
function output_results($features) {
    $output['status'] = 'success';
    $output['result'] = [];
    array_push($output['result'], $features);
    echo json_encode($output);
    exit;
}

/**
 * This function returns gene information from gff3 database
 * @param $locus string AGI ID
 * @return mixed
 */
function get_gff3_data($locus) {

    $data = [];
    # Connect to database
    $conn = connect_db();

    $sql = "SELECT SeqID, Start, End, Strand FROM gff3 WHERE type = 'gene' AND geneID = '$locus'";
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
            $data['length'] = (int) $row['End'] - (int) $row['Start'] + 1;
            $data['start'] = $row['Start'];
            $data['end'] = $row['End'];
            $data['strand'] = $row['Strand'];
            $data['chr'] = $row['SeqID'];
        }
    } else {
        mysqli_close($conn);
        output_error('Gene is not in gff3 table.');
    }

    mysqli_close($conn);
    return $data;
}

/**
 * Get sequence using data array
 * @param $data array Data from gff3 table
 * @return bool|string
 */
function get_sequence($data) {
    $file = '/DATA/ePlants_Data/eplant_medicago/Phytozome/' . $data['chr'] . ".fas";
    $cmd = 'cat ' . $file;
    try {
        $sequence = substr(shell_exec($cmd), $data['start'] - 1, $data['length']);
        # At this point we will only get either false or sequence
        if ($sequence) {
            return $sequence;
        } else {
            output_error('No DNA Sequence!');
        }
    } catch (Exception $e) {
        output_error('No DNA Sequence!');
    }
}

/**
 * The official get data function for this program
 * @param $locus string AGIs
 * @return mixed Data
 */
function get_data($locus) {

    # Get gff3 data
    $data = get_gff3_data($locus);

    # Get DNA sequence
    $sequence = get_sequence($data);

    $features['length'] = (int) strlen($sequence);
    $features['sequence'] = $sequence;

    return $features;
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
