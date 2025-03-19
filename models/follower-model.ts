import mongoose, { model, models, Schema } from "mongoose";

interface IFollower {
    followerId: mongoose.Schema.Types.ObjectId
    followingId: mongoose.Schema.Types.ObjectId
}

const followerSchema = new Schema<IFollower>({
    followerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    followingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });


const followerModel = models.Follower || model<IFollower>('Follower', followerSchema);

export default followerModel;