import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Home() {
  const NOMOR_WA = "6285157335268"; // Ganti dengan nomor WA aslimu

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State untuk melacak FAQ mana yang sedang terbuka (null berarti tertutup semua)
  const [activeFaq, setActiveFaq] = useState(null);

  const handleOrder = (layanan) => {
    // KODE RAHASIA URL:
    // %E2%9C%A8 = ✨
    // %0A       = Enter (Baris Baru)
    // %F0%9F%91%80 = 👀

    // Kita langsung rangkai kalimatnya dengan kode di atas, tanpa perlu encodeURIComponent lagi
    const text = `Hii Gotcha Mate %E2%9C%A8%0AAku mau tanya-tanya soal jasa kalian dong %F0%9F%91%80%0AAvailable layanan apa aja, harganya gimana, dan cara ordernya gimana yaa?`;

    // Kita juga ubah link wa.me menjadi api.whatsapp (lebih stabil untuk web/desktop)
    window.open(
      `https://api.whatsapp.com/send?phone=${NOMOR_WA}&text=${text}`,
      "_blank",
    );
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Fungsi untuk membuka/menutup FAQ
  const toggleFaq = (index) => {
    if (activeFaq === index) {
      setActiveFaq(null); // Tutup jika yang diklik sudah terbuka
    } else {
      setActiveFaq(index); // Buka yang baru diklik
    }
  };

  // Data Pertanyaan dan Jawaban FAQ
  const faqData = [
    {
      question: "Berapa lama proses pengerjaannya?",
      answer:
        "Sangat fleksibel! Untuk SMM biasanya butuh 3-5 hari untuk riset dan desain konten awal. Sedangkan untuk joki tugas, waktunya bisa disesuaikan dengan deadline kamu. Kami juga melayani pengerjaan Express (kilat) jika sedang darurat!",
    },
    {
      question: "Apakah privasi data dan akun saya aman?",
      answer:
        "100% Aman. Kami sangat menjaga kerahasiaan identitas klien untuk layanan joki tugas, dan menjamin keamanan kredensial login akun sosial mediamu untuk layanan SMM. Privasimu adalah prioritas kami.",
    },
    {
      question: "Apakah ada garansi revisi jika hasil kurang sesuai?",
      answer:
        "Tentu saja. Kami memberikan kesempatan revisi wajar (1-2 kali) agar hasil akhirnya benar-benar memuaskan, sesuai ekspektasi, dan mendapat nilai atau engagement yang maksimal.",
    },
    {
      question: "Bagaimana sistem pembayarannya?",
      answer:
        "Pembayaran bisa dilakukan via QRIS, e-Wallet (Gopay, Dana, Spay) atau Transfer Bank. Kami menerapkan sistem DP (Down Payment) minimal 50% di awal sebagai tanda jadi, dan pelunasan dilakukan setelah preview hasil akhir selesai.",
    },
  ];

  return (
    <div className="app-container">
      {/* NAVBAR */}
      <nav className="navbar-container">
        <div
          style={{
            fontSize: "26px",
            fontWeight: "bold",
            color: "var(--citrus-zest)",
          }}
        >
          GotchaMate
        </div>

        <button
          className="hamburger-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>

        <div className={`nav-links-menu ${isMobileMenuOpen ? "active" : ""}`}>
          <a href="#beranda" className="nav-link" onClick={closeMobileMenu}>
            Beranda
          </a>
          <a href="#layanan" className="nav-link" onClick={closeMobileMenu}>
            Layanan & Harga
          </a>
          <a href="#faq" className="nav-link" onClick={closeMobileMenu}>
            FAQ
          </a>
          <Link to="/admin" className="btn-admin" onClick={closeMobileMenu}>
            Dashboard Struk
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header id="beranda" className="hero-section">
        <h1 className="hero-title">
          Tugas Beres, Sosmed Sukses.
          <br />
          GotchaMate Siap Bantu! 🚀
        </h1>
        <p className="hero-sub">
          Joki Tugas Digital & Tulis, Social Media Management, hingga Creative &
          Design. Pengerjaan sat-set, hasil maksimal, dan harga yang bersahabat.
          We got your back!
        </p>
        <button
          className="cta-button"
          onClick={() => handleOrder("Umum / Lainnya")}
        >
          💬 Konsultasi Sekarang
        </button>
      </header>

      {/* PRICELIST SECTION */}
      <section id="layanan" className="services-section">
        <h2 className="section-title">Pilihan Layanan Kami</h2>

        <div className="card-container">
          {/* KARTU 1 */}
          <div className="service-card">
            <div className="card-header">📱 SMM Bulanan</div>
            <h3 className="card-price">
              RpXXX.XXX<span>/bln</span>
            </h3>
            <p className="card-desc">
              Manajemen akun penuh, 15 konten/bulan, copywriting jitu, dan
              optimasi jadwal posting sesuai algoritma TikTok/IG terkini.
            </p>
            <button
              className="card-button"
              onClick={() => handleOrder("SMM Bulanan")}
            >
              Pesan via WA
            </button>
          </div>

          {/* KARTU 2 */}
          <div className="service-card">
            <div className="card-header">🎨 SMM Per Konten</div>
            <h3 className="card-price">
              Mulai RpXX.XXX<span>/post</span>
            </h3>
            <p className="card-desc">
              Desain feed, reels, atau TikTok per video/post. Sangat cocok untuk
              melengkapi konten spesifikmu tanpa harus berlangganan bulanan.
            </p>
            <button
              className="card-button"
              onClick={() => handleOrder("SMM Per Konten")}
            >
              Pesan via WA
            </button>
          </div>

          {/* KARTU 3 */}
          <div className="service-card">
            <div className="card-header">📚 Joki Tugas</div>
            <h3 className="card-price">Mulai Rp50.000</h3>
            <p className="card-desc">
              Bantuan tugas tulis, digital, makalah, hingga presentasi. Harga
              sangat fleksibel menyesuaikan tingkat kerumitan tugasmu.
            </p>
            <button
              className="card-button"
              onClick={() => handleOrder("Joki Tugas")}
            >
              Diskusi Harga via WA
            </button>
          </div>
        </div>
      </section>

      {/* SECTION BARU: FAQ */}
      <section id="faq" className="faq-section">
        <h2 className="section-title" style={{ marginBottom: "40px" }}>
          Pertanyaan Umum (FAQ)
        </h2>
        <div className="faq-container">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`faq-item ${activeFaq === index ? "open" : ""}`}
            >
              <div className="faq-question" onClick={() => toggleFaq(index)}>
                {item.question}
                <span className="faq-icon">+</span>
              </div>
              <div className="faq-answer">{item.answer}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAT FOOTER */}
      <footer className="fat-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h2>GotchaMate</h2>
            <p>
              Partner andalanmu untuk urusan Joki Tugas Digital, Tulis, dan
              Manajemen Sosial Media. Pengerjaan cepat, privasi aman, dan hasil
              yang tidak mengecewakan. We got your back!
            </p>
          </div>

          <div className="footer-links">
            <h3>Tautan Cepat</h3>
            <ul>
              <li>
                <a href="#beranda">Beranda Utama</a>
              </li>
              <li>
                <a href="#layanan">Katalog Layanan</a>
              </li>
              <li>
                <a href="#faq">Tanya Jawab (FAQ)</a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleOrder("Umum");
                  }}
                >
                  Konsultasi Gratis
                </a>
              </li>
              <li>
                <Link to="/admin">Dashboard Internal</Link>
              </li>
            </ul>
          </div>

          <div className="footer-social">
            <h3>Hubungi Kami</h3>
            <div className="social-icons">
              <a
                href="https://instagram.com/gotchaamatee"
                target="_blank"
                rel="noreferrer"
                className="social-btn"
              >
                📸 Instagram
              </a>
              <a
                href={`https://wa.me/${NOMOR_WA}`}
                target="_blank"
                rel="noreferrer"
                className="social-btn"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} GotchaMate. Dibuat dengan 💛 untuk
            kemudahanmu.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
