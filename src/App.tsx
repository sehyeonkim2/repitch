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
          </Routes>
        </MobileShell>
      </Router>
    </AppProvider>
  );
}

export default App;
