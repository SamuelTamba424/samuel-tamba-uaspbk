import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import axios from 'axios'

vi.mock('axios')

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.resetAllMocks()
  })

  it('logs in a user successfully', async () => {
    const auth = useAuthStore()
    const fakeUser = { id: 1, name: 'Andi Musisi', email: 'andi@gmail.com' }
    axios.post.mockResolvedValue({ data: fakeUser })
    await auth.login('andi@gmail.com', '123')
    expect(auth.isAuthenticated).toBe(true)
    expect(auth.user.name).toBe('Andi Musisi')
  })

  it('fails to log in with wrong credentials', async () => {
    const auth = useAuthStore()
    axios.post.mockRejectedValue({ response: { data: { message: 'Email atau password salah' } } })
    await auth.login('salah@gmail.com', 'salah')
    expect(auth.isAuthenticated).toBe(false)
  })

  it('logs out a user', async () => {
    const auth = useAuthStore()
    const fakeUser = { id: 1, name: 'Andi Musisi', email: 'andi@gmail.com' }
    axios.post.mockResolvedValue({ data: fakeUser })
    await auth.login('andi@gmail.com', '123')
    expect(auth.isAuthenticated).toBe(true)
    auth.logout()
    expect(auth.isAuthenticated).toBe(false)
    expect(localStorage.getItem('token')).toBeNull()
  })
})