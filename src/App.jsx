import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { TravelProvider } from './context/TravelContext'
import Layout from './components/Layout'
import Login    from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Trips    from './pages/Trips'
import { Route as RoutePage } from './pages/Route'
import Baggage  from './pages/Baggage'
import Hotels   from './pages/Hotels'
import Flights  from './pages/Flights'
import Bookings from './pages/Bookings'

function Guard({ children }) {
  const { user, ready } = useAuth()
  if (!ready) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'linear-gradient(135deg,#0c4a6e,#0369a1)'}}>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full sp mx-auto mb-3"/>
        <p className="text-white/70 text-sm">Жүктөлүүдө...</p>
      </div>
    </div>
  )
  return user ? children : <Navigate to="/login" replace/>
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login"    element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/*" element={
            <Guard>
              <TravelProvider>
                <Layout>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                    <Route path="/trips"     element={<Trips/>}/>
                    <Route path="/route"     element={<RoutePage/>}/>
                    <Route path="/baggage"   element={<Baggage/>}/>
                    <Route path="/hotels"    element={<Hotels/>}/>
                    <Route path="/flights"   element={<Flights/>}/>
                    <Route path="/bookings"  element={<Bookings/>}/>
                    <Route path="*"          element={<Navigate to="/dashboard" replace/>}/>
                  </Routes>
                </Layout>
              </TravelProvider>
            </Guard>
          }/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
