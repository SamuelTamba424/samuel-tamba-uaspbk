import axios from 'axios';

// --- FUNGSI UNTUK MENGINISIALISASI SIMULASI API ---
export function initMockApi() {

  // SINGLETON PATTERN: Cek apakah mock API sudah diinisialisasi.
  // Jika sudah, jangan jalankan lagi untuk mencegah reset oleh HMR.
  if (window.isMockApiInitialized) {
    return;
  }

  const DB_KEY = 'studioBandDb_vFinal';

  const getDb = () => {
    let dbJson = localStorage.getItem(DB_KEY);
    if (!dbJson) {
      const initialDb = {
        users: [],
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
        bookings: []
      };
      dbJson = JSON.stringify(initialDb);
      localStorage.setItem(DB_KEY, dbJson);
    }
    return JSON.parse(dbJson);
  };

  const saveDb = (db) => localStorage.setItem(DB_KEY, JSON.stringify(db));

  axios.get = async (url) => {
    const db = getDb();
    await new Promise(res => setTimeout(res, 100));
    if (url === '/api/studios') return { data: db.studios };
    const studioMatch = url.match(/\/api\/studios\/(\d+)/);
    if (studioMatch) return { data: db.studios.find(s => s.id === parseInt(studioMatch[1])) };
    if (url.startsWith('/api/bookings')) {
      const params = new URLSearchParams(url.split('?')[1]);
      if (params.has('userId')) {
        const userId = parseInt(params.get('userId'));
        const userBookings = db.bookings.filter(b => b.userId === userId).map(booking => ({...booking, studioName: db.studios.find(s => s.id === booking.studioId).name, studioLocation: db.studios.find(s => s.id === booking.studioId).location }));
        return { data: userBookings };
      }
      if (params.has('studioId')) {
        const studioIdParam = parseInt(params.get('studioId'));
        const dateParam = params.get('date');
        return { data: db.bookings.filter(b => b.studioId === studioIdParam && b.date === dateParam) };
      }
    }
    return Promise.reject(new Error(`GET URL Not Found: ${url}`));
  };

  axios.post = async (url, data) => {
    const db = getDb();
    await new Promise(res => setTimeout(res, 100));
    if (url === '/api/register') {
      if (db.users.some(user => user.email === data.email)) return Promise.reject({ response: { status: 400, data: { message: 'Email sudah terdaftar' } } });
      const newUser = { id: Date.now(), ...data };
      db.users.push(newUser);
      saveDb(db);
      return { data: newUser, status: 201 };
    }
    if (url === '/api/bookings') {
      const newBooking = { ...data, id: Date.now() };
      db.bookings.push(newBooking);
      saveDb(db);
      return { data: newBooking, status: 201 };
    }
    if (url === '/api/login') {
      const user = db.users.find(u => u.email === data.email && u.password === data.password);
      if (user) return { data: user };
      return Promise.reject({ response: { status: 401, data: { message: 'Email atau password salah' } } });
    }
    return Promise.reject(new Error(`POST URL Not Found: ${url}`));
  };

  axios.delete = async (url) => {
    const db = getDb();
    await new Promise(res => setTimeout(res, 100));
    const bookingMatch = url.match(/\/api\/bookings\/(\d+)/);
    if (bookingMatch) {
      const bookingId = parseInt(bookingMatch[1]);
      const index = db.bookings.findIndex(b => b.id === bookingId);
      if (index > -1) {
        db.bookings.splice(index, 1);
        saveDb(db);
        return { status: 200, data: { message: 'Booking berhasil dihapus' } };
      }
    }
    return Promise.reject(new Error(`DELETE URL Not Found: ${url}`));
  };

  axios.put = async (url, data) => {
    const db = getDb();
    await new Promise(res => setTimeout(res, 100));
    const userMatch = url.match(/\/api\/users\/(\d+)/);
    if (userMatch) {
      const userId = parseInt(userMatch[1]);
      const userIndex = db.users.findIndex(u => u.id === userId);
      if (userIndex > -1) {
        db.users[userIndex].name = data.name;
        saveDb(db);
        return { status: 200, data: db.users[userIndex] };
      }
    }
    return Promise.reject(new Error(`PUT URL Not Found: ${url}`));
  };

  window.isMockApiInitialized = true;
}