import React from "react";

export default function About() {
  const teamMembers = [
    {
      name: "Keval Sompura",
      funFact:
        "Loves collecting vintage tech gadgets and once built a PC inside an old typewriter.",
    },
    {
      name: "Jenish Khunt",
      funFact:
        "Can solve a Rubik’s Cube in under a minute and designs in neon colors.",
    },
    {
      name: "Himanshu Chadha",
      funFact:
        "Has a secret recipe for the world’s best chocolate chip cookies.",
    },
    {
      name: "Xavier Carty",
      funFact:
        "Once backpacked across 10 countries in a month and documents every trip with doodles.",
    },
  ];
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8 text-center">
        About Student Bridge
      </h1>
      <p className="text-gray-700 leading-relaxed">
        Student Bridge is a community-driven platform designed to help students
        connect with professors, ask questions, share resources, and stay
        informed about courses. Our mission is to foster collaboration and
        support across universities.
      </p>
      <section className="bg-gray-100 py-16 rounded-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="text-center">
              <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
              <p className="text-gray-600">{member.funFact}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
