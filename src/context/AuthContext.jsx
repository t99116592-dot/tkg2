import { createContext, useContext, useState, useEffect } from 'react'
import { USERS } from '../data/db'

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try { const u = localStorage.getItem('tkg_u'); if (u) setUser(JSON.parse(u)) } catch(_){}
    setReady(true)
  }, [])

  function login(email, pw) {
    let found = USERS.find(u => u.email === email && u.password === pw)
    if (!found) {
      try {
        const regs = JSON.parse(localStorage.getItem('tkg_regs') || '[]')
        found = regs.find(u => u.email === email && u.password === pw)
      } catch(_){}
    }
    if (!found) return { ok:false, err:'Email же сырсөз туура эмес' }
    const { password:_, ...safe } = found
    setUser(safe); localStorage.setItem('tkg_u', JSON.stringify(safe))
    return { ok:true }
  }

  function register(name, email, pw) {
    let regs = []
    try { regs = JSON.parse(localStorage.getItem('tkg_regs') || '[]') } catch(_){}
    const taken = [...USERS, ...regs].find(u => u.email === email)
    if (taken) return { ok:false, err:'Бул email мурунтан катталган' }
    const nu = {
      id: Date.now(), name, email, password: pw,
      av: name.trim().split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)
    }
    regs.push(nu)
    localStorage.setItem('tkg_regs', JSON.stringify(regs))
    const { password:_, ...safe } = nu
    setUser(safe); localStorage.setItem('tkg_u', JSON.stringify(safe))
    return { ok:true }
  }

  function logout() { setUser(null); localStorage.removeItem('tkg_u') }

  return <Ctx.Provider value={{ user, ready, login, register, logout }}>{children}</Ctx.Provider>
}

export function useAuth() {
  const c = useContext(Ctx)
  if (!c) throw new Error('No AuthProvider')
  return c
}
