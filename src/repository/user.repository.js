import User from "../models/user.model.js";

export const findByEmail = async (email) => User.findOne({ email });
export const findById = async (id) => User.findById(id);
export const createUser = async (data) => User.create(data);
export const updateLastLogin = async (id) => 
  User.findByIdAndUpdate(id, { lastLoginAt: new Date(), loginAttempts: 0 }, { new: true });
