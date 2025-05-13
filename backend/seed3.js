import { universities, professors, courses } from "./config/mongoCollections.js";
import { ObjectId } from "mongodb";

function mergeSeed2Courses(seed3Unis, seed2CoursesByUniversity) {
    for (const uni of seed3Unis) {
        const deptCourses = seed2CoursesByUniversity[uni.name];
        if (!deptCourses) continue;

        for (const [major, courseTitles] of Object.entries(deptCourses)) {
            const existingTitles = new Set(
                uni.requiredCourses.filter(c => c.major === major).map(c => c.title)
            );

            for (const title of courseTitles) {
                if (!existingTitles.has(title)) {
                    uni.requiredCourses.push({
                        title,
                        semesterOffered: "Fall",
                        yearRecommended: 1,
                        major
                    });
                }
            }
        }
    }
}

function generateFakeCourseTitle(uniqueGenIndex, major) {
    const keywords = {
        "Computer Science": [
            "Introduction to Software", "Functional Programming", "Systems Programming", "Web Architecture",
            "AI Principles", "Secure Computing", "Data Visualization", "Network Protocols",
            "Compiler Design", "Graph Theory", "Cyber Defense",
            "Object-Oriented Design", "Software Engineering Principles", "Database Management Systems",
            "Operating Systems Concepts", "Computer Organization & Architecture", "Algorithm Analysis",
            "Discrete Structures for CS", "Human-Computer Interaction", "Mobile Application Development",
            "Cloud Computing Fundamentals", "Introduction to Cybersecurity", "Machine Learning Foundations",
            "Data Mining & Warehousing", "Natural Language Processing Basics", "Computer Graphics",
            "Parallel and Distributed Computing", "Software Testing & QA", "Advanced Web Technologies",
            "Ethical Hacking & Penetration Testing", "Game Development Fundamentals", "Bioinformatics Algorithms"
        ],
        "Information Technology": [
            "Foundations of IT", "Cloud Infrastructure", "Modern Networking", "Applied Cybersecurity",
            "Database Systems", "IT Project Leadership", "Digital Transformation", "Enterprise Platforms",
            "Tech in Business", "Mobile Platforms",
            "Network Administration", "System Administration", "Information Security Management",
            "IT Governance & Policy", "Web Server Administration", "Virtualization Technologies",
            "Data Center Management", "IT Audit and Compliance", "Business Intelligence Systems",
            "Customer Relationship Management (CRM) Systems", "Enterprise Resource Planning (ERP) Systems",
            "Scripting for IT Automation", "Wireless Networking", "Forensic IT",
            "IT Service Management (ITSM)", "User Support & Help Desk Operations"
        ],
        "Engineering": [
            "Design for Engineers", "CAD and Modeling", "Statics and Dynamics", "Intro to Thermofluids",
            "Engineering Systems", "Digital Signal Processing", "Sensors and Actuators", "Manufacturing Systems",
            "Field Engineering", "Applied Mechanics",
            "Engineering Ethics & Professionalism", "Materials Science for Engineers", "Engineering Computation",
            "Probability & Statistics for Engineers", "Fluid Mechanics I", "Thermodynamics I",
            "Electrical Circuits I", "Engineering Economics", "Control Systems Theory",
            "Heat Transfer Principles", "Mechanical Vibrations", "Structural Analysis",
            "Introduction to Robotics", "Sustainable Engineering Design", "Finite Element Analysis Basics",
            "Biomechanics Fundamentals"
        ],
        "Mathematics": [
            "Logic and Proof", "Combinatorics", "Number Theory", "Linear Systems", "Abstract Algebra",
            "Stochastic Models", "Real Variables", "Complex Systems", "Optimization Methods", "Set Theory",
            "Calculus I for Majors", "Calculus II for Majors", "Multivariable Calculus", "Differential Equations",
            "Linear Algebra II", "Introduction to Topology", "Probability Theory", "Mathematical Statistics",
            "Numerical Analysis I", "Mathematical Modeling", "History of Mathematics",
            "Graph Theory Applications", "Advanced Abstract Algebra", "Real Analysis II",
            "Partial Differential Equations", "Cryptography & Coding Theory"
        ],
        "Biology": [
            "Molecular Genetics", "Botany", "Cell Structure", "Ecological Systems", "Zoology",
            "Developmental Biology", "Immunobiology", "Genomic Data", "Neurobiology", "Evolutionary Biology",
            "General Biology I & Lab", "General Biology II & Lab", "Organic Chemistry for Biologists",
            "Biochemistry I", "Human Anatomy & Physiology I", "Human Anatomy & Physiology II",
            "Microbiology & Lab", "Principles of Ecology", "Genetics Lab", "Cell Biology Lab",
            "Introduction to Marine Biology", "Conservation Biology", "Animal Behavior",
            "Plant Physiology", "Virology", "Parasitology"
        ],
    };

    const pool = keywords[major] || [];

    if (pool.length === 0) {
        return `Advanced Studies in ${major} Series ${uniqueGenIndex + 1}`;
    }
    return pool[uniqueGenIndex % pool.length];
}

function balanceSemesterCourses(universities) {
    function getBaseTitle(title) {
        return title.trim().toLowerCase();
    }
    for (const uni of universities) {
        const courseGroups = {};

        for (const course of uni.requiredCourses) {
            const key = `${course.major}-${course.yearRecommended}-${course.semesterOffered}`;
            if (!courseGroups[key]) courseGroups[key] = [];
            courseGroups[key].push(course);
        }

        for (let year = 1; year <= 4; year++) {
            const majors = new Set(uni.requiredCourses.map(c => c.major));
            for (const major of majors) {
                const allExistingTitles = new Set(
                    uni.requiredCourses
                        .filter(c => c.major === major)
                        .map(c => getBaseTitle(c.title))
                );
                for (const semester of ["Fall", "Spring"]) {
                    const key = `${major}-${year}-${semester}`;
                    if (!courseGroups[key]) courseGroups[key] = [];
                    let existing = courseGroups[key];

                    const seenTitles = new Set();
                    existing = existing.filter(course => {
                        const normTitle = getBaseTitle(course.title);
                        if (seenTitles.has(normTitle)) return false;
                        seenTitles.add(normTitle);
                        return true;
                    });
                    courseGroups[key] = existing;
                    if (existing.length > 3) {
                        existing = existing.slice(0, 3);
                        courseGroups[key] = existing;
                    }
                    const keepTitles = new Set(existing.map(c => c.title));
                    uni.requiredCourses = uni.requiredCourses.filter(
                        c => !(c.major === major && c.yearRecommended === year && c.semesterOffered === semester) || keepTitles.has(c.title)
                    );

                    let index = 0;
                    while (existing.length < 3) {
                        let title = generateFakeCourseTitle(index + allExistingTitles.size, major, semester, year);
                        while (allExistingTitles.has(getBaseTitle(title))) {
                            index++;
                            title = generateFakeCourseTitle(index + allExistingTitles.size, major, semester, year);
                        }
                        allExistingTitles.add(getBaseTitle(title));
                        const newCourse = {
                            title,
                            semesterOffered: semester,
                            yearRecommended: year,
                            major
                        };
                        uni.requiredCourses.push(newCourse);
                        courseGroups[key].push(newCourse);
                        existing.push(newCourse);
                    }
                }
            }
        }
    }
}

const seed2CoursesByUniversity = {
    "Tech Institute": {
        "Computer Science": [
            "Introduction to Programming", "Data Structures", "Algorithms", "Machine Learning", "Web Development"
        ],
        "Mathematics": [
            "Calculus I", "Linear Algebra", "Differential Equations", "Statistics", "Discrete Mathematics"
        ],
        "Electrical Engineering": [
            "Circuit Analysis", "Digital Systems", "Signals and Systems", "Microelectronics", "Control Systems"
        ]
    },
    "Coastal University": {
        "Marine Biology": [
            "Marine Ecosystems", "Fish Biology", "Coral Reef Ecology", "Marine Conservation", "Oceanography"
        ],
        "Oceanography": [
            "Physical Oceanography", "Chemical Oceanography", "Marine Geology", "Ocean Dynamics", "Coastal Processes"
        ],
        "Environmental Science": [
            "Ecology", "Environmental Chemistry", "Climate Science", "Conservation Biology", "Sustainable Development"
        ]
    },
    "Midwest College": {
        "Literature": [
            "World Literature", "Creative Writing", "Literary Theory", "Shakespeare Studies", "Modern Poetry"
        ],
        "Philosophy": [
            "Ethics", "Logic", "Metaphysics", "Philosophy of Mind", "Political Philosophy"
        ],
        "Business Administration": [
            "Management Principles", "Marketing", "Organizational Behavior", "Business Ethics", "Strategic Management"
        ]
    },
    "Mountain State University": {
        "Geology": [
            "Physical Geology", "Mineralogy", "Structural Geology", "Sedimentology", "Geomorphology"
        ],
        "Environmental Studies": [
            "Environmental Policy", "Natural Resource Management", "Environmental Impact Assessment", "Ecosystem Management", "Environmental Law"
        ],
        "Recreation Management": [
            "Outdoor Leadership", "Park Management", "Adventure Programming", "Ecotourism", "Wilderness First Aid"
        ]
    }
};

const newUniversities = [
    {
        name: "Tech Institute",
        location: "Boston, MA",
        overview: "A leading institute for technology and applied sciences.",
        requiredCourses: [
            { title: "Intro to Information Technology", semesterOffered: "Fall", yearRecommended: 1, major: "Information Technology" },
            { title: "Programming Fundamentals", semesterOffered: "Fall", yearRecommended: 1, major: "Information Technology" },
            { title: "Computer Hardware Basics", semesterOffered: "Fall", yearRecommended: 1, major: "Information Technology" },
            { title: "IT Systems Lab", semesterOffered: "Spring", yearRecommended: 1, major: "Information Technology" },
            { title: "Mathematics for IT", semesterOffered: "Spring", yearRecommended: 1, major: "Information Technology" },
            { title: "Digital Literacy", semesterOffered: "Spring", yearRecommended: 1, major: "Information Technology" },
            { title: "Networking Basics", semesterOffered: "Fall", yearRecommended: 2, major: "Information Technology" },
            { title: "Database Concepts", semesterOffered: "Fall", yearRecommended: 2, major: "Information Technology" },
            { title: "Systems Analysis", semesterOffered: "Fall", yearRecommended: 2, major: "Information Technology" },
            { title: "Web Technologies", semesterOffered: "Spring", yearRecommended: 2, major: "Information Technology" },
            { title: "Operating Systems", semesterOffered: "Spring", yearRecommended: 2, major: "Information Technology" },
            { title: "IT Support Fundamentals", semesterOffered: "Spring", yearRecommended: 2, major: "Information Technology" },
            { title: "Cybersecurity Principles", semesterOffered: "Fall", yearRecommended: 3, major: "Information Technology" },
            { title: "Cloud Computing", semesterOffered: "Fall", yearRecommended: 3, major: "Information Technology" },
            { title: "Virtualization Technologies", semesterOffered: "Fall", yearRecommended: 3, major: "Information Technology" },
            { title: "IT Project Management", semesterOffered: "Spring", yearRecommended: 3, major: "Information Technology" },
            { title: "Mobile Application Development", semesterOffered: "Spring", yearRecommended: 3, major: "Information Technology" },
            { title: "Data Analytics for IT", semesterOffered: "Spring", yearRecommended: 3, major: "Information Technology" },
            { title: "Enterprise Systems", semesterOffered: "Fall", yearRecommended: 4, major: "Information Technology" },
            { title: "Capstone Project I", semesterOffered: "Fall", yearRecommended: 4, major: "Information Technology" },
            { title: "Emerging Technologies in IT", semesterOffered: "Fall", yearRecommended: 4, major: "Information Technology" },
            { title: "Professional Ethics in IT", semesterOffered: "Spring", yearRecommended: 4, major: "Information Technology" },
            { title: "Capstone Project II", semesterOffered: "Spring", yearRecommended: 4, major: "Information Technology" },
            { title: "IT Entrepreneurship", semesterOffered: "Spring", yearRecommended: 4, major: "Information Technology" },
            { title: "Introduction to Software Engineering", semesterOffered: "Fall", yearRecommended: 1, major: "Software Engineering" },
            { title: "Object-Oriented Programming", semesterOffered: "Fall", yearRecommended: 1, major: "Software Engineering" },
            { title: "Introduction to Algorithms", semesterOffered: "Fall", yearRecommended: 1, major: "Software Engineering" },
            { title: "Software Engineering Lab", semesterOffered: "Spring", yearRecommended: 1, major: "Software Engineering" },
            { title: "Discrete Structures", semesterOffered: "Spring", yearRecommended: 1, major: "Software Engineering" },
            { title: "Introduction to Databases", semesterOffered: "Spring", yearRecommended: 1, major: "Software Engineering" },
            { title: "Data Structures & Algorithms", semesterOffered: "Fall", yearRecommended: 2, major: "Software Engineering" },
            { title: "Software Design Patterns", semesterOffered: "Fall", yearRecommended: 2, major: "Software Engineering" },
            { title: "Software Architecture", semesterOffered: "Fall", yearRecommended: 2, major: "Software Engineering" },
            { title: "Software Testing & QA", semesterOffered: "Spring", yearRecommended: 2, major: "Software Engineering" },
            { title: "Requirements Engineering", semesterOffered: "Spring", yearRecommended: 2, major: "Software Engineering" },
            { title: "Introduction to Web Development", semesterOffered: "Spring", yearRecommended: 2, major: "Software Engineering" },
            { title: "Agile Development", semesterOffered: "Fall", yearRecommended: 3, major: "Software Engineering" },
            { title: "Human-Computer Interaction", semesterOffered: "Fall", yearRecommended: 3, major: "Software Engineering" },
            { title: "Software Maintenance", semesterOffered: "Fall", yearRecommended: 3, major: "Software Engineering" },
            { title: "Web Application Engineering", semesterOffered: "Spring", yearRecommended: 3, major: "Software Engineering" },
            { title: "Mobile Systems Security", semesterOffered: "Spring", yearRecommended: 3, major: "Software Engineering" },
            { title: "Cloud Application Development", semesterOffered: "Spring", yearRecommended: 3, major: "Software Engineering" },
            { title: "DevOps and CI/CD", semesterOffered: "Fall", yearRecommended: 4, major: "Software Engineering" },
            { title: "Advanced JavaScript Applications", semesterOffered: "Fall", yearRecommended: 4, major: "Software Engineering" },
            { title: "Emerging Topics in Software Engineering", semesterOffered: "Fall", yearRecommended: 4, major: "Software Engineering" },
            { title: "Software Engineering Capstone I", semesterOffered: "Spring", yearRecommended: 4, major: "Software Engineering" },
            { title: "Software Engineering Capstone II", semesterOffered: "Spring", yearRecommended: 4, major: "Software Engineering" },
            { title: "Professional Practice in Software Engineering", semesterOffered: "Spring", yearRecommended: 4, major: "Software Engineering" },
            { title: "Introduction to Information Systems", semesterOffered: "Fall", yearRecommended: 1, major: "Information Systems" },
            { title: "Business Process Analysis", semesterOffered: "Fall", yearRecommended: 1, major: "Information Systems" },
            { title: "Introduction to Programming for IS", semesterOffered: "Fall", yearRecommended: 1, major: "Information Systems" },
            { title: "IS Lab I", semesterOffered: "Spring", yearRecommended: 1, major: "Information Systems" },
            { title: "Intro to Business Analytics", semesterOffered: "Spring", yearRecommended: 1, major: "Information Systems" },
            { title: "Spreadsheet Applications for IS", semesterOffered: "Spring", yearRecommended: 1, major: "Information Systems" },
            { title: "Systems Analysis & Design", semesterOffered: "Fall", yearRecommended: 2, major: "Information Systems" },
            { title: "Enterprise Resource Planning", semesterOffered: "Fall", yearRecommended: 2, major: "Information Systems" },
            { title: "IT Project Management for IS", semesterOffered: "Fall", yearRecommended: 2, major: "Information Systems" },
            { title: "Database Management Systems", semesterOffered: "Spring", yearRecommended: 2, major: "Information Systems" },
            { title: "Business Intelligence", semesterOffered: "Spring", yearRecommended: 2, major: "Information Systems" },
            { title: "Information Security for IS", semesterOffered: "Spring", yearRecommended: 2, major: "Information Systems" },
            { title: "IT Infrastructure Strategy", semesterOffered: "Fall", yearRecommended: 3, major: "Information Systems" },
            { title: "E-Commerce Systems", semesterOffered: "Fall", yearRecommended: 3, major: "Information Systems" },
            { title: "Data Visualization for IS", semesterOffered: "Fall", yearRecommended: 3, major: "Information Systems" },
            { title: "IS Security & Risk Management", semesterOffered: "Spring", yearRecommended: 3, major: "Information Systems" },
            { title: "Project Management in IS", semesterOffered: "Spring", yearRecommended: 3, major: "Information Systems" },
            { title: "Advanced Business Analytics", semesterOffered: "Spring", yearRecommended: 3, major: "Information Systems" },
            { title: "Cloud-based Information Systems", semesterOffered: "Fall", yearRecommended: 4, major: "Information Systems" },
            { title: "IS Capstone Project I", semesterOffered: "Fall", yearRecommended: 4, major: "Information Systems" },
            { title: "Digital Transformation", semesterOffered: "Fall", yearRecommended: 4, major: "Information Systems" },
            { title: "Ethics & Social Issues in IS", semesterOffered: "Spring", yearRecommended: 4, major: "Information Systems" },
            { title: "IS Capstone Project II", semesterOffered: "Spring", yearRecommended: 4, major: "Information Systems" },
            { title: "IS Consulting Practices", semesterOffered: "Spring", yearRecommended: 4, major: "Information Systems" },
        ]
    },
    {
        name: "Coastal University",
        location: "Charleston, SC",
        overview: "A vibrant university by the coast, specializing in marine and environmental sciences.",
        requiredCourses: [
            { title: "Intro to Environmental Science", semesterOffered: "Fall", yearRecommended: 1, major: "Environmental Science" },
            { title: "General Chemistry I", semesterOffered: "Fall", yearRecommended: 1, major: "Environmental Science" },
            { title: "Sustainability Practices", semesterOffered: "Fall", yearRecommended: 1, major: "Environmental Science" },
            { title: "Environmental Science Lab I", semesterOffered: "Spring", yearRecommended: 1, major: "Environmental Science" },
            { title: "General Chemistry II", semesterOffered: "Spring", yearRecommended: 1, major: "Environmental Science" },
            { title: "Biodiversity and Conservation", semesterOffered: "Spring", yearRecommended: 1, major: "Environmental Science" },
            { title: "Ecology", semesterOffered: "Fall", yearRecommended: 2, major: "Environmental Science" },
            { title: "Oceanography", semesterOffered: "Fall", yearRecommended: 2, major: "Environmental Science" },
            { title: "Environmental Policy", semesterOffered: "Spring", yearRecommended: 2, major: "Environmental Science" },
            { title: "Statistics for Scientists", semesterOffered: "Spring", yearRecommended: 2, major: "Environmental Science" },
            { title: "Marine Biology", semesterOffered: "Fall", yearRecommended: 3, major: "Environmental Science" },
            { title: "Environmental Toxicology", semesterOffered: "Fall", yearRecommended: 3, major: "Environmental Science" },
            { title: "GIS Applications", semesterOffered: "Spring", yearRecommended: 3, major: "Environmental Science" },
            { title: "Field Methods in Env Sci", semesterOffered: "Spring", yearRecommended: 3, major: "Environmental Science" },
            { title: "Climate Change Science", semesterOffered: "Fall", yearRecommended: 4, major: "Environmental Science" },
            { title: "Senior Seminar I", semesterOffered: "Fall", yearRecommended: 4, major: "Environmental Science" },
            { title: "Environmental Impact Assessment", semesterOffered: "Spring", yearRecommended: 4, major: "Environmental Science" },
            { title: "Senior Seminar II", semesterOffered: "Spring", yearRecommended: 4, major: "Environmental Science" },
            { title: "Introduction to Marine Studies", semesterOffered: "Fall", yearRecommended: 1, major: "Marine Studies" },
            { title: "Marine Chemistry", semesterOffered: "Fall", yearRecommended: 1, major: "Marine Studies" },
            { title: "Introduction to Ocean Life", semesterOffered: "Fall", yearRecommended: 1, major: "Marine Studies" },
            { title: "Marine Studies Lab I", semesterOffered: "Spring", yearRecommended: 1, major: "Marine Studies" },
            { title: "Physical Oceanography", semesterOffered: "Spring", yearRecommended: 1, major: "Marine Studies" },
            { title: "Marine Ecosystems", semesterOffered: "Spring", yearRecommended: 1, major: "Marine Studies" },
            { title: "Marine Ecology", semesterOffered: "Fall", yearRecommended: 2, major: "Marine Studies" },
            { title: "Coastal Geology", semesterOffered: "Fall", yearRecommended: 2, major: "Marine Studies" },
            { title: "Marine Policy & Law", semesterOffered: "Spring", yearRecommended: 2, major: "Marine Studies" },
            { title: "Marine Statistics", semesterOffered: "Spring", yearRecommended: 2, major: "Marine Studies" },
            { title: "Fisheries Biology", semesterOffered: "Fall", yearRecommended: 3, major: "Marine Studies" },
            { title: "Advanced Coastal Ecology", semesterOffered: "Fall", yearRecommended: 3, major: "Marine Studies" },
            { title: "Marine Mammalogy", semesterOffered: "Spring", yearRecommended: 3, major: "Marine Studies" },
            { title: "Marine Conservation", semesterOffered: "Spring", yearRecommended: 3, major: "Marine Studies" },
            { title: "Climate Modeling Techniques", semesterOffered: "Fall", yearRecommended: 4, major: "Marine Studies" },
            { title: "Marine Seminar I", semesterOffered: "Fall", yearRecommended: 4, major: "Marine Studies" },
            { title: "Marine Policy Analysis", semesterOffered: "Spring", yearRecommended: 4, major: "Marine Studies" },
            { title: "Marine Seminar II", semesterOffered: "Spring", yearRecommended: 4, major: "Marine Studies" },
            { title: "Intro to Environmental Engineering", semesterOffered: "Fall", yearRecommended: 1, major: "Environmental Engineering" },
            { title: "Environmental Engineering Chemistry", semesterOffered: "Fall", yearRecommended: 1, major: "Environmental Engineering" },
            { title: "Water Quality Management", semesterOffered: "Fall", yearRecommended: 1, major: "Environmental Engineering" },
            { title: "Env Eng Lab I", semesterOffered: "Spring", yearRecommended: 1, major: "Environmental Engineering" },
            { title: "Calculus for Engineers", semesterOffered: "Spring", yearRecommended: 1, major: "Environmental Engineering" },
            { title: "Advanced Environmental Systems", semesterOffered: "Spring", yearRecommended: 1, major: "Environmental Engineering" },
            { title: "Fluid Mechanics for Env Eng", semesterOffered: "Fall", yearRecommended: 2, major: "Environmental Engineering" },
            { title: "Microbiology for Env Eng", semesterOffered: "Fall", yearRecommended: 2, major: "Environmental Engineering" },
            { title: "Green Technologies in Engineering", semesterOffered: "Fall", yearRecommended: 2, major: "Environmental Engineering" },
            { title: "Water Treatment Processes", semesterOffered: "Spring", yearRecommended: 2, major: "Environmental Engineering" },
            { title: "Statistics for Env Eng", semesterOffered: "Spring", yearRecommended: 2, major: "Environmental Engineering" },
            { title: "Pollution Control Engineering", semesterOffered: "Spring", yearRecommended: 2, major: "Environmental Engineering" },
            { title: "Air Quality Engineering", semesterOffered: "Fall", yearRecommended: 3, major: "Environmental Engineering" },
            { title: "Solid Waste Engineering", semesterOffered: "Fall", yearRecommended: 3, major: "Environmental Engineering" },
            { title: "Renewable Energy Systems", semesterOffered: "Fall", yearRecommended: 3, major: "Environmental Engineering" },
            { title: "Sustainable Infrastructure", semesterOffered: "Spring", yearRecommended: 3, major: "Environmental Engineering" },
            { title: "Env Eng Lab II", semesterOffered: "Spring", yearRecommended: 3, major: "Environmental Engineering" },
            { title: "Hazardous Waste Engineering", semesterOffered: "Spring", yearRecommended: 3, major: "Environmental Engineering" },
            { title: "Environmental Law & Policy", semesterOffered: "Fall", yearRecommended: 4, major: "Environmental Engineering" },
            { title: "Env Eng Senior Project I", semesterOffered: "Fall", yearRecommended: 4, major: "Environmental Engineering" },
            { title: "Environmental Risk Assessment", semesterOffered: "Fall", yearRecommended: 4, major: "Environmental Engineering" },
            { title: "Env Eng Senior Project II", semesterOffered: "Spring", yearRecommended: 4, major: "Environmental Engineering" },
            { title: "Professional Practice in Env Eng", semesterOffered: "Spring", yearRecommended: 4, major: "Environmental Engineering" }
        ]
    },
    {
        name: "Midwest College",
        location: "Des Moines, IA",
        overview: "A community-focused college in the Midwest offering strong engineering programs.",
        requiredCourses: [
            { title: "Engineering Foundations", semesterOffered: "Fall", yearRecommended: 1, major: "Engineering" },
            { title: "Calculus I", semesterOffered: "Fall", yearRecommended: 1, major: "Engineering" },
            { title: "Introduction to Computing for Engineers", semesterOffered: "Fall", yearRecommended: 1, major: "Engineering" },
            { title: "Physics I", semesterOffered: "Spring", yearRecommended: 1, major: "Engineering" },
            { title: "Introduction to Engineering Design", semesterOffered: "Spring", yearRecommended: 1, major: "Engineering" },
            { title: "Engineering Graphics", semesterOffered: "Spring", yearRecommended: 1, major: "Engineering" },
            { title: "Calculus II", semesterOffered: "Fall", yearRecommended: 2, major: "Engineering" },
            { title: "Physics II", semesterOffered: "Fall", yearRecommended: 2, major: "Engineering" },
            { title: "Circuits for Engineers", semesterOffered: "Fall", yearRecommended: 2, major: "Engineering" },
            { title: "Statics", semesterOffered: "Spring", yearRecommended: 2, major: "Engineering" },
            { title: "Materials Science", semesterOffered: "Spring", yearRecommended: 2, major: "Engineering" },
            { title: "Programming for Engineers", semesterOffered: "Spring", yearRecommended: 2, major: "Engineering" },
            { title: "Thermodynamics", semesterOffered: "Fall", yearRecommended: 3, major: "Engineering" },
            { title: "Dynamics", semesterOffered: "Fall", yearRecommended: 3, major: "Engineering" },
            { title: "Engineering Communication", semesterOffered: "Fall", yearRecommended: 3, major: "Engineering" },
            { title: "Electrical Circuits", semesterOffered: "Spring", yearRecommended: 3, major: "Engineering" },
            { title: "Engineering Economics", semesterOffered: "Spring", yearRecommended: 3, major: "Engineering" },
            { title: "Project Management for Engineers", semesterOffered: "Spring", yearRecommended: 3, major: "Engineering" },
            { title: "Senior Design Project I", semesterOffered: "Fall", yearRecommended: 4, major: "Engineering" },
            { title: "Control Systems", semesterOffered: "Fall", yearRecommended: 4, major: "Engineering" },
            { title: "Engineering Leadership", semesterOffered: "Fall", yearRecommended: 4, major: "Engineering" },
            { title: "Senior Design Project II", semesterOffered: "Spring", yearRecommended: 4, major: "Engineering" },
            { title: "Professional Practice in Engineering", semesterOffered: "Spring", yearRecommended: 4, major: "Engineering" },
            { title: "Engineering Innovation", semesterOffered: "Spring", yearRecommended: 4, major: "Engineering" },
            { title: "Introduction to Civil Engineering", semesterOffered: "Fall", yearRecommended: 1, major: "Civil Engineering" },
            { title: "Engineering Graphics", semesterOffered: "Fall", yearRecommended: 1, major: "Civil Engineering" },
            { title: "Introduction to Environmental Systems", semesterOffered: "Fall", yearRecommended: 1, major: "Civil Engineering" },
            { title: "Civil Engineering Lab I", semesterOffered: "Spring", yearRecommended: 1, major: "Civil Engineering" },
            { title: "Surveying", semesterOffered: "Spring", yearRecommended: 1, major: "Civil Engineering" },
            { title: "Introduction to Geotechnical Engineering", semesterOffered: "Spring", yearRecommended: 1, major: "Civil Engineering" },
            { title: "Structural Analysis I", semesterOffered: "Fall", yearRecommended: 2, major: "Civil Engineering" },
            { title: "Geotechnical Engineering", semesterOffered: "Fall", yearRecommended: 2, major: "Civil Engineering" },
            { title: "Civil Engineering Materials", semesterOffered: "Fall", yearRecommended: 2, major: "Civil Engineering" },
            { title: "Construction Materials", semesterOffered: "Spring", yearRecommended: 2, major: "Civil Engineering" },
            { title: "Hydraulics", semesterOffered: "Spring", yearRecommended: 2, major: "Civil Engineering" },
            { title: "Civil Engineering Computation", semesterOffered: "Spring", yearRecommended: 2, major: "Civil Engineering" },
            { title: "Structural Analysis II", semesterOffered: "Fall", yearRecommended: 3, major: "Civil Engineering" },
            { title: "Transportation Engineering", semesterOffered: "Fall", yearRecommended: 3, major: "Civil Engineering" },
            { title: "Construction Planning", semesterOffered: "Fall", yearRecommended: 3, major: "Civil Engineering" },
            { title: "Environmental Engineering", semesterOffered: "Spring", yearRecommended: 3, major: "Civil Engineering" },
            { title: "Construction Management", semesterOffered: "Spring", yearRecommended: 3, major: "Civil Engineering" },
            { title: "Urban Drainage Systems", semesterOffered: "Spring", yearRecommended: 3, major: "Civil Engineering" },
            { title: "Senior Project I: Civil", semesterOffered: "Fall", yearRecommended: 4, major: "Civil Engineering" },
            { title: "Urban Planning", semesterOffered: "Fall", yearRecommended: 4, major: "Civil Engineering" },
            { title: "Infrastructure Sustainability", semesterOffered: "Fall", yearRecommended: 4, major: "Civil Engineering" },
            { title: "Senior Project II: Civil", semesterOffered: "Spring", yearRecommended: 4, major: "Civil Engineering" },
            { title: "Civil Engineering Seminar", semesterOffered: "Spring", yearRecommended: 4, major: "Civil Engineering" },
            { title: "Construction Law and Contracts", semesterOffered: "Spring", yearRecommended: 4, major: "Civil Engineering" },
            { title: "Intro to Mechanical Engineering", semesterOffered: "Fall", yearRecommended: 1, major: "Mechanical Engineering" },
            { title: "Engineering Drawing", semesterOffered: "Fall", yearRecommended: 1, major: "Mechanical Engineering" },
            { title: "Introduction to Manufacturing", semesterOffered: "Fall", yearRecommended: 1, major: "Mechanical Engineering" },
            { title: "Mechanical Engineering Lab I", semesterOffered: "Spring", yearRecommended: 1, major: "Mechanical Engineering" },
            { title: "Statics for Mech Eng", semesterOffered: "Spring", yearRecommended: 1, major: "Mechanical Engineering" },
            { title: "Introduction to Materials", semesterOffered: "Spring", yearRecommended: 1, major: "Mechanical Engineering" },
            { title: "Mechanics of Materials", semesterOffered: "Fall", yearRecommended: 2, major: "Mechanical Engineering" },
            { title: "Thermodynamics I", semesterOffered: "Fall", yearRecommended: 2, major: "Mechanical Engineering" },
            { title: "Mechanical Systems Design", semesterOffered: "Fall", yearRecommended: 2, major: "Mechanical Engineering" },
            { title: "Dynamics for Mech Eng", semesterOffered: "Spring", yearRecommended: 2, major: "Mechanical Engineering" },
            { title: "Manufacturing Processes", semesterOffered: "Spring", yearRecommended: 2, major: "Mechanical Engineering" },
            { title: "Mechanical Vibrations", semesterOffered: "Spring", yearRecommended: 2, major: "Mechanical Engineering" },
            { title: "Fluid Mechanics", semesterOffered: "Fall", yearRecommended: 3, major: "Mechanical Engineering" },
            { title: "Thermodynamics II", semesterOffered: "Fall", yearRecommended: 3, major: "Mechanical Engineering" },
            { title: "Computer-Aided Engineering", semesterOffered: "Fall", yearRecommended: 3, major: "Mechanical Engineering" },
            { title: "Heat Transfer", semesterOffered: "Spring", yearRecommended: 3, major: "Mechanical Engineering" },
            { title: "Mechanical Design I", semesterOffered: "Spring", yearRecommended: 3, major: "Mechanical Engineering" },
            { title: "Finite Element Analysis", semesterOffered: "Spring", yearRecommended: 3, major: "Mechanical Engineering" },
            { title: "Senior Project I: Mechanical", semesterOffered: "Fall", yearRecommended: 4, major: "Mechanical Engineering" },
            { title: "Control Systems for Mech Eng", semesterOffered: "Fall", yearRecommended: 4, major: "Mechanical Engineering" },
            { title: "Robotics", semesterOffered: "Fall", yearRecommended: 4, major: "Mechanical Engineering" },
            { title: "Senior Project II: Mechanical", semesterOffered: "Spring", yearRecommended: 4, major: "Mechanical Engineering" },
            { title: "Mechanical Engineering Seminar", semesterOffered: "Spring", yearRecommended: 4, major: "Mechanical Engineering" },
            { title: "Mechanical Engineering Ethics", semesterOffered: "Spring", yearRecommended: 4, major: "Mechanical Engineering" },
        ]
    },
    {
        name: "Mountain State University",
        location: "Denver, CO",
        overview: "A university nestled in the Rockies, known for its strong mathematics program.",
        requiredCourses: [
            { title: "Calculus I", semesterOffered: "Fall", yearRecommended: 1, major: "Mathematics" },
            { title: "Introduction to Proofs", semesterOffered: "Fall", yearRecommended: 1, major: "Mathematics" },
            { title: "Mathematical Computing", semesterOffered: "Fall", yearRecommended: 1, major: "Mathematics" },
            { title: "Calculus II", semesterOffered: "Spring", yearRecommended: 1, major: "Mathematics" },
            { title: "Linear Algebra", semesterOffered: "Spring", yearRecommended: 1, major: "Mathematics" },
            { title: "Mathematical Modeling I", semesterOffered: "Spring", yearRecommended: 1, major: "Mathematics" },
            { title: "Calculus III", semesterOffered: "Fall", yearRecommended: 2, major: "Mathematics" },
            { title: "Discrete Mathematics", semesterOffered: "Fall", yearRecommended: 2, major: "Mathematics" },
            { title: "Advanced Probability", semesterOffered: "Fall", yearRecommended: 2, major: "Mathematics" },
            { title: "Differential Equations", semesterOffered: "Spring", yearRecommended: 2, major: "Mathematics" },
            { title: "Probability Theory", semesterOffered: "Spring", yearRecommended: 2, major: "Mathematics" },
            { title: "Mathematical Modeling II", semesterOffered: "Spring", yearRecommended: 2, major: "Mathematics" },
            { title: "Abstract Algebra I", semesterOffered: "Fall", yearRecommended: 3, major: "Mathematics" },
            { title: "Real Analysis I", semesterOffered: "Fall", yearRecommended: 3, major: "Mathematics" },
            { title: "Topology I", semesterOffered: "Fall", yearRecommended: 3, major: "Mathematics" },
            { title: "Abstract Algebra II", semesterOffered: "Spring", yearRecommended: 3, major: "Mathematics" },
            { title: "Real Analysis II", semesterOffered: "Spring", yearRecommended: 3, major: "Mathematics" },
            { title: "Numerical Linear Algebra", semesterOffered: "Spring", yearRecommended: 3, major: "Mathematics" },
            { title: "Numerical Methods", semesterOffered: "Fall", yearRecommended: 4, major: "Mathematics" },
            { title: "Complex Analysis", semesterOffered: "Fall", yearRecommended: 4, major: "Mathematics" },
            { title: "Mathematical Statistics", semesterOffered: "Fall", yearRecommended: 4, major: "Mathematics" },
            { title: "Mathematics Seminar I", semesterOffered: "Spring", yearRecommended: 4, major: "Mathematics" },
            { title: "Mathematics Seminar II", semesterOffered: "Spring", yearRecommended: 4, major: "Mathematics" },
            { title: "Senior Thesis in Mathematics", semesterOffered: "Spring", yearRecommended: 4, major: "Mathematics" },
            { title: "Intro to Statistics", semesterOffered: "Fall", yearRecommended: 1, major: "Statistics" },
            { title: "Statistical Computing", semesterOffered: "Fall", yearRecommended: 1, major: "Statistics" },
            { title: "Probability and Statistics I", semesterOffered: "Fall", yearRecommended: 1, major: "Statistics" },
            { title: "Statistical Methods I", semesterOffered: "Spring", yearRecommended: 1, major: "Statistics" },
            { title: "Regression Analysis", semesterOffered: "Spring", yearRecommended: 1, major: "Statistics" },
            { title: "Probability and Statistics II", semesterOffered: "Spring", yearRecommended: 1, major: "Statistics" },
            { title: "Experimental Design", semesterOffered: "Fall", yearRecommended: 2, major: "Statistics" },
            { title: "Applied Statistics", semesterOffered: "Fall", yearRecommended: 2, major: "Statistics" },
            { title: "Sampling Theory", semesterOffered: "Fall", yearRecommended: 2, major: "Statistics" },
            { title: "Statistical Inference", semesterOffered: "Spring", yearRecommended: 2, major: "Statistics" },
            { title: "Nonparametric Statistics", semesterOffered: "Spring", yearRecommended: 2, major: "Statistics" },
            { title: "Data Visualization", semesterOffered: "Spring", yearRecommended: 2, major: "Statistics" },
            { title: "Time Series Analysis", semesterOffered: "Fall", yearRecommended: 3, major: "Statistics" },
            { title: "Multivariate Statistics", semesterOffered: "Fall", yearRecommended: 3, major: "Statistics" },
            { title: "Statistical Learning", semesterOffered: "Fall", yearRecommended: 3, major: "Statistics" },
            { title: "Bayesian Statistics", semesterOffered: "Spring", yearRecommended: 3, major: "Statistics" },
            { title: "Statistical Consulting", semesterOffered: "Spring", yearRecommended: 3, major: "Statistics" },
            { title: "Advanced Data Analysis", semesterOffered: "Spring", yearRecommended: 3, major: "Statistics" },
            { title: "Capstone Project I: Statistics", semesterOffered: "Fall", yearRecommended: 4, major: "Statistics" },
            { title: "Statistical Software", semesterOffered: "Fall", yearRecommended: 4, major: "Statistics" },
            { title: "Applied Probability", semesterOffered: "Fall", yearRecommended: 4, major: "Statistics" },
            { title: "Capstone Project II: Statistics", semesterOffered: "Spring", yearRecommended: 4, major: "Statistics" },
            { title: "Statistical Seminar", semesterOffered: "Spring", yearRecommended: 4, major: "Statistics" },
            { title: "Ethics in Statistics", semesterOffered: "Spring", yearRecommended: 4, major: "Statistics" },
            { title: "Intro to Data Science", semesterOffered: "Fall", yearRecommended: 1, major: "Data Science" },
            { title: "Python for Data Science", semesterOffered: "Fall", yearRecommended: 1, major: "Data Science" },
            { title: "Data Science Seminar I", semesterOffered: "Fall", yearRecommended: 1, major: "Data Science" },
            { title: "Data Wrangling", semesterOffered: "Spring", yearRecommended: 1, major: "Data Science" },
            { title: "Statistics for Data Science", semesterOffered: "Spring", yearRecommended: 1, major: "Data Science" },
            { title: "Data Science Ethics", semesterOffered: "Spring", yearRecommended: 1, major: "Data Science" },
            { title: "Machine Learning I", semesterOffered: "Fall", yearRecommended: 2, major: "Data Science" },
            { title: "Database Systems for Data Science", semesterOffered: "Fall", yearRecommended: 2, major: "Data Science" },
            { title: "Big Data Analytics", semesterOffered: "Fall", yearRecommended: 2, major: "Data Science" },
            { title: "Data Visualization for Data Science", semesterOffered: "Spring", yearRecommended: 2, major: "Data Science" },
            { title: "Statistical Modeling", semesterOffered: "Spring", yearRecommended: 2, major: "Data Science" },
            { title: "Data Science Seminar II", semesterOffered: "Spring", yearRecommended: 2, major: "Data Science" },
            { title: "Deep Learning", semesterOffered: "Fall", yearRecommended: 3, major: "Data Science" },
            { title: "Natural Language Processing", semesterOffered: "Fall", yearRecommended: 3, major: "Data Science" },
            { title: "Cloud Computing for Data Science", semesterOffered: "Fall", yearRecommended: 3, major: "Data Science" },
            { title: "Applied Data Science", semesterOffered: "Spring", yearRecommended: 3, major: "Data Science" },
            { title: "Data Ethics and Law", semesterOffered: "Spring", yearRecommended: 3, major: "Data Science" },
            { title: "Data Mining", semesterOffered: "Spring", yearRecommended: 3, major: "Data Science" },
            { title: "Capstone Project I: Data Science", semesterOffered: "Fall", yearRecommended: 4, major: "Data Science" },
            { title: "Advanced Topics in Data Science", semesterOffered: "Fall", yearRecommended: 4, major: "Data Science" },
            { title: "Professional Practice in Data Science", semesterOffered: "Fall", yearRecommended: 4, major: "Data Science" },
            { title: "Capstone Project II: Data Science", semesterOffered: "Spring", yearRecommended: 4, major: "Data Science" },
            { title: "Data Science Seminar III", semesterOffered: "Spring", yearRecommended: 4, major: "Data Science" },
            { title: "Entrepreneurship in Data Science", semesterOffered: "Spring", yearRecommended: 4, major: "Data Science" }
        ]
    },
    {
        name: "Bay Area University",
        location: "Oakland, CA",
        overview: "A diverse university in the Bay Area, with a strong liberal arts tradition.",
        requiredCourses: [
            { title: "Intro to Sociology", semesterOffered: "Fall", yearRecommended: 1, major: "Sociology" },
            { title: "Sociological Theory I", semesterOffered: "Fall", yearRecommended: 1, major: "Sociology" },
            { title: "Introduction to Social Research", semesterOffered: "Fall", yearRecommended: 1, major: "Sociology" },
            { title: "Statistics for Social Science", semesterOffered: "Spring", yearRecommended: 1, major: "Sociology" },
            { title: "Research Methods I", semesterOffered: "Spring", yearRecommended: 1, major: "Sociology" },
            { title: "Culture and Society", semesterOffered: "Spring", yearRecommended: 1, major: "Sociology" },
            { title: "Social Stratification", semesterOffered: "Fall", yearRecommended: 2, major: "Sociology" },
            { title: "Urban Sociology", semesterOffered: "Fall", yearRecommended: 2, major: "Sociology" },
            { title: "Sociology of Organizations", semesterOffered: "Fall", yearRecommended: 2, major: "Sociology" },
            { title: "Sociological Theory II", semesterOffered: "Spring", yearRecommended: 2, major: "Sociology" },
            { title: "Research Methods II", semesterOffered: "Spring", yearRecommended: 2, major: "Sociology" },
            { title: "Sociology of Family", semesterOffered: "Spring", yearRecommended: 2, major: "Sociology" },
            { title: "Race and Ethnicity", semesterOffered: "Fall", yearRecommended: 3, major: "Sociology" },
            { title: "Gender Studies", semesterOffered: "Fall", yearRecommended: 3, major: "Sociology" },
            { title: "Sociology of Law", semesterOffered: "Fall", yearRecommended: 3, major: "Sociology" },
            { title: "Social Movements", semesterOffered: "Spring", yearRecommended: 3, major: "Sociology" },
            { title: "Sociology of Education", semesterOffered: "Spring", yearRecommended: 3, major: "Sociology" },
            { title: "Sociology of Religion", semesterOffered: "Spring", yearRecommended: 3, major: "Sociology" },
            { title: "Sociology Capstone I", semesterOffered: "Fall", yearRecommended: 4, major: "Sociology" },
            { title: "Contemporary Social Problems", semesterOffered: "Fall", yearRecommended: 4, major: "Sociology" },
            { title: "Sociology of Globalization", semesterOffered: "Fall", yearRecommended: 4, major: "Sociology" },
            { title: "Sociology Capstone II", semesterOffered: "Spring", yearRecommended: 4, major: "Sociology" },
            { title: "Public Sociology", semesterOffered: "Spring", yearRecommended: 4, major: "Sociology" },
            { title: "Applied Sociology", semesterOffered: "Spring", yearRecommended: 4, major: "Sociology" },
            { title: "Introduction to Philosophy", semesterOffered: "Fall", yearRecommended: 1, major: "Philosophy" },
            { title: "History of Philosophy I", semesterOffered: "Fall", yearRecommended: 1, major: "Philosophy" },
            { title: "Philosophical Writing", semesterOffered: "Fall", yearRecommended: 1, major: "Philosophy" },
            { title: "Ethics", semesterOffered: "Spring", yearRecommended: 1, major: "Philosophy" },
            { title: "Logic", semesterOffered: "Spring", yearRecommended: 1, major: "Philosophy" },
            { title: "History of Philosophy II", semesterOffered: "Spring", yearRecommended: 1, major: "Philosophy" },
            { title: "Metaphysics", semesterOffered: "Fall", yearRecommended: 2, major: "Philosophy" },
            { title: "Philosophy of Science", semesterOffered: "Fall", yearRecommended: 2, major: "Philosophy" },
            { title: "Social & Political Philosophy", semesterOffered: "Fall", yearRecommended: 2, major: "Philosophy" },
            { title: "Aesthetics", semesterOffered: "Spring", yearRecommended: 2, major: "Philosophy" },
            { title: "Epistemology", semesterOffered: "Spring", yearRecommended: 2, major: "Philosophy" },
            { title: "Environmental Philosophy", semesterOffered: "Spring", yearRecommended: 2, major: "Philosophy" },
            { title: "Philosophy of Mind", semesterOffered: "Fall", yearRecommended: 3, major: "Philosophy" },
            { title: "Philosophy of Language", semesterOffered: "Fall", yearRecommended: 3, major: "Philosophy" },
            { title: "Modern Philosophy", semesterOffered: "Fall", yearRecommended: 3, major: "Philosophy" },
            { title: "Philosophy of Law", semesterOffered: "Spring", yearRecommended: 3, major: "Philosophy" },
            { title: "Philosophy of Religion", semesterOffered: "Spring", yearRecommended: 3, major: "Philosophy" },
            { title: "Contemporary Philosophy", semesterOffered: "Spring", yearRecommended: 3, major: "Philosophy" },
            { title: "Philosophy Capstone I", semesterOffered: "Fall", yearRecommended: 4, major: "Philosophy" },
            { title: "Philosophy Seminar", semesterOffered: "Fall", yearRecommended: 4, major: "Philosophy" },
            { title: "Ethics of Technology", semesterOffered: "Fall", yearRecommended: 4, major: "Philosophy" },
            { title: "Philosophy Capstone II", semesterOffered: "Spring", yearRecommended: 4, major: "Philosophy" },
            { title: "Applied Philosophy", semesterOffered: "Spring", yearRecommended: 4, major: "Philosophy" },
            { title: "Senior Thesis in Philosophy", semesterOffered: "Spring", yearRecommended: 4, major: "Philosophy" },
            { title: "World History I", semesterOffered: "Fall", yearRecommended: 1, major: "History" },
            { title: "Historical Methods", semesterOffered: "Fall", yearRecommended: 1, major: "History" },
            { title: "Intro to American History", semesterOffered: "Fall", yearRecommended: 1, major: "History" },
            { title: "World History II", semesterOffered: "Spring", yearRecommended: 1, major: "History" },
            { title: "History of California", semesterOffered: "Spring", yearRecommended: 1, major: "History" },
            { title: "History of the Americas", semesterOffered: "Spring", yearRecommended: 1, major: "History" },
            { title: "European History I", semesterOffered: "Fall", yearRecommended: 2, major: "History" },
            { title: "Asian History I", semesterOffered: "Fall", yearRecommended: 2, major: "History" },
            { title: "African History I", semesterOffered: "Fall", yearRecommended: 2, major: "History" },
            { title: "European History II", semesterOffered: "Spring", yearRecommended: 2, major: "History" },
            { title: "Asian History II", semesterOffered: "Spring", yearRecommended: 2, major: "History" },
            { title: "African History II", semesterOffered: "Spring", yearRecommended: 2, major: "History" },
            { title: "Modern American History", semesterOffered: "Fall", yearRecommended: 3, major: "History" },
            { title: "History of the Middle East", semesterOffered: "Fall", yearRecommended: 3, major: "History" },
            { title: "Women in History", semesterOffered: "Fall", yearRecommended: 3, major: "History" },
            { title: "History of Science", semesterOffered: "Spring", yearRecommended: 3, major: "History" },
            { title: "History of Social Movements", semesterOffered: "Spring", yearRecommended: 3, major: "History" },
            { title: "Environmental History", semesterOffered: "Spring", yearRecommended: 3, major: "History" },
            { title: "History Capstone I", semesterOffered: "Fall", yearRecommended: 4, major: "History" },
            { title: "History Seminar", semesterOffered: "Fall", yearRecommended: 4, major: "History" },
            { title: "California History Seminar", semesterOffered: "Fall", yearRecommended: 4, major: "History" },
            { title: "History Capstone II", semesterOffered: "Spring", yearRecommended: 4, major: "History" },
            { title: "Senior Thesis in History", semesterOffered: "Spring", yearRecommended: 4, major: "History" },
            { title: "Oral History Workshop", semesterOffered: "Spring", yearRecommended: 4, major: "History" }
        ]
    },
    {
        name: "Atlantic College",
        location: "Providence, RI",
        overview: "A historic college on the Atlantic coast, known for its economics department.",
        requiredCourses: [
            { title: "Principles of Microeconomics", semesterOffered: "Fall", yearRecommended: 1, major: "Economics" },
            { title: "Mathematical Economics I", semesterOffered: "Fall", yearRecommended: 1, major: "Economics" },
            { title: "Introduction to Econometrics", semesterOffered: "Fall", yearRecommended: 1, major: "Economics" },
            { title: "Principles of Macroeconomics", semesterOffered: "Spring", yearRecommended: 1, major: "Economics" },
            { title: "Statistics for Economics", semesterOffered: "Spring", yearRecommended: 1, major: "Economics" },
            { title: "History of Economic Thought", semesterOffered: "Spring", yearRecommended: 1, major: "Economics" },
            { title: "Intermediate Microeconomics", semesterOffered: "Fall", yearRecommended: 2, major: "Economics" },
            { title: "Econometrics I", semesterOffered: "Fall", yearRecommended: 2, major: "Economics" },
            { title: "Behavioral Economics", semesterOffered: "Fall", yearRecommended: 2, major: "Economics" },
            { title: "Intermediate Macroeconomics", semesterOffered: "Spring", yearRecommended: 2, major: "Economics" },
            { title: "Econometrics II", semesterOffered: "Spring", yearRecommended: 2, major: "Economics" },
            { title: "Game Theory", semesterOffered: "Spring", yearRecommended: 2, major: "Economics" },
            { title: "International Economics", semesterOffered: "Fall", yearRecommended: 3, major: "Economics" },
            { title: "Public Finance", semesterOffered: "Fall", yearRecommended: 3, major: "Economics" },
            { title: "Environmental Economics", semesterOffered: "Fall", yearRecommended: 3, major: "Economics" },
            { title: "Labor Economics", semesterOffered: "Spring", yearRecommended: 3, major: "Economics" },
            { title: "Development Economics", semesterOffered: "Spring", yearRecommended: 3, major: "Economics" },
            { title: "Health Economics", semesterOffered: "Spring", yearRecommended: 3, major: "Economics" },
            { title: "Economics Seminar I", semesterOffered: "Fall", yearRecommended: 4, major: "Economics" },
            { title: "Financial Economics", semesterOffered: "Fall", yearRecommended: 4, major: "Economics" },
            { title: "Advanced Macroeconomics", semesterOffered: "Fall", yearRecommended: 4, major: "Economics" },
            { title: "Economics Seminar II", semesterOffered: "Spring", yearRecommended: 4, major: "Economics" },
            { title: "Senior Thesis in Economics", semesterOffered: "Spring", yearRecommended: 4, major: "Economics" },
            { title: "Policy Analysis in Economics", semesterOffered: "Spring", yearRecommended: 4, major: "Economics" },
            { title: "Introduction to Business Administration", semesterOffered: "Fall", yearRecommended: 1, major: "Business Administration" },
            { title: "Business Math", semesterOffered: "Fall", yearRecommended: 1, major: "Business Administration" },
            { title: "Business Communication", semesterOffered: "Fall", yearRecommended: 1, major: "Business Administration" },
            { title: "Organizational Behavior", semesterOffered: "Spring", yearRecommended: 1, major: "Business Administration" },
            { title: "Financial Accounting", semesterOffered: "Spring", yearRecommended: 1, major: "Business Administration" },
            { title: "Business Law", semesterOffered: "Spring", yearRecommended: 1, major: "Business Administration" },
            { title: "Marketing Principles", semesterOffered: "Fall", yearRecommended: 2, major: "Business Administration" },
            { title: "Managerial Accounting", semesterOffered: "Fall", yearRecommended: 2, major: "Business Administration" },
            { title: "Operations Management", semesterOffered: "Fall", yearRecommended: 2, major: "Business Administration" },
            { title: "Quantitative Analysis", semesterOffered: "Spring", yearRecommended: 2, major: "Business Administration" },
            { title: "Human Resource Management", semesterOffered: "Spring", yearRecommended: 2, major: "Business Administration" },
            { title: "Entrepreneurship", semesterOffered: "Spring", yearRecommended: 2, major: "Business Administration" },
            { title: "International Business", semesterOffered: "Fall", yearRecommended: 3, major: "Business Administration" },
            { title: "Business Analytics", semesterOffered: "Fall", yearRecommended: 3, major: "Business Administration" },
            { title: "Corporate Finance", semesterOffered: "Fall", yearRecommended: 3, major: "Business Administration" },
            { title: "Leadership in Business", semesterOffered: "Spring", yearRecommended: 3, major: "Business Administration" },
            { title: "Strategic Management", semesterOffered: "Spring", yearRecommended: 3, major: "Business Administration" },
            { title: "Ethics in Business", semesterOffered: "Spring", yearRecommended: 3, major: "Business Administration" },
            { title: "Business Policy", semesterOffered: "Fall", yearRecommended: 4, major: "Business Administration" },
            { title: "Advanced Business Strategy", semesterOffered: "Fall", yearRecommended: 4, major: "Business Administration" },
            { title: "Capstone Project I: Business Administration", semesterOffered: "Fall", yearRecommended: 4, major: "Business Administration" },
            { title: "Capstone Project II: Business Administration", semesterOffered: "Spring", yearRecommended: 4, major: "Business Administration" },
            { title: "Business Administration Seminar", semesterOffered: "Spring", yearRecommended: 4, major: "Business Administration" },
            { title: "Special Topics in Business Administration", semesterOffered: "Spring", yearRecommended: 4, major: "Business Administration" },
            { title: "Introduction to Political Science", semesterOffered: "Fall", yearRecommended: 1, major: "Political Science" },
            { title: "Comparative Politics", semesterOffered: "Fall", yearRecommended: 1, major: "Political Science" },
            { title: "Political Science Writing Lab", semesterOffered: "Fall", yearRecommended: 1, major: "Political Science" },
            { title: "American Government", semesterOffered: "Spring", yearRecommended: 1, major: "Political Science" },
            { title: "International Relations", semesterOffered: "Spring", yearRecommended: 1, major: "Political Science" },
            { title: "Political Theory I", semesterOffered: "Spring", yearRecommended: 1, major: "Political Science" },
            { title: "Research Methods in Political Science", semesterOffered: "Fall", yearRecommended: 2, major: "Political Science" },
            { title: "Political Ideologies", semesterOffered: "Fall", yearRecommended: 2, major: "Political Science" },
            { title: "Public Policy Analysis", semesterOffered: "Fall", yearRecommended: 2, major: "Political Science" },
            { title: "Political Theory II", semesterOffered: "Spring", yearRecommended: 2, major: "Political Science" },
            { title: "State and Local Politics", semesterOffered: "Spring", yearRecommended: 2, major: "Political Science" },
            { title: "Elections and Voting Behavior", semesterOffered: "Spring", yearRecommended: 2, major: "Political Science" },
            { title: "Comparative Government", semesterOffered: "Fall", yearRecommended: 3, major: "Political Science" },
            { title: "Political Science Seminar I", semesterOffered: "Fall", yearRecommended: 3, major: "Political Science" },
            { title: "Politics of Developing Nations", semesterOffered: "Fall", yearRecommended: 3, major: "Political Science" },
            { title: "Political Science Seminar II", semesterOffered: "Spring", yearRecommended: 3, major: "Political Science" },
            { title: "Public Opinion", semesterOffered: "Spring", yearRecommended: 3, major: "Political Science" },
            { title: "Political Psychology", semesterOffered: "Spring", yearRecommended: 3, major: "Political Science" },
            { title: "Capstone Project I: Political Science", semesterOffered: "Fall", yearRecommended: 4, major: "Political Science" },
            { title: "Advanced Topics in Political Science", semesterOffered: "Fall", yearRecommended: 4, major: "Political Science" },
            { title: "Global Governance", semesterOffered: "Fall", yearRecommended: 4, major: "Political Science" },
            { title: "Capstone Project II: Political Science", semesterOffered: "Spring", yearRecommended: 4, major: "Political Science" },
            { title: "Political Science Senior Seminar", semesterOffered: "Spring", yearRecommended: 4, major: "Political Science" },
            { title: "Special Topics in Political Science", semesterOffered: "Spring", yearRecommended: 4, major: "Political Science" }
        ]
    },
    {
        name: "Southern State University",
        location: "Dallas, TX",
        overview: "A large public university in the South, offering a strong nursing program.",
        requiredCourses: [
            { title: "Introduction to Nursing", semesterOffered: "Fall", yearRecommended: 1, major: "Nursing" },
            { title: "Human Anatomy", semesterOffered: "Fall", yearRecommended: 1, major: "Nursing" },
            { title: "Foundations of Pharmacology", semesterOffered: "Fall", yearRecommended: 1, major: "Nursing" },
            { title: "Nursing Lab I", semesterOffered: "Spring", yearRecommended: 1, major: "Nursing" },
            { title: "Human Physiology", semesterOffered: "Spring", yearRecommended: 1, major: "Nursing" },
            { title: "Introduction to Pathology", semesterOffered: "Spring", yearRecommended: 1, major: "Nursing" },
            { title: "Pharmacology", semesterOffered: "Fall", yearRecommended: 2, major: "Nursing" },
            { title: "Pathophysiology", semesterOffered: "Fall", yearRecommended: 2, major: "Nursing" },
            { title: "Nursing Informatics", semesterOffered: "Fall", yearRecommended: 2, major: "Nursing" },
            { title: "Nursing Lab II", semesterOffered: "Spring", yearRecommended: 2, major: "Nursing" },
            { title: "Health Assessment", semesterOffered: "Spring", yearRecommended: 2, major: "Nursing" },
            { title: "Nursing Ethics", semesterOffered: "Spring", yearRecommended: 2, major: "Nursing" },
            { title: "Adult Health Nursing I", semesterOffered: "Fall", yearRecommended: 3, major: "Nursing" },
            { title: "Pediatric Nursing", semesterOffered: "Fall", yearRecommended: 3, major: "Nursing" },
            { title: "Gerontological Nursing", semesterOffered: "Fall", yearRecommended: 3, major: "Nursing" },
            { title: "Adult Health Nursing II", semesterOffered: "Spring", yearRecommended: 3, major: "Nursing" },
            { title: "Mental Health Nursing", semesterOffered: "Spring", yearRecommended: 3, major: "Nursing" },
            { title: "Community Health Nursing", semesterOffered: "Spring", yearRecommended: 3, major: "Nursing" },
            { title: "Community Health Nursing", semesterOffered: "Fall", yearRecommended: 4, major: "Nursing" },
            { title: "Nursing Leadership", semesterOffered: "Fall", yearRecommended: 4, major: "Nursing" },
            { title: "Evidence-Based Practice in Nursing", semesterOffered: "Fall", yearRecommended: 4, major: "Nursing" },
            { title: "Nursing Capstone I", semesterOffered: "Spring", yearRecommended: 4, major: "Nursing" },
            { title: "Nursing Capstone II", semesterOffered: "Spring", yearRecommended: 4, major: "Nursing" },
            { title: "Nursing Management", semesterOffered: "Spring", yearRecommended: 4, major: "Nursing" },
            { title: "Introduction to Public Health", semesterOffered: "Fall", yearRecommended: 1, major: "Public Health" },
            { title: "Public Health Writing Lab", semesterOffered: "Fall", yearRecommended: 1, major: "Public Health" },
            { title: "Epidemiology I", semesterOffered: "Fall", yearRecommended: 1, major: "Public Health" },
            { title: "Introduction to Biostatistics", semesterOffered: "Spring", yearRecommended: 1, major: "Public Health" },
            { title: "Introduction to Environmental Health", semesterOffered: "Spring", yearRecommended: 1, major: "Public Health" },
            { title: "Health Behavior Theory", semesterOffered: "Spring", yearRecommended: 1, major: "Public Health" },
            { title: "Epidemiology II", semesterOffered: "Fall", yearRecommended: 2, major: "Public Health" },
            { title: "Global Health", semesterOffered: "Fall", yearRecommended: 2, major: "Public Health" },
            { title: "Health Policy", semesterOffered: "Fall", yearRecommended: 2, major: "Public Health" },
            { title: "Program Planning in Public Health", semesterOffered: "Spring", yearRecommended: 2, major: "Public Health" },
            { title: "Community Health Assessment", semesterOffered: "Spring", yearRecommended: 2, major: "Public Health" },
            { title: "Research Methods in Public Health", semesterOffered: "Spring", yearRecommended: 2, major: "Public Health" },
            { title: "Infectious Disease Epidemiology", semesterOffered: "Fall", yearRecommended: 3, major: "Public Health" },
            { title: "Environmental Epidemiology", semesterOffered: "Fall", yearRecommended: 3, major: "Public Health" },
            { title: "Chronic Disease Epidemiology", semesterOffered: "Fall", yearRecommended: 3, major: "Public Health" },
            { title: "Health Education", semesterOffered: "Spring", yearRecommended: 3, major: "Public Health" },
            { title: "Public Health Ethics", semesterOffered: "Spring", yearRecommended: 3, major: "Public Health" },
            { title: "Special Topics in Public Health", semesterOffered: "Spring", yearRecommended: 3, major: "Public Health" },
            { title: "Capstone I: Public Health", semesterOffered: "Fall", yearRecommended: 4, major: "Public Health" },
            { title: "Advanced Topics in Public Health", semesterOffered: "Fall", yearRecommended: 4, major: "Public Health" },
            { title: "Public Health Seminar I", semesterOffered: "Fall", yearRecommended: 4, major: "Public Health" },
            { title: "Public Health Seminar II", semesterOffered: "Spring", yearRecommended: 4, major: "Public Health" },
            { title: "Capstone II: Public Health", semesterOffered: "Spring", yearRecommended: 4, major: "Public Health" },
            { title: "Special Topics in Public Health", semesterOffered: "Spring", yearRecommended: 4, major: "Public Health" },
            { title: "Introduction to Health Sciences", semesterOffered: "Fall", yearRecommended: 1, major: "Health Sciences" },
            { title: "Medical Terminology", semesterOffered: "Fall", yearRecommended: 1, major: "Health Sciences" },
            { title: "Health Sciences Writing Lab", semesterOffered: "Fall", yearRecommended: 1, major: "Health Sciences" },
            { title: "Anatomy & Physiology I", semesterOffered: "Spring", yearRecommended: 1, major: "Health Sciences" },
            { title: "Biology for Health Sciences", semesterOffered: "Spring", yearRecommended: 1, major: "Health Sciences" },
            { title: "Introduction to Nutrition", semesterOffered: "Spring", yearRecommended: 1, major: "Health Sciences" },
            { title: "Anatomy & Physiology II", semesterOffered: "Fall", yearRecommended: 2, major: "Health Sciences" },
            { title: "Microbiology", semesterOffered: "Fall", yearRecommended: 2, major: "Health Sciences" },
            { title: "Pathophysiology", semesterOffered: "Fall", yearRecommended: 2, major: "Health Sciences" },
            { title: "Health Sciences Lab", semesterOffered: "Spring", yearRecommended: 2, major: "Health Sciences" },
            { title: "Chemistry for Health Sciences", semesterOffered: "Spring", yearRecommended: 2, major: "Health Sciences" },
            { title: "Special Topics in Health Sciences", semesterOffered: "Spring", yearRecommended: 2, major: "Health Sciences" },
            { title: "Clinical Skills I", semesterOffered: "Fall", yearRecommended: 3, major: "Health Sciences" },
            { title: "Medical Ethics", semesterOffered: "Fall", yearRecommended: 3, major: "Health Sciences" },
            { title: "Health Promotion", semesterOffered: "Fall", yearRecommended: 3, major: "Health Sciences" },
            { title: "Clinical Skills II", semesterOffered: "Spring", yearRecommended: 3, major: "Health Sciences" },
            { title: "Healthcare Systems", semesterOffered: "Spring", yearRecommended: 3, major: "Health Sciences" },
            { title: "Research in Health Sciences", semesterOffered: "Spring", yearRecommended: 3, major: "Health Sciences" },
            { title: "Health Sciences Capstone I", semesterOffered: "Fall", yearRecommended: 4, major: "Health Sciences" },
            { title: "Advanced Studies in Health Sciences", semesterOffered: "Fall", yearRecommended: 4, major: "Health Sciences" },
            { title: "Health Sciences Seminar I", semesterOffered: "Fall", yearRecommended: 4, major: "Health Sciences" },
            { title: "Health Sciences Seminar II", semesterOffered: "Spring", yearRecommended: 4, major: "Health Sciences" },
            { title: "Health Sciences Capstone II", semesterOffered: "Spring", yearRecommended: 4, major: "Health Sciences" },
            { title: "Special Topics in Health Sciences", semesterOffered: "Spring", yearRecommended: 4, major: "Health Sciences" }
        ]
    },
    {
        name: "Pacific Northwest University",
        location: "Seattle, WA",
        overview: "A progressive university in the Pacific Northwest, specializing in environmental engineering.",
        requiredCourses: [
            { title: "Intro to Environmental Engineering", semesterOffered: "Fall", yearRecommended: 1, major: "Environmental Engineering" },
            { title: "Chemistry for Engineers", semesterOffered: "Fall", yearRecommended: 1, major: "Environmental Engineering" },
            { title: "Introduction to Environmental Science", semesterOffered: "Fall", yearRecommended: 1, major: "Environmental Engineering" },
            { title: "Environmental Engineering Lab I", semesterOffered: "Spring", yearRecommended: 1, major: "Environmental Engineering" },
            { title: "Calculus I", semesterOffered: "Spring", yearRecommended: 1, major: "Environmental Engineering" },
            { title: "Introduction to Environmental Policy", semesterOffered: "Spring", yearRecommended: 1, major: "Environmental Engineering" },
            { title: "Fluid Mechanics", semesterOffered: "Fall", yearRecommended: 2, major: "Environmental Engineering" },
            { title: "Microbiology for Engineers", semesterOffered: "Fall", yearRecommended: 2, major: "Environmental Engineering" },
            { title: "Environmental Engineering Design", semesterOffered: "Fall", yearRecommended: 2, major: "Environmental Engineering" },
            { title: "Water Resources Engineering", semesterOffered: "Spring", yearRecommended: 2, major: "Environmental Engineering" },
            { title: "Statistics for Engineers", semesterOffered: "Spring", yearRecommended: 2, major: "Environmental Engineering" },
            { title: "Environmental Chemistry", semesterOffered: "Spring", yearRecommended: 2, major: "Environmental Engineering" },
            { title: "Air Pollution Control", semesterOffered: "Fall", yearRecommended: 3, major: "Environmental Engineering" },
            { title: "Solid Waste Management", semesterOffered: "Fall", yearRecommended: 3, major: "Environmental Engineering" },
            { title: "Climate Change and Engineering", semesterOffered: "Fall", yearRecommended: 3, major: "Environmental Engineering" },
            { title: "Sustainable Design", semesterOffered: "Spring", yearRecommended: 3, major: "Environmental Engineering" },
            { title: "Environmental Engineering Lab II", semesterOffered: "Spring", yearRecommended: 3, major: "Environmental Engineering" },
            { title: "Water Quality Engineering", semesterOffered: "Spring", yearRecommended: 3, major: "Environmental Engineering" },
            { title: "Environmental Law & Policy", semesterOffered: "Fall", yearRecommended: 4, major: "Environmental Engineering" },
            { title: "Senior Design Project I", semesterOffered: "Fall", yearRecommended: 4, major: "Environmental Engineering" },
            { title: "Green Building Design", semesterOffered: "Fall", yearRecommended: 4, major: "Environmental Engineering" },
            { title: "Senior Design Project II", semesterOffered: "Spring", yearRecommended: 4, major: "Environmental Engineering" },
            { title: "Professional Practice in Env Eng", semesterOffered: "Spring", yearRecommended: 4, major: "Environmental Engineering" },
            { title: "Sustainable Energy Systems", semesterOffered: "Spring", yearRecommended: 4, major: "Environmental Engineering" },
        ]
    },
    {
        name: "Great Lakes College",
        location: "Cleveland, OH",
        overview: "A college located near the Great Lakes, with a focus on chemistry.",
        requiredCourses: [
            { title: "General Chemistry I", semesterOffered: "Fall", yearRecommended: 1, major: "Chemistry" },
            { title: "Chemistry Lab I", semesterOffered: "Fall", yearRecommended: 1, major: "Chemistry" },
            { title: "General Chemistry II", semesterOffered: "Spring", yearRecommended: 1, major: "Chemistry" },
            { title: "Chemistry Lab II", semesterOffered: "Spring", yearRecommended: 1, major: "Chemistry" },
            { title: "Organic Chemistry I", semesterOffered: "Fall", yearRecommended: 2, major: "Chemistry" },
            { title: "Organic Chemistry Lab I", semesterOffered: "Fall", yearRecommended: 2, major: "Chemistry" },
            { title: "Organic Chemistry II", semesterOffered: "Spring", yearRecommended: 2, major: "Chemistry" },
            { title: "Organic Chemistry Lab II", semesterOffered: "Spring", yearRecommended: 2, major: "Chemistry" },
            { title: "Physical Chemistry I", semesterOffered: "Fall", yearRecommended: 3, major: "Chemistry" },
            { title: "Analytical Chemistry", semesterOffered: "Fall", yearRecommended: 3, major: "Chemistry" },
            { title: "Physical Chemistry II", semesterOffered: "Spring", yearRecommended: 3, major: "Chemistry" },
            { title: "Inorganic Chemistry", semesterOffered: "Spring", yearRecommended: 3, major: "Chemistry" },
            { title: "Advanced Chemistry Lab I", semesterOffered: "Fall", yearRecommended: 4, major: "Chemistry" },
            { title: "Biochemistry", semesterOffered: "Fall", yearRecommended: 4, major: "Chemistry" },
            { title: "Advanced Chemistry Lab II", semesterOffered: "Spring", yearRecommended: 4, major: "Chemistry" },
            { title: "Chemistry Seminar", semesterOffered: "Spring", yearRecommended: 4, major: "Chemistry" }
        ]
    },
    {
        name: "Southwest Technical University",
        location: "Phoenix, AZ",
        overview: "A technical university in the Southwest with a focus on computer engineering.",
        requiredCourses: [
            { title: "Intro to Computer Engineering", semesterOffered: "Fall", yearRecommended: 1, major: "Computer Engineering" },
            { title: "Programming I", semesterOffered: "Fall", yearRecommended: 1, major: "Computer Engineering" },
            { title: "Digital Logic Design", semesterOffered: "Spring", yearRecommended: 1, major: "Computer Engineering" },
            { title: "Programming II", semesterOffered: "Spring", yearRecommended: 1, major: "Computer Engineering" },
            { title: "Computer Organization", semesterOffered: "Fall", yearRecommended: 2, major: "Computer Engineering" },
            { title: "Circuits I", semesterOffered: "Fall", yearRecommended: 2, major: "Computer Engineering" },
            { title: "Data Structures", semesterOffered: "Spring", yearRecommended: 2, major: "Computer Engineering" },
            { title: "Circuits II", semesterOffered: "Spring", yearRecommended: 2, major: "Computer Engineering" },
            { title: "Microprocessors", semesterOffered: "Fall", yearRecommended: 3, major: "Computer Engineering" },
            { title: "Embedded Systems", semesterOffered: "Fall", yearRecommended: 3, major: "Computer Engineering" },
            { title: "Operating Systems", semesterOffered: "Spring", yearRecommended: 3, major: "Computer Engineering" },
            { title: "Signals and Systems", semesterOffered: "Spring", yearRecommended: 3, major: "Computer Engineering" },
            { title: "Senior Design I", semesterOffered: "Fall", yearRecommended: 4, major: "Computer Engineering" },
            { title: "Computer Networks", semesterOffered: "Fall", yearRecommended: 4, major: "Computer Engineering" },
            { title: "Senior Design II", semesterOffered: "Spring", yearRecommended: 4, major: "Computer Engineering" },
            { title: "Engineering Ethics", semesterOffered: "Spring", yearRecommended: 4, major: "Computer Engineering" }
        ]
    },
    {
        name: "Pacific Tech University",
        location: "San Francisco, CA",
        overview: "Focused on innovation and software engineering.",
        requiredCourses: [
            { title: "Introduction to Programming", semesterOffered: "Fall", yearRecommended: 1, major: "Computer Science" },
            { title: "CS Foundations Lab", semesterOffered: "Fall", yearRecommended: 1, major: "Computer Science" },
            { title: "Mathematical Foundations for CS", semesterOffered: "Fall", yearRecommended: 1, major: "Computer Science" },
            { title: "Discrete Mathematics", semesterOffered: "Spring", yearRecommended: 1, major: "Computer Science" },
            { title: "Programming Paradigms", semesterOffered: "Spring", yearRecommended: 1, major: "Computer Science" },
            { title: "CS Ethics & Society", semesterOffered: "Spring", yearRecommended: 1, major: "Computer Science" },
            { title: "Data Structures", semesterOffered: "Fall", yearRecommended: 2, major: "Computer Science" },
            { title: "Computer Networks", semesterOffered: "Fall", yearRecommended: 2, major: "Computer Science" },
            { title: "Web Development", semesterOffered: "Fall", yearRecommended: 2, major: "Computer Science" },
            { title: "Computer Architecture", semesterOffered: "Spring", yearRecommended: 2, major: "Computer Science" },
            { title: "Database Systems", semesterOffered: "Spring", yearRecommended: 2, major: "Computer Science" },
            { title: "Theory of Computation", semesterOffered: "Spring", yearRecommended: 2, major: "Computer Science" },
            { title: "Algorithms", semesterOffered: "Fall", yearRecommended: 3, major: "Computer Science" },
            { title: "Mobile App Development", semesterOffered: "Fall", yearRecommended: 3, major: "Computer Science" },
            { title: "Cybersecurity Fundamentals", semesterOffered: "Fall", yearRecommended: 3, major: "Computer Science" },
            { title: "Operating Systems", semesterOffered: "Spring", yearRecommended: 3, major: "Computer Science" },
            { title: "Parallel Computing", semesterOffered: "Spring", yearRecommended: 3, major: "Computer Science" },
            { title: "Distributed Systems", semesterOffered: "Spring", yearRecommended: 3, major: "Computer Science" },
            { title: "Software Engineering", semesterOffered: "Fall", yearRecommended: 4, major: "Computer Science" },
            { title: "Capstone Project I", semesterOffered: "Fall", yearRecommended: 4, major: "Computer Science" },
            { title: "Machine Learning", semesterOffered: "Fall", yearRecommended: 4, major: "Computer Science" },
            { title: "Artificial Intelligence", semesterOffered: "Spring", yearRecommended: 4, major: "Computer Science" },
            { title: "Capstone Project II", semesterOffered: "Spring", yearRecommended: 4, major: "Computer Science" },
            { title: "Human-Computer Interaction", semesterOffered: "Spring", yearRecommended: 4, major: "Computer Science" },
            { title: "General Biology I", semesterOffered: "Fall", yearRecommended: 1, major: "Biology" },
            { title: "Biology Lab Skills I", semesterOffered: "Fall", yearRecommended: 1, major: "Biology" },
            { title: "Chemistry for Biologists", semesterOffered: "Fall", yearRecommended: 1, major: "Biology" },
            { title: "General Biology II", semesterOffered: "Spring", yearRecommended: 1, major: "Biology" },
            { title: "Biology Lab Skills II", semesterOffered: "Spring", yearRecommended: 1, major: "Biology" },
            { title: "Biostatistics", semesterOffered: "Spring", yearRecommended: 1, major: "Biology" },
            { title: "Genetics", semesterOffered: "Fall", yearRecommended: 2, major: "Biology" },
            { title: "Anatomy & Physiology I", semesterOffered: "Fall", yearRecommended: 2, major: "Biology" },
            { title: "Plant Biology", semesterOffered: "Fall", yearRecommended: 2, major: "Biology" },
            { title: "Cell Biology", semesterOffered: "Spring", yearRecommended: 2, major: "Biology" },
            { title: "Anatomy & Physiology II", semesterOffered: "Spring", yearRecommended: 2, major: "Biology" },
            { title: "Research Methods in Biology", semesterOffered: "Spring", yearRecommended: 2, major: "Biology" },
            { title: "Microbiology", semesterOffered: "Fall", yearRecommended: 3, major: "Biology" },
            { title: "Immunology", semesterOffered: "Fall", yearRecommended: 3, major: "Biology" },
            { title: "Neurobiology", semesterOffered: "Fall", yearRecommended: 3, major: "Biology" },
            { title: "Ecology", semesterOffered: "Spring", yearRecommended: 3, major: "Biology" },
            { title: "Marine Biology", semesterOffered: "Spring", yearRecommended: 3, major: "Biology" },
            { title: "Bioinformatics", semesterOffered: "Spring", yearRecommended: 3, major: "Biology" },
            { title: "Biochemistry", semesterOffered: "Fall", yearRecommended: 4, major: "Biology" },
            { title: "Advanced Molecular Biology", semesterOffered: "Fall", yearRecommended: 4, major: "Biology" },
            { title: "Senior Thesis I", semesterOffered: "Fall", yearRecommended: 4, major: "Biology" },
            { title: "Evolution", semesterOffered: "Spring", yearRecommended: 4, major: "Biology" },
            { title: "Senior Thesis II", semesterOffered: "Spring", yearRecommended: 4, major: "Biology" },
            { title: "Conservation Biology", semesterOffered: "Spring", yearRecommended: 4, major: "Biology" }
        ]
    },
    {
        name: "Global Business Institute",
        location: "New York, NY",
        overview: "Leading business school with a global perspective.",
        requiredCourses: [
            { title: "Introduction to Business", semesterOffered: "Fall", yearRecommended: 1, major: "Business" },
            { title: "Business Communication", semesterOffered: "Fall", yearRecommended: 1, major: "Business" },
            { title: "Spreadsheet Fundamentals", semesterOffered: "Fall", yearRecommended: 1, major: "Business" },
            { title: "Financial Accounting", semesterOffered: "Spring", yearRecommended: 1, major: "Business" },
            { title: "Business Math", semesterOffered: "Spring", yearRecommended: 1, major: "Business" },
            { title: "Business Ethics", semesterOffered: "Spring", yearRecommended: 1, major: "Business" },
            { title: "Microeconomics", semesterOffered: "Fall", yearRecommended: 2, major: "Business" },
            { title: "Managerial Accounting", semesterOffered: "Fall", yearRecommended: 2, major: "Business" },
            { title: "Business Law", semesterOffered: "Fall", yearRecommended: 2, major: "Business" },
            { title: "Macroeconomics", semesterOffered: "Spring", yearRecommended: 2, major: "Business" },
            { title: "Quantitative Analysis", semesterOffered: "Spring", yearRecommended: 2, major: "Business" },
            { title: "Management Information Systems", semesterOffered: "Spring", yearRecommended: 2, major: "Business" },
            { title: "Marketing Principles", semesterOffered: "Fall", yearRecommended: 3, major: "Business" },
            { title: "Operations Management", semesterOffered: "Fall", yearRecommended: 3, major: "Business" },
            { title: "Corporate Finance", semesterOffered: "Fall", yearRecommended: 3, major: "Business" },
            { title: "Business Analytics", semesterOffered: "Spring", yearRecommended: 3, major: "Business" },
            { title: "International Business", semesterOffered: "Spring", yearRecommended: 3, major: "Business" },
            { title: "Entrepreneurship", semesterOffered: "Spring", yearRecommended: 3, major: "Business" },
            { title: "Organizational Behavior", semesterOffered: "Fall", yearRecommended: 4, major: "Business" },
            { title: "Business Strategy Simulation", semesterOffered: "Fall", yearRecommended: 4, major: "Business" },
            { title: "Leadership in Business", semesterOffered: "Fall", yearRecommended: 4, major: "Business" },
            { title: "Strategic Management", semesterOffered: "Spring", yearRecommended: 4, major: "Business" },
            { title: "Capstone Project: Business", semesterOffered: "Spring", yearRecommended: 4, major: "Business" },
            { title: "Business Consulting", semesterOffered: "Spring", yearRecommended: 4, major: "Business" },
            { title: "Introduction to Psychology", semesterOffered: "Fall", yearRecommended: 1, major: "Psychology" },
            { title: "Psychology Writing Lab", semesterOffered: "Fall", yearRecommended: 1, major: "Psychology" },
            { title: "Introduction to Statistics", semesterOffered: "Fall", yearRecommended: 1, major: "Psychology" },
            { title: "Developmental Psychology", semesterOffered: "Spring", yearRecommended: 1, major: "Psychology" },
            { title: "Psychology Research Methods", semesterOffered: "Spring", yearRecommended: 1, major: "Psychology" },
            { title: "Ethics in Psychology", semesterOffered: "Spring", yearRecommended: 1, major: "Psychology" },
            { title: "Social Psychology", semesterOffered: "Fall", yearRecommended: 2, major: "Psychology" },
            { title: "Experimental Psychology", semesterOffered: "Fall", yearRecommended: 2, major: "Psychology" },
            { title: "Health Psychology", semesterOffered: "Fall", yearRecommended: 2, major: "Psychology" },
            { title: "Cognitive Psychology", semesterOffered: "Spring", yearRecommended: 2, major: "Psychology" },
            { title: "Psychological Assessment", semesterOffered: "Spring", yearRecommended: 2, major: "Psychology" },
            { title: "Forensic Psychology", semesterOffered: "Spring", yearRecommended: 2, major: "Psychology" },
            { title: "Biopsychology", semesterOffered: "Fall", yearRecommended: 3, major: "Psychology" },
            { title: "Counseling Psychology", semesterOffered: "Fall", yearRecommended: 3, major: "Psychology" },
            { title: "Educational Psychology", semesterOffered: "Fall", yearRecommended: 3, major: "Psychology" },
            { title: "Personality Psychology", semesterOffered: "Spring", yearRecommended: 3, major: "Psychology" },
            { title: "Cross-Cultural Psychology", semesterOffered: "Spring", yearRecommended: 3, major: "Psychology" },
            { title: "Industrial/Organizational Psychology", semesterOffered: "Spring", yearRecommended: 3, major: "Psychology" },
            { title: "Abnormal Psychology", semesterOffered: "Fall", yearRecommended: 4, major: "Psychology" },
            { title: "Psychology Seminar I", semesterOffered: "Fall", yearRecommended: 4, major: "Psychology" },
            { title: "Neuropsychology", semesterOffered: "Fall", yearRecommended: 4, major: "Psychology" },
            { title: "Clinical Psychology", semesterOffered: "Spring", yearRecommended: 4, major: "Psychology" },
            { title: "Psychology Seminar II", semesterOffered: "Spring", yearRecommended: 4, major: "Psychology" },
            { title: "Senior Thesis in Psychology", semesterOffered: "Spring", yearRecommended: 4, major: "Psychology" }
        ]
    }
];

mergeSeed2Courses(newUniversities, seed2CoursesByUniversity);
balanceSemesterCourses(newUniversities);

const newProfessors = [
    { name: "Dr. John Doe", department: "Information Technology", universityName: "Tech Institute" },
    { name: "Dr. Jane Smith", department: "Environmental Science", universityName: "Coastal University" },
    { name: "Dr. Robert Wilson", department: "Engineering", universityName: "Midwest College" },
    { name: "Dr. Linda Evans", department: "Mathematics", universityName: "Mountain State University" },
    { name: "Dr. Michael Carter", department: "Sociology", universityName: "Bay Area University" },
    { name: "Dr. Susan Turner", department: "Economics", universityName: "Atlantic College" },
    { name: "Dr. William Harris", department: "Nursing", universityName: "Southern State University" },
    { name: "Dr. Emily Green", department: "Environmental Engineering", universityName: "Pacific Northwest University" },
    { name: "Dr. Daniel Lee", department: "Chemistry", universityName: "Great Lakes College" },
    { name: "Dr. Patricia Adams", department: "Computer Engineering", universityName: "Southwest Technical University" },
    { name: "Dr. Alice Winters", department: "Computer Science", universityName: "Pacific Tech University" },
    { name: "Dr. Ethan Brown", department: "Computer Science", universityName: "Pacific Tech University" },
    { name: "Dr. Maria Gonzalez", department: "Biology", universityName: "Pacific Tech University" },
    { name: "Dr. Samuel Lee", department: "Biology", universityName: "Pacific Tech University" },
    { name: "Dr. Susan Lee", department: "Business", universityName: "Global Business Institute" },
    { name: "Dr. Michael Chen", department: "Business Analytics", universityName: "Global Business Institute" },
    { name: "Dr. Olivia Davis", department: "Business", universityName: "Global Business Institute" },
    { name: "Dr. Karen Smith", department: "Psychology", universityName: "Global Business Institute" },
    { name: "Dr. David Johnson", department: "Psychology", universityName: "Global Business Institute" },
    { name: "Dr. Robert Miller", department: "Business", universityName: "Global Business Institute" }
];

mergeSeed2Courses(newUniversities, seed2CoursesByUniversity);

const newCourses = [
    {
        title: "CS Foundations Lab",
        description: "Hands-on lab accompanying introductory programming.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Alice Winters",
        major: "Computer Science",
        semesterOffered: "Fall",
        yearRecommended: 1
    },
    {
        title: "Mathematical Foundations for CS",
        description: "Mathematical concepts essential for computer science.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Ethan Brown",
        major: "Computer Science",
        semesterOffered: "Fall",
        yearRecommended: 1
    },
    {
        title: "Programming Paradigms",
        description: "Explores functional, logic, and object-oriented programming.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Alice Winters",
        major: "Computer Science",
        semesterOffered: "Spring",
        yearRecommended: 1
    },
    {
        title: "CS Ethics & Society",
        description: "Study of ethical and societal issues in computing.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Ethan Brown",
        major: "Computer Science",
        semesterOffered: "Spring",
        yearRecommended: 1
    },
    {
        title: "Computer Networks",
        description: "Introduction to networking and internet protocols.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Alice Winters",
        major: "Computer Science",
        semesterOffered: "Fall",
        yearRecommended: 2
    },
    {
        title: "Web Development",
        description: "Full-stack web application design and development.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Ethan Brown",
        major: "Computer Science",
        semesterOffered: "Fall",
        yearRecommended: 2
    },
    {
        title: "Database Systems",
        description: "Relational databases and SQL.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Alice Winters",
        major: "Computer Science",
        semesterOffered: "Spring",
        yearRecommended: 2
    },
    {
        title: "Theory of Computation",
        description: "Automata, languages, and computational theory.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Ethan Brown",
        major: "Computer Science",
        semesterOffered: "Spring",
        yearRecommended: 2
    },
    {
        title: "Mobile App Development",
        description: "Developing applications for mobile devices.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Alice Winters",
        major: "Computer Science",
        semesterOffered: "Fall",
        yearRecommended: 3
    },
    {
        title: "Cybersecurity Fundamentals",
        description: "Principles of securing computer systems.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Ethan Brown",
        major: "Computer Science",
        semesterOffered: "Fall",
        yearRecommended: 3
    },
    {
        title: "Parallel Computing",
        description: "Parallel architectures and programming models.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Alice Winters",
        major: "Computer Science",
        semesterOffered: "Spring",
        yearRecommended: 3
    },
    {
        title: "Distributed Systems",
        description: "Principles and design of distributed computing.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Ethan Brown",
        major: "Computer Science",
        semesterOffered: "Spring",
        yearRecommended: 3
    },
    {
        title: "Capstone Project I",
        description: "First semester of senior project in CS.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Alice Winters",
        major: "Computer Science",
        semesterOffered: "Fall",
        yearRecommended: 4
    },
    {
        title: "Machine Learning",
        description: "Introduction to machine learning models and techniques.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Ethan Brown",
        major: "Computer Science",
        semesterOffered: "Fall",
        yearRecommended: 4
    },
    {
        title: "Capstone Project II",
        description: "Second semester of senior project in CS.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Alice Winters",
        major: "Computer Science",
        semesterOffered: "Spring",
        yearRecommended: 4
    },
    {
        title: "Human-Computer Interaction",
        description: "User interface design and usability.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Ethan Brown",
        major: "Computer Science",
        semesterOffered: "Spring",
        yearRecommended: 4
    },
    {
        title: "Biology Lab Skills I",
        description: "Introduction to essential laboratory skills in biology.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Maria Gonzalez",
        major: "Biology",
        semesterOffered: "Fall",
        yearRecommended: 1
    },
    {
        title: "Chemistry for Biologists",
        description: "Basic chemistry concepts for life sciences.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Samuel Lee",
        major: "Biology",
        semesterOffered: "Fall",
        yearRecommended: 1
    },
    {
        title: "Biology Lab Skills II",
        description: "Advanced laboratory techniques in biology.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Maria Gonzalez",
        major: "Biology",
        semesterOffered: "Spring",
        yearRecommended: 1
    },
    {
        title: "Biostatistics",
        description: "Statistical methods for biological data analysis.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Samuel Lee",
        major: "Biology",
        semesterOffered: "Spring",
        yearRecommended: 1
    },
    {
        title: "Anatomy & Physiology I",
        description: "Structure and function of the human body I.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Maria Gonzalez",
        major: "Biology",
        semesterOffered: "Fall",
        yearRecommended: 2
    },
    {
        title: "Plant Biology",
        description: "Study of plant structure, function, and diversity.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Samuel Lee",
        major: "Biology",
        semesterOffered: "Fall",
        yearRecommended: 2
    },
    {
        title: "Anatomy & Physiology II",
        description: "Structure and function of the human body II.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Maria Gonzalez",
        major: "Biology",
        semesterOffered: "Spring",
        yearRecommended: 2
    },
    {
        title: "Research Methods in Biology",
        description: "Experimental design and research in biology.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Samuel Lee",
        major: "Biology",
        semesterOffered: "Spring",
        yearRecommended: 2
    },
    {
        title: "Immunology",
        description: "Immune system structure and function.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Maria Gonzalez",
        major: "Biology",
        semesterOffered: "Fall",
        yearRecommended: 3
    },
    {
        title: "Neurobiology",
        description: "Study of nervous system structure and function.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Samuel Lee",
        major: "Biology",
        semesterOffered: "Fall",
        yearRecommended: 3
    },
    {
        title: "Marine Biology",
        description: "Biology of marine organisms and ecosystems.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Maria Gonzalez",
        major: "Biology",
        semesterOffered: "Spring",
        yearRecommended: 3
    },
    {
        title: "Bioinformatics",
        description: "Application of informatics in biological research.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Samuel Lee",
        major: "Biology",
        semesterOffered: "Spring",
        yearRecommended: 3
    },
    {
        title: "Advanced Molecular Biology",
        description: "In-depth study of molecular biology techniques.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Maria Gonzalez",
        major: "Biology",
        semesterOffered: "Fall",
        yearRecommended: 4
    },
    {
        title: "Senior Thesis I",
        description: "First semester of senior thesis research.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Samuel Lee",
        major: "Biology",
        semesterOffered: "Fall",
        yearRecommended: 4
    },
    {
        title: "Senior Thesis II",
        description: "Second semester of senior thesis research.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Maria Gonzalez",
        major: "Biology",
        semesterOffered: "Spring",
        yearRecommended: 4
    },
    {
        title: "Conservation Biology",
        description: "Study of conservation of biodiversity.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Samuel Lee",
        major: "Biology",
        semesterOffered: "Spring",
        yearRecommended: 4
    },
    {
        title: "Business Communication",
        description: "Principles and practice of effective business communication.",
        universityName: "Global Business Institute",
        professorName: "Dr. Susan Lee",
        major: "Business",
        semesterOffered: "Fall",
        yearRecommended: 1
    },
    {
        title: "Spreadsheet Fundamentals",
        description: "Introduction to spreadsheets for business applications.",
        universityName: "Global Business Institute",
        professorName: "Dr. Michael Chen",
        major: "Business",
        semesterOffered: "Fall",
        yearRecommended: 1
    },
    {
        title: "Business Math",
        description: "Mathematics for business and finance.",
        universityName: "Global Business Institute",
        professorName: "Dr. Olivia Davis",
        major: "Business",
        semesterOffered: "Spring",
        yearRecommended: 1
    },
    {
        title: "Business Ethics",
        description: "Ethical issues in business decision making.",
        universityName: "Global Business Institute",
        professorName: "Dr. Susan Lee",
        major: "Business",
        semesterOffered: "Spring",
        yearRecommended: 1
    },
    {
        title: "Managerial Accounting",
        description: "Accounting for managers and decision making.",
        universityName: "Global Business Institute",
        professorName: "Dr. Michael Chen",
        major: "Business",
        semesterOffered: "Fall",
        yearRecommended: 2
    },
    {
        title: "Business Law",
        description: "Legal environment of business.",
        universityName: "Global Business Institute",
        professorName: "Dr. Olivia Davis",
        major: "Business",
        semesterOffered: "Fall",
        yearRecommended: 2
    },
    {
        title: "Quantitative Analysis",
        description: "Quantitative techniques for business analysis.",
        universityName: "Global Business Institute",
        professorName: "Dr. Robert Miller",
        major: "Business",
        semesterOffered: "Spring",
        yearRecommended: 2
    },
    {
        title: "Management Information Systems",
        description: "Information systems in organizations.",
        universityName: "Global Business Institute",
        professorName: "Dr. Susan Lee",
        major: "Business",
        semesterOffered: "Spring",
        yearRecommended: 2
    },
    {
        title: "Operations Management",
        description: "Managing operations in manufacturing and services.",
        universityName: "Global Business Institute",
        professorName: "Dr. Michael Chen",
        major: "Business",
        semesterOffered: "Fall",
        yearRecommended: 3
    },
    {
        title: "Corporate Finance",
        description: "Financial management of corporations.",
        universityName: "Global Business Institute",
        professorName: "Dr. Olivia Davis",
        major: "Business",
        semesterOffered: "Fall",
        yearRecommended: 3
    },
    {
        title: "International Business",
        description: "Business in a global environment.",
        universityName: "Global Business Institute",
        professorName: "Dr. Robert Miller",
        major: "Business",
        semesterOffered: "Spring",
        yearRecommended: 3
    },
    {
        title: "Entrepreneurship",
        description: "Starting and managing new ventures.",
        universityName: "Global Business Institute",
        professorName: "Dr. Susan Lee",
        major: "Business",
        semesterOffered: "Spring",
        yearRecommended: 3
    },
    {
        title: "Business Strategy Simulation",
        description: "Simulated business strategy and decision making.",
        universityName: "Global Business Institute",
        professorName: "Dr. Michael Chen",
        major: "Business",
        semesterOffered: "Fall",
        yearRecommended: 4
    },
    {
        title: "Leadership in Business",
        description: "Leadership theories and practices in business.",
        universityName: "Global Business Institute",
        professorName: "Dr. Olivia Davis",
        major: "Business",
        semesterOffered: "Fall",
        yearRecommended: 4
    },
    {
        title: "Capstone Project: Business",
        description: "Comprehensive business project in senior year.",
        universityName: "Global Business Institute",
        professorName: "Dr. Robert Miller",
        major: "Business",
        semesterOffered: "Spring",
        yearRecommended: 4
    },
    {
        title: "Business Consulting",
        description: "Consulting practices and client engagement.",
        universityName: "Global Business Institute",
        professorName: "Dr. Susan Lee",
        major: "Business",
        semesterOffered: "Spring",
        yearRecommended: 4
    },
    {
        title: "Psychology Writing Lab",
        description: "Development of writing skills for psychology.",
        universityName: "Global Business Institute",
        professorName: "Dr. Karen Smith",
        major: "Psychology",
        semesterOffered: "Fall",
        yearRecommended: 1
    },
    {
        title: "Introduction to Statistics",
        description: "Basic statistics for psychology and social sciences.",
        universityName: "Global Business Institute",
        professorName: "Dr. David Johnson",
        major: "Psychology",
        semesterOffered: "Fall",
        yearRecommended: 1
    },
    {
        title: "Psychology Research Methods",
        description: "Experimental design and research methods in psychology.",
        universityName: "Global Business Institute",
        professorName: "Dr. Karen Smith",
        major: "Psychology",
        semesterOffered: "Spring",
        yearRecommended: 1
    },
    {
        title: "Ethics in Psychology",
        description: "Ethical considerations in psychological research.",
        universityName: "Global Business Institute",
        professorName: "Dr. David Johnson",
        major: "Psychology",
        semesterOffered: "Spring",
        yearRecommended: 1
    },
    {
        title: "Experimental Psychology",
        description: "Experimental methods and data analysis in psychology.",
        universityName: "Global Business Institute",
        professorName: "Dr. Karen Smith",
        major: "Psychology",
        semesterOffered: "Fall",
        yearRecommended: 2
    },
    {
        title: "Health Psychology",
        description: "Psychological factors in health and illness.",
        universityName: "Global Business Institute",
        professorName: "Dr. David Johnson",
        major: "Psychology",
        semesterOffered: "Fall",
        yearRecommended: 2
    },
    {
        title: "Psychological Assessment",
        description: "Principles and techniques of psychological assessment.",
        universityName: "Global Business Institute",
        professorName: "Dr. Karen Smith",
        major: "Psychology",
        semesterOffered: "Spring",
        yearRecommended: 2
    },
    {
        title: "Forensic Psychology",
        description: "Intersection of psychology and the legal system.",
        universityName: "Global Business Institute",
        professorName: "Dr. David Johnson",
        major: "Psychology",
        semesterOffered: "Spring",
        yearRecommended: 2
    },
    {
        title: "Counseling Psychology",
        description: "Principles and practice of counseling.",
        universityName: "Global Business Institute",
        professorName: "Dr. Karen Smith",
        major: "Psychology",
        semesterOffered: "Fall",
        yearRecommended: 3
    },
    {
        title: "Educational Psychology",
        description: "Psychological principles applied to education.",
        universityName: "Global Business Institute",
        professorName: "Dr. David Johnson",
        major: "Psychology",
        semesterOffered: "Fall",
        yearRecommended: 3
    },
    {
        title: "Cross-Cultural Psychology",
        description: "Cultural influences on psychological processes.",
        universityName: "Global Business Institute",
        professorName: "Dr. Karen Smith",
        major: "Psychology",
        semesterOffered: "Spring",
        yearRecommended: 3
    },
    {
        title: "Industrial/Organizational Psychology",
        description: "Psychology applied to the workplace.",
        universityName: "Global Business Institute",
        professorName: "Dr. David Johnson",
        major: "Psychology",
        semesterOffered: "Spring",
        yearRecommended: 3
    },
    {
        title: "Psychology Seminar I",
        description: "Seminar on contemporary psychology topics.",
        universityName: "Global Business Institute",
        professorName: "Dr. Karen Smith",
        major: "Psychology",
        semesterOffered: "Fall",
        yearRecommended: 4
    },
    {
        title: "Neuropsychology",
        description: "Brain-behavior relationships and neuropsychological disorders.",
        universityName: "Global Business Institute",
        professorName: "Dr. David Johnson",
        major: "Psychology",
        semesterOffered: "Fall",
        yearRecommended: 4
    },
    {
        title: "Psychology Seminar II",
        description: "Advanced seminar in psychology.",
        universityName: "Global Business Institute",
        professorName: "Dr. Karen Smith",
        major: "Psychology",
        semesterOffered: "Spring",
        yearRecommended: 4
    },
    {
        title: "Senior Thesis in Psychology",
        description: "Independent research thesis in psychology.",
        universityName: "Global Business Institute",
        professorName: "Dr. David Johnson",
        major: "Psychology",
        semesterOffered: "Spring",
        yearRecommended: 4
    },
    {
        title: "Introduction to Programming",
        description: "Learn programming basics using Python and Java.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Alice Winters",
        major: "Computer Science",
        semesterOffered: "Fall",
        yearRecommended: 1
    },
    {
        title: "Discrete Mathematics",
        description: "Covers logic, set theory, combinatorics, and proofs.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Ethan Brown",
        major: "Computer Science",
        semesterOffered: "Spring",
        yearRecommended: 1
    },
    {
        title: "Data Structures",
        description: "Study of arrays, lists, trees, and graphs.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Alice Winters",
        major: "Computer Science",
        semesterOffered: "Fall",
        yearRecommended: 2
    },
    {
        title: "Computer Architecture",
        description: "Introduction to computer organization and hardware.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Ethan Brown",
        major: "Computer Science",
        semesterOffered: "Spring",
        yearRecommended: 2
    },
    {
        title: "Algorithms",
        description: "Design and analysis of algorithms and complexity.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Alice Winters",
        major: "Computer Science",
        semesterOffered: "Fall",
        yearRecommended: 3
    },
    {
        title: "Operating Systems",
        description: "Concepts of OS, processes, and concurrency.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Ethan Brown",
        major: "Computer Science",
        semesterOffered: "Spring",
        yearRecommended: 3
    },
    {
        title: "Software Engineering",
        description: "Principles of software design, testing, and maintenance.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Alice Winters",
        major: "Computer Science",
        semesterOffered: "Fall",
        yearRecommended: 4
    },
    {
        title: "Artificial Intelligence",
        description: "Introduction to AI concepts and applications.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Ethan Brown",
        major: "Computer Science",
        semesterOffered: "Spring",
        yearRecommended: 4
    },
    {
        title: "General Biology I",
        description: "Cell structure, function, and genetics.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Maria Gonzalez",
        major: "Biology",
        semesterOffered: "Fall",
        yearRecommended: 1
    },
    {
        title: "General Biology II",
        description: "Plant, animal diversity, and ecology.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Samuel Lee",
        major: "Biology",
        semesterOffered: "Spring",
        yearRecommended: 1
    },
    {
        title: "Genetics",
        description: "Principles of heredity and genetic analysis.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Maria Gonzalez",
        major: "Biology",
        semesterOffered: "Fall",
        yearRecommended: 2
    },
    {
        title: "Cell Biology",
        description: "Structure and function of eukaryotic cells.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Samuel Lee",
        major: "Biology",
        semesterOffered: "Spring",
        yearRecommended: 2
    },
    {
        title: "Microbiology",
        description: "Study of microorganisms and disease.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Maria Gonzalez",
        major: "Biology",
        semesterOffered: "Fall",
        yearRecommended: 3
    },
    {
        title: "Ecology",
        description: "Interactions between organisms and environment.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Samuel Lee",
        major: "Biology",
        semesterOffered: "Spring",
        yearRecommended: 3
    },
    {
        title: "Biochemistry",
        description: "Chemical processes in living organisms.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Maria Gonzalez",
        major: "Biology",
        semesterOffered: "Fall",
        yearRecommended: 4
    },
    {
        title: "Evolution",
        description: "Mechanisms and evidence of evolution.",
        universityName: "Pacific Tech University",
        professorName: "Dr. Samuel Lee",
        major: "Biology",
        semesterOffered: "Spring",
        yearRecommended: 4
    },
    {
        title: "Introduction to Business",
        description: "Fundamentals of business principles and practices.",
        universityName: "Global Business Institute",
        professorName: "Dr. Susan Lee",
        major: "Business",
        semesterOffered: "Fall",
        yearRecommended: 1
    },
    {
        title: "Financial Accounting",
        description: "Principles of financial accounting and reporting.",
        universityName: "Global Business Institute",
        professorName: "Dr. Michael Chen",
        major: "Business",
        semesterOffered: "Spring",
        yearRecommended: 1
    },
    {
        title: "Microeconomics",
        description: "Economic behavior of individuals and firms.",
        universityName: "Global Business Institute",
        professorName: "Dr. Olivia Davis",
        major: "Business",
        semesterOffered: "Fall",
        yearRecommended: 2
    },
    {
        title: "Macroeconomics",
        description: "Economy-wide phenomena and policies.",
        universityName: "Global Business Institute",
        professorName: "Dr. Susan Lee",
        major: "Business",
        semesterOffered: "Spring",
        yearRecommended: 2
    },
    {
        title: "Marketing Principles",
        description: "Study of marketing concepts and strategies.",
        universityName: "Global Business Institute",
        professorName: "Dr. Michael Chen",
        major: "Business",
        semesterOffered: "Fall",
        yearRecommended: 3
    },
    {
        title: "Business Analytics",
        description: "Data-driven decision making in business.",
        universityName: "Global Business Institute",
        professorName: "Dr. Olivia Davis",
        major: "Business",
        semesterOffered: "Spring",
        yearRecommended: 3
    },
    {
        title: "Organizational Behavior",
        description: "Study of human behavior in organizations.",
        universityName: "Global Business Institute",
        professorName: "Dr. Robert Miller",
        major: "Business",
        semesterOffered: "Fall",
        yearRecommended: 4
    },
    {
        title: "Strategic Management",
        description: "Formulation and implementation of business strategy.",
        universityName: "Global Business Institute",
        professorName: "Dr. Susan Lee",
        major: "Business",
        semesterOffered: "Spring",
        yearRecommended: 4
    },
    {
        title: "Introduction to Psychology",
        description: "Overview of psychological principles and theories.",
        universityName: "Global Business Institute",
        professorName: "Dr. Karen Smith",
        major: "Psychology",
        semesterOffered: "Fall",
        yearRecommended: 1
    },
    {
        title: "Developmental Psychology",
        description: "Human development from infancy to adulthood.",
        universityName: "Global Business Institute",
        professorName: "Dr. David Johnson",
        major: "Psychology",
        semesterOffered: "Spring",
        yearRecommended: 1
    },
    {
        title: "Social Psychology",
        description: "Study of how people influence each other.",
        universityName: "Global Business Institute",
        professorName: "Dr. Karen Smith",
        major: "Psychology",
        semesterOffered: "Fall",
        yearRecommended: 2
    },
    {
        title: "Cognitive Psychology",
        description: "Mental processes such as memory and perception.",
        universityName: "Global Business Institute",
        professorName: "Dr. David Johnson",
        major: "Psychology",
        semesterOffered: "Spring",
        yearRecommended: 2
    },
    {
        title: "Biopsychology",
        description: "Biological bases of behavior and cognition.",
        universityName: "Global Business Institute",
        professorName: "Dr. Karen Smith",
        major: "Psychology",
        semesterOffered: "Fall",
        yearRecommended: 3
    },
    {
        title: "Personality Psychology",
        description: "Major theories of personality and assessment.",
        universityName: "Global Business Institute",
        professorName: "Dr. David Johnson",
        major: "Psychology",
        semesterOffered: "Spring",
        yearRecommended: 3
    },
    {
        title: "Abnormal Psychology",
        description: "Psychological disorders and treatments.",
        universityName: "Global Business Institute",
        professorName: "Dr. Karen Smith",
        major: "Psychology",
        semesterOffered: "Fall",
        yearRecommended: 4
    },
    {
        title: "Clinical Psychology",
        description: "Diagnosis and intervention of mental illness.",
        universityName: "Global Business Institute",
        professorName: "Dr. David Johnson",
        major: "Psychology",
        semesterOffered: "Spring",
        yearRecommended: 4
    }
];

function generateCourseCode(major, index) {
    const prefix = major
        .split(' ')
        .map(word => word[0].toUpperCase())
        .join('');
    return `${prefix}${500 + index}`;
}

mergeSeed2Courses(newUniversities, seed2CoursesByUniversity);
balanceSemesterCourses(newUniversities);

const run = async () => {
    const universitiesCol = await universities();
    const professorsCol = await professors();
    const coursesCol = await courses();

    let courseIndex = 0;
    for (const uni of newUniversities) {
        for (const course of uni.requiredCourses) {
            course.code = generateCourseCode(course.major, courseIndex++);
        }
    }

    const uniMap = {};

    for (const uni of newUniversities) {
        let existing = await universitiesCol.findOne({ name: uni.name });

        if (!existing) {
            const result = await universitiesCol.insertOne({
                name: uni.name,
                location: uni.location,
                overview: uni.overview,
                requiredCourses: uni.requiredCourses,
                publicChatId: new ObjectId().toString()
            });
            console.log(`✅ Added university: ${uni.name}`);
            uniMap[uni.name] = result.insertedId;
        } else {
            uniMap[uni.name] = existing._id;

            await universitiesCol.updateOne(
                { _id: existing._id },
                {
                    $set: {
                        requiredCourses: uni.requiredCourses,
                        location: uni.location,
                        overview: uni.overview
                    }
                }
            );
            console.log(`🔁 Updated university info for: ${uni.name}`);

            for (const course of uni.requiredCourses) {
                const courseExists = await coursesCol.findOne({
                    title: course.title,
                    universityId: existing._id,
                    major: course.major
                });

                if (!courseExists) {
                    await coursesCol.insertOne({
                        code: course.code || generateCourseCode(course.major, courseIndex++),
                        title: course.title,
                        description: course.description || "",
                        universityId: existing._id,
                        professorId: null,
                        major: course.major,
                        semesterOffered: course.semesterOffered,
                        yearRecommended: course.yearRecommended,
                        studentsEnrolled: []
                    });
                    console.log(`🆕 Backfilled missing course: ${course.title}`);
                }
            }
        }
    }

    const allUniversities = await universitiesCol.find({}).toArray();
    for (const uni of allUniversities) {
        if (!Array.isArray(uni.requiredCourses) || uni.requiredCourses.length === 0) {
            await universitiesCol.updateOne(
                { _id: uni._id },
                { $set: { requiredCourses: [] } }
            );
            console.log(`🧩 Patched empty course plan for: ${uni.name}`);
        }
    }

    await coursesCol.updateMany(
        { $or: [{ major: { $exists: false } }, { major: "" }] },
        { $set: { major: "General Studies" } }
    );
    console.log("🛠️ Backfilled missing majors with 'General Studies'");

    const profMap = {};

    for (const prof of newProfessors) {
        const uniId = uniMap[prof.universityName];
        if (!uniId) continue;

        const existing = await professorsCol.findOne({ name: prof.name, universityId: uniId });

        if (!existing) {
            const result = await professorsCol.insertOne({
                name: prof.name,
                department: prof.department,
                universityId: uniId
            });
            console.log(`Added professor: ${prof.name}`);
            profMap[prof.name] = result.insertedId;
        } else {
            console.log(`Professor already exists: ${prof.name}`);
            profMap[prof.name] = existing._id;
        }
    }

    for (let index = 0; index < newCourses.length; index++) {
        const course = newCourses[index];
        const uniId = uniMap[course.universityName];
        const profId = profMap[course.professorName];
        if (!uniId || !profId) continue;

        const exists = await coursesCol.findOne({
            title: course.title,
            universityId: uniId,
            professorId: profId,
            major: course.major
        });

        if (!exists) {
            await coursesCol.insertOne({
                code: course.code || generateCourseCode(course.major, index),
                title: course.title,
                description: course.description,
                universityId: uniId,
                professorId: profId,
                major: course.major,
                semesterOffered: course.semesterOffered,
                yearRecommended: course.yearRecommended,
                studentsEnrolled: []
            });
            console.log(`Added course: ${course.code || generateCourseCode(course.major, index)} - ${course.title}`);
        } else {
            console.log(`⚠️ Course already exists: ${course.title}`);
        }
    }
    console.log("🎓 Course Scheduler Seed Complete!");
};

run();
function ensureNoDuplicateCourseTitles(universities) {
    for (const uni of universities) {
        const groups = {};
        for (const course of uni.requiredCourses) {
            const key = `${course.major}|||${course.yearRecommended}|||${course.semesterOffered}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(course);
        }
        for (const [key, group] of Object.entries(groups)) {
            const seen = new Set();
            for (let i = 0; i < group.length; ++i) {
                const c = group[i];
                if (!seen.has(c.title)) {
                    seen.add(c.title);
                } else {
                    let pool = [];
                    if (c.major === "Environmental Engineering") {
                        pool = [
                            "Water Quality Management", "Advanced Environmental Systems", "Green Technologies in Engineering",
                            "Pollution Control Engineering", "Renewable Energy Systems", "Hazardous Waste Engineering",
                            "Environmental Risk Assessment"
                        ];
                    } else if (c.major === "Civil Engineering") {
                        pool = [
                            "Hydraulic Engineering", "Urban Water Systems", "Transportation Systems",
                            "Construction Safety", "Geospatial Analysis for Civil Eng", "Bridge Engineering",
                            "Environmental Impact in Civil Eng"
                        ];
                    } else if (c.major === "Mechanical Engineering") {
                        pool = [
                            "Thermal Systems Design", "Mechatronics", "Advanced CAD",
                            "Energy Conversion", "Biomechanics", "HVAC Systems", "Materials Selection"
                        ];
                    } else if (c.major === "Nursing") {
                        pool = [
                            "Clinical Skills Practicum", "Nursing Informatics", "Population Health",
                            "Critical Care Nursing", "Nursing Research", "Transcultural Nursing", "Leadership in Nursing"
                        ];
                    } else if (c.major === "Public Health") {
                        pool = [
                            "Chronic Disease Epidemiology", "Public Health Nutrition", "Health Promotion Strategies",
                            "Environmental Health Policy", "Global Health Issues", "Health Program Evaluation", "Public Health Leadership"
                        ];
                    } else if (c.major === "Health Sciences") {
                        pool = [
                            "Clinical Nutrition", "Health Informatics", "Rehabilitation Science",
                            "Pathology Lab", "Applied Physiology", "Healthcare Law", "Patient Safety"
                        ];
                    } else {
                        pool = [];
                        for (let j = 1; j <= 10; ++j) pool.push(`Special Topic ${c.major} ${j}`);
                    }
                    let newTitle = null;
                    for (const candidate of pool) {
                        if (!seen.has(candidate)) {
                            newTitle = candidate;
                            break;
                        }
                    }
                    if (!newTitle) {
                        let suffix = 2;
                        while (seen.has(`${c.title} (${suffix})`)) ++suffix;
                        newTitle = `${c.title} (${suffix})`;
                    }
                    c.title = newTitle;
                    seen.add(newTitle);
                }
            }
        }
    }
}

ensureNoDuplicateCourseTitles(newUniversities);