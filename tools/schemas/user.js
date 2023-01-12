import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  avatar: {
    type: String,
    default: "",
    require: true,
  },
  kyc: {
    type: {
      _id: String,
      id_front: String,
      id_back: String,
      id_with_face: String,
    },
    default: {},
    require: true,
  },
});

const User = mongoose.model("users", UserSchema);

export default User;
