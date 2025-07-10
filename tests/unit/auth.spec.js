import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth' // Impor store yang akan diuji
import { describe, it, expect, beforeEach } from 'vitest'

// 'describe' digunakan untuk mengelompokkan tes-tes terkait
describe('Auth Store', () => {

  // 'beforeEach' akan berjalan sebelum setiap tes ('it') dijalankan.
  // Ini memastikan setiap tes dimulai dari kondisi yang bersih.
  beforeEach(() => {
    // Membuat instance Pinia baru untuk setiap tes
    setActivePinia(createPinia())
    // Membersihkan localStorage untuk memastikan tidak ada sisa data dari tes sebelumnya
    localStorage.clear()
  })

  // 'it' adalah sebuah test case individual
  it('logs in a user successfully', async () => {
    const auth = useAuthStore()
    expect(auth.isAuthenticated).toBe(false) // Awalnya, user belum login

    // Menjalankan action login
    await auth.login('andi@gmail.com', '123')

    // 'expect' digunakan untuk memverifikasi hasilnya
    expect(auth.isAuthenticated).toBe(true) // Sekarang, user seharusnya sudah login
    expect(auth.user.name).toBe('Andi Musisi') // Nama user harus sesuai
  })

  it('fails to log in with wrong credentials', async () => {
    const auth = useAuthStore()
    await auth.login('salah@gmail.com', 'salah')
    expect(auth.isAuthenticated).toBe(false) // Login harus gagal
  })

  it('logs out a user', async () => {
    const auth = useAuthStore()
    // Login dulu
    await auth.login('andi@gmail.com', '123')
    expect(auth.isAuthenticated).toBe(true)

    // Jalankan action logout
    auth.logout()

    // Verifikasi bahwa user sudah logout
    expect(auth.isAuthenticated).toBe(false)
    expect(localStorage.getItem('token')).toBeNull() // Token di localStorage harus hilang
  })
})