import { Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from './pages/home';
import SetupPage from './pages/setup';
import Authenticate from './pages/login/Authenticate';
import { AccessTokenWrapper } from '@calimero-is-near/calimero-p2p-sdk';
import { getNodeUrl } from './utils/node';
import LandingPage from './pages/landing-page';
import PublisherDashboard from './pages/dashboard/publisher';
import TrainerDashboard from './pages/dashboard/trainer';

export default function App() {
  return (
    <AccessTokenWrapper getNodeUrl={getNodeUrl}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path="/login" element={<SetupPage />} />
          <Route path="/auth" element={<Authenticate />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/dashboard/publisher" element={<PublisherDashboard />} />
          <Route path="/dashboard/trainer" element={<TrainerDashboard />} />
        </Routes>
      </BrowserRouter>
    </AccessTokenWrapper>
    
  );
}
