mongoimport -h ds039950.mongolab.com:39950 -d beer2beer -c breweries -u b2b -p b2b --file app/data/brewery.json --jsonArray
mongoimport -h ds039950.mongolab.com:39950 -d beer2beer -c beers -u b2b -p b2b --file app/data/beers.json --jsonArray
