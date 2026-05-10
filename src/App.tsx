import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./state/AppContext";
import { MobileShell } from "./components/MobileShell";
import RoleSelect from "./pages/RoleSelect";
import AuthDashboard from "./pages/AuthDashboard";
import MatchingDashboard from "./pages/MatchingDashboard";
import ProposalGenerator from "./pages/ProposalGenerator";
import ProposalSent from "./pages/ProposalSent";
import BrandInbox from "./pages/BrandInbox";
import CampaignDashboard from "./pages/CampaignDashboard";
import ChatList from "./pages/ChatList";
import ChatRoom from "./pages/ChatRoom";
import SamplesPage from "./pages/SamplesPage";
import SampleDetail from "./pages/SampleDetail";
import StartupHome from "./pages/StartupHome";
import StartupProductUpload from "./pages/StartupProductUpload";
import StartupInbox from "./pages/StartupInbox";
import StartupSendProposal from "./pages/StartupSendProposal";

function App() {
  return (
    <AppProvider>
      <Router>
        <MobileShell>
          <Routes>
            <Route path="/" element={<RoleSelect />} />
            <Route path="/influencer/auth" element={<AuthDashboard />} />
            <Route path="/influencer/proposal" element={<ProposalGenerator />} />
            <Route path="/influencer/proposal/sent/:id" element={<ProposalSent />} />
            <Route path="/brand/matching" element={<MatchingDashboard />} />
            <Route path="/brand/inbox/:id" element={<BrandInbox />} />
            <Route path="/brand/campaign/:id" element={<CampaignDashboard />} />
            <Route path="/brand/chat" element={<ChatList />} />
            <Route path="/brand/chat/:id" element={<ChatRoom />} />
            <Route path="/influencer/samples" element={<SamplesPage />} />
            <Route path="/influencer/samples/:id" element={<SampleDetail />} />
            <Route path="/brand/startup" element={<StartupHome />} />
            <Route path="/brand/startup/upload" element={<StartupProductUpload />} />
            <Route path="/brand/startup/inbox" element={<StartupInbox />} />
            <Route path="/brand/startup/send" element={<StartupSendProposal />} />
          </Routes>
        </MobileShell>
      </Router>
    </AppProvider>
  );
}

export default App;
