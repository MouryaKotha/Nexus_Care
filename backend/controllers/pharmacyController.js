import Product from '../models/Product.js';
import Prescription from '../models/Prescription.js';
import Order from '../models/Order.js';

// @desc    Get all products
// @route   GET /api/pharmacy/products
// @access  Public
const getProducts = async (req, res) => {
    const products = await Product.find({});
    res.json(products);
};

// @desc    Get user prescriptions
// @route   GET /api/pharmacy/prescriptions
// @access  Private
const getMyPrescriptions = async (req, res) => {
    const prescriptions = await Prescription.find({ user: req.user._id }).sort({ date: -1 });
    res.json(prescriptions);
};

// @desc    Create a prescription (Mock for doctor use)
// @route   POST /api/pharmacy/prescriptions
// @access  Private
const createPrescription = async (req, res) => {
    const { doctorName, medicines, notes } = req.body;

    const prescription = await Prescription.create({
        user: req.user._id,
        doctorName,
        medicines,
        notes
    });

    if (prescription) {
        res.status(201).json(prescription);
    } else {
        res.status(400).json({ message: 'Invalid prescription data' });
    }
};

// @desc    Place a new order
// @route   POST /api/pharmacy/orders
// @access  Private
const placeOrder = async (req, res) => {
    const { items, totalPrice } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'No items in order' });
    }

    try {
        const order = await Order.create({
            user: req.user._id,
            items,
            totalPrice
        });
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: 'Order failed' });
    }
};

// @desc    Get user orders
// @route   GET /api/pharmacy/orders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ orderDate: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

export { getProducts, getMyPrescriptions, createPrescription, placeOrder, getMyOrders };
