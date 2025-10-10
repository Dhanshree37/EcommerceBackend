import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Address subdocument schema
const addressSchema = new mongoose.Schema({
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

// Main User schema
const userSchema = new mongoose.Schema(
  {
    // Basic info
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Email is invalid"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    dob: {
      type: Date,
      required: [true, "Date of Birth is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    gender: { type: String, enum: ["male", "female", "other"] },
    profileImage: { type: String },

    // Account status
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    // Addresses
    addresses: [addressSchema],

    // Wishlist
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

    // Order references
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],

    // Password reset / security tracking
    passwordResetAt: { type: Date },

    // Last login & failed attempts
    lastLoginAt: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    accountLockedUntil: { type: Date },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method for login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
