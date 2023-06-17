"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import JSONViewer from 'react-json-view';


export default function Home() {
  const [number1, setNumber1] = useState('');
  const [number2, setNumber2] = useState('');
  const [steps, setSteps] = useState('');
  const [savedResults, setSavedResults] = useState({
    "step1":{"carryString": "1", "sumString": "3"},
    "step2":{"carryString": "11", "sumString": "03"},
    "step3":{"carryString": "111", "sumString": "203"},
    "step4":{"carryString": "1111", "sumString": "2203"},
  });

  const handleGenerateSteps = async () => {
    try {
      const response = await axios.post('/api/steps', {
        number1,
        number2,
      });
      setSteps(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error(error);
    }
  };
  const handleSaveResults = async () => {
    try {
      await axios.post('/api/save-results', {
        steps: JSON.parse(steps),
      });
      fetchSavedResults(); // Refresh saved results after saving
    } catch (error) {
      console.error(error);
    }
  }

  const fetchSavedResults = async () => {
    try {
      const response = await axios.get('/api/results');
      setSavedResults(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // fetchSavedResults();
  }, []);

  return (
    <>
    <header className="header-fixed">
	<div className="header-limiter">
		<h1><a href="#">Eqaim<span>Technology</span></a></h1>
	</div>
</header>
    <div className="form-container">
      <form className="register-form">
        <span>First Number</span>
        <input
          className="form-field"
          type="text"
          value={number1}
          onChange={(e) => setNumber1(e.target.value)} />
        <span>Second Number</span>
        <input
          className="form-field"
          type="text"
          value={number2}
          onChange={(e) => setNumber2(e.target.value)} />
        <button onClick={handleGenerateSteps}>Generate Steps</button>
      </form>
    </div>
    <div className="form-container">
            <h2>Saved Results</h2>
            <JSONViewer src={savedResults} />
    </div>
    <div className="form-container">
         <button onClick={handleSaveResults}>Save Results to DB</button>
      </div>
    </>
  );
}
