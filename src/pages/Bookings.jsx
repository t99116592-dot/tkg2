import { useState } from 'react'
import { useTravel } from '../context/TravelContext'

export default function Bookings(){
  const {bookings,cancelBook}=useTravel()
  const [tab,setTab]=useState('all')
  const [del,setDel]=useState(null)

  const confirmed=bookings.filter(b=>b.status==='confirmed')
  const spent=confirmed.reduce((s,b)=>s+(b.totalPrice||0),0)

  const list=tab==='all'?bookings
    :tab==='flights'?bookings.filter(b=>b.type==='flight')
    :tab==='hotels'?bookings.filter(b=>b.type==='hotel')
    :bookings.filter(b=>b.status===tab)

  return(
    <div className="max-w-5xl mx-auto au">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-800" style={{fontFamily:"'Playfair Display',serif"}}>Брондоолорум</h1>
        <p className="text-slate-400 text-sm mt-0.5">Бардык броно маалыматтары</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          {ico:'🎫',v:bookings.length,      l:'Жалпы',     c:'#0369a1'},
          {ico:'✅', v:confirmed.length,     l:'Ырасталган', c:'#059669'},
          {ico:'✈️', v:bookings.filter(b=>b.type==='flight').length, l:'Учуулар', c:'#7c3aed'},
          {ico:'💰', v:`$${spent}`,          l:'Чыгым',     c:'#d97706'},
        ].map((s,i)=>(
          <div key={i} className={`card p-4 text-center au d${i+1}`}>
            <div className="text-2xl mb-1">{s.ico}</div>
            <div className="text-xl font-bold" style={{color:s.c}}>{s.v}</div>
            <div className="text-xs text-slate-400">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {[['all',`Баары(${bookings.length})`],['flights','✈️ Учуулар'],['hotels','🏨 Отелдер'],['confirmed','✅ Ырасталган'],['cancelled','❌ Жокко чыгарылган']].map(([v,l])=>(
          <button key={v} onClick={()=>setTab(v)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all
                         ${tab===v?'text-white':'bg-white text-slate-500 border border-slate-200 hover:border-blue-300'}`}
            style={tab===v?{background:'linear-gradient(135deg,#0369a1,#0284c7)'}:{}}>
            {l}
          </button>
        ))}
      </div>

      {del&&(
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 ai">
          <div className="bg-white rounded-3xl p-7 w-full max-w-sm text-center shadow-2xl as">
            <div className="text-5xl mb-3">⚠️</div>
            <h3 className="font-bold text-slate-800 text-xl mb-2" style={{fontFamily:"'Playfair Display',serif"}}>Жокко чыгаруу?</h3>
            <p className="text-slate-400 text-sm mb-6">Код: <strong>{del.code}</strong></p>
            <div className="flex gap-3">
              <button onClick={()=>setDel(null)} className="btn-gray flex-1">Кайтуу</button>
              <button onClick={()=>{cancelBook(del.id);setDel(null)}} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition-colors">Жокко чыгар</button>
            </div>
          </div>
        </div>
      )}

      {list.length===0?(
        <div className="card text-center py-16">
          <div className="text-6xl opacity-30 mb-4">🎫</div>
          <h3 className="font-bold text-slate-600 text-xl mb-2" style={{fontFamily:"'Playfair Display',serif"}}>Броно жок</h3>
          <p className="text-slate-400 text-sm">Учуу же отель бронолоңуз</p>
        </div>
      ):(
        <div className="space-y-3">
          {list.map((b,i)=>(
            <div key={b.id} className={`card hover-lift overflow-hidden au ${b.status==='cancelled'?'opacity-60':''}`} style={{animationDelay:`${i*40}ms`}}>
              <div className="flex items-stretch">
                <div className="w-1.5 flex-shrink-0" style={{background:b.type==='flight'?'linear-gradient(#0369a1,#38bdf8)':'linear-gradient(#d97706,#fbbf24)'}}/>
                <div className="flex-1 p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${b.type==='flight'?'bg-blue-50':'bg-amber-50'}`}>
                      {b.type==='flight'?'✈️':'🏨'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-slate-800 text-base" style={{fontFamily:"'Playfair Display',serif"}}>
                          {b.type==='flight'?`${b.from} → ${b.to}`:b.hotelName}
                        </h3>
                        <span className={`badge text-xs ${b.status==='confirmed'?'bg-green-50 text-green-600':'bg-red-50 text-red-500'}`}>
                          {b.status==='confirmed'?'✅ Ырасталган':'❌ Жокко чыгарылган'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                        {b.type==='flight'
                          ?<><span>📅 {b.date}</span><span>🕐 {b.dep}–{b.arr}</span><span>👥 {b.pax} жолоочу</span><span>💺 {b.cls==='economy'?'Эконом':b.cls==='business'?'Бизнес':'Биринчи'}</span></>
                          :<><span>📅 {b.checkIn}–{b.checkOut}</span><span>🌙 {b.nights} түн</span><span>👥 {b.guests} кишт</span><span>📍 {b.city}</span></>
                        }
                      </div>
                      <span className="badge bg-slate-100 text-slate-500 text-xs mt-2">#{b.code}</span>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-xl font-bold" style={{color:b.status==='cancelled'?'#9ca3af':'#0369a1'}}>${b.totalPrice}</p>
                      {b.status==='confirmed'&&<button onClick={()=>setDel(b)} className="text-xs text-red-400 hover:text-red-600 hover:underline mt-1 block">Жокко чыгаруу</button>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {spent>0&&(
        <div className="card p-5 mt-5 flex justify-between items-center">
          <div>
            <p className="font-bold text-slate-700" style={{fontFamily:"'Playfair Display',serif"}}>Жалпы чыгым</p>
            <p className="text-slate-400 text-sm">{confirmed.length} ырасталган броно</p>
          </div>
          <p className="text-3xl font-bold text-blue-700">${spent}</p>
        </div>
      )}
    </div>
  )
}
