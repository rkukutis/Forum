const User = require('../models/usersModel');

exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json({ status: 'success', data: allUsers });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err });
  }
};
exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({ status: 'success', message: newUser });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err });
  }
};
exports.getUser = (req, res) => {
  try {
    const user = User.findById(req.params.id);
    res.status(200).json({ status: 'success', message: user });
  } catch (err) {
    res.status(404).json({ status: 'error', message: err });
  }
};
exports.updateUser = (req, res) => {
  try {
    const user = User.findByIdAndUpdate(req.params.id);
    res.status(200).json({ status: 'success', message: user });
  } catch (err) {
    res.status(404).json({ status: 'error', message: err });
  }
};
exports.deleteUser = (req, res) => {
  try {
    const user = User.findById(req.params.id);
    res.status(204).json({ status: 'success', message: user });
  } catch (err) {
    res.status(404).json({ status: 'error', message: err });
  }
};
