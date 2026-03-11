import { useState } from 'react'
import { HOTELS } from '../data/db'
import { useTravel } from '../context/TravelContext'
import { useAuth } from '../context/AuthContext'

function days(a,b){if(!a||!b)return 0;return Math.max(0,Math.ceil((new Date(b)-new Date(a))/86400000))}

export default function Hotels(){
  const {addBook}=useTravel()
  const {user}=useAuth()
  const [search,setSearch]=useState('')
  const [city,setCity]=useState('all')
  const [stars,setStars]=useState(0)
  const [modal,setModal]=useState(null)
  const [f,setF]=useState({in:'',out:'',guests:1})
  const [toast,setToast]=useState('')

  const cities=['all',...new Set(HOTELS.map(h=>h.city))]
  const filtered=HOTELS.filter(h=>
    (!search||h.name.toLowerCase().includes(search.toLowerCase())||h.city.toLowerCase().includes(search.toLowerCase()))&&
    (city==='all'||h.city===city)&&(stars===0||h.stars>=stars)
  )
  const nights=days(f.in,f.out)

  function book(e){
    e.preventDefault(); if(nights<=0)return
    const b=addBook({type:'hotel',hotelName:modal.name,city:modal.city,stars:modal.stars,
      checkIn:f.in,checkOut:f.out,guests:f.guests,nights,pricePerNight:modal.price,
      totalPrice:modal.price*nights,guestName:user?.name})
    setModal(null); setF({in:'',out:'',guests:1})
    setToast(`✅ Броно ийгиликтүү! Код: ${b.code}`)
    setTimeout(()=>setToast(''),4000)
  }

  return(
    <div className="max-w-5xl mx-auto au">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-800" style={{fontFamily:"'Playfair Display',serif"}}>Отелдер</h1>
        <p className="text-slate-400 text-sm mt-0.5">Жайгашуу орун бронолоңуз</p>
      </div>
      {toast&&<div className="flex items-center gap-3 p-4 mb-4 bg-green-50 border border-green-200 rounded-2xl as"><p className="text-green-700 font-bold text-sm flex-1">{toast}</p><button onClick={()=>setToast('')} className="text-green-500">✕</button></div>}

      <div className="card p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Отель же шаар..." className="inp pl-9"/>
        </div>
        <select value={city} onChange={e=>setCity(e.target.value)} className="inp sm:w-44">
          {cities.map(c=><option key={c} value={c}>{c==='all'?'Бардык шаарлар':c}</option>)}
        </select>
        <select value={stars} onChange={e=>setStars(+e.target.value)} className="inp sm:w-36">
          <option value={0}>Баары ⭐</option>
          <option value={3}>3+ ⭐</option>
          <option value={4}>4+ ⭐</option>
          <option value={5}>5 ⭐⭐⭐⭐⭐</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((h,i)=>(
          <div key={h.id} className={`card hover-lift overflow-hidden au`} style={{animationDelay:`${i*50}ms`}}>
            <div className="h-28 flex items-center justify-center text-6xl" style={{background:'linear-gradient(135deg,#e0f2fe,#bae6fd)'}}>{h.ico}</div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-slate-800" style={{fontFamily:"'Playfair Display',serif"}}>{h.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">📍 {h.city}</p>
                </div>
                <div className="text-right ml-2 flex-shrink-0">
                  <p className="text-yellow-400 text-xs">{'⭐'.repeat(h.stars)}</p>
                  <p className="text-xs text-slate-400">{h.rating}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {h.am.slice(0,4).map(a=><span key={a} className="badge bg-sky-50 text-sky-600 border border-sky-100">{a}</span>)}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div><span className="text-2xl font-bold text-blue-700">${h.price}</span><span className="text-xs text-slate-400">/түн</span></div>
                <button onClick={()=>setModal(h)} className="btn-blue text-xs py-2 px-4">Брондоо</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length===0&&<div className="card text-center py-12"><div className="text-5xl opacity-30 mb-3">🏨</div><p className="text-slate-400">Отель табылган жок</p></div>}

      {modal&&(
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 ai">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md as">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-800" style={{fontFamily:"'Playfair Display',serif"}}>🏨 Броно жасоо</h3>
                <p className="text-slate-400 text-sm">{modal.name}, {modal.city}</p>
              </div>
              <button onClick={()=>setModal(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500">✕</button>
            </div>
            <form onSubmit={book} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="lbl">Келиш</label><input type="date" required value={f.in} onChange={e=>setF({...f,in:e.target.value})} min={new Date().toISOString().split('T')[0]} className="inp text-sm"/></div>
                <div><label className="lbl">Кетиш</label><input type="date" required value={f.out} onChange={e=>setF({...f,out:e.target.value})} min={f.in||new Date().toISOString().split('T')[0]} className="inp text-sm"/></div>
              </div>
              <div><label className="lbl">Жолоочулар</label><input type="number" min="1" max="10" value={f.guests} onChange={e=>setF({...f,guests:+e.target.value})} className="inp"/></div>
              {nights>0&&(
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 space-y-2">
                  <div className="flex justify-between text-sm text-slate-600"><span>${modal.price} × {nights} түн</span></div>
                  <div className="flex justify-between border-t border-blue-200 pt-2">
                    <span className="font-bold text-slate-700">Жалпы</span>
                    <span className="text-xl font-bold text-blue-700">${modal.price*nights}</span>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={()=>setModal(null)} className="btn-gray flex-1">Жок кылуу</button>
                <button type="submit" disabled={nights<=0} className="btn-blue flex-1 disabled:opacity-50">Брондоо</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
