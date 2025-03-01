import { model, models, Schema } from "mongoose";

const adminLoginSchema = new Schema({
    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    }
})

const AdminLoginModel = models?.AdminLoginModel || model("adminlogin", adminLoginSchema);

export default AdminLoginModel;