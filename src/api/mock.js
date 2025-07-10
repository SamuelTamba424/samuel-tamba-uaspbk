import axios from 'axios';

// --- FUNGSI UNTUK MENGINISIALISASI SIMULASI API ---
export function initMockApi() {
  
  // PERBAIKAN: Simpan database di window object agar tidak hilang saat HMR
  if (!window.mockDb) {
    console.log("Membuat database tiruan untuk pertama kali.");
    window.mockDb = {
      users: [
        { id: 1, name: "Andi Musisi", email: "andi@gmail.com", password: "123" }
      ],
      studios: [
        { id: 1, name: "MansionPro Studio", location: "Jl. Nenas, Sukajadi", price_per_hour: 85000, image_url: "https://placehold.co/600x400/7c3aed/ffffff?text=MansionPro", description: "Studio rekaman profesional dengan peralatan canggih dan operator berpengalaman." },
        { id: 2, name: "Positif Studio Band", location: "Jl. Teratai, Sukajadi", price_per_hour: 75000, image_url: "https://placehold.co/600x400/db2777/ffffff?text=Positif", description: "Tempat latihan band yang nyaman dengan sound system yang jernih dan kuat." },
        { id: 3, name: "Azira Musik & Audio", location: "Marpoyan Damai", price_per_hour: 80000, image_url: "https://placehold.co/600x400/0ea5e9/ffffff?text=Azira+Musik", description: "Menyediakan studio latihan dan penyewaan sound system untuk berbagai acara." },
        { id: 4, name: "Garfari Teknik Studio", location: "Jl. Tengku Bey, Simpang Tiga", price_per_hour: 90000, image_url: "https://placehold.co/600x400/f59e0b/ffffff?text=Garfari", description: "Studio dengan pilihan alat musik terlengkap di Pekanbaru. Cocok untuk semua genre." },
        { id: 5, name: "Riau Rhythm Room", location: "Jl. Jenderal Sudirman", price_per_hour: 95000, image_url: "https://placehold.co/600x400/10b981/ffffff?text=Riau+Rhythm", description: "Studio premium dengan fasilitas VIP dan akustik ruangan yang superior." },
        { id: 6, name: "Panam Jam Session", location: "Jl. HR. Soebrantas, Panam", price_per_hour: 70000, image_url: "https://placehold.co/600x400/ef4444/ffffff?text=Panam+Jam", description: "Pilihan tepat untuk latihan rutin dengan harga terjangkau di area Panam." },
        { id: 7, name: "Gobah Groove Station", location: "Jl. Pattimura, Gobah", price_per_hour: 80000, image_url: "https://placehold.co/600x400/3b82f6/ffffff?text=Gobah+Groove", description: "Suasana homey dan nyaman, cocok untuk sesi latihan akustik atau vokal." },
        { id: 8, name: "Harapan Raya Music Hub", location: "Jl. Harapan Raya", price_per_hour: 75000, image_url: "https://placehold.co/600x400/8b5cf6/ffffff?text=HR+Music", description: "Menjadi pusat berkumpulnya komunitas musik lokal. Sering mengadakan event." }
      ],
      bookings: [
        { id: 1, studioId: 1, userId: 1, date: "2025-07-09", time_slot: "19:00 - 20:00" },
      ]
    };
  }

  // Gunakan database dari window object
  const mockDb = window.mockDb;

  axios.get = async (url) => {
    console.log(`[MOCK GET]: ${url}`);
    await new Promise(res => setTimeout(res, 300));
    
    if (url === '/api/studios') return { data: mockDb.studios };

    const studioMatch = url.match(/\/api\/studios\/(\d+)/);
    if (studioMatch) {
      const studioId = parseInt(studioMatch[1]);
      return { data: mockDb.studios.find(s => s.id === studioId) };
    }

    if (url.startsWith('/api/bookings')) {
      const params = new URLSearchParams(url.split('?')[1]);
      if (params.has('userId')) {
        const userId = parseInt(params.get('userId'));
        const userBookings = mockDb.bookings.filter(b => b.userId === userId).map(booking => {
            const studio = mockDb.studios.find(s => s.id === booking.studioId);
            return {...booking, studioName: studio.name, studioLocation: studio.location };
        });
        return { data: userBookings };
      }
      if (params.has('studioId')) {
        const studioIdParam = parseInt(params.get('studioId'));
        const dateParam = params.get('date');
        const bookings = mockDb.bookings.filter(b => b.studioId === studioIdParam && b.date === dateParam);
        return { data: bookings };
      }
    }
    return Promise.reject(new Error("URL GET tidak ditemukan"));
  };

  axios.post = async (url, data) => {
    console.log(`[MOCK POST]: ${url}`, data);
    await new Promise(res => setTimeout(res, 300));

    if (url === '/api/register') {
      const emailExists = mockDb.users.some(user => user.email === data.email);
      if (emailExists) return Promise.reject({ response: { status: 400, data: { message: 'Email sudah terdaftar' } } });
      const newUser = { id: Date.now(), ...data };
      mockDb.users.push(newUser);
      console.log('Database Users terbaru:', mockDb.users);
      return { data: newUser, status: 201 };
    }

    if (url === '/api/bookings') {
      const newBooking = { ...data, id: Date.now() };
      mockDb.bookings.push(newBooking);
      console.log('Database Bookings terbaru:', mockDb.bookings);
      return { data: newBooking, status: 201 };
    }

    if (url === '/api/login') {
        const user = mockDb.users.find(u => u.email === data.email && u.password === data.password);
        if (user) return { data: user };
        return Promise.reject({ response: { status: 401, data: { message: 'Email atau password salah' } } });
    }
    return Promise.reject(new Error("URL POST tidak ditemukan"));
  };
}
