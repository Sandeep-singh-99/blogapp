import mongoose, { models, Schema } from "mongoose";

interface ILike {
    userId: mongoose.Schema.Types.ObjectId
    blogId: mongoose.Schema.Types.ObjectId
}

const likeSchema = new Schema<ILike>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    }
}, { timestamps: true });

const LikeModel = models.Like || mongoose.model<ILike>('Like', likeSchema);

export default LikeModel;