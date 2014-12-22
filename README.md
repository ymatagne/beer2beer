### Import des donnes d'initialisation
mongoimport -h <URL:PORT> -d <BDD_NAME> -c breweries -u <USER> -p <MDP> --file app/data/brewery.json --jsonArray
mongoimport -h <URL:PORT> -d <BDD_NAME>  -c types -u <USER> -p <MDP> --file app/data/type.json --jsonArray
mongoimport -h <URL:PORT> -d <BDD_NAME>  -c beers -u <USER> -p <MDP> --file app/data/beers.json --jsonArray


### Certaines variables sont à saisir sur l'environnement
- process.env.MONGOLAB_URI: Adresse de la base mongolab
- process.env.GOOGLE_CLIENT_ID: ID de l'application
- process.env.GOOGLE_CLIENT_SECRET: ID de l'application