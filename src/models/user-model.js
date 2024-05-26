// models/user-model.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, maxlength: 60},
    email: { type: String, required: true },
    street: { type: String },
    city: { type: String },
    stateAbr: { type: String },
    zipcode: { type: String },
    role: { type: String, required: true, enum: ['user', 'admin'], default: 'user' }
}, { collection: 'Users'});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('Users', userSchema);
module.exports = User;