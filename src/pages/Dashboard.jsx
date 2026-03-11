import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTravel } from '../context/TravelContext'

function days(a,b){if(!a||!b)return 0;return Math.max(0,Math.ceil((new Date(b)-new Date(a))/86400000))}
function fmt(d){if(!d)return '—';return new Date(d).toLocaleDateString('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric'})}

const QUICK=[
  {to:'/trips',   ico:'➕',l:'Сапар кошуу',bg:'#eff6ff',fg:'#1d4ed8'},
  {to:'/route',   ico:'📍',l:'Маршрут',    bg:'#f0fdf4',fg:'#15803d'},
  {to:'/baggage', ico:'🧳',l:'Багаж',      bg:'#faf5ff',fg:'#7c3aed'},
  {to:'/flights', ico:'✈️',l:'Учуулар',    bg:'#fff7ed',fg:'#c2410c'},
  {to:'/hotels',  ico:'🏨',l:'Отелдер',    bg:'#fdf2f8',fg:'#9d174d'},
  {to:'/bookings',ico:'🎫',l:'Брондоолор', bg:'#ecfeff',fg:'#0e7490'},
]

export default function Dashboard() {
  const { user } = useAuth()
  const { trips, bookings, totalKg } = useTravel()

  const planned   = trips.filter(t=>t.status==='planned').length
  const confirmed = bookings.filter(b=>b.status==='confirmed').length
  const next = [...trips].filter(t=>t.startDate&&new Date(t.startDate)>=new Date())
                .sort((a,b)=>new Date(a.startDate)-new Date(b.startDate))[0]

  const h = new Date().getHours()
  const greet = h<12?'Кут болсун таң':h<18?'Кут болсун күн':'Кут болсун кеч'

  return (
    <div className="max-w-5xl mx-auto space-y-5 au">
      {/* Hero */}
      <div className="rounded-3xl p-7 relative overflow-hidden" style={{background:'linear-gradient(135deg,#0c4a6e,#0369a1,#0284c7)'}}>
        <div className="absolute inset-0 opacity-10 pointer-events-none"
             style={{backgroundImage:'radial-gradient(circle,white 1px,transparent 1px)',backgroundSize:'28px 28px'}}/>
        <div className="absolute -right-4 -top-4 text-9xl opacity-10 select-none pointer-events-none">✈️</div>
        <div className="relative">
          <p className="text-blue-200 text-sm">{greet},</p>
          <h1 className="text-3xl font-bold text-white mt-0.5 mb-2" style={{fontFamily:"'Playfair Display',serif"}}>{user?.name}!</h1>
          <p className="text-blue-100 text-sm mb-4">
            {planned>0?`${planned} сапар пландалган — жолуңуз болсун 🌟`:'Жаңы саякатты пландаштыра баштаңыз 🌍'}
          </p>
          {next&&(
            <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur rounded-2xl px-4 py-2.5">
              <span className="text-xl">🗓️</span>
              <div>
                <div className="text-blue-200 text-xs">Кийинки сапар</div>
                <div className="text-white font-semibold text-sm">
                  {next.destination} · {fmt(next.startDate)}{next.endDate&&` · ${days(next.startDate,next.endDate)} күн`}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {ico:'🗺️',v:trips.length,      l:'Жалпы сапарлар',c:'#0369a1',to:'/trips'},
          {ico:'✅', v:planned,            l:'Пландалган',    c:'#059669',to:'/trips'},
          {ico:'🎫', v:confirmed,          l:'Брондоолор',    c:'#d97706',to:'/bookings'},
          {ico:'🧳', v:`${totalKg} кг`,   l:'Багаж',         c:'#7c3aed',to:'/baggage'},
        ].map((s,i)=>(
          <Link key={i} to={s.to}
            className={`card hover-lift p-5 block au d${i+1}`}>
            <span className="text-2xl">{s.ico}</span>
            <div className="text-2xl font-bold mt-3" style={{color:s.c}}>{s.v}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.l}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Recent trips */}
        <div className="md:col-span-3 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800" style={{fontFamily:"'Playfair Display',serif"}}>Акыркы сапарлар</h3>
            <Link to="/trips" className="text-xs text-blue-600 font-bold hover:underline">Баары →</Link>
          </div>
          {trips.length===0?(
            <div className="text-center py-10">
              <div className="text-5xl opacity-30 mb-3">🗺️</div>
              <p className="text-slate-400 text-sm mb-4">Сапарлар жок</p>
              <Link to="/trips" className="btn-blue text-xs py-2 px-4">Сапар кошуу</Link>
            </div>
          ):(
            <div className="space-y-2">
              {trips.slice(0,5).map((t,i)=>(
                <div key={t.id} className={`flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors au d${i+1}`}>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center text-xl flex-shrink-0">🌍</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-800 truncate">{t.destination}</p>
                    <p className="text-xs text-slate-400">{fmt(t.startDate)}{t.endDate&&` · ${days(t.startDate,t.endDate)} күн`}</p>
                  </div>
                  <span className={`badge ${t.status==='planned'?'bg-blue-50 text-blue-600':t.status==='active'?'bg-green-50 text-green-600':'bg-slate-100 text-slate-500'}`}>
                    {t.status==='planned'?'Планда':t.status==='active'?'Активдүү':'Аяктады'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="md:col-span-2 card p-5">
          <h3 className="font-bold text-slate-800 mb-4" style={{fontFamily:"'Playfair Display',serif"}}>Тез кирүү</h3>
          <div className="grid grid-cols-2 gap-2">
            {QUICK.map(q=>(
              <Link key={q.to} to={q.to}
                className="flex flex-col items-center gap-1.5 p-3.5 rounded-xl transition-all hover:scale-105 active:scale-95"
                style={{background:q.bg}}>
                <span className="text-2xl">{q.ico}</span>
                <span className="text-xs font-bold text-center" style={{color:q.fg}}>{q.l}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
