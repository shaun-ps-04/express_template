// import mongoose from 'mongoose';
const mongoose = require('mongoose');
// const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        index: { unique: true, sparse: true },
        // unique: true,
        minLength: 4,
        maxLength: 50
    },
    email: { 
        type: String, 
        index: { unique: true, sparse: true },
        // unique: true,
        lowercase: true,
        minLength: 3,
        maxLength: 100,
    },
    password: { 
        type: String, 
        required: true
    },
    firstName:  {
        type: String,
        minLength: 1,
        maxLength: 50
    },
    lastName:  {
        type: String,
        minLength: 1,
        maxLength: 50
    },
    birth_date: Date,
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    updatedAt: {
        type: Date,
        default: () => Date.now(),
    },
});


// const User = mongoose.model('User', userSchema);
module.exports = mongoose.model('User', userSchema);

