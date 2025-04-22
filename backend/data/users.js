import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithEmailAndPassword,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import {
  strCheck,
  validateName,
  validatePassword,
  validateUsername,
} from "../helpers.js";

export const createUser = async (email, password, name, role, universityId) => {
  name = strCheck(name, "name");
  validateName(name);
  email = strCheck(email, "email");

  email = email.toLowerCase();
  password = strCheck(password, "password");
  validatePassword(password);
  role = strCheck(role, "role");

  let userCollection = await users();
  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    let user = {
      name,
      email,
      role,
      universityId,
      profile: {},
      groups: [],
    };
    let newUser = await userCollection.insertOne(user);
    if (!newUser.acknowledged) {
      await userCredential.user.delete();
      throw new Error("Could not add user to database");
    }
    return { ...user, _id: newUser.insertedId.toString() };
  } catch (e) {
    if (e.code === "auth/email-already-in-use") {
      throw new Error("Email already in use");
    } else if (e.code === "auth/invalid-email") {
      throw new Error("Invalid email address");
    } else if (e.code === "auth/weak-password") {
      throw new Error("Password should be at least 6 characters long");
    }
    throw e;
  }
};

export const loginUser = async (email, password) => {
  email = strCheck(email, "email");

  email = email.toLowerCase();
  password = strCheck(password, "password");

  const auth = getAuth();
  let userCollection = await users();

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    console.log("User credential:", userCredential);

    const user = await userCollection.findOne({
      email: email,
    });

    if (!user) {
      throw new Error("User not found in database");
    }

    return user;
  } catch (e) {
    console.error("Login error:", e);
    return { signInCompleted: false };
  }
};
