#!/usr/bin/perl
################################################################################
# This is the JSmol webservice that returns the link to TAIR10 Phyre2 pdb file
# given an Gene.
# Author: Asher
# Date: March 2014
# Usage Example: http://bar.utoronto.ca/eplant/cgi-bin/JSMol.cgi?gene=At1g01010
################################################################################
use warnings;
use strict;
use CGI;
use JSON;
use DBI;

my $cgiObj = new CGI;	# The CGI Oject
my $gene = $cgiObj->param('gene');	# Gene supplied by the user

# Check input for errors, and return correct Gene or exit
end("No Gene provided.") if (!defined($gene));
main();

################################################################################
# Subroutines
################################################################################

# This subroutine check Gene ID for errors, etc
sub checkGene {
	my $gene = shift;

	if ($gene =~ /^(Potri\.\d+[M|G|C]\d+)$/i) {
		$gene = $1;
		return $gene;
	} else {
		end("Invalid Gene.");
	}
}

# Get experimental link
sub getExpLink {
	my $gene = shift;
	my $link = "";
	my $dataFile = "";
	
	# Remove .\d from the end
	$gene =~ s/\.\d$//g;

	# Query database and find the results
	my $dbh = DBI->connect('DBI:mysql:eplant2', 'hans', 'un1pr0t') or end("Could not connect to database!.");
	my $sth = $dbh->prepare('SELECT gene, model FROM pdb_experimental where gene = ?') or end("Could not prepare statement!.");
	$sth->execute($gene) or end("Could not execute statement!.");

	# If something is found, return it.
	if ($sth->rows > 0) {
		while (my @data = $sth->fetchrow_array()) {
			$dataFile = "/DATA/CDD3D_structures/TAIR10-Phyre2/" . lc($data[1]) . ".pdb";	# SymLink to pdb files
			if (-e $dataFile) {
				$link = "//bar.utoronto.ca/eplant_legacy/java/Phyre2-Models/" . lc($data[1]) . ".pdb";
			}
		}
	}

	$sth->finish();
	$dbh->disconnect;

	return $link;
}

# This subroutine returns the link to pdb files
sub getLink {
	my $gene = shift;
	my $link = "";	# Link to pdb files
	my $dataDir = "/DATA/ePlants_Data/eplant_poplar/protein_structures/";	# SymLink to pdb files
	my $ePlant = "//bar.utoronto.ca/eplant_poplar/pdb/";	# Link

	
	$gene .= ".pdb";
	if (-e $dataDir.$gene) {
		$link = $ePlant . $gene;
	} else {
		$link = "";
	}
	return $link;
}

# Get Exp sequence of the pdb
# These sequences are from: http://www.rcsb.org/pdb/download/download.do#FASTA
sub getExpSequence {
	my $link = shift;
	my $seq = "";
	my $dataDir = "/DATA/CDD3D_structures/TAIR10-Phyre2/";	# PDB files
	my $file = "";
	
	# If the link has a file name, parse it
	if ($link =~ /Phyre2.+\/(.+pdb$)/) {
		# Get the FASTA file name
		$file = $1;
		$file =~ s/.pdb$/.fasta/g;
		$file = $dataDir . $file;
		
		# Get the sequence
		if (-e $file) {
			open(my $infh, "<", $file) or end();
			while (<$infh>) {
				chomp($_);
				unless ($_ =~ /^>/) {
					$seq .= $_;
				}
			}
			close $infh;
		}
	}
	return $seq;
}

# Get the protein pdb seqeunce of the link
sub getSequence {
	my $link = shift;
	my $seq = "";
	my $dataDir = "/DATA/ePlants_Data/eplant_poplar/protein_structures/";	# SymLink to pdb files
	my $file = "";
	
	# If the link has a file name, parse it
	if ($link =~ /(Potri.+pdb$)/) {
		# Get the FASTA file name
		$file = $1;
		$file =~ s/.pdb$/.fas/g;
		$file = $dataDir . $file;
		
		# Get the sequence
		if (-e $file) {
			open(my $infh, "<", $file) or end();
			while (<$infh>) {
				chomp($_);
				unless ($_ =~ /^>/) {
					$seq .= $_;
				}
			}
			close $infh;
		}
	}
	return $seq;
}

# Get prediction from the database
sub getPrediction {
	my $gene = shift;
	my $template = "";
	my $hmmpredEValue = "";
	my $pathToResults = "";
	
	# Query database and find the results
	my $dbh = DBI->connect('DBI:mysql:eplant_poplar', 'hans', 'un1pr0t') or end("Could not connect to database!.");
	my $sth = $dbh->prepare('SELECT gene, template, confidence FROM pdb_predicted_files where gene = ? limit 1') or end("Could not prepare statement!.");
	$sth->execute($gene) or end("Could not execute statement!.");

	# If something is found, return it.
	if ($sth->rows > 0) {
		while (my @data = $sth->fetchrow_array()) {
			$template = $data[1];
			$hmmpredEValue = $data[2];
		}
	}

	$sth->finish();
	$dbh->disconnect;
	return ($template, $hmmpredEValue, $pathToResults);
}

# This program exits the script
sub end {
	my $errMsg = shift || "";
	my %jsonHash;
	
	print $cgiObj->header('application/json');

	# If there is no error, output a {}. If there is error, output error.
	if ($errMsg eq "") {
		print '{}';
	} else {
		$jsonHash{'error'} = $errMsg;
		print encode_json(\%jsonHash);
	}
	exit(0);
}

# The main function
sub main {
	my $link = "";	# This to file
	my $seq = "";	# The FASTA sequence of pdb file
	my $jsonObj;	# This is the final JSON object
	my %jsonHash;	# The json hash
	my $predicted = "null";	# Is PDB predicted
	
	# Check Gene for errors
	$gene = checkGene($gene);

	# First try the experimental data, No experimental data yet!
	#$link = getExpLink($gene);
	#if ($link ne "") {
	#	$seq = getExpSequence($link);
	#	$predicted = "false";
	#}

	# Get the linked the phyre2 file
	if ($link eq "") {
		$link = getLink($gene);
		if ($link ne "") {
			$seq = getSequence($link);
			$predicted = "true";
		}
	}
	
	# Get HMM Prediction data Testing
	my ($template, $hmmpredEValue, $pathToResults) = getPrediction($gene);

	# Make json object
	$jsonHash{'link'} = $link;
	$jsonHash{'sequence'} = $seq;
	$jsonHash{'template'} = $template;
	$jsonHash{'HMMpred_e-value'} = $hmmpredEValue;
	$jsonHash{'Phyre2_server_link'} = $pathToResults;
	$jsonHash{'predicted'} = $predicted;
	$jsonObj = encode_json(\%jsonHash);

	# Output results
	print $cgiObj->header('application/json');
	print $jsonObj;
}
	



