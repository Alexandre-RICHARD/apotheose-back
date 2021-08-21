// Modèle Active Record
const db = require('../database.js');

class Quiz {
    //camelCase ici, snake_case côté BDD
    id;
    frTitle;
    enTitle;
    categoryId;

    //setters
    set fr_title(val) {
        this.frTitle = val;
    }

    set en_title(val) {
        this.enTitle = val;
    }

    set category_id(val) {
        this.categoryId = val;
    }

    constructor(data = {}) {
        for (const prop in data) {
            this[prop] = data[prop];
        }
    }

    static async findAllQuiz(lang) {
        const { rows } = await db.query(`SELECT quiz.id AS quiz_id, category.id AS category_id, category.${lang}_category_name AS category_name, quiz.${lang}_title AS quiz_title
        FROM quiz
        JOIN category ON category.id = quiz.category_id;`);

        return rows.map(allQuiz => new Quiz(allQuiz));
    }

    static async findOneQuiz(id, lang) {
        const { rows } = await db.query(`SELECT quiz.id AS quiz_id, quiz.${lang}_title AS quiz_title, question.id AS question_id, question.${lang}_statement AS question_statement, question.${lang}_article_link AS article_link, question.${lang}_article_title AS article_title, question.${lang}_justification AS question_justification, answer.id AS answer_id, answer.${lang}_answer_name AS answer_name, answer.good_answer
        FROM quiz
        JOIN question ON quiz.id = question.quiz_id
        JOIN answer ON question.id = answer.question_id
        WHERE quiz.id = $1 ORDER BY answer.id;`, [id]);

        return rows;

    }

}

module.exports = Quiz;