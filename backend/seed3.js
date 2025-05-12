import { universities, professors, courses } from "./config/mongoCollections.js";
import { ObjectId } from "mongodb";

const newUniversities = [
  {
    name: "Pacific Tech University",
    location: "San Francisco, CA",
    overview: "Focused on innovation and software engineering.",
    requiredCourses: [
      // Computer Science (8+8=16 courses)
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
      // Biology (8+8=16 courses)
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
      // Business (8+8=16 courses)
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
      // Psychology (8+8=16 courses)
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

const newProfessors = [
  // Pacific Tech University
  { name: "Dr. Alice Winters", department: "Computer Science", universityName: "Pacific Tech University" },
  { name: "Dr. Ethan Brown", department: "Computer Science", universityName: "Pacific Tech University" },
  { name: "Dr. Maria Gonzalez", department: "Biology", universityName: "Pacific Tech University" },
  { name: "Dr. Samuel Lee", department: "Biology", universityName: "Pacific Tech University" },
  // Global Business Institute
  { name: "Dr. Susan Lee", department: "Business", universityName: "Global Business Institute" },
  { name: "Dr. Michael Chen", department: "Business Analytics", universityName: "Global Business Institute" },
  { name: "Dr. Olivia Davis", department: "Business", universityName: "Global Business Institute" },
  { name: "Dr. Karen Smith", department: "Psychology", universityName: "Global Business Institute" },
  { name: "Dr. David Johnson", department: "Psychology", universityName: "Global Business Institute" },
  { name: "Dr. Robert Miller", department: "Business", universityName: "Global Business Institute" }
];

const newCourses = [
  // Additional Computer Science courses @ Pacific Tech University
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

  // Additional Biology courses @ Pacific Tech University
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

  // Additional Business courses @ Global Business Institute
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

  // Additional Psychology courses @ Global Business Institute
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
  // Computer Science @ Pacific Tech University
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
  // Biology @ Pacific Tech University
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
  // Business @ Global Business Institute
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
  // Psychology @ Global Business Institute
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

const run = async () => {
  const universitiesCol = await universities();
  const professorsCol = await professors();
  const coursesCol = await courses();

  const uniMap = {}; // name -> _id

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

      // Only update requiredCourses if not already set
      if (!existing.requiredCourses || existing.requiredCourses.length === 0) {
        await universitiesCol.updateOne(
          { _id: existing._id },
          { $set: { requiredCourses: uni.requiredCourses } }
        );
        console.log(`🔁 Updated requiredCourses for: ${uni.name}`);
      } else {
        console.log(`⚠️ University already has requiredCourses: ${uni.name}`);
      }
    }
  }

  const profMap = {}; // name -> _id

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
      console.log(`✅ Added professor: ${prof.name}`);
      profMap[prof.name] = result.insertedId;
    } else {
      console.log(`⚠️ Professor already exists: ${prof.name}`);
      profMap[prof.name] = existing._id;
    }
  }

  for (const course of newCourses) {
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
        title: course.title,
        description: course.description,
        universityId: uniId,
        professorId: profId,
        major: course.major,
        semesterOffered: course.semesterOffered,
        yearRecommended: course.yearRecommended,
        studentsEnrolled: []
      });
      console.log(`✅ Added course: ${course.title}`);
    } else {
      console.log(`⚠️ Course already exists: ${course.title}`);
    }
  }

  console.log("🎓 Course Scheduler Seed Complete!");
};

run();