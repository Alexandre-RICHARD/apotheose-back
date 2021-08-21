// Modèle Active Record
const db = require('../database.js');

class Question {
  //camelCase ici, snake_case côté BDD  
  id;
  frStatement;
  frArticleLink;
  frArticleTitle;
  frJustification;
  enStatement;
  enArticleLink;
  enArticleTitle;
  enJustification;
  quizId;

    //setters
    set fr_statement(val) {
        this.frStatement = val;
    }

    set fr_article_link(val) {
        this.frArticleLink= val;
    }

    set fr_article_title(val) {
        this.frArticleTitle = val;
    }

    set fr_justification(val) {
        this.frJustification = val;
    }

    set en_statement(val) {
        this.enStatement = val;
    }

    set en_article_link(val) {
        this.enArticleLink = val;
    }

    set en_article_title(val) {
        this.enArticleTitle = val;
    }

    set en_justification(val) {
        this.enJustification = val;
    }

    set quiz_id(val) {
        this.quizId = val;
    }


    constructor(data = {}) {
        for (const prop in data) {
            this[prop] = data[prop];
        }
    }

    static async findAllArticle(lang) {

        const { rows } = await db.query(`SELECT category.id AS category_id, category.${lang}_category_name AS category_name, quiz.id AS quiz_id, quiz.${lang}_title AS quiz_title, question.id AS question_id, question.${lang}_statement AS question_statement, question.${lang}_article_link AS article_link, question.${lang}_article_title AS article_title
        FROM question
        LEFT JOIN quiz ON question.quiz_id = quiz.id
        LEFT JOIN category ON quiz.category_id = category.id;`);

        return rows.map(allArticle => new Question(allArticle));
    }

}

module.exports = Question;