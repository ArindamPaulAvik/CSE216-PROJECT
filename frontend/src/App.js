import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import FrontPage from './components/Frontpage';    // Correct casing (FrontPage)
import ShowDetails from './components/ShowDetails'; // Import ShowDetails
import ActorDetailPage from './components/ActorDetailPage';
import ActorsPage from './components/ActorsPage';


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/frontpage" element={<FrontPage />} />
          <Route path="/show/:id" element={<ShowDetails />} /> {/* New ShowDetails Route */}
          <Route path="/actors" element={<ActorsPage />} />
          <Route path="/actor/:id" element={<ActorDetailPage />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
