import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import FrontPage from './components/Frontpage';
import ShowDetails from './components/ShowDetails';
import ActorDetailPage from './components/ActorDetailPage';
import ActorsPage from './components/ActorsPage';
import UserProfile from './components/UserProfile';
import Auth from './components/Auth';
import Favourites from './components/Favourites';  // Import the new favorites page

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/frontpage" element={<FrontPage />} />
          <Route path="/show/:id" element={<ShowDetails />} />
          <Route path="/actors" element={<ActorsPage />} />
          <Route path="/actor/:id" element={<ActorDetailPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/favourites" element={<Favourites />} /> {/* Add favorites route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
