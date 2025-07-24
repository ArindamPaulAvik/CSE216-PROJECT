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
import UserProfileView from './components/UserProfileView';
import Settings from './components/Settings';
import Auth from './components/Auth';
import ShowsManagement from './components/ShowsManagement';
import AdminShowDetails from './components/AdminShowDetails';
import EditShow from './components/EditShow';
import ActorsManagement from './components/ActorsManagement';
import AdminActorDetails from './components/AdminActorDetails';
import EditActor from './components/EditActor';
import DirectorsManagement from './components/DirectorsManagement';
import AdminDirectorDetails from './components/AdminDirectorDetails';
import EditDirector from './components/EditDirector';
import AwardsManagement from './components/AwardsManagement';
import AdminAwardDetails from './components/AdminAwardDetails';
import EditAward from './components/EditAward';
import SubmissionsManagement from './components/SubmissionsManagement';
import ReportsManagement from './components/ReportsManagement';
import Subscription from './components/Subscription';
import FAQManagement from './components/FAQManagement';
import SimpleFAQManagement from './components/SimpleFAQManagement';
import UsersManagement from './components/UsersManagement';
import UserDetails from './components/UserDetails';
import CustomerCareRequests from './components/CustomerCareRequests';

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
          <Route path="/profile/:userId" element={<UserProfileView />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/shows-management" element={<ShowsManagement />} />
          <Route path="/admin-show-details/:id" element={<AdminShowDetails />} />
          <Route path="/edit-show/:id" element={<EditShow />} />
          <Route path="/actors-management" element={<ActorsManagement />} />
          <Route path="/admin-actor-details/:id" element={<AdminActorDetails />} />
          <Route path="/edit-actor/:id" element={<EditActor />} />
          <Route path="/directors-management" element={<DirectorsManagement />} />
          <Route path="/admin-director-details/:id" element={<AdminDirectorDetails />} />
          <Route path="/edit-director/:id" element={<EditDirector />} />
          <Route path="/add-actor" element={<EditActor />} />
          <Route path="/awards-management" element={<AwardsManagement />} />
          <Route path="/admin-award-details/:id" element={<AdminAwardDetails />} />
          <Route path="/edit-award/:id" element={<EditAward />} />
          <Route path="/add-award" element={<EditAward />} />
          <Route path="/submissions-management" element={<SubmissionsManagement />} />
          <Route path="/reports-management" element={<ReportsManagement />} />
          <Route path="/faq-management" element={<FAQManagement />} />
          <Route path="/users-management" element={<UsersManagement />} />
          <Route path="/user-details/:id" element={<UserDetails />} />
          <Route path="/customer-care-requests" element={<CustomerCareRequests />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
