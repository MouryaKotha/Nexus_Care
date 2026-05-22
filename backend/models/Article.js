import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        default: 'Nexus Medical Team'
    },
    category: {
        type: String,
        required: true,
        enum: ['Wellness', 'Mental Health', 'Nutrition', 'Medical News', 'Disease Prevention']
    },
    image: {
        type: String,
        default: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    tags: [String],
    readTime: {
        type: String,
        default: '5 min'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Article = mongoose.model('Article', articleSchema);

export default Article;
