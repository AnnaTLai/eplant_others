<?php
/**
 * This program returns protein sequence from BAR filesystem.
 * This is a drop in replacement for Araport gene_protein_sequence_by_identifier API
 * Author: Asher
 * Date: January, 2018
 * Usage: http://bar.utoronto.ca/webservices/bar_araport/get_protein_sequence_by_identifier.php?locus=At1g01010
 */
require_once('functions.php');

/**
 * This function output results
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
 * Get data from Araport 11 Protein sequence.
 * @param $locus string AGI id
 * @return mixed
 */
function get_data($locus) {
    # The location of the protein sequences.
    $file = '/DATA/ePlants_Data/eplant_sunflower/Phytozome/Hannuus_494_r1.2.protein_primaryTranscriptOnly.fa';

    # The command is: agrep -d'\>' -e'AT3G24650 ' Araport11_genes.201606.pep.fasta
    try {
        $cmd = 'agrep -i -d\'\\>\' -e\'' . strtoupper(escapeshellcmd($locus)) . '\' ' .  $file;
        $output = shell_exec($cmd);
    } catch (Exception $e) {
        output_error('Could not search sequence.');
    }

    $output = explode("\n", $output);
    array_shift($output);
    $sequence = implode($output);

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
