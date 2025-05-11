import { useEffect, useState } from 'react';
import axios from 'axios';

const CoursePlan = () => {
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [majors, setMajors] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState('');
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    axios.get('/api/universities').then((res) => setUniversities(res.data));
  }, []);

  useEffect(() => {
    if (selectedUniversity) {
      axios.get(`/api/universities/${selectedUniversity}`).then((res) => {
        const majors = [...new Set(res.data.requiredCourses.map((c) => c.major))];
        setMajors(majors);
      });
    }
  }, [selectedUniversity]);

  useEffect(() => {
    if (selectedUniversity && selectedMajor) {
      axios
        .get(`/api/scheduler/full-plan/${selectedUniversity}/${selectedMajor}`)
        .then((res) => setPlan(res.data));
    }
  }, [selectedUniversity, selectedMajor]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🧭 4-Year Guided Course Plan</h2>

      <label>University:</label>
      <select onChange={(e) => setSelectedUniversity(e.target.value)}>
        <option value="">Select</option>
        {universities.map((u) => (
          <option key={u._id} value={u._id}>{u.name}</option>
        ))}
      </select>

      <label>Major:</label>
      <select onChange={(e) => setSelectedMajor(e.target.value)} disabled={!selectedUniversity}>
        <option value="">Select</option>
        {majors.map((m) => <option key={m}>{m}</option>)}
      </select>

      {plan && (
        <div>
          {Object.entries(plan).map(([year, semesters]) => (
            <div key={year} style={{ marginTop: '1rem' }}>
              <h3>{year}</h3>
              <div style={{ display: 'flex', gap: '2rem' }}>
                {['Fall', 'Spring'].map((sem) => (
                  <div key={sem}>
                    <h4>{sem}</h4>
                    <ul>
                      {(semesters[sem] || []).map((c) => (
                        <li key={c.title}>
                          <strong>{c.title}</strong> — {c.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursePlan;