import { model, models, Schema } from "mongoose";

interface AdminAuth {
    username: string;
    password: string;
}

const adminaAuthSchema = new Schema<AdminAuth>({
    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    }
})

const AdminAuthModel = models?.AdminAuthModel || model<AdminAuth>('AdminAuth', adminaAuthSchema);

export default AdminAuthModel;