import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import CandidateOnboarding from "./pages/CandidateOnboarding"
import ClientOnboarding from "./pages/ClientOnboarding"
import EventFeed from "./pages/EventFeed"
import CheckIn from "./components/CheckIn"
import ClientDashboard from "./pages/ClientDashboard"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/onboarding/candidate" element={<CandidateOnboarding />} />
        <Route path="/onboarding/client" element={<ClientOnboarding />} />
        <Route path="/feed" element={<EventFeed />} />
        <Route path="/check-in" element={<CheckIn />} />
        <Route path="/dashboard" element={<ClientDashboard />} />
        {/* We will add Admin routes here */}
      </Routes>
    </Router>
  )
}

export default App
