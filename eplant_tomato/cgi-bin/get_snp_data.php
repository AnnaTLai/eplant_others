<?php
////////////////////////////////////////////////////////////////////////////////
// This script is ussed to download SNP data
// Author: Asher Pasha
// Date: September 2016
// Usage: http:/bar.utoronto.ca/eplant/cgi-bin/get_snp_data.php?agi=AT3G24650.1&service=nssnps
////////////////////////////////////////////////////////////////////////////////

// Check if AGI is valid
function is_agi_valid($agi) {
	// Assume it is valid and fail on invalid one.
	$result = true;

	if (preg_match('/^at[12345mc]g\d{5}\.*\d*$/i', $agi)) {
		// Data is valid. Moving on
		return $result;
	} else {
		// Invalid data found 
		$result = false;
		return $result;
	}	
}

// Check if service is valid
function is_service_valid($service) {
	// Assume it is valid and fail on invalid one.
	$result = true;

	if (preg_match('/^\D+$/i', $service)) {
		// Data is valid. Moving on
		return $result;
	} else {
		// Invalid data found 
		$result = false;
		return $result;
	}	
}

// Get data
function get_data($url) {
	// Create curl resource
	$ch = curl_init();

	// Set parameters
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_FAILONERROR, true);
	curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 120);
	curl_setopt($ch, CURLOPT_USERAGENT, 'The BAR PHP Client');
	
	// Get data
	$output = curl_exec($ch);
	$http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	$error = curl_error($ch);
	
	if ($http_status == 200) {
		curl_close($ch);
		return $output;
	} else {
		curl_close($ch);
		output_error("HTTP status from gator.masc-proteomics.org is not 200.");
		return;
	}
}

// Output error
function output_error($error_text) {
	$output["status"] = "fail";
	$output["error"] = $error_text;

	// Output a JSON error message	
	header('Content-Type: application/json');
	echo json_encode($output);
	exit();
}

// Main program
function main() {
	
	// For all GET requests
	if ($_SERVER["REQUEST_METHOD"] == "GET") {

		// Gene
		if (empty($_GET["agi"])) {
			output_error("No AGI parameter.");
		} else {
			$agi = $_GET["agi"];

			// Check if service parameter exist, if not defaults to nssnps.
			if (empty($_GET["service"])) {
				$service = "nssnps";
			} else {
				$service = $_GET["service"];
			}		

			// validate data
			if (is_agi_valid($agi) == false) {
				output_error("AGI is not valid");
			}

			if (is_service_valid($service) == false) {
				output_error("Service is not valid");
			}		

			// Add .1 if it's not there	
			if (preg_match('/^at[12345mc]g\d{5}$/i', $agi)) {
				$agi .= ".1";
			}
		
			// Data is valid, moving on:	
			$url = "http://gator.masc-proteomics.org/data/latest/gator?agi=" . $agi . "&service=" . $service;
				
			// Get the SNP data
			$data = get_data($url);	
				
			// Output the image
			header('Content-Type: application/json');
			print $data;			
		}
	}
}

// Run the main program and exit gracefully
main();
exit();
?>
