import Article from '../models/Article.js';

// @desc    Get all articles
// @route   GET /api/blog
// @access  Public
const getArticles = async (req, res) => {
    const articles = await Article.find({}).sort({ createdAt: -1 });
    res.json(articles);
};

// @desc    Get single article
// @route   GET /api/blog/:id
// @access  Public
const getArticleById = async (req, res) => {
    const article = await Article.findById(req.params.id);
    if (article) {
        res.json(article);
    } else {
        res.status(404).json({ message: 'Article not found' });
    }
};

// @desc    Create article (Mock for admin)
// @route   POST /api/blog
// @access  Private/Admin
const createArticle = async (req, res) => {
    const { title, content, category, image, tags, readTime } = req.body;

    const article = await Article.create({
        title,
        content,
        category,
        image,
        tags,
        readTime
    });

    if (article) {
        res.status(201).json(article);
    } else {
        res.status(400).json({ message: 'Invalid article data' });
    }
};

export { getArticles, getArticleById, createArticle };
