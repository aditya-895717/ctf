import mongoose from "mongoose"; // Make sure to import mongoose
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Import your User model
import dotenv from "dotenv";
import { errorHandler } from "../utils/error.js"; // Assuming you have a custom error handler

dotenv.config();

export const connect = () => {
  mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/CTF', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// Signup Route Handler
export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  // Validation check
  if (!name || !email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    // Check if the user already exists
    const existingUser  = await User.findOne({ email });
    if (existingUser ) {
      return next(errorHandler(409, "User  already exists. Please log in."));
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create a new user in the database
    const newUser  = new User({
      name,
      email,
      password: hashedPassword,
      role: "Student",
    });

    await newUser .save();

    // Create JWT token
    const tokenjwt = jwt.sign(
      { id: newUser ._id, email: newUser .email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).cookie("access_token", tokenjwt, { httpOnly: true }).json({
      message: "User  registered successfully",
      user: { id: newUser ._id, name: newUser .name, email: newUser .email },
    });
  } catch (err) {
    next(err);
  }
};

// Login Controller
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Validation check
  if (!email || !password) {
    return next(errorHandler(400, "Email and password are required"));
  }

  try {
    // Find user in the database
    const validUser  = await User.findOne({ email });
    if (!validUser ) {
      return next(errorHandler(404, "User  not found, Register to login"));
    }

    // Compare the entered password with the hashed password in the database
    const validPassword = await compare(password, validUser .password);
    if (!validPassword) {
      return next(errorHandler(401, "Invalid password or email"));
    }

    // Create JWT token
    const tokenjwt = jwt.sign(
      { id: validUser ._id, email: validUser .email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send the token as a cookie and respond with user details
    res.status(200).json({
      id: validUser ._id,
      name: validUser .name,
      email: validUser .email,
      role: validUser .role,
    });
  } catch (error) {
    next(error);
  }
};