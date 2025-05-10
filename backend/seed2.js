// DO not run seed2.js directly. It is used to seed the database with initial data. only run if you want to make changes to the database. also be advised to clear the older data first before running it to add new data.
// This scripts seeds only the universities, professors, and courses collections.

import {
  universities,
  professors,
  courses,
} from "./config/mongoCollections.js";
// import { dbConnection } from "./config/mongoConnection.js";
import { ObjectId } from "mongodb";
import firebaseApp from "./config/firebase.js";

async function main() {
  try {
    // Get collection references
    const universitiesCollection = await universities();
    const professorsCollection = await professors();

    // Get database connection for courses (since it might not be in mongoCollections.js)
    const coursesCollection = await courses();

    console.log("Starting to seed universities, professors, and courses...");

    // Create universities
    console.log("Creating universities...");
    const universityData = [
      {
        name: "Tech Institute",
        location: "Boston, MA",
        overview:
          "A leading technology-focused university with strong computer science programs.",
        courses: [
          "Introduction to AI",
          "Advanced Data Structures",
          "Mobile App Development",
        ],
        professors: [],
        publicChatId: new ObjectId().toString(),
      },
      {
        name: "Coastal University",
        location: "San Diego, CA",
        overview:
          "A research university known for marine biology and environmental science programs.",
        courses: ["Marine Ecosystems", "Environmental Policy", "Oceanography"],
        professors: [],
        publicChatId: new ObjectId().toString(),
      },
      {
        name: "Midwest College",
        location: "Chicago, IL",
        overview:
          "A liberal arts college with strong humanities and business programs.",
        courses: [
          "Business Ethics",
          "Modern Literature",
          "Financial Accounting",
        ],
        professors: [],
        publicChatId: new ObjectId().toString(),
      },
      {
        name: "Mountain State University",
        location: "Denver, CO",
        overview:
          "Known for environmental science, geology, and outdoor recreation programs.",
        courses: [
          "Geology 101",
          "Sustainable Development",
          "Outdoor Leadership",
        ],
        professors: [],
        publicChatId: new ObjectId().toString(),
      },
    ];

    const universityResults = await universitiesCollection.insertMany(
      universityData
    );
    console.log(
      `Added ${
        Object.keys(universityResults.insertedIds).length
      } new universities`
    );

    // Get all university IDs
    const allUniversities = await universitiesCollection.find({}).toArray();

    // Create professors
    console.log("Creating professors...");
    const professorData = [
      {
        userId: new ObjectId().toString(), // Placeholder userId (would normally reference a user)
        universityId: universityResults.insertedIds[0].toString(),
        department: "Computer Science",
        courses: ["Machine Learning", "Data Mining"],
        ratings: [],
        averageRating: 0,
      },
      {
        userId: new ObjectId().toString(),
        universityId: universityResults.insertedIds[1].toString(),
        department: "Physics",
        courses: ["Quantum Mechanics", "Theoretical Physics"],
        ratings: [],
        averageRating: 0,
      },
      {
        userId: new ObjectId().toString(),
        universityId: universityResults.insertedIds[2].toString(),
        department: "Biology",
        courses: ["Molecular Biology", "Genetics"],
        ratings: [],
        averageRating: 0,
      },
      {
        userId: new ObjectId().toString(),
        universityId: universityResults.insertedIds[0].toString(),
        department: "Mathematics",
        courses: ["Advanced Calculus", "Linear Algebra"],
        ratings: [],
        averageRating: 0,
      },
      {
        userId: new ObjectId().toString(),
        universityId: universityResults.insertedIds[1].toString(),
        department: "Chemistry",
        courses: ["Organic Chemistry", "Biochemistry"],
        ratings: [],
        averageRating: 0,
      },
      {
        userId: new ObjectId().toString(),
        universityId: universityResults.insertedIds[3].toString(),
        department: "History",
        courses: ["World History", "American Revolution"],
        ratings: [],
        averageRating: 0,
      },
    ];

    const professorResults = await professorsCollection.insertMany(
      professorData
    );
    console.log(
      `Added ${Object.keys(professorResults.insertedIds).length} new professors`
    );

    // Create courses
    console.log("Creating courses...");
    const courseData = [
      {
        title: "Introduction to Machine Learning",
        description:
          "An overview of machine learning algorithms and applications.",
        universityId: universityResults.insertedIds[0].toString(),
        professorId: professorResults.insertedIds[0].toString(),
        studentsEnrolled: [],
      },
      {
        title: "Quantum Physics",
        description:
          "Study of quantum mechanics and its applications in modern physics.",
        universityId: universityResults.insertedIds[1].toString(),
        professorId: professorResults.insertedIds[1].toString(),
        studentsEnrolled: [],
      },
      {
        title: "Molecular Biology Techniques",
        description:
          "Laboratory techniques in molecular biology and genetic engineering.",
        universityId: universityResults.insertedIds[2].toString(),
        professorId: professorResults.insertedIds[2].toString(),
        studentsEnrolled: [],
      },
      {
        title: "Advanced Calculus",
        description:
          "In-depth study of calculus concepts including limits, derivatives, and integrals.",
        universityId: universityResults.insertedIds[0].toString(),
        professorId: professorResults.insertedIds[3].toString(),
        studentsEnrolled: [],
      },
      {
        title: "Organic Chemistry Lab",
        description:
          "Laboratory course focusing on organic chemistry reactions and techniques.",
        universityId: universityResults.insertedIds[1].toString(),
        professorId: professorResults.insertedIds[4].toString(),
        studentsEnrolled: [],
      },
      {
        title: "American History: Revolution to Civil War",
        description:
          "Comprehensive study of American history from 1776 to 1865.",
        universityId: universityResults.insertedIds[3].toString(),
        professorId: professorResults.insertedIds[5].toString(),
        studentsEnrolled: [],
      },
      {
        title: "Data Structures and Algorithms",
        description:
          "Implementation and analysis of fundamental data structures and algorithms.",
        universityId: universityResults.insertedIds[0].toString(),
        professorId: professorResults.insertedIds[0].toString(),
        studentsEnrolled: [],
      },
      {
        title: "Environmental Chemistry",
        description:
          "Study of chemical processes in the environment and their impact on ecosystems.",
        universityId: universityResults.insertedIds[2].toString(),
        professorId: professorResults.insertedIds[4].toString(),
        studentsEnrolled: [],
      },
    ];

    const courseResults = await coursesCollection.insertMany(courseData);
    console.log(
      `Added ${Object.keys(courseResults.insertedIds).length} new courses`
    );

    console.log("Seeding completed successfully!");
  } catch (e) {
    console.error("Error during seeding:", e);
  }
}

main().catch(console.error);
