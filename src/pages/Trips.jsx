import { useState } from 'react'
import { useTravel } from '../context/TravelContext'
import { CITIES } from '../data/db'

const ST={planned:'Пландалган',active:'Активдүү',completed:'Аяктады'}
const SC={planned:'bg-blue-50 text-blue-600',active:'bg-green-50 text-green-600',completed:'bg-slate-100 text-slate-500'}

function days(a,b){if(!a||!b)return 0;return Math.max(0,Math.ceil((new Date(b)-new Date(a))/86400000))}
function fmt(d){if(!d)return '—';return new Date(d).toLocaleDateString('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric'})}

function Modal({trip,onClose,onSave}){
  const [f,setF]=useState(trip?{dest:trip.destination,s:trip.startDate||'',e:trip.endDate||'',budget:trip.budget||'',notes:trip.notes||'',status:trip.status}
    :{dest:'',s:'',e:'',budget:'',notes:'',status:'planned'})
  return(
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 ai">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg as">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-800" style={{fontFamily:"'Playfair Display',serif"}}>
            {trip?'✏️ Өзгөртүү':'➕ Жаңы Сапар'}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500">✕</button>
        </div>
        <form onSubmit={e=>{e.preventDefault();onSave(f)}} className="p-6 space-y-4">
          <div>
            <label className="lbl">Багыт</label>
            <input list="clist" required value={f.dest} onChange={e=>setF({...f,dest:e.target.value})}
              placeholder="Стамбул, Дубай..." className="inp"/>
            <datalist id="clist">{CITIES.map(c=><option key={c} value={c}/>)}</datalist>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="lbl">Башталат</label><input type="date" value={f.s} onChange={e=>setF({...f,s:e.target.value})} className="inp"/></div>
            <div><label className="lbl">Аяктайт</label><input type="date" value={f.e} onChange={e=>setF({...f,e:e.target.value})} className="inp"/></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="lbl">Бюджет ($)</label><input type="number" min="0" value={f.budget} onChange={e=>setF({...f,budget:e.target.value})} placeholder="1000" className="inp"/></div>
            <div>
              <label className="lbl">Статус</label>
              <select value={f.status} onChange={e=>setF({...f,status:e.target.value})} className="inp">
                {Object.entries(ST).map(([v,l])=><option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="lbl">Эскертме</label>
            <textarea rows={2} value={f.notes} onChange={e=>setF({...f,notes:e.target.value})} placeholder="Маалымат..." className="inp resize-none"/>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-gray flex-1">Жок кылуу</button>
            <button type="submit" className="btn-blue flex-1">{trip?'Сактоо':'Кошуу'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Trips(){
  const {trips,addTrip,editTrip,delTrip}=useTravel()
  const [modal,setM]=useState(null)
  const [del,setD]=useState(null)
  const [filter,setF]=useState('all')

  function save(f){
    const d={destination:f.dest,startDate:f.s,endDate:f.e,budget:f.budget,notes:f.notes,status:f.status}
    if(modal==='new')addTrip(d); else editTrip(modal.id,d)
    setM(null)
  }
  const list=filter==='all'?trips:trips.filter(t=>t.status===filter)

  return(
    <div className="max-w-5xl mx-auto au">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800" style={{fontFamily:"'Playfair Display',serif"}}>Менин Сапарларым</h1>
          <p className="text-slate-400 text-sm mt-0.5">{trips.length} сапар</p>
        </div>
        <button onClick={()=>setM('new')} className="btn-blue flex items-center gap-2">+ Сапар кошуу</button>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {[['all','Баары'],...Object.entries(ST)].map(([v,l])=>(
          <button key={v} onClick={()=>setF(v)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all
                        ${filter===v?'text-white':'bg-white text-slate-500 border border-slate-200 hover:border-blue-300'}`}
            style={filter===v?{background:'linear-gradient(135deg,#0369a1,#0284c7)'}:{}}>
            {l}
          </button>
        ))}
      </div>

      {list.length===0?(
        <div className="card text-center py-16">
          <div className="text-6xl opacity-30 mb-4">🗺️</div>
          <h3 className="font-bold text-slate-600 text-xl mb-2" style={{fontFamily:"'Playfair Display',serif"}}>Сапарлар жок</h3>
          <p className="text-slate-400 text-sm mb-5">Жаңы сапарды пландаштыра баштаңыз</p>
          <button onClick={()=>setM('new')} className="btn-blue text-sm py-2 px-6">Сапар кошуу</button>
        </div>
      ):(
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map((t,i)=>{
            const d=days(t.startDate,t.endDate)
            return(
              <div key={t.id} className={`card hover-lift overflow-hidden au d${(i%4)+1}`}>
                <div className="h-1.5" style={{background:'linear-gradient(90deg,#0369a1,#38bdf8)'}}/>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center text-2xl">🌍</div>
                      <div>
                        <div className="font-bold text-slate-800" style={{fontFamily:"'Playfair Display',serif"}}>{t.destination}</div>
                        <span className={`badge text-xs mt-1 ${SC[t.status]}`}>{ST[t.status]}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={()=>setM(t)} className="w-8 h-8 rounded-lg hover:bg-blue-50 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">✏️</button>
                      <button onClick={()=>setD(t)} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">🗑️</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[{l:'Башталат',v:fmt(t.startDate)},{l:'Күн',v:d>0?`${d}к`:'—',a:true},{l:'Бюджет',v:t.budget?`$${t.budget}`:'—'}].map(c=>(
                      <div key={c.l} className="bg-slate-50 rounded-xl p-2.5 text-center">
                        <p className="text-xs text-slate-400">{c.l}</p>
                        <p className={`text-sm font-bold mt-0.5 ${c.a?'text-blue-600':'text-slate-700'}`}>{c.v}</p>
                      </div>
                    ))}
                  </div>
                  {t.notes&&<p className="mt-3 text-xs text-slate-500 bg-slate-50 rounded-xl p-2.5 line-clamp-2">📝 {t.notes}</p>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modal&&<Modal trip={modal==='new'?null:modal} onClose={()=>setM(null)} onSave={save}/>}

      {del&&(
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 ai">
          <div className="bg-white rounded-3xl p-7 w-full max-w-sm text-center shadow-2xl as">
            <div className="text-5xl mb-3">🗑️</div>
            <h3 className="font-bold text-slate-800 text-xl mb-2" style={{fontFamily:"'Playfair Display',serif"}}>Жок кылабызбы?</h3>
            <p className="text-slate-400 text-sm mb-6">«{del.destination}» биротола жок болот.</p>
            <div className="flex gap-3">
              <button onClick={()=>setD(null)} className="btn-gray flex-1">Жок</button>
              <button onClick={()=>{delTrip(del.id);setD(null)}} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition-colors">Жок кыл</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
