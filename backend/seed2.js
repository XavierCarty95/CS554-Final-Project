// seed2.js
import {
  universities,
  professors,
  courses,
} from "./config/mongoCollections.js";
import { ObjectId } from "mongodb";

async function main() {
  try {
    const db = await import("./config/mongoConnection.js").then((m) =>
      m.dbConnection()
    );

    const collectionsToClear = [
      "universities",
      "professors",
      "courses",
      "reviews",
      "forums",
      "posts",
      "chats",
      "chatrequests",
      "users",
    ];

    console.log("Clearing existing collections (preserving users)...");
    for (const collection of collectionsToClear) {
      await db.collection(collection).deleteMany({});
      console.log(`Cleared ${collection} collection`);
    }

    const universitiesCollection = await universities();
    const professorsCollection = await professors();
    const coursesCollection = await courses();

    console.log("Starting to seed universities, professors, and courses...");

    console.log("Creating universities...");
    const universityData = [
      {
        name: "Tech Institute",
        location: "Boston, MA",
        overview:
          "A leading technology-focused university with strong computer science programs.",
        courses: [],
        professors: [],
        publicChatId: new ObjectId().toString(),
      },
      {
        name: "Coastal University",
        location: "San Diego, CA",
        overview:
          "A research university known for marine biology and environmental science programs.",
        courses: [],
        professors: [],
        publicChatId: new ObjectId().toString(),
      },
      {
        name: "Midwest College",
        location: "Chicago, IL",
        overview:
          "A liberal arts college with strong humanities and business programs.",
        courses: [],
        professors: [],
        publicChatId: new ObjectId().toString(),
      },
      {
        name: "Mountain State University",
        location: "Denver, CO",
        overview:
          "Known for environmental science, geology, and outdoor recreation programs.",
        courses: [],
        professors: [],
        publicChatId: new ObjectId().toString(),
      },
      {
        name: "Bay Area University",
        location: "San Francisco, CA",
        overview:
          "Renowned for innovation and technology entrepreneurship programs.",
        courses: [],
        professors: [],
        publicChatId: new ObjectId().toString(),
      },
      {
        name: "Atlantic College",
        location: "New York, NY",
        overview:
          "Prestigious institution with strong programs in finance and business.",
        courses: [],
        professors: [],
        publicChatId: new ObjectId().toString(),
      },
      {
        name: "Southern State University",
        location: "Atlanta, GA",
        overview:
          "Known for medical research and healthcare education programs.",
        courses: [],
        professors: [],
        publicChatId: new ObjectId().toString(),
      },
      {
        name: "Pacific Northwest University",
        location: "Seattle, WA",
        overview:
          "Leading institution for environmental science and sustainable development.",
        courses: [],
        professors: [],
        publicChatId: new ObjectId().toString(),
      },
      {
        name: "Great Lakes College",
        location: "Detroit, MI",
        overview:
          "Focused on engineering and automotive technology innovation.",
        courses: [],
        professors: [],
        publicChatId: new ObjectId().toString(),
      },
      {
        name: "Southwest Technical University",
        location: "Phoenix, AZ",
        overview:
          "Specializing in renewable energy and desert ecology research.",
        courses: [],
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

    const universityDepartments = {
      0: ["Computer Science", "Mathematics", "Electrical Engineering"],
      1: ["Marine Biology", "Oceanography", "Environmental Science"],
      2: ["Literature", "Philosophy", "Business Administration"],
      3: ["Geology", "Environmental Studies", "Recreation Management"],
      4: ["Computer Engineering", "Data Science", "Business Innovation"],
      5: ["Finance", "Economics", "International Business"],
      6: ["Medicine", "Nursing", "Public Health"],
      7: ["Environmental Engineering", "Forestry", "Sustainable Design"],
      8: ["Mechanical Engineering", "Automotive Design", "Materials Science"],
      9: ["Renewable Energy", "Desert Ecology", "Sustainable Agriculture"],
    };

    const departmentCourses = {
      "Computer Science": [
        "Introduction to Programming",
        "Data Structures",
        "Algorithms",
        "Machine Learning",
        "Web Development",
      ],
      Mathematics: [
        "Calculus I",
        "Linear Algebra",
        "Differential Equations",
        "Statistics",
        "Discrete Mathematics",
      ],
      "Electrical Engineering": [
        "Circuit Analysis",
        "Digital Systems",
        "Signals and Systems",
        "Microelectronics",
        "Control Systems",
      ],
      "Marine Biology": [
        "Marine Ecosystems",
        "Fish Biology",
        "Coral Reef Ecology",
        "Marine Conservation",
        "Oceanography",
      ],
      Oceanography: [
        "Physical Oceanography",
        "Chemical Oceanography",
        "Marine Geology",
        "Ocean Dynamics",
        "Coastal Processes",
      ],
      "Environmental Science": [
        "Ecology",
        "Environmental Chemistry",
        "Climate Science",
        "Conservation Biology",
        "Sustainable Development",
      ],
      Literature: [
        "World Literature",
        "Creative Writing",
        "Literary Theory",
        "Shakespeare Studies",
        "Modern Poetry",
      ],
      Philosophy: [
        "Ethics",
        "Logic",
        "Metaphysics",
        "Philosophy of Mind",
        "Political Philosophy",
      ],
      "Business Administration": [
        "Management Principles",
        "Marketing",
        "Organizational Behavior",
        "Business Ethics",
        "Strategic Management",
      ],
      Geology: [
        "Physical Geology",
        "Mineralogy",
        "Structural Geology",
        "Sedimentology",
        "Geomorphology",
      ],
      "Environmental Studies": [
        "Environmental Policy",
        "Natural Resource Management",
        "Environmental Impact Assessment",
        "Ecosystem Management",
        "Environmental Law",
      ],
      "Recreation Management": [
        "Outdoor Leadership",
        "Park Management",
        "Adventure Programming",
        "Ecotourism",
        "Wilderness First Aid",
      ],
      "Computer Engineering": [
        "Computer Architecture",
        "Operating Systems",
        "Embedded Systems",
        "Computer Networks",
        "VLSI Design",
      ],
      "Data Science": [
        "Data Mining",
        "Machine Learning",
        "Big Data Analytics",
        "Statistical Computing",
        "Data Visualization",
      ],
      "Business Innovation": [
        "Entrepreneurship",
        "Product Development",
        "Innovation Management",
        "Venture Capital",
        "Business Model Design",
      ],
      Finance: [
        "Corporate Finance",
        "Investment Analysis",
        "Financial Markets",
        "Risk Management",
        "International Finance",
      ],
      Economics: [
        "Microeconomics",
        "Macroeconomics",
        "Econometrics",
        "International Trade",
        "Development Economics",
      ],
      "International Business": [
        "Global Marketing",
        "International Management",
        "Cross-Cultural Communication",
        "Global Supply Chain",
        "International Finance",
      ],
      Medicine: [
        "Anatomy",
        "Physiology",
        "Pathology",
        "Pharmacology",
        "Clinical Medicine",
      ],
      Nursing: [
        "Fundamentals of Nursing",
        "Medical-Surgical Nursing",
        "Pediatric Nursing",
        "Mental Health Nursing",
        "Community Health",
      ],
      "Public Health": [
        "Epidemiology",
        "Biostatistics",
        "Health Policy",
        "Global Health",
        "Environmental Health",
      ],
      "Environmental Engineering": [
        "Water Treatment",
        "Air Pollution Control",
        "Waste Management",
        "Environmental Modeling",
        "Remediation Technologies",
      ],
      Forestry: [
        "Forest Ecology",
        "Silviculture",
        "Forest Management",
        "Wildlife Habitat",
        "Forest Economics",
      ],
      "Sustainable Design": [
        "Green Building Design",
        "Sustainable Materials",
        "Energy Efficient Design",
        "Ecological Design",
        "Urban Planning",
      ],
      "Mechanical Engineering": [
        "Thermodynamics",
        "Fluid Mechanics",
        "Machine Design",
        "Heat Transfer",
        "Robotics",
      ],
      "Automotive Design": [
        "Vehicle Dynamics",
        "Powertrain Systems",
        "Automotive Electronics",
        "Vehicle Safety",
        "Autonomous Vehicles",
      ],
      "Materials Science": [
        "Materials Characterization",
        "Polymer Science",
        "Metallurgy",
        "Composite Materials",
        "Nanomaterials",
      ],
      "Renewable Energy": [
        "Solar Energy Systems",
        "Wind Energy",
        "Bioenergy",
        "Energy Storage",
        "Smart Grid Technologies",
      ],
      "Desert Ecology": [
        "Desert Ecosystems",
        "Arid Land Management",
        "Desert Wildlife",
        "Desert Plant Biology",
        "Desert Hydrology",
      ],
      "Sustainable Agriculture": [
        "Organic Farming",
        "Agroecology",
        "Irrigation Systems",
        "Soil Conservation",
        "Crop Science",
      ],
    };

    console.log("Creating courses...");
    const courseData = [];
    const universityCoursesMap = {}; // To track courses for each university

    for (let uniIndex = 0; uniIndex < 10; uniIndex++) {
      const universityId = universityResults.insertedIds[uniIndex].toString();
      const departments = universityDepartments[uniIndex];
      universityCoursesMap[universityId] = [];

      for (let deptIndex = 0; deptIndex < departments.length; deptIndex++) {
        const department = departments[deptIndex];
        const courseTitles = departmentCourses[department];

        for (let i = 0; i < 5; i++) {
          const courseTitle = courseTitles[i];

          courseData.push({
            title: courseTitle,
            description: `Comprehensive course covering ${courseTitle.toLowerCase()} principles and applications.`,
            universityId: universityId,
            professorId: null,
            department: department,
            studentsEnrolled: [],
          });
        }
      }
    }

    const courseResults = await coursesCollection.insertMany(courseData);
    console.log(
      `Added ${Object.keys(courseResults.insertedIds).length} new courses`
    );

    for (let i = 0; i < courseData.length; i++) {
      const courseId = courseResults.insertedIds[i].toString();
      const universityId = courseData[i].universityId;

      universityCoursesMap[universityId].push({
        id: courseId,
        department: courseData[i].department,
      });

      await universitiesCollection.updateOne(
        { _id: new ObjectId(universityId) },
        { $push: { courses: courseId } }
      );
    }

    console.log("Creating professors...");
    const professorData = [];

    const professorNamesByDepartment = {
      "Computer Science": [
        "Dr. Alan Turing",
        "Dr. Grace Hopper",
        "Dr. Ada Lovelace",
      ],
      Mathematics: [
        "Dr. Katherine Johnson",
        "Dr. John Nash",
        "Dr. Emmy Noether",
      ],
      "Electrical Engineering": [
        "Dr. Nikola Tesla",
        "Dr. Thomas Edison",
        "Dr. Claude Shannon",
      ],
      "Marine Biology": [
        "Dr. Jacques Cousteau",
        "Dr. Sylvia Earle",
        "Dr. Rachel Carson",
      ],
      Oceanography: [
        "Dr. Robert Ballard",
        "Dr. Marie Tharp",
        "Dr. Charles Wyville Thomson",
      ],
      "Environmental Science": [
        "Dr. Jane Goodall",
        "Dr. E.O. Wilson",
        "Dr. Wangari Maathai",
      ],
      Literature: [
        "Dr. Harold Bloom",
        "Dr. Toni Morrison",
        "Dr. Northrop Frye",
      ],
      Philosophy: [
        "Dr. Martha Nussbaum",
        "Dr. Peter Singer",
        "Dr. Judith Butler",
      ],
      "Business Administration": [
        "Dr. Peter Drucker",
        "Dr. Clayton Christensen",
        "Dr. Rosabeth Moss Kanter",
      ],
      Geology: ["Dr. Charles Lyell", "Dr. Marie Curie", "Dr. James Hutton"],
      "Environmental Studies": [
        "Dr. Aldo Leopold",
        "Dr. Gro Harlem Brundtland",
        "Dr. David Suzuki",
      ],
      "Recreation Management": [
        "Dr. Aldo Leopold",
        "Dr. John Muir",
        "Dr. Gifford Pinchot",
      ],
      "Computer Engineering": [
        "Dr. Gordon Moore",
        "Dr. Vint Cerf",
        "Dr. Anita Borg",
      ],
      "Data Science": [
        "Dr. Andrew Ng",
        "Dr. Fei-Fei Li",
        "Dr. Geoffrey Hinton",
      ],
      "Business Innovation": [
        "Dr. Clayton Christensen",
        "Dr. W. Chan Kim",
        "Dr. Rita McGrath",
      ],
      Finance: ["Dr. Eugene Fama", "Dr. Robert Shiller", "Dr. Harry Markowitz"],
      Economics: ["Dr. Paul Krugman", "Dr. Esther Duflo", "Dr. Amartya Sen"],
      "International Business": [
        "Dr. Pankaj Ghemawat",
        "Dr. Geert Hofstede",
        "Dr. C.K. Prahalad",
      ],
      Medicine: [
        "Dr. Anthony Fauci",
        "Dr. Elizabeth Blackwell",
        "Dr. Jonas Salk",
      ],
      Nursing: [
        "Dr. Florence Nightingale",
        "Dr. Virginia Henderson",
        "Dr. Martha Rogers",
      ],
      "Public Health": [
        "Dr. Michael Marmot",
        "Dr. Mary Bassett",
        "Dr. Paul Farmer",
      ],
      "Environmental Engineering": [
        "Dr. Ellen Swallow Richards",
        "Dr. G.D. Agrawal",
        "Dr. Abel Wolman",
      ],
      Forestry: [
        "Dr. Wangari Maathai",
        "Dr. Gifford Pinchot",
        "Dr. Suzanne Simard",
      ],
      "Sustainable Design": [
        "Dr. William McDonough",
        "Dr. Janine Benyus",
        "Dr. Buckminster Fuller",
      ],
      "Mechanical Engineering": [
        "Dr. Bill Nye",
        "Dr. Mae Jemison",
        "Dr. Robert Goddard",
      ],
      "Automotive Design": [
        "Dr. Ferdinand Porsche",
        "Dr. Kelly Johnson",
        "Dr. Mary Anderson",
      ],
      "Materials Science": [
        "Dr. Mildred Dresselhaus",
        "Dr. Richard Feynman",
        "Dr. Stephanie Kwolek",
      ],
      "Renewable Energy": [
        "Dr. Ashok Gadgil",
        "Dr. Martin Green",
        "Dr. Maria Telkes",
      ],
      "Desert Ecology": [
        "Dr. Jane Goodall",
        "Dr. Janice Bowers",
        "Dr. Robert Ricklefs",
      ],
      "Sustainable Agriculture": [
        "Dr. Vandana Shiva",
        "Dr. Wes Jackson",
        "Dr. Miguel Altieri",
      ],
    };

    for (let uniIndex = 0; uniIndex < 10; uniIndex++) {
      const universityId = universityResults.insertedIds[uniIndex].toString();
      const departments = universityDepartments[uniIndex];

      for (let deptIndex = 0; deptIndex < departments.length; deptIndex++) {
        const department = departments[deptIndex];
        const professorName =
          professorNamesByDepartment[department][deptIndex % 3];

        const departmentCourses = universityCoursesMap[universityId]
          .filter((course) => course.department === department)
          .map((course) => course.id);

        professorData.push({
          name: professorName,
          department: department,
          universityId: universityId,
          courses: departmentCourses,
          ratings: [],
          averageRating: 0,
        });
      }
    }

    const professorResults = await professorsCollection.insertMany(
      professorData
    );
    console.log(
      `Added ${Object.keys(professorResults.insertedIds).length} new professors`
    );

    for (let i = 0; i < professorData.length; i++) {
      const profId = professorResults.insertedIds[i].toString();
      const uniId = professorData[i].universityId;

      await universitiesCollection.updateOne(
        { _id: new ObjectId(uniId) },
        { $push: { professors: profId } }
      );
    }

    for (let i = 0; i < professorData.length; i++) {
      const profId = professorResults.insertedIds[i].toString();
      const courseIds = professorData[i].courses;

      for (const courseId of courseIds) {
        await coursesCollection.updateOne(
          { _id: new ObjectId(courseId) },
          { $set: { professorId: profId } }
        );
      }
    }

    await import("./config/mongoConnection.js").then((m) =>
      m.closeConnection()
    );
    console.log("Seeding completed successfully!");
  } catch (e) {
    console.error("Error during seeding:", e);
  }
}

main().catch(console.error);
