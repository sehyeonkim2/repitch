import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./state/AppContext";
import AuthDashboard from "./pages/AuthDashboard";
import MatchingDashboard from "./pages/MatchingDashboard";
import ProposalGenerator from "./pages/ProposalGenerator";
import ProposalSent from "./pages/ProposalSent";
import BrandInbox from "./pages/BrandInbox";

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AuthDashboard />} />
          <Route path="/matching" element={<MatchingDashboard />} />
          <Route path="/proposal" element={<ProposalGenerator />} />
          <Route path="/proposal/sent/:id" element={<ProposalSent />} />
          <Route path="/brand/inbox/:id" element={<BrandInbox />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
