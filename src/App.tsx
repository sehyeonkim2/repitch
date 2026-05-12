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
import StudioPage from "./pages/StudioPage";
import InfluencerChatList from "./pages/InfluencerChatList";
import InfluencerChatRoom from "./pages/InfluencerChatRoom";
import InfluencerProfile from "./pages/InfluencerProfile";
import EnterpriseDashboard from "./pages/EnterpriseDashboard";
import EnterpriseAdDetail from "./pages/EnterpriseAdDetail";
import EnterpriseProfile from "./pages/EnterpriseProfile";
import StartupHome from "./pages/StartupHome";
import StartupProductUpload from "./pages/StartupProductUpload";
import StartupInbox from "./pages/StartupInbox";
import StartupInboxDetail from "./pages/StartupInboxDetail";
import StartupChatList from "./pages/StartupChatList";
import StartupChatRoom from "./pages/StartupChatRoom";
import StartupProfile from "./pages/StartupProfile";
import StartupProductList from "./pages/StartupProductList";

function App() {
  return (
    <AppProvider>
      <Router>
        <MobileShell>
          <Routes>
            <Route path="/" element={<RoleSelect />} />

            {/* Influencer */}
            <Route path="/influencer/auth" element={<AuthDashboard />} />
            <Route path="/influencer/proposal" element={<ProposalGenerator />} />
            <Route path="/influencer/proposal/sent/:id" element={<ProposalSent />} />
            <Route path="/influencer/samples" element={<SamplesPage />} />
            <Route path="/influencer/samples/:id" element={<SampleDetail />} />
            <Route path="/influencer/studio" element={<StudioPage />} />
            <Route path="/influencer/chat" element={<InfluencerChatList />} />
            <Route path="/influencer/chat/:id" element={<InfluencerChatRoom />} />
            <Route path="/influencer/profile" element={<InfluencerProfile />} />

            {/* Enterprise / Brand */}
            <Route path="/brand/matching" element={<MatchingDashboard />} />
            <Route path="/brand/inbox/:id" element={<BrandInbox />} />
            <Route path="/brand/campaign/:id" element={<CampaignDashboard />} />
            <Route path="/brand/chat" element={<ChatList />} />
            <Route path="/brand/chat/:id" element={<ChatRoom />} />
            <Route path="/brand/dashboard" element={<EnterpriseDashboard />} />
            <Route path="/brand/ad/:id" element={<EnterpriseAdDetail />} />
            <Route path="/brand/profile" element={<EnterpriseProfile />} />

            {/* Startup */}
            <Route path="/startup/home" element={<StartupHome />} />
            <Route path="/startup/upload" element={<StartupProductUpload />} />
            <Route path="/startup/inbox" element={<StartupInbox />} />
            <Route path="/startup/inbox/:id" element={<StartupInboxDetail />} />
            <Route path="/startup/chat" element={<StartupChatList />} />
            <Route path="/startup/chat/:id" element={<StartupChatRoom />} />
            <Route path="/startup/products" element={<StartupProductList />} />
            <Route path="/startup/profile" element={<StartupProfile />} />
          </Routes>
        </MobileShell>
      </Router>
    </AppProvider>
  );
}

export default App;
