import { useState } from 'react'
import { FLIGHTS } from '../data/db'
import { useTravel } from '../context/TravelContext'
import { useAuth } from '../context/AuthContext'

const CLS=[{v:'economy',l:'Эконом',m:1},{v:'business',l:'Бизнес',m:1.8},{v:'first',l:'Биринчи',m:3}]

export default function Flights(){
  const {addBook}=useTravel()
  const {user}=useAuth()
  const [from,setFrom]=useState('')
  const [to,setTo]=useState('')
  const [modal,setModal]=useState(null)
  const [f,setF]=useState({date:'',pax:1,cls:'economy'})
  const [toast,setToast]=useState('')

  const filtered=FLIGHTS.filter(fl=>
    (!from||fl.from.toLowerCase().includes(from.toLowerCase()))&&
    (!to||fl.to.toLowerCase().includes(to.toLowerCase()))
  )

  function book(e){
    e.preventDefault()
    const mul=CLS.find(c=>c.v===f.cls)?.m||1
    const pp=Math.round(modal.price*mul)
    const b=addBook({type:'flight',airline:modal.al,
      from:modal.from,fromCode:modal.fC,to:modal.to,toCode:modal.tC,
      dep:modal.dep,arr:modal.arr,dur:modal.dur,
      date:f.date,pax:f.pax,cls:f.cls,pricePerPerson:pp,totalPrice:pp*f.pax,passengerName:user?.name})
    setModal(null); setF({date:'',pax:1,cls:'economy'})
    setToast(`✅ Билет брондолду! Код: ${b.code}`)
    setTimeout(()=>setToast(''),4000)
  }

  return(
    <div className="max-w-5xl mx-auto au">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-800" style={{fontFamily:"'Playfair Display',serif"}}>Авиабилеттер</h1>
        <p className="text-slate-400 text-sm mt-0.5">Учуу бронолоңуз</p>
      </div>
      {toast&&<div className="flex items-center gap-3 p-4 mb-4 bg-green-50 border border-green-200 rounded-2xl as"><p className="text-green-700 font-bold text-sm flex-1">{toast}</p><button onClick={()=>setToast('')} className="text-green-500">✕</button></div>}

      <div className="card p-4 mb-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2">🛫</span>
          <input list="fl-f" value={from} onChange={e=>setFrom(e.target.value)} placeholder="Кайдан..." className="inp pl-9"/>
          <datalist id="fl-f">{[...new Set(FLIGHTS.map(f=>f.from))].map(c=><option key={c} value={c}/>)}</datalist>
        </div>
        <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2">🛬</span>
          <input list="fl-t" value={to} onChange={e=>setTo(e.target.value)} placeholder="Кайда..." className="inp pl-9"/>
          <datalist id="fl-t">{[...new Set(FLIGHTS.map(f=>f.to))].map(c=><option key={c} value={c}/>)}</datalist>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((fl,i)=>(
          <div key={fl.id} className={`card hover-lift p-5 au`} style={{animationDelay:`${i*50}ms`}}>
            <div className="flex items-center gap-3">
              <div className="text-center min-w-max">
                <p className="text-2xl font-bold text-slate-800">{fl.dep}</p>
                <p className="text-sm font-bold text-blue-600">{fl.fC}</p>
                <p className="text-xs text-slate-400">{fl.from}</p>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <p className="text-xs text-slate-400 mb-1">{fl.dur}</p>
                <div className="flex items-center w-full gap-1">
                  <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-blue-400"/>
                  <div className="w-7 h-7 bg-blue-50 border-2 border-blue-200 rounded-full flex items-center justify-center text-sm">✈️</div>
                  <div className="flex-1 h-px bg-gradient-to-r from-blue-400 to-blue-200"/>
                </div>
                <p className="text-xs text-blue-600 font-bold mt-1">{fl.al}</p>
              </div>
              <div className="text-center min-w-max">
                <p className="text-2xl font-bold text-slate-800">{fl.arr}</p>
                <p className="text-sm font-bold text-blue-600">{fl.tC}</p>
                <p className="text-xs text-slate-400">{fl.to}</p>
              </div>
              <div className="text-right ml-2 pl-4 border-l border-slate-100 min-w-max">
                <p className="text-2xl font-bold text-blue-700">${fl.price}</p>
                <p className="text-xs text-slate-400">1 жолоочу</p>
                <p className={`text-xs font-bold mt-0.5 ${fl.seats<=5?'text-red-500':'text-green-600'}`}>
                  {fl.seats<=5?`⚠️ ${fl.seats} орун`:`✓ ${fl.seats} орун`}
                </p>
                <button onClick={()=>setModal(fl)} className="btn-blue text-xs py-1.5 px-4 mt-2">Брондоо</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length===0&&<div className="card text-center py-12"><div className="text-5xl opacity-30 mb-3">✈️</div><p className="text-slate-400">Учуулар табылган жок</p></div>}
      </div>

      {modal&&(
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 ai">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md as">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-800" style={{fontFamily:"'Playfair Display',serif"}}>✈️ Билет брондоо</h3>
                <p className="text-slate-400 text-sm">{modal.from} → {modal.to}</p>
              </div>
              <button onClick={()=>setModal(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500">✕</button>
            </div>
            <form onSubmit={book} className="p-6 space-y-4">
              <div><label className="lbl">Учуу датасы</label><input type="date" required value={f.date} onChange={e=>setF({...f,date:e.target.value})} min={new Date().toISOString().split('T')[0]} className="inp"/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="lbl">Жолоочулар</label><input type="number" min="1" max={modal.seats} value={f.pax} onChange={e=>setF({...f,pax:+e.target.value})} className="inp"/></div>
                <div><label className="lbl">Класс</label>
                  <select value={f.cls} onChange={e=>setF({...f,cls:e.target.value})} className="inp">
                    {CLS.map(c=><option key={c.v} value={c.v}>{c.l}</option>)}
                  </select>
                </div>
              </div>
              {(()=>{
                const mul=CLS.find(c=>c.v===f.cls)?.m||1
                const pp=Math.round(modal.price*mul)
                return(
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 space-y-2">
                    <div className="flex justify-between text-sm text-slate-600"><span>${pp} × {f.pax} жолоочу{f.cls!=='economy'&&<span className="text-blue-500 ml-1">(×{mul})</span>}</span></div>
                    <div className="flex justify-between border-t border-blue-200 pt-2">
                      <span className="font-bold text-slate-700">Жалпы</span>
                      <span className="text-xl font-bold text-blue-700">${pp*f.pax}</span>
                    </div>
                  </div>
                )
              })()}
              <div className="flex gap-3">
                <button type="button" onClick={()=>setModal(null)} className="btn-gray flex-1">Жок кылуу</button>
                <button type="submit" className="btn-blue flex-1">Брондоо</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
