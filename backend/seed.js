import {
  users,
  forums,
  universities,
  posts,
} from "./config/mongoCollections.js";
import firebaseApp from "./config/firebase.js";
import { ObjectId } from "mongodb";
import { createUser } from "./data/users.js";

async function main() {
  try {
    // Get collection references
    const usersCollection = await users();
    const universitiesCollection = await universities();
    const forumsCollection = await forums();
    const postsCollection = await posts();

    // Clear existing data
    console.log("Clearing existing collections...");
    await usersCollection.deleteMany({});
    await universitiesCollection.deleteMany({});
    await forumsCollection.deleteMany({});
    await postsCollection.deleteMany({});

    // Create universities
    console.log("Creating universities...");
    const universityData = [
      {
        name: "State University",
        location: "New York, NY",
        overview:
          "A leading public research university with a diverse student body and renowned faculty.",
        professors: [],
        courses: [],
        publicChatId: new ObjectId().toString(),
      },
      // Add more universities...
    ];

    const universityIds = [];
    for (const uniData of universityData) {
      const insertInfo = await universitiesCollection.insertOne(uniData);
      universityIds.push(insertInfo.insertedId);
      console.log(`Added university: ${uniData.name}`);
    }

    // Create users using the createUser function
    console.log("Creating users...");
    const userData = [
      {
        name: "Alice Johnson",
        email: "alice2@example.com",
        password: "Password123!",
        role: "student",
        universityId: universityIds[0].toString(),
      },
      // Add more users...
    ];

    const userIds = [];
    for (const user of userData) {
      try {
        const newUser = await createUser(
          user.email,
          user.password,
          user.name,
          user.role,
          user.universityId
        );
        userIds.push(newUser._id);
        console.log(`Added user: ${user.name}`);
      } catch (e) {
        console.error(`Failed to add user ${user.name}: ${e.message}`);
      }
    }

    // Continue with creating forums and posts...
    // (rest of your seed code)
  } catch (e) {
    console.error("Error during seeding:", e);
  }
}

main().catch(console.error);
