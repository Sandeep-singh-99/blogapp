import { Schema } from "mongoose";

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },

    slug: {
        type: String,
        required: true,
        unique: true
    },

    author: {
        type: String,
        required: true
    },

    tags: [{type: String}],

    profileImage: {
        type: String,
        required: true
    },

    cloudinaryId: {
        type: String,
        required: true
    },

    featuredImage: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true});