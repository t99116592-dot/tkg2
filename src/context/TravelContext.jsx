import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const Ctx = createContext(null)

const get = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch { return d } }
const set = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch(_){} }

export function TravelProvider({ children }) {
  const { user } = useAuth()
  const id = user?.id || 'g'

  const [trips,    setT] = useState([])
  const [bookings, setB] = useState([])
  const [baggage,  setG] = useState([])

  useEffect(() => {
    if (!user) return
    setT(get(`tkg_t_${user.id}`, []))
    setB(get(`tkg_b_${user.id}`, []))
    setG(get(`tkg_g_${user.id}`, []))
  }, [user?.id])

  const saveT = v => { setT(v); set(`tkg_t_${id}`, v) }
  const saveB = v => { setB(v); set(`tkg_b_${id}`, v) }
  const saveG = v => { setG(v); set(`tkg_g_${id}`, v) }

  const addTrip    = d => { const t = {...d, id:Date.now(), status:d.status||'planned', at:new Date().toISOString()}; saveT([...trips,t]); return t }
  const editTrip   = (id,d) => saveT(trips.map(t=>t.id===id?{...t,...d}:t))
  const delTrip    = id => saveT(trips.filter(t=>t.id!==id))

  const addBook = d => {
    const b = {...d, id:Date.now(), status:'confirmed', at:new Date().toISOString(),
               code:'TKG'+Math.random().toString(36).substr(2,6).toUpperCase()}
    saveB([...bookings,b]); return b
  }
  const cancelBook = id => saveB(bookings.map(b=>b.id===id?{...b,status:'cancelled'}:b))

  const addBag  = d => { const i={...d,id:Date.now()}; saveG([...baggage,i]); return i }
  const delBag  = id => saveG(baggage.filter(i=>i.id!==id))
  const editBag = (id,d) => saveG(baggage.map(i=>i.id===id?{...i,...d}:i))

  const totalKg = baggage.reduce((s,i)=>s+(parseFloat(i.weight)||0),0)

  return <Ctx.Provider value={{
    trips, addTrip, editTrip, delTrip,
    bookings, addBook, cancelBook,
    baggage, addBag, delBag, editBag, totalKg,
  }}>{children}</Ctx.Provider>
}

export function useTravel() {
  const c = useContext(Ctx)
  if (!c) throw new Error('No TravelProvider')
  return c
}
