// === PUSAT KONFIGURASI API ===
// Ubah bagian ini saja saat kamu pindah dari local ke Vercel

const isProduction = false; // Ubah ke 'false' jika sedang coding di laptop (local)

const API_BASE_URL = isProduction
  ? "https://gotchamate-api.vercel.app" // GANTI DENGAN URL VERCEL BACKEND-MU
  : "http://localhost:5000";

export default API_BASE_URL;
