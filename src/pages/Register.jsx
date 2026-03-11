import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function str(p){
  if(!p)return 0; let s=0
  if(p.length>=6)s++; if(p.length>=10)s++
  if(/[A-Z]/.test(p))s++; if(/[0-9]/.test(p))s++; if(/[^A-Za-z0-9]/.test(p))s++
  return s
}
const SL=['','Начар','Жарамдуу','Жакшы','Күчтүү','Абдан күчтүү']
const SC=['','#ef4444','#f97316','#eab308','#3b82f6','#22c55e']

export default function Register() {
  const { register } = useAuth()
  const nav = useNavigate()
  const [f, setF] = useState({name:'',email:'',pw:'',pw2:''})
  const [err,setE]  = useState('')
  const [busy,setBusy] = useState(false)
  const s = str(f.pw)

  async function submit(e) {
    e.preventDefault(); setE('')
    if(f.name.trim().length<2) return setE('Аты-жөнүңүздү жазыңыз')
    if(f.pw.length<6)          return setE('Сырсөз кеминде 6 символ')
    if(f.pw!==f.pw2)           return setE('Сырсөздөр дал келбейт')
    setBusy(true)
    await new Promise(r=>setTimeout(r,400))
    const res = register(f.name.trim(), f.email, f.pw)
    if(res.ok) nav('/dashboard')
    else { setE(res.err); setBusy(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
         style={{background:'linear-gradient(135deg,#0c4a6e,#0369a1,#0284c7)'}}>
      <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"/>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/4 translate-y-1/4 pointer-events-none"/>
      <div className="absolute top-16 left-16 text-6xl opacity-20 fl">🗺️</div>
      <div className="absolute bottom-20 right-12 text-5xl opacity-15 fl" style={{animationDelay:'1s'}}>🏔️</div>

      <div className="relative w-full max-w-md au">
        <div className="text-center mb-8">
          <div className="inline-flex w-20 h-20 bg-white/20 backdrop-blur rounded-3xl items-center justify-center text-4xl mb-4">✈️</div>
          <h1 className="text-4xl font-bold text-white" style={{fontFamily:"'Playfair Display',serif"}}>TravelKG</h1>
          <p className="text-blue-200 mt-1 text-sm">Жаңы аккаунт түзүү</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-1" style={{fontFamily:"'Playfair Display',serif"}}>Катталуу</h2>
            <p className="text-slate-400 text-sm mb-6">Саякатыңызды баштаңыз!</p>

            {err && <div className="flex gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 au">⚠️ {err}</div>}

            <form onSubmit={submit} className="space-y-4">
              {[
                {label:'Аты-жөнү', k:'name',  type:'text',     ico:'👤', ph:'Айбек Маматов'},
                {label:'Email',    k:'email', type:'email',    ico:'📧', ph:'email@mail.kg'},
                {label:'Сырсөз',   k:'pw',    type:'password', ico:'🔒', ph:'••••••••'},
                {label:'Ырастоо',  k:'pw2',   type:'password', ico:'🛡️', ph:'••••••••'},
              ].map(fi=>(
                <div key={fi.k}>
                  <label className="lbl">{fi.label}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{fi.ico}</span>
                    <input type={fi.type} required value={f[fi.k]} onChange={e=>setF({...f,[fi.k]:e.target.value})}
                      placeholder={fi.ph}
                      className={`inp pl-10 ${fi.k==='pw2'&&f.pw2 ? f.pw2===f.pw?'!border-green-400':'!border-red-400':''}`}/>
                    {fi.k==='pw2'&&f.pw2===f.pw&&f.pw2&&<span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 font-bold">✓</span>}
                  </div>
                  {fi.k==='pw'&&f.pw&&(
                    <div className="mt-1.5">
                      <div className="flex gap-1">{[1,2,3,4,5].map(i=>(
                        <div key={i} className="h-1.5 flex-1 rounded-full transition-all"
                             style={{background:i<=s?SC[s]:'#e2e8f0'}}/>
                      ))}</div>
                      <p className="text-xs mt-0.5" style={{color:SC[s]}}>{SL[s]}</p>
                    </div>
                  )}
                </div>
              ))}
              <button type="submit" disabled={busy} className="btn-blue w-full py-3 flex items-center justify-center gap-2">
                {busy?<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full sp"/>Катталууда...</>:'Катталуу →'}
              </button>
            </form>
          </div>
          <div className="pb-8 text-center text-sm text-slate-400">
            Аккаунт барбы? <Link to="/login" className="text-blue-600 font-bold hover:underline">Кирүү</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
