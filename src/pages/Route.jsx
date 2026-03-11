// Route.jsx
import { useState } from 'react'
import { useTravel } from '../context/TravelContext'
import { CITIES } from '../data/db'

const TR=['✈️ Учак','🚂 Поезд','🚌 Автобус','🚗 Машина','🚢 Кеме']
function days(a,b){if(!a||!b)return 0;return Math.max(0,Math.ceil((new Date(b)-new Date(a))/86400000))}

export function Route(){
  const {addTrip}=useTravel()
  const [stops,setSt]=useState([{id:1,city:'',arrive:'',depart:'',tr:'✈️ Учак',note:''}])
  const [saved,setSaved]=useState(false)

  const add=()=>setSt([...stops,{id:Date.now(),city:'',arrive:'',depart:'',tr:'✈️ Учак',note:''}])
  const rem=id=>stops.length>1&&setSt(stops.filter(s=>s.id!==id))
  const upd=(id,k,v)=>setSt(stops.map(s=>s.id===id?{...s,[k]:v}:s))

  function save(){
    if(!stops.some(s=>s.city))return
    addTrip({
      destination:stops.map(s=>s.city).filter(Boolean).join(' → '),
      startDate:stops[0].arrive,
      endDate:stops[stops.length-1].depart||stops[stops.length-1].arrive,
      notes:`Маршрут: ${stops.filter(s=>s.city).map(s=>s.city).join(' → ')}`,
    })
    setSaved(true); setTimeout(()=>setSaved(false),3000)
  }

  const valid=stops.filter(s=>s.city)
  const total=stops.reduce((s,st)=>s+days(st.arrive,st.depart),0)

  return(
    <div className="max-w-4xl mx-auto au">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-800" style={{fontFamily:"'Playfair Display',serif"}}>Маршрут Пландаштыруу</h1>
        <p className="text-slate-400 text-sm mt-0.5">Аялдамаларды кадамма-кадам кошуңуз</p>
      </div>
      {saved&&<div className="flex gap-3 p-4 mb-5 bg-green-50 border border-green-200 rounded-2xl as"><span>✅</span><p className="text-green-700 font-bold text-sm">Маршрут сапарларга сакталды!</p></div>}

      {valid.length>0&&(
        <div className="card p-5 mb-5">
          <p className="lbl mb-3">Маршрут картасы</p>
          <div className="flex items-end flex-wrap gap-3">
            {valid.map((s,i)=>(
              <div key={s.id} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-9 h-9 rounded-full text-white text-xs font-bold flex items-center justify-center"
                       style={{background:`hsl(${200+i*35},70%,45%)`}}>{i+1}</div>
                  <span className="text-xs font-bold text-slate-700 max-w-16 truncate text-center">{s.city}</span>
                  {days(s.arrive,s.depart)>0&&<span className="text-xs text-blue-500">{days(s.arrive,s.depart)}к</span>}
                </div>
                {i<valid.length-1&&<div className="flex items-center gap-1 pb-6"><div className="w-6 h-0.5 bg-slate-200"/><span>{s.tr.split(' ')[0]}</span><div className="w-6 h-0.5 bg-slate-200"/></div>}
              </div>
            ))}
          </div>
          {total>0&&<p className="text-sm text-blue-700 font-bold mt-3">⏱ Жалпы: {total} күн</p>}
        </div>
      )}

      <div className="space-y-3">
        {stops.map((st,idx)=>(
          <div key={st.id} className="card overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100 bg-slate-50">
              <div className="w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center"
                   style={{background:'linear-gradient(135deg,#0369a1,#0284c7)'}}>{idx+1}</div>
              <span className="font-bold text-slate-700 text-sm">
                {idx===0?'🛫 Жолго чыгуу':idx===stops.length-1?'🛬 Жетиш':`📍 ${idx+1}-аялдама`}
              </span>
              {stops.length>1&&<button onClick={()=>rem(st.id)} className="ml-auto w-6 h-6 rounded-full hover:bg-red-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors text-xs">✕</button>}
            </div>
            <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <label className="lbl">Шаар</label>
                <input list={`d${st.id}`} value={st.city} onChange={e=>upd(st.id,'city',e.target.value)} placeholder="Шаарды тандаңыз..." className="inp"/>
                <datalist id={`d${st.id}`}>{CITIES.map(c=><option key={c} value={c}/>)}</datalist>
              </div>
              <div><label className="lbl">Келиш</label><input type="date" value={st.arrive} onChange={e=>upd(st.id,'arrive',e.target.value)} className="inp text-xs"/></div>
              <div><label className="lbl">Кетиш</label><input type="date" value={st.depart} onChange={e=>upd(st.id,'depart',e.target.value)} className="inp text-xs"/></div>
              <div>
                <label className="lbl">Транспорт</label>
                <select value={st.tr} onChange={e=>upd(st.id,'tr',e.target.value)} className="inp text-xs">
                  {TR.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="lbl">Эскертме</label>
                <input type="text" value={st.note} onChange={e=>upd(st.id,'note',e.target.value)} placeholder="Билет №, трансфер..." className="inp text-xs"/>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-5">
        <button onClick={add} className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-dashed border-blue-300 hover:border-blue-500 text-blue-600 text-sm font-bold rounded-xl transition-all">+ Аялдама</button>
        <button onClick={save} disabled={!stops.some(s=>s.city)} className="btn-blue disabled:opacity-50">✓ Сапарга сактоо</button>
      </div>
      <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
        <p className="text-sm font-bold text-amber-800 mb-1.5">💡 Кеңештер</p>
        <ul className="text-xs text-amber-700 space-y-1">
          <li>→ Ар бир шаарда кеминде 2–3 күн болуу сунушталат</li>
          <li>→ Виза талаптарын алдын ала текшериңиз</li>
          <li>→ Трансфер убакытын маршрутка кошуп эсептеңиз</li>
        </ul>
      </div>
    </div>
  )
}
