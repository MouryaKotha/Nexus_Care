import mongoose from 'mongoose';

const statsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    week: {
        type: Number, // Week of the year
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    activityScore: {
        type: Number, // Percentage 0-100
        default: 0
    },
    appointmentsCount: {
        type: Number,
        default: 0
    },
    prescriptionsCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Stats = mongoose.model('Stats', statsSchema);

export default Stats;
