import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { getToken, setToken, clearToken, api } from './api'

// AuthContext — tizimga kirgan userning holatini butun iloyda saqlaydi.
// Har bir komponent useAuth() orqali user va login/logout funksiyalarini oladi.

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // sahifa ochilganda token tekshiriladi

  // Token bor bo'lsa — backenddan joriy userni olamiz.
  // Token eskirgan (expired) bo'lsa — uni o'chirib tashlaymiz.
  useEffect(() => {
    const loadUser = async () => {
      if (!getToken()) {
        setLoading(false)
        return
      }
      try {
        const me = await api.getMe()
        setUser(me)
      } catch {
        clearToken()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await api.login({ email, password })
    setToken(data.token)
    setUser(data.user)
    return data.user
  }, [])

  const register = useCallback(async (username, email, password) => {
    return await api.register({ username, email, password })
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
  }, [])

  // setUser — balans yangilanganda sahifalar bir zumda moslashishi uchun ochiq qoyilgan
  const value = { user, loading, login, register, logout, setUser, isAdmin: user?.role === 'admin' }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Boshqa komponentlarda ishlatish uchun qulay hook
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth faqat AuthProvider ichida ishlashi kerak')
  return ctx
}
