import { useEffect, useState } from 'react';
import axiosInstance from '../../config/axiosConfig';

const CoursePlan = () => {
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [majors, setMajors] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState('');
  const [plan, setPlan] = useState(null);

  // 🔄 Corrected path: relative URL to respect baseURL from axiosInstance
  useEffect(() => {
    axiosInstance.get('/universities').then((res) => {
      console.log("✔️ Universities loaded:", res.data);
      setUniversities(res.data);
    });
  }, []);

  // 🔄 Corrected path: relative URL to respect baseURL from axiosInstance
  useEffect(() => {
    if (selectedUniversity) {
      axiosInstance.get(`/universities/${selectedUniversity}`).then((res) => {
        console.log("Selected university details:", res.data);
        const requiredCourses = Array.isArray(res.data.requiredCourses) ? res.data.requiredCourses : [];
        const majorsSet = new Set();
        requiredCourses.forEach((course) => {
          if (course.major && typeof course.major === 'string') {
            majorsSet.add(course.major);
          }
        });
        setMajors([...majorsSet]);
        console.log("Majors extracted:", [...majorsSet]);
      });
    }
  }, [selectedUniversity]);

  // 🔄 Corrected path: relative URL to respect baseURL from axiosInstance
  useEffect(() => {
    if (selectedUniversity && selectedMajor) {
      console.log("📤 Fetching plan for:", selectedUniversity, selectedMajor);
      axiosInstance
        .get(`/api/scheduler/full-plan/${selectedUniversity}/${selectedMajor}`)
        .then((res) => {
          console.log("📥 Received plan:", res.data);
          setPlan(res.data);
        });
    }
  }, [selectedUniversity, selectedMajor]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">🧭 4-Year Guided Course Plan</h2>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">University:</label>
          <select
            className="w-full border rounded p-2"
            onChange={(e) => {
              setSelectedUniversity(e.target.value);
              setSelectedMajor(""); // reset major when university changes
            }}
          >
            <option value="">Select</option>
            {Array.isArray(universities) &&
              universities.map((u) => (
                <option key={u._id} value={u._id}>{u.name}</option>
              ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">Major:</label>
          <select
            className="w-full border rounded p-2"
            onChange={(e) => setSelectedMajor(e.target.value)}
            disabled={!selectedUniversity}
          >
            <option value="">Select</option>
            {majors.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>

        {plan && (
          <div>
            {Object.entries(plan).map(([year, semesters]) => {
              const yearMap = {
                year1: "Freshman",
                year2: "Sophomore",
                year3: "Junior",
                year4: "Senior"
              };
              return (
                <div key={year} className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">{yearMap[year] || year}</h3>
                  <div className="grid md:grid-cols-2 gap-6 mt-4">
                    {['Fall', 'Spring'].map((sem) => (
                      <div key={sem} className="border p-4 rounded shadow bg-gray-50">
                        <h4 className="font-semibold text-lg text-blue-600 mb-2">{sem}</h4>
                        <ul>
                          {(semesters[sem] || []).map((c) => (
                            <li key={`${c.code || c.title}`} className="mb-1">
                              <strong>{c.code ? `${c.code} - ` : ''}{c.title}</strong>
                              {c.description ? ` — ${c.description}` : ''}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePlan;