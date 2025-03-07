import { model, models, Schema, Types } from "mongoose";
import mongoose from "mongoose";

interface IComment {
    author: mongoose.Schema.Types.ObjectId;
    comment: string;
    blogId: mongoose.Schema.Types.ObjectId;
}

const commentSchema = new Schema<IComment>({
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comment: {
        type: String,
        required: true,
        trim: true,
    },

    blogId: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
}, { timestamps: true });

const  CommentModel = models.Comment || model<IComment>("Comment", commentSchema);

export default CommentModel;