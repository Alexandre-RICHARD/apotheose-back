// Modèle Active Record
const db = require('../database.js');

class UserMadeQuiz {
    //camelCase ici, snake_case côté BDD
    id;
    scoreQuiz;
    userId;
    quizId;


    //setters
    set score_quiz(val) {
        this.scoreQuiz = val;
    }

    set user_id(val) {
        this.userId = val;
    }

    set quiz_id(val) {
        this.quizId = val;
    }


    constructor(data = {}) {
        for (const prop in data) {
            this[prop] = data[prop];
        }
    }

    static async findOneById(userId, quizId) {

        const { rows } = await db.query(`SELECT * FROM "user_made_quiz" WHERE "user_id" = $1 AND "quiz_id" = $2;`, [userId, quizId]);

        return new UserMadeQuiz(rows[0]);

    }

    static async findScoreUserById(id) {

        const { rows } = await db.query(`SELECT * FROM "user_made_quiz" WHERE "user_id" = $1;`, [id]);

        return rows.map(allScore => new UserMadeQuiz(allScore));

    }

    // pas statique car propre à chaque instance
    async createScoreQuiz() {
        const { rows } = await db.query(`INSERT INTO "user_made_quiz" ("score_quiz", "user_id", "quiz_id")
        VALUES ($1, $2, $3) RETURNING id;`, [this.scoreQuiz, this.userId, this.quizId]);

        this.id = rows[0].id;
    }

    async modifyScoreQuiz() {
        const { rows } = await db.query(`UPDATE "user_made_quiz" SET "score_quiz" = $3 WHERE "user_id" = $1 AND "quiz_id" = $2 RETURNING *;`, [this.userId, this.quizId, this.scoreQuiz]);
    }

}

module.exports = UserMadeQuiz;