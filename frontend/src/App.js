import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import FrontPage from './components/Frontpage';
import ShowDetails from './components/ShowDetails';
import ActorDetailPage from './components/ActorDetailPage';
import ActorsPage from './components/ActorsPage';
import AwardDetailPage from './components/AwardDetailPage';
import AwardsPage from './components/AwardsPage';
import PublisherFrontpage from './components/PublisherFrontpage';
import SupportAdminFrontpage from './components/SupportAdminFrontpage';
import ContentAdminFrontpage from './components/ContentAdminFrontpage';
import MarketingAdminFrontpage from './components/MarketingAdminFrontpage';
import UserProfile from './components/UserProfile';
import Settings from './components/Settings';
import Auth from './components/Auth';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/frontpage" element={<FrontPage />} />
          <Route path="/publisher-frontpage" element={<PublisherFrontpage />} />
          <Route path="/support-admin-frontpage" element={<SupportAdminFrontpage />} />
          <Route path="/content-admin-frontpage" element={<ContentAdminFrontpage />} />
          <Route path="/marketing-admin-frontpage" element={<MarketingAdminFrontpage />} />
          <Route path="/show/:id" element={<ShowDetails />} />
          <Route path="/actors" element={<ActorsPage />} />
          <Route path="/actor/:id" element={<ActorDetailPage />} />
          <Route path="/awards" element={<AwardsPage />} />
          <Route path="/award/:id" element={<AwardDetailPage />} />
          <Route path="/directors" element={React.createElement(require('./components/DirectorsPage').default)} />
          <Route path="/director/:id" element={React.createElement(require('./components/DirectorDetailPage').default)} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
