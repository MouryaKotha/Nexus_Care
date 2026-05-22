import mongoose from 'mongoose';

const discussionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true, default: 'Mourya Kotha (You)' },
    authorInitials: { type: String, default: 'MK' },
    category: { type: String, required: true },
    type: { type: String, required: true }, // health, blood, tips, support
    status: {
        type: String,
        enum: ['Approved', 'Rejected', 'Flagged', 'Pending'],
        default: 'Pending'
    },
    moderationLog: {
        score: Number,
        reason: String,
        flaggedTerms: [String],
        timestamp: { type: Date, default: Date.now }
    },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

const Discussion = mongoose.model('Discussion', discussionSchema);

export default Discussion;
