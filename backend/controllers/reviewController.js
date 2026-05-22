import Review from '../models/Review.js';

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
const addReview = async (req, res) => {
    const { doctorId, doctorName, rating, comment } = req.body;

    const review = await Review.create({
        user: req.user._id,
        userName: req.user.name,
        doctorId,
        doctorName,
        rating: Number(rating),
        comment
    });

    if (review) {
        res.status(201).json(review);
    } else {
        res.status(400).json({ message: 'Invalid review data' });
    }
};

// @desc    Get reviews for a doctor
// @route   GET /api/reviews/:doctorId
// @access  Public
const getDoctorReviews = async (req, res) => {
    const reviews = await Review.find({ doctorId: req.params.doctorId }).sort({ createdAt: -1 });
    res.json(reviews);
};

export { addReview, getDoctorReviews };
