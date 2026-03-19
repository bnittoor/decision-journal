import { Navigate, Route, Routes } from 'react-router-dom'
import AddDecision from './pages/AddDecision'
import Dashboard from './pages/Dashboard'
import DecisionDetail from './pages/DecisionDetail'
import TopNav from './components/TopNav'

export default function App() {
  return (
    <div className="dj-app">
      <TopNav />
      <main className="dj-page">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddDecision />} />
          <Route path="/decisions/:id" element={<DecisionDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
