import { model, models, Schema } from "mongoose";
import mongoose from "mongoose";

interface IBookmark {
    userId: mongoose.Schema.Types.ObjectId;
    blogId: mongoose.Schema.Types.ObjectId;
}

const bookmarkSchema = new Schema<IBookmark>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true        
    },

    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true
    }
}, { timestamps: true });

const BookMarkModel = models.Bookmark || model<IBookmark>("Bookmark", bookmarkSchema);

export default BookMarkModel;