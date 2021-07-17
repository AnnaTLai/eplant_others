#!/usr/bin/python3

import cgi
import MySQLdb
import json
import urllib.request, urllib.error, urllib.parse

# Retrieve parameters
arguments = cgi.FieldStorage()
chromosome = arguments['chromosome'].value
start = arguments['start'].value
end = arguments['end'].value

# Print header
print('Content-Type: application/json\n')

try:
    con = MySQLdb.connect('localhost', 'hans', 'un1pr0t', 'eplant_soybean')
    cur1 = con.cursor()
    cur2 = con.cursor()
    query1 = 'SELECT geneId,start,end,strand FROM gff3 WHERE type="gene" AND SeqID = "' + chromosome  + '" AND ((start>=' + start + ' AND start<=' + end + ') OR (end>=' + start + ' AND end<=' + end + ') OR (start<' + start + ' AND end>' + end + '));'
    cur1.execute(query1)
    genes = []
    for row1 in cur1:
        gene = {}
        gene['id'] = row1[0]
        gene['start'] = row1[1]
        gene['end'] = row1[2]
        gene['strand'] = row1[3]
        gene['aliases'] = []
        gene['annotation'] = []

        # Get aliases
        #query2 = 'SELECT alias FROM agi_alias WHERE agi="' + gene['id'] + '";'
        #cur2.execute(query2)
        #aliases = []
        #for row2 in cur2:
        #    aliases.append(row2[0])
        #gene['aliases'] = aliases

        # Get annotation
        query2 = 'SELECT annotation FROM gene_annotation WHERE gene="' + gene['id'] + '";'
        cur2.execute(query2)
        gene['annotation'] = None
        for row2 in cur2:
            temp = row2[0].split('__')
            if len(temp) > 1:
                gene['annotation'] = temp[1]
            else:
                gene['annotation'] = temp[0]

        # Get subcellular localizations
        #url = 'http://suba.plantenergy.uwa.edu.au/cgi/suba-app.py/suba3?start=0&limit=50&sort=locus&dir=ASC&table=suba3&where=@' + gene['id']
        #response = json.loads(urllib2.urlopen(url).read())
        #gene['localisation'] = None
        #if response['count'] > 0:
            #gene['localisation'] = response['rows'][0]

        genes.append(gene)
    
    cur1.close()
    cur2.close()
    con.close()   
    print(json.dumps(genes))
except:
    raise
    print('{}')

