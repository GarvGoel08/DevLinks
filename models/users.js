import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    about: {
      type: String,
    },
    Profile: {
      type: String,
      default: "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-Clipart.png",
    },
    password: {
      type: String,
      required: true,
    },
    code: {
      type: String,
    },
    Links: [
      {
        platform: {
          name: {
            type: String,  
            required: true,
          },
          color: {
            type: String,   
          },
        },
        url: {
          type: String,     
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

let User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
