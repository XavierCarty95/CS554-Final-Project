import {
  users,
  forums,
  universities,
  posts,
  professors,
  reviews
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
    const professorsCollection = await professors();
    const reviewsCollection = await reviews(); 


    console.log("Clearing existing collections...");
 
    await universitiesCollection.deleteMany({});
    await forumsCollection.deleteMany({});
    await postsCollection.deleteMany({});
    await professorsCollection.deleteMany({});
    await reviewsCollection.deleteMany({});

    // Create university
    console.log("Creating university...");
    const universityInfo = {
      name: "State University",
      location: "New York, NY",
      overview:
        "A leading public research university with a diverse student body and renowned faculty.",
      professors: [],
      courses: [],
      publicChatId: new ObjectId().toString()
    };

    const universityInsert = await universitiesCollection.insertOne(universityInfo);
    const universityId = universityInsert.insertedId;
    console.log(`Added university: ${universityInfo.name}`);

    // Add professors
    console.log("Adding professors...");
    const professorData = [
      {
        name: "Dr. Alice Johnson",
        department: "Computer Science",
        universityId: universityId,
        ratings: [
          { score: 5, comment: "Dr. Alice Johnson is incredibly engaging and clear." },
          { score: 4, comment: "Really appreciated her feedback on assignments." }
        ]
      },
      {
        name: "Dr. Bob Smith",
        department: "Mathematics",
        universityId: universityId,
        ratings: [
          { score: 3, comment: "Hard to follow sometimes, but knows the material well." },
          { score: 4, comment: "Makes tough math topics easier to understand." }
        ]
      }
    ];

    const professorIds = [];

    for (const prof of professorData) {
      const insertResult = await professorsCollection.insertOne(prof);
      professorIds.push(insertResult.insertedId);
      console.log(`Added professor: ${prof.name}`);
    }

    // Update university with professor IDs
    await universitiesCollection.updateOne(
      { _id: universityId },
      { $set: { professors: professorIds } }
    );
    console.log(" University updated with professor references.");

    // Add reviews for professors
    console.log("Adding reviews...");
    const reviewData = [
      {
        professorId: professorIds[0],
        userId: new ObjectId(),
        rating: 5,
        comment: "Dr. Alice Johnson is incredibly engaging and clear.",
        createdAt: new Date()
      },
      {
        professorId: professorIds[0],
        userId: new ObjectId(),
        rating: 4,
        comment: "Really appreciated her feedback on assignments.",
        createdAt: new Date()
      },
      {
        professorId: professorIds[1],
        userId: new ObjectId(),
        rating: 3,
        comment: "Hard to follow sometimes, but knows the material well.",
        createdAt: new Date()
      },
      {
        professorId: professorIds[1],
        userId: new ObjectId(),
        rating: 4,
        comment: "Makes tough math topics easier to understand.",
        createdAt: new Date()
      }
    ];

    for (const review of reviewData) {
      await reviewsCollection.insertOne(review);
      console.log(`Inserted review for professor ${review.professorId}`);
    }

    console.log("Database seeding complete!");

  } catch (e) {
    console.error("Error during seeding:", e);
  }
}

main().catch(console.error);