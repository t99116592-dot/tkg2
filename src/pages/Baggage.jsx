import { useState } from 'react'
import { useTravel } from '../context/TravelContext'
import { BAG_RULES } from '../data/db'

const CATS=['Кийим','Электроника','Тамак-аш','Дары','Китептер','Спорт','Косметика','Башкалар']
const ICOS={Кийим:'👕',Электроника:'💻','Тамак-аш':'🍎',Дары:'💊',Китептер:'📚',Спорт:'⚽',Косметика:'💄',Башкалар:'📦'}
const TYPES=[{v:'cabin',l:'🎒 Кабина'},{v:'hold',l:'🧳 Туткага'},{v:'extra',l:'👜 Жеке'}]
const CLS=[{v:'economy',l:'Эконом'},{v:'business',l:'Бизнес'},{v:'first',l:'Биринчи'}]

function pct(c,l){return Math.min(100,(c/l)*100)}
function clr(c,l){const p=pct(c,l);return p>90?'#ef4444':p>70?'#f59e0b':'#22c55e'}

function Bar({cur,lim,label}){
  const c=clr(cur,lim)
  return(
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-xs text-slate-500">{label}</span>
        <span className="text-xs font-bold" style={{color:c}}>{cur}/{lim} кг</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{width:`${pct(cur,lim)}%`,background:c}}/>
      </div>
    </div>
  )
}

export default function Baggage(){
  const {baggage,addBag,delBag,editBag}=useTravel()
  const [cls,setCls]=useState('economy')
  const [modal,setModal]=useState(false)
  const [eid,setEid]=useState(null)
  const [tab,setTab]=useState('all')
  const [f,setF]=useState({name:'',weight:'',category:'Кийим',type:'hold',qty:1})

  const r=BAG_RULES[cls]
  const cabin=baggage.filter(i=>i.type==='cabin')
  const hold =baggage.filter(i=>i.type==='hold')
  const cW=+cabin.reduce((s,i)=>s+(parseFloat(i.weight)||0),0).toFixed(1)
  const hW=+hold.reduce((s,i)=>s+(parseFloat(i.weight)||0),0).toFixed(1)
  const cOver=Math.max(0,cW-r.cabin.kg)
  const hOver=Math.max(0,hW-r.hold.kg)
  const fee=+(cOver+hOver).toFixed(1)*r.fee
  const total=+baggage.reduce((s,i)=>s+(parseFloat(i.weight)||0),0).toFixed(1)

  function openNew(){setEid(null);setF({name:'',weight:'',category:'Кийим',type:'hold',qty:1});setModal(true)}
  function openEdit(item){setEid(item.id);setF({name:item.name,weight:item.weight,category:item.category,type:item.type,qty:item.qty||1});setModal(true)}
  function save(e){e.preventDefault();if(eid)editBag(eid,f);else addBag(f);setModal(false)}

  const list=tab==='all'?baggage:baggage.filter(i=>i.type===tab)

  return(
    <div className="max-w-5xl mx-auto au">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800" style={{fontFamily:"'Playfair Display',serif"}}>Багаж Эсептегич</h1>
          <p className="text-slate-400 text-sm mt-0.5">Буюмдардын салмагын эсептеңиз</p>
        </div>
        <button onClick={openNew} className="btn-blue">+ Буюм кошуу</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left */}
        <div className="space-y-4">
          <div className="card p-5">
            <p className="lbl mb-3">✈️ Учуу классы</p>
            {CLS.map(c=>(
              <label key={c.v} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-1.5 ${cls===c.v?'bg-blue-50 border-2 border-blue-200':'border-2 border-transparent hover:bg-slate-50'}`}>
                <input type="radio" name="cls" checked={cls===c.v} onChange={()=>setCls(c.v)} className="accent-blue-600"/>
                <span className="text-sm font-medium text-slate-700 flex-1">{c.l}</span>
                <span className="text-xs text-slate-400">{BAG_RULES[c.v].hold.kg}кг</span>
              </label>
            ))}
          </div>

          <div className="card p-5 space-y-4">
            <p className="lbl">📊 Салмак</p>
            <Bar cur={hW} lim={r.hold.kg} label="🧳 Туткага"/>
            <Bar cur={cW} lim={r.cabin.kg} label="🎒 Кабина"/>
            <div className="pt-3 border-t border-slate-100 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-400">Жалпы</span><span className="font-bold">{total} кг</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Буюмдар</span><span className="font-bold">{baggage.length} даана</span></div>
            </div>
          </div>

          {fee>0?(
            <div className="card p-5 bg-red-50 border-red-200">
              <p className="text-sm font-bold text-red-700 mb-2">⚠️ Кошумча акы</p>
              {hOver>0&&<p className="text-xs text-red-600">Туткага +{hOver.toFixed(1)}кг × ${r.fee}</p>}
              {cOver>0&&<p className="text-xs text-red-600">Кабина +{cOver.toFixed(1)}кг × ${r.fee}</p>}
              <p className="text-2xl font-bold text-red-700 mt-2">${fee}</p>
            </div>
          ):baggage.length>0?(
            <div className="card p-5 bg-green-50 border-green-200">
              <p className="text-sm font-bold text-green-700">✅ Нормада!</p>
              <p className="text-xs text-green-600 mt-1">Кошумча акы жок</p>
            </div>
          ):null}

          <div className="card p-5">
            <p className="lbl mb-3">📋 Эреже ({cls==='economy'?'Эконом':cls==='business'?'Бизнес':'Биринчи'})</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-400">Кабина</span><span className="font-bold">{r.cabin.kg}кг ({r.cabin.dim})</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Туткага</span><span className="font-bold">{r.hold.kg}кг</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Ашык акы</span><span className={`font-bold ${r.fee>0?'text-red-600':'text-green-600'}`}>{r.fee>0?`$${r.fee}/кг`:'Акысыз'}</span></div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-2">
          <div className="flex gap-2 mb-3 flex-wrap">
            {[['all',`Баары(${baggage.length})`],...TYPES.map(t=>[t.v,`${t.l}(${baggage.filter(i=>i.type===t.v).length})`])].map(([v,l])=>(
              <button key={v} onClick={()=>setTab(v)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all
                             ${tab===v?'text-white':'bg-white text-slate-500 border border-slate-200 hover:border-blue-300'}`}
                style={tab===v?{background:'linear-gradient(135deg,#0369a1,#0284c7)'}:{}}>
                {l}
              </button>
            ))}
          </div>
          {list.length===0?(
            <div className="card text-center py-14">
              <div className="text-5xl opacity-30 mb-3">🧳</div>
              <p className="text-slate-400 text-sm">Буюмдар жок</p>
              <button onClick={openNew} className="mt-3 text-blue-600 text-sm font-bold hover:underline">Буюм кошуу →</button>
            </div>
          ):(
            <div className="space-y-2.5">
              {list.map((item,i)=>(
                <div key={item.id} className={`card hover-lift flex items-center gap-4 p-4 au`} style={{animationDelay:`${i*40}ms`}}>
                  <div className="text-2xl w-10 text-center flex-shrink-0">{ICOS[item.category]||'📦'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-sm text-slate-800 truncate">{item.name}</p>
                      <span className={`badge text-xs ${item.type==='cabin'?'bg-blue-50 text-blue-600':item.type==='hold'?'bg-purple-50 text-purple-600':'bg-slate-100 text-slate-500'}`}>
                        {TYPES.find(t=>t.v===item.type)?.l}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{item.category} · ×{item.qty||1}</p>
                  </div>
                  <p className="font-bold text-slate-800">{item.weight}<span className="text-xs text-slate-400 font-normal">кг</span></p>
                  <div className="flex gap-1">
                    <button onClick={()=>openEdit(item)} className="w-8 h-8 rounded-lg hover:bg-blue-50 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">✏️</button>
                    <button onClick={()=>delBag(item.id)} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {modal&&(
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 ai">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md as">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800" style={{fontFamily:"'Playfair Display',serif"}}>{eid?'✏️ Өзгөртүү':'➕ Буюм кошуу'}</h3>
              <button onClick={()=>setModal(false)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500">✕</button>
            </div>
            <form onSubmit={save} className="p-6 space-y-4">
              <div><label className="lbl">Аталышы</label><input required value={f.name} onChange={e=>setF({...f,name:e.target.value})} placeholder="Ноутбук, кийимдер..." className="inp"/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="lbl">Салмак (кг)</label><input type="number" step="0.1" min="0.1" required value={f.weight} onChange={e=>setF({...f,weight:e.target.value})} placeholder="2.5" className="inp"/></div>
                <div><label className="lbl">Саны</label><input type="number" min="1" value={f.qty} onChange={e=>setF({...f,qty:parseInt(e.target.value)})} className="inp"/></div>
              </div>
              <div><label className="lbl">Категория</label><select value={f.category} onChange={e=>setF({...f,category:e.target.value})} className="inp">{CATS.map(c=><option key={c}>{c}</option>)}</select></div>
              <div>
                <label className="lbl mb-2">Багаж түрү</label>
                <div className="grid grid-cols-3 gap-2">
                  {TYPES.map(t=>(
                    <label key={t.v} className={`flex flex-col items-center p-3 rounded-xl cursor-pointer border-2 transition-all ${f.type===t.v?'border-blue-500 bg-blue-50':'border-slate-200 hover:border-blue-200'}`}>
                      <input type="radio" name="bt" value={t.v} checked={f.type===t.v} onChange={()=>setF({...f,type:t.v})} className="sr-only"/>
                      <span className="text-xl mb-1">{t.l.split(' ')[0]}</span>
                      <span className="text-xs text-center font-medium text-slate-600">{t.l.split(' ').slice(1).join(' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={()=>setModal(false)} className="btn-gray flex-1">Жок кылуу</button>
                <button type="submit" className="btn-blue flex-1">{eid?'Сактоо':'Кошуу'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
