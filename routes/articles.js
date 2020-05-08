const routerArticles = require('express').Router();

const { showSavedArticles, createArticle, deleteArticle } = require('../controllers/articles');
const { checkArticleId, checkArticle } = require('../modules/validation');

routerArticles.get('/articles', showSavedArticles);
routerArticles.post('/articles', checkArticle, createArticle);
routerArticles.delete('/articles/:articleId', checkArticleId, deleteArticle);

module.exports = routerArticles;
