import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: { type: Date, required: true },
    createdByIp: { type: String },          // IP from where it was created
    revoked: { type: Boolean, default: false },
    replacedByToken: { type: String, default: null } // in case token rotation is used
  },
  { timestamps: true } // automatically adds createdAt & updatedAt
);

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken;
