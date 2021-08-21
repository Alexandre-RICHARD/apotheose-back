// Modèle Active Record
const db = require('../database.js');

class User {
    //camelCase ici, snake_case côté BDD
    id;
    email;
    firstname;
    lastname;
    password;
    role;


    constructor(data = {}) {
        for (const prop in data) {
            this[prop] = data[prop];
        }
    }

    static async findOneById(id) {

        const { rows } = await db.query(`SELECT * FROM "user" WHERE "id" = $1;`, [id]);

        return new User(rows[0]);

    }

    static async findOneUserByEmail(email) {

        const { rows } = await db.query(`SELECT * FROM "user" WHERE "email" = $1;`, [email]);

        return new User(rows[0]);

    }

    async createAuser() {
        // props de this => insérer une ligne dans la bdd
        const { rows } = await db.query(`INSERT INTO "user" ("email", "firstname", "lastname", "password")
        VALUES ($1, $2, $3, $4) RETURNING id, role;`, [this.email, this.firstname, this.lastname, this.password]);

        this.id = rows[0].id;
        this.role = rows[0].role;
    }

    // pas statique car propre à chaque instance
    async modifyUserData() {
        const { rows } = await db.query(`UPDATE "user" SET "firstname" = $2, "lastname" = $3, "password" = $4
        WHERE id = $1 RETURNING *;`, [this.id, this.firstname, this.lastname, this.password]);
    }

    async modifyUserEmail() {
        const { rows } = await db.query(`UPDATE "user" SET "email" = $2
        WHERE id = $1 RETURNING *;`, [this.id, this.email]);
    }

    async deleteUser() {
        const { rows } = await db.query(`DELETE FROM "user" WHERE id = $1;`, [this.id]);
    }

}

module.exports = User;