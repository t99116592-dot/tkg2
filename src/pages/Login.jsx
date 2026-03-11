import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const DEMOS = [
  {n:'Айбек', e:'aibek@mail.kg',   p:'aibek123' },
  {n:'Зарина',e:'zarina@mail.kg',  p:'zarina456'},
  {n:'Тимур', e:'timur@gmail.com', p:'timur789' },
]

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [f, setF]   = useState({email:'', pw:''})
  const [err, setE] = useState('')
  const [busy, setBusy] = useState(false)
  const [show, setShow] = useState(false)

  async function submit(e) {
    e.preventDefault(); setE(''); setBusy(true)
    await new Promise(r=>setTimeout(r,400))
    const res = login(f.email, f.pw)
    if (res.ok) nav('/dashboard')
    else { setE(res.err); setBusy(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
         style={{background:'linear-gradient(135deg,#0c4a6e,#0369a1,#0284c7)'}}>
      {/* blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"/>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none"/>
      <div className="absolute top-12 left-16 text-7xl opacity-20 fl" style={{animationDelay:'0s'}}>✈️</div>
      <div className="absolute bottom-16 right-16 text-6xl opacity-15 fl" style={{animationDelay:'1s'}}>🌍</div>
      <div className="absolute top-1/3 right-12 text-4xl opacity-15 fl" style={{animationDelay:'.5s'}}>🏝️</div>

      <div className="relative w-full max-w-md au">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex w-20 h-20 bg-white/20 backdrop-blur rounded-3xl items-center justify-center text-4xl mb-4">✈️</div>
          <h1 className="text-4xl font-bold text-white" style={{fontFamily:"'Playfair Display',serif"}}>TravelKG</h1>
          <p className="text-blue-200 mt-1 text-sm">Саякат Пландаштыргыч</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-1" style={{fontFamily:"'Playfair Display',serif"}}>Кирүү</h2>
            <p className="text-slate-400 text-sm mb-6">Аккаунтуңузга кириңиз</p>

            {err && <div className="flex gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 au">⚠️ {err}</div>}

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="lbl">Email</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">📧</span>
                  <input type="email" required value={f.email} onChange={e=>setF({...f,email:e.target.value})}
                    placeholder="email@mail.kg" className="inp pl-10"/>
                </div>
              </div>
              <div>
                <label className="lbl">Сырсөз</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔒</span>
                  <input type={show?'text':'password'} required value={f.pw} onChange={e=>setF({...f,pw:e.target.value})}
                    placeholder="••••••••" className="inp pl-10 pr-10"/>
                  <button type="button" onClick={()=>setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {show?'🙈':'👁️'}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={busy} className="btn-blue w-full py-3 flex items-center justify-center gap-2">
                {busy ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full sp"/>Кирүүдө...</> : 'Кирүү →'}
              </button>
            </form>
          </div>

          {/* Demo */}
          <div className="px-8 pb-6">
            <div className="p-4 bg-blue-50 border border-dashed border-blue-200 rounded-2xl">
              <p className="text-xs font-bold text-blue-600 mb-3">🔑 Демо аккаунттар (чыкылдатыңыз)</p>
              <div className="grid grid-cols-3 gap-2">
                {DEMOS.map(d=>(
                  <button key={d.e} onClick={()=>setF({email:d.e,pw:d.p})}
                    className="p-2.5 bg-white rounded-xl border border-blue-100 hover:border-blue-400 hover:bg-blue-50 transition-all text-left">
                    <p className="text-xs font-bold text-slate-700">{d.n}</p>
                    <p className="text-xs text-slate-400 truncate">{d.p}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="pb-8 text-center text-sm text-slate-400">
            Аккаунт жокпу? <Link to="/register" className="text-blue-600 font-bold hover:underline">Катталуу</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
