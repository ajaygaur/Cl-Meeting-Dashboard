import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MeetingModule from './modules/Meeting/MeetingModule'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MeetingModule/>}/>
        <Route path="/meeting" element={<MeetingModule/>}/>
      </Routes>
    </Router>
  );
}

export default App;
