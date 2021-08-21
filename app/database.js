const { Pool } = require('pg');

// Ici, les informations de connexions sont récupérées dans l'environnement
// PGHOST pour l'hôte
// PGUSER pour l'utilisateur
// PGPASSWORD pour le mot de passe
// PGDATABASE pour la base de données

// db est un pool de connecteurs de base de données
// avec Heroku, mon Pool va devoir se connecter à DATABASE_URL
// par contre, en local, il faut qu'il continue de se connecter avec les variables d'environnement de libpq (PGUSER, PGPASSWORD etc.)
// mais en fait, Pool se débrouille tout seul comme un grand

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

module.exports = db;