import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";

function Admin() {
  // === STATE LOGIN ===
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // === STATE DASHBOARD ===
  const [klien, setKlien] = useState("");
  const [layanan, setLayanan] = useState("");
  const [totalHarga, setTotalHarga] = useState("");
  const [status, setStatus] = useState("Belum Lunas");

  const [historyStruk, setHistoryStruk] = useState([]);
  const [selectedStruk, setSelectedStruk] = useState(null);

  const strukRef = useRef(null);

  // ⚠️ PENTING: Ganti dengan URL Vercel Backend kamu!
  const API_URL = "https://gotchamate-api.vercel.app/api/struk";

  // Mengambil data riwayat HANYA jika sudah login
  useEffect(() => {
    if (isLoggedIn) {
      fetchHistory();
    }
  }, [isLoggedIn]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setHistoryStruk(data);
    } catch (error) {
      console.error("Gagal mengambil data riwayat:", error);
    }
  };

  // === FUNGSI LOGIN ===
  const handleLogin = (e) => {
    e.preventDefault();
    // Ganti 'admin123' dengan password rahasia yang kamu inginkan!
    if (password === "admin123") {
      setIsLoggedIn(true);
      setErrorMsg("");
      setPassword("");
    } else {
      setErrorMsg("Password salah! Coba lagi.");
    }
  };

  // === FUNGSI LOGOUT ===
  const handleLogout = () => {
    setIsLoggedIn(false);
    setHistoryStruk([]);
  };

  // === FUNGSI BUAT STRUK ===
  const handleCetakStruk = async (e) => {
    e.preventDefault();
    const dataBaru = { klien, layanan, totalHarga: Number(totalHarga), status };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataBaru),
      });

      const result = await response.json();

      setKlien("");
      setLayanan("");
      setTotalHarga("");
      setStatus("Belum Lunas");

      fetchHistory();
      setSelectedStruk(result);
    } catch (error) {
      console.error("Gagal membuat struk:", error);
      alert("Terjadi kesalahan saat menyimpan struk.");
    }
  };

  // === FUNGSI DOWNLOAD GAMBAR ===
  const downloadStrukPNG = async () => {
    const element = strukRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      const dataUrl = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.download = `Struk_GotchaMate_${selectedStruk.klien}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Gagal membuat PNG:", error);
      alert("Waduh, gagal mendownload gambar struk.");
    }
  };

  // === TAMPILAN JIKA BELUM LOGIN ===
  if (!isLoggedIn) {
    return (
      <div style={adminStyles.loginPage}>
        <form onSubmit={handleLogin} style={adminStyles.loginForm}>
          <h2 style={{ color: "var(--amalfi-tile)", marginBottom: "10px" }}>
            Login Admin
          </h2>
          <p
            style={{
              color: "#666",
              fontSize: "14px",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            Masukkan kata sandi untuk mengakses dashboard GotchaMate.
          </p>

          {errorMsg && (
            <p style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>
              {errorMsg}
            </p>
          )}

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={adminStyles.inputField}
          />
          <button
            type="submit"
            style={{ ...adminStyles.btnPrimary, marginTop: "15px" }}
          >
            Masuk
          </button>

          <Link
            to="/"
            style={{
              marginTop: "20px",
              color: "var(--amalfi-tile)",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            &larr; Kembali ke Beranda
          </Link>
        </form>
      </div>
    );
  }

  // === TAMPILAN DASHBOARD (JIKA SUDAH LOGIN) ===
  return (
    <div style={adminStyles.dashboardWrapper}>
      {/* HEADER DASHBOARD */}
      <div style={adminStyles.dbHeader}>
        <h1 style={{ color: "var(--deep-navy)", margin: 0, fontSize: "24px" }}>
          Dashboard Admin GotchaMate
        </h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={handleLogout} style={adminStyles.btnDanger}>
            Keluar
          </button>
          <Link to="/" style={adminStyles.btnSecondary}>
            Lihat Web
          </Link>
        </div>
      </div>

      {/* KONTEN UTAMA */}
      <div style={adminStyles.dbContent}>
        {/* KOLOM KIRI: FORM BUAT STRUK */}
        <div style={adminStyles.sectionBox}>
          <h2 style={{ color: "var(--amalfi-tile)", marginTop: 0 }}>
            Buat Struk Baru
          </h2>
          <form onSubmit={handleCetakStruk} style={adminStyles.formContainer}>
            <div>
              <label style={adminStyles.label}>Nama Klien</label>
              <input
                type="text"
                value={klien}
                onChange={(e) => setKlien(e.target.value)}
                required
                style={adminStyles.inputField}
                placeholder="Contoh: Budi Santoso"
              />
            </div>
            <div>
              <label style={adminStyles.label}>Layanan / Tugas</label>
              <input
                type="text"
                value={layanan}
                onChange={(e) => setLayanan(e.target.value)}
                required
                style={adminStyles.inputField}
                placeholder="Contoh: Makalah Sejarah"
              />
            </div>
            <div>
              <label style={adminStyles.label}>Total Harga (Rp)</label>
              <input
                type="number"
                value={totalHarga}
                onChange={(e) => setTotalHarga(e.target.value)}
                required
                style={adminStyles.inputField}
                placeholder="Contoh: 50000"
              />
            </div>
            <div>
              <label style={adminStyles.label}>Status Pembayaran</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={adminStyles.inputField}
              >
                <option value="Belum Lunas">Belum Lunas</option>
                <option value="DP">DP (Setengah)</option>
                <option value="Lunas">Lunas</option>
              </select>
            </div>
            <button type="submit" style={adminStyles.btnPrimary}>
              Simpan & Buat Struk
            </button>
          </form>
        </div>

        {/* KOLOM KANAN: TABEL RIWAYAT */}
        <div style={adminStyles.sectionBox}>
          <h2 style={{ color: "var(--amalfi-tile)", marginTop: 0 }}>
            Riwayat Pesanan
          </h2>
          <div style={{ overflowX: "auto", width: "100%" }}>
            <table style={{ ...adminStyles.table, minWidth: "700px" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--cream-gelato)" }}>
                  <th style={adminStyles.th}>Tanggal</th>
                  <th style={adminStyles.th}>Klien</th>
                  <th style={adminStyles.th}>Layanan</th>
                  <th style={adminStyles.th}>Status</th>
                  <th style={adminStyles.th}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {historyStruk.map((item) => (
                  <tr key={item._id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={adminStyles.td}>
                      {new Date(item.tanggal).toLocaleDateString("id-ID")}
                    </td>
                    <td style={adminStyles.td}>
                      <strong>{item.klien}</strong>
                    </td>
                    <td style={adminStyles.td}>{item.layanan}</td>
                    <td style={adminStyles.td}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          backgroundColor:
                            item.status === "Lunas"
                              ? "#d4edda"
                              : item.status === "DP"
                                ? "#fff3cd"
                                : "#f8d7da",
                          color:
                            item.status === "Lunas"
                              ? "#155724"
                              : item.status === "DP"
                                ? "#856404"
                                : "#721c24",
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td style={adminStyles.td}>
                      <button
                        onClick={() => setSelectedStruk(item)}
                        style={adminStyles.btnCetakMini}
                      >
                        Lihat Struk
                      </button>
                    </td>
                  </tr>
                ))}
                {historyStruk.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "#888",
                      }}
                    >
                      Belum ada riwayat struk.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* === MODAL POP-UP STRUK === */}
      {selectedStruk && (
        <div style={adminStyles.modalOverlay}>
          <div>
            <div style={adminStyles.strukCard} ref={strukRef}>
              <div style={adminStyles.strukHeader}>
                <h2 style={{ color: "var(--amalfi-tile)", margin: 0 }}>
                  GotchaMate
                </h2>
                <p style={{ margin: "5px 0", fontSize: "14px", color: "#666" }}>
                  Tanda Terima Pembayaran
                </p>
              </div>
              <div style={adminStyles.strukBody}>
                <p>
                  <strong>No. Nota:</strong>{" "}
                  {selectedStruk._id.slice(-6).toUpperCase()}
                </p>
                <p>
                  <strong>Tanggal:</strong>{" "}
                  {new Date(selectedStruk.tanggal).toLocaleDateString("id-ID")}
                </p>
                <p>
                  <strong>Klien:</strong> {selectedStruk.klien}
                </p>
                <p>
                  <strong>Layanan:</strong> {selectedStruk.layanan}
                </p>
                <p>
                  <strong>Total Harga:</strong> Rp{" "}
                  {selectedStruk.totalHarga.toLocaleString("id-ID")}
                </p>
                <p>
                  <strong>Status:</strong> {selectedStruk.status}
                </p>
                <hr
                  style={{
                    margin: "20px 0",
                    border: "none",
                    borderTop: "1px dashed #ccc",
                  }}
                />
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "13px",
                    fontStyle: "italic",
                  }}
                >
                  Terima kasih telah mempercayakan tugasmu pada GotchaMate! ✨
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "15px",
                justifyContent: "center",
              }}
            >
              <button onClick={downloadStrukPNG} style={adminStyles.btnPrimary}>
                📥 Download PNG
              </button>
              <button
                onClick={() => setSelectedStruk(null)}
                style={adminStyles.btnDanger}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// === GAYA CSS INTERNAL ===
const adminStyles = {
  // Tambahan style untuk halaman login
  loginPage: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "var(--cream-gelato)",
    padding: "20px",
  },
  loginForm: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "350px",
  },

  // Style dashboard
  dashboardWrapper: {
    minHeight: "100vh",
    backgroundColor: "#fdfbf7",
    padding: "20px",
  },
  dbHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "3px solid var(--sea-breeze)",
    paddingBottom: "15px",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "15px",
  },
  dbContent: { display: "flex", gap: "20px", flexWrap: "wrap" },
  sectionBox: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    flex: "1 1 100%",
    minWidth: "250px",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "15px",
  },
  label: {
    fontWeight: "bold",
    color: "#444",
    fontSize: "14px",
    marginBottom: "5px",
    display: "block",
  },
  inputField: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
    width: "100%",
    outline: "none",
    backgroundColor: "white",
    boxSizing: "border-box",
  },
  btnPrimary: {
    backgroundColor: "var(--amalfi-tile)",
    color: "white",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
  },
  btnSecondary: {
    backgroundColor: "var(--sea-breeze)",
    color: "white",
    padding: "10px 15px",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "14px",
    border: "none",
    cursor: "pointer",
  },
  btnDanger: {
    backgroundColor: "#dc3545",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  btnCetakMini: {
    backgroundColor: "var(--citrus-zest)",
    color: "var(--amalfi-tile)",
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "13px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px",
    textAlign: "left",
  },
  th: { padding: "12px", fontSize: "15px", color: "#444" },
  td: { padding: "12px", fontSize: "15px", color: "#444" },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    padding: "20px",
  },
  strukCard: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "380px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  strukHeader: {
    textAlign: "center",
    borderBottom: "2px solid var(--sea-breeze)",
    paddingBottom: "15px",
    marginBottom: "20px",
  },
  strukBody: { fontSize: "15px", color: "#333", lineHeight: "1.5" },
};

export default Admin;
