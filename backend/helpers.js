import { ObjectId } from "mongodb";

export function strCheck(strVal, varName) {
  if (!strVal) throw new Error(`Error: You must supply a ${varName}!`);
  if (typeof strVal !== "string")
    throw new Error(`Error: ${varName} must be a string!`);
  strVal = strVal.trim();
  if (strVal.length === 0)
    throw new Error(
      `Error: ${varName} cannot be an empty string or string with just spaces`
    );
  return strVal;
}

export const validateName = (str) => {
  if (str.length < 5) {
    throw new Error("Name must be at least 5 characters long");
  }
  if (str.length > 25) {
    throw new Error("Name must be at most 25 characters long");
  }
  const nameRegex = /^[a-zA-Z\s\-'.]+$/;
  if (!nameRegex.test(str)) {
    throw new Error(
      "Name can only contain letters, spaces, hyphens, apostrophes, and periods"
    );
  }
};

export const validateUsername = (str) => {
  if (str.length < 5) {
    throw new Error("Username must be at least 5 characters long");
  }
  if (/^[0-9]+$/.test(str)) {
    throw new Error("Username cannot be just numbers");
  }
  if (!/^[a-zA-Z0-9]+$/.test(str)) {
    throw new Error("Username can only contain letters and numbers");
  }
};

export const validatePassword = (password) => {
  if (/\s/.test(password)) {
    throw new Error("password cannot contain spaces");
  }
  if (password.length < 8) {
    throw new Error("password must be at least 8 characters long");
  }
  if (/^\s*$/.test(password)) {
    throw new Error("password cannot be just spaces");
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error("password must contain at least one uppercase letter");
  }
  if (!/[0-9]/.test(password)) {
    throw new Error("password must contain at least one number");
  }
  if (!/[!@#$%^&*(),.?":{}|<>_]/.test(password)) {
    throw new Error("password must contain at least one special character");
  }
};

export const isValidId = (id) => {
  if (!id) throw new Error("You must provide an id to search for");
  if (typeof id !== "string") throw new Error("Id must be a string");
  if (id.trim().length === 0)
    throw new Error("Id cannot be an empty string or just spaces");
  id = id.trim();
  if (!ObjectId.isValid(id)) throw new Error("invalid object ID");
};
