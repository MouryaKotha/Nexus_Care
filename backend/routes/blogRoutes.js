import express from 'express';
const router = express.Router();
import { getArticles, getArticleById, createArticle } from '../controllers/blogController.js';
import { protect, admin } from '../middleware/auth.js';

router.get('/', getArticles);
router.get('/:id', getArticleById);
router.post('/', protect, admin, createArticle);

export default router;
