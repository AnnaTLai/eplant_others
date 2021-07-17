<?php
/**
 * This program returns gene structure from BAR databases.
 * This is a drop in replacement for Araport gene_structure_by_locus API
 * Author: Asher
 * Date: January, 2018
 * Usage: http://bar.utoronto.ca/webservices/bar_araport/gene_structure_by_locus.php?locus=At1g01010
 */
require_once('functions.php');

/**
 * Output features
 * @param $features
 */
function output_results($features) {
    $output['wasSuccessful'] = true;
    $output['error'] = null;
    $output['statusCode'] = 200;
    $output['features'] = [];
    array_push($output['features'], $features);
    echo json_encode($output);
    exit();
}

/**
 * Get data from gff3 database (eplant2) given a locus
 * @param $locus string AGI id
 * @return mixed An object of features
 */
function get_data($locus) {

    // Create a connection
    $conn = connect_db();
    $features = [];

    // Query
    $locus = mysqli_real_escape_string($conn, $locus);
    $sql = "SELECT Type, Start, End, Strand, geneId, Parent FROM gff3_v3 WHERE geneId like '$locus%'";
    $sql_output = mysqli_query($conn, $sql);

    # Error checking
    if (!$sql_output) {
        mysqli_close($conn);
        output_error("SQL query failed!");
    }

    // Process results
    if (mysqli_num_rows($sql_output) > 0 ) {
        while ($row = mysqli_fetch_assoc($sql_output)) {

            // Get gene features
            if ($row['Type'] === 'gene') {
                // ADD Main features
                $features['type'] = $row['Type'];
                $features['uniqueID'] = strtoupper($locus);
                $features['start'] = (int) $row['Start'];
                $features['end'] = (int) $row['End'];
                $features['strand'] = get_strand($row['Strand']);
            } elseif ($row['Type'] === 'mRNA') {

                // mRNA features (This is variants data.
                $gene_id = $row['geneId'];

                // Add mRNAs
                $mRNA[$gene_id]['type'] = $row['Type'];
                $mRNA[$gene_id]['uniqueID'] = strtoupper($gene_id);
                $mRNA[$gene_id]['start'] = (int) $row['Start'];
                $mRNA[$gene_id]['end'] = (int) $row['End'];
                $mRNA[$gene_id]['strand'] = get_strand($row['Strand']);
            } elseif (in_array($row['Type'], array('CDS', 'exon', 'five_prime_UTR', 'three_prime_UTR'))) {
                $parent = $row['Parent'];

                // Add subfeatures
                $subfeatures = [];
                $subfeatures['type'] = $row['Type'];
                $subfeatures['uniqueID'] = $row['geneId'];
                $subfeatures['start'] = (int) $row['Start'];
                $subfeatures['end'] = (int) $row['End'];
                $subfeatures['strand'] = get_strand($row['Strand']);

                // Add empty sub features array for some reason
                $subfeatures['subfeatures'] = [];

                // Define the subfeatures array if it is not defined! (This is important).
                if (! isset($mRNA[$parent]['subfeatures'])) {
                    $mRNA[$parent]['subfeatures'] = [];
                }

                // Now add it to parent
                array_push($mRNA[$parent]['subfeatures'], $subfeatures);
            }
        }
    } else {
        mysqli_close($conn);
        output_error('No data for this given AGI!');
    }

    $features['subfeatures'] = [];
    foreach ($mRNA as $k => $v){
        array_push($features['subfeatures'], $v);
    }

    // Close connection
    mysqli_close($conn);
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
