import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTravel } from '../context/TravelContext'

const NAV = [
  {to:'/dashboard',icon:'🏠',l:'Башкы бет'},
  {to:'/trips',    icon:'🗺️',l:'Сапарларым'},
  {to:'/route',    icon:'📍',l:'Маршрут'},
  {to:'/baggage',  icon:'🧳',l:'Багаж'},
  {to:'/flights',  icon:'✈️',l:'Учуулар'},
  {to:'/hotels',   icon:'🏨',l:'Отелдер'},
  {to:'/bookings', icon:'🎫',l:'Брондоолор'},
]

export default function Layout({ children }) {
  const nav = useNavigate()
  const { user, logout } = useAuth()
  const { trips, bookings } = useTravel()
  const [open, setOpen] = useState(false)
  const confirmed = bookings.filter(b=>b.status==='confirmed').length

  return (
    <div className="min-h-screen flex">
      {open && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden ai" onClick={()=>setOpen(false)}/>}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200
                         flex flex-col shadow-xl lg:shadow-none transition-transform duration-300
                         ${open?'translate-x-0':'-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-5" style={{background:'linear-gradient(135deg,#0c4a6e,#0369a1)'}}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">✈️</div>
            <div>
              <div className="text-white font-bold text-xl" style={{fontFamily:"'Playfair Display',serif"}}>TravelKG</div>
              <div className="text-blue-200 text-xs">Саякат Пландаштыргыч</div>
            </div>
          </div>
        </div>

        {/* User */}
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                 style={{background:'linear-gradient(135deg,#0369a1,#d97706)'}}>
              {user?.av}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-800 truncate">{user?.name}</div>
              <div className="text-xs text-slate-400 truncate">{user?.email}</div>
            </div>
          </div>
          <div className="flex gap-2 mt-2.5">
            <span className="badge bg-blue-50 text-blue-600">{trips.length} сапар</span>
            <span className="badge bg-green-50 text-green-600">{confirmed} броно</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(n=>(
            <NavLink key={n.to} to={n.to} onClick={()=>setOpen(false)}
              className={({isActive})=>`nav-link${isActive?' active':''}`}>
              <span className="text-base w-5 text-center">{n.icon}</span>
              {n.l}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-100">
          <button onClick={()=>{logout();nav('/login')}}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
                       text-red-400 hover:bg-red-50 hover:text-red-600 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Чыгуу
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 h-14 flex items-center gap-4 px-4 lg:px-6 shadow-sm">
          <button onClick={()=>setOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100">
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <h2 className="flex-1 font-bold text-slate-800 text-lg" style={{fontFamily:"'Playfair Display',serif"}}>TravelKG</h2>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
               style={{background:'linear-gradient(135deg,#0369a1,#d97706)'}}>
            {user?.av}
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
