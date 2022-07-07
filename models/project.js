const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide project name"],
    trim: true,
    maxlength: [120, "Project name should not be more than 120 characters"],
  },
  description: {
    type: String,
    required: [true, "please provide product description"],
  },
  files: [
    {
      id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [
      true,
      "please select category from- short-sleeves, long-sleeves, sweat-shirts, hoodies",
    ],
    enum: {
      values: ["MERN", "Python", "MobileApp", "Other"],
      message:
        "please select category ONLY from - MERN, Python, MobileApp and Other ",
    },
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// In this model, user is one who added the product

module.exports = mongoose.model("Project", projectSchema);
