import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const [formData, setFormData] = useState({
    nama: "",
    tugas: "",
    harga: "",
    status: "Lunas",
  });
  const [historyStruk, setHistoryStruk] = useState([]);
  const [strukCetak, setStrukCetak] = useState(null);

  // === STATE BARU UNTUK FITUR SORTING ===
  const [sortType, setSortType] = useState("Terbaru");

  const fetchHistory = async () => {
    try {
      const response = await fetch(
        "https://gotchamate-api.vercel.app//api/struk",
      );
      const data = await response.json();
      setHistoryStruk(data);
    } catch (error) {
      console.error("Gagal mengambil data history:", error);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchHistory();
  }, [isAdmin]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === "adminjoki123") {
      setIsAdmin(true);
      setPasswordInput("");
    } else {
      alert("Password salah!");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCetakStruk = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://gotchamate-api.vercel.app//api/struk",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (response.ok) {
        const dataBaru = await response.json();
        setFormData({ nama: "", tugas: "", harga: "", status: "Lunas" });
        fetchHistory();
        setStrukCetak(dataBaru);
      } else {
        alert("Gagal menyimpan struk.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // === LOGIKA PENGURUTAN DATA (SORTING) ===
  const sortedHistory = [...historyStruk].sort((a, b) => {
    if (sortType === "Terbaru") return b.nota.localeCompare(a.nota);
    if (sortType === "Terlama") return a.nota.localeCompare(b.nota);
    if (sortType === "Harga Tertinggi") return b.harga - a.harga;
    if (sortType === "Harga Terendah") return a.harga - b.harga;
    if (sortType === "Nama A-Z") return a.nama.localeCompare(b.nama);
    if (sortType === "Status") return a.status.localeCompare(b.status);
    return 0;
  });

  if (!isAdmin) {
    return (
      <div style={adminStyles.loginPage}>
        <form onSubmit={handleLogin} style={adminStyles.loginForm}>
          <h2 style={{ color: "var(--amalfi-tile)", marginBottom: "15px" }}>
            GotchaMate Admin
          </h2>
          <input
            type="password"
            placeholder="Masukkan Password Admin"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            style={adminStyles.inputField}
            required
          />
          <button type="submit" style={adminStyles.btnPrimary}>
            Akses Dashboard
          </button>
          <Link
            to="/"
            style={{
              marginTop: "15px",
              color: "#666",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            ← Kembali ke Beranda
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div style={adminStyles.dashboardWrapper}>
      <div style={adminStyles.dbHeader}>
        <h2>Dashboard Internal GotchaMate</h2>
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <Link to="/" style={adminStyles.btnSecondary}>
            Lihat Web Klien
          </Link>
          <button
            onClick={() => setIsAdmin(false)}
            style={adminStyles.btnDanger}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={adminStyles.dbContent}>
        {/* FORM INPUT (KIRI) */}
        <div style={adminStyles.sectionBox}>
          <h3>Buat Struk / Nota Baru</h3>
          <form onSubmit={handleCetakStruk} style={adminStyles.formContainer}>
            <input
              type="text"
              name="nama"
              placeholder="Nama Klien"
              value={formData.nama}
              onChange={handleChange}
              style={adminStyles.inputField}
              required
            />
            <input
              type="text"
              name="tugas"
              placeholder="Judul Tugas / Paket SMM"
              value={formData.tugas}
              onChange={handleChange}
              style={adminStyles.inputField}
              required
            />
            <input
              type="number"
              name="harga"
              placeholder="Harga (Contoh: 150000)"
              value={formData.harga}
              onChange={handleChange}
              style={adminStyles.inputField}
              required
            />

            <label
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                color: "#555",
                marginBottom: "-5px",
              }}
            >
              Status Pembayaran:
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={adminStyles.inputField}
              required
            >
              <option value="DP">DP (Down Payment)</option>
              <option value="Pelunasan">Pelunasan</option>
              <option value="Lunas">Lunas</option>
            </select>

            <button type="submit" style={adminStyles.btnPrimary}>
              Simpan & Generate
            </button>
          </form>
        </div>

        {/* TABEL HISTORY (KANAN) */}
        <div style={{ ...adminStyles.sectionBox, flex: 2 }}>
          {/* Header Tabel dengan Dropdown Sorting */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <h3 style={{ margin: 0 }}>Riwayat Transaksi</h3>
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              style={{
                ...adminStyles.inputField,
                width: "auto",
                padding: "8px 12px",
                fontSize: "14px",
              }}
            >
              <option value="Terbaru">Urutkan: Terbaru</option>
              <option value="Terlama">Urutkan: Terlama</option>
              <option value="Harga Tertinggi">Urutkan: Harga Tertinggi</option>
              <option value="Harga Terendah">Urutkan: Harga Terendah</option>
              <option value="Nama A-Z">Urutkan: Klien (A - Z)</option>
              <option value="Status">Urutkan: Berdasarkan Status</option>
            </select>
          </div>

          <div style={{ overflowX: "auto", width: "100%" }}>
            <table style={{ ...adminStyles.table, minWidth: "700px" }}>
              <thead>
                <tr
                  style={{
                    backgroundColor: "var(--amalfi-tile)",
                    color: "white",
                  }}
                >
                  <th style={adminStyles.th}>No. Nota</th>
                  <th style={adminStyles.th}>Tanggal</th>
                  <th style={adminStyles.th}>Klien</th>
                  <th style={adminStyles.th}>Total</th>
                  <th style={adminStyles.th}>Status</th>
                  <th style={adminStyles.th}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {/* Kita melakukan pemetaan pada sortedHistory, bukan historyStruk */}
                {sortedHistory.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      style={{ padding: "15px", textAlign: "center" }}
                    >
                      Belum ada data transaksi.
                    </td>
                  </tr>
                ) : (
                  sortedHistory.map((item) => (
                    <tr
                      key={item._id}
                      style={{ borderBottom: "1px solid #ddd" }}
                    >
                      <td style={adminStyles.td}>
                        <strong>{item.nota}</strong>
                      </td>
                      <td style={adminStyles.td}>{item.tanggal}</td>
                      <td style={adminStyles.td}>{item.nama}</td>
                      <td style={adminStyles.td}>
                        Rp{item.harga.toLocaleString("id-ID")}
                      </td>
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
                                  : "#cce5ff",
                            color:
                              item.status === "Lunas"
                                ? "#155724"
                                : item.status === "DP"
                                  ? "#856404"
                                  : "#004085",
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td style={adminStyles.td}>
                        <button
                          onClick={() => setStrukCetak(item)}
                          style={adminStyles.btnCetakMini}
                        >
                          Cetak
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL POP-UP CETAK STRUK */}
      {strukCetak && (
        <div style={adminStyles.modalOverlay}>
          <div id="area-cetak" style={adminStyles.strukCard}>
            <div style={adminStyles.strukHeader}>
              <h1 style={{ color: "var(--amalfi-tile)", margin: 0 }}>
                GotchaMate
              </h1>
              <p style={{ color: "#666", fontSize: "14px", margin: 0 }}>
                Tugas Beres, Sosmed Sukses.
              </p>
            </div>

            <div style={adminStyles.strukBody}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "5px",
                }}
              >
                <span>
                  <strong>No. Nota:</strong>
                </span>
                <span>{strukCetak.nota}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "15px",
                }}
              >
                <span>
                  <strong>Tanggal:</strong>
                </span>
                <span>{strukCetak.tanggal}</span>
              </div>

              <div
                style={{
                  borderTop: "2px dashed #ccc",
                  borderBottom: "2px dashed #ccc",
                  padding: "15px 0",
                  margin: "15px 0",
                }}
              >
                <p style={{ marginBottom: "5px" }}>
                  <strong>Klien:</strong> {strukCetak.nama}
                </p>
                <p style={{ marginBottom: "5px" }}>
                  <strong>Layanan:</strong> {strukCetak.tugas}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Status Pembayaran:</strong>{" "}
                  <span
                    style={{ fontWeight: "bold", color: "var(--amalfi-tile)" }}
                  >
                    {strukCetak.status}
                  </span>
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "18px",
                  color: "var(--amalfi-tile)",
                }}
              >
                <span>
                  <strong>TOTAL:</strong>
                </span>
                <span>
                  <strong>Rp{strukCetak.harga.toLocaleString("id-ID")}</strong>
                </span>
              </div>
            </div>

            <div
              style={{
                textAlign: "center",
                marginTop: "20px",
                color: "#888",
                fontSize: "12px",
              }}
            >
              <p>Terima kasih telah menggunakan jasa kami!</p>
              <p>We got your back!</p>
            </div>

            <div
              className="no-print"
              style={{ display: "flex", gap: "10px", marginTop: "25px" }}
            >
              <button
                onClick={() => window.print()}
                style={{
                  ...adminStyles.btnPrimary,
                  backgroundColor: "var(--citrus-zest)",
                  color: "var(--amalfi-tile)",
                }}
              >
                🖨️ Simpan PDF / Print
              </button>
              <button
                onClick={() => setStrukCetak(null)}
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

const adminStyles = {
  // Tambahan padding agar di HP tidak menempel ke pinggir layar
  loginPage: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "var(--cream-gelato)",
    padding: "20px",
  },

  // width diubah jadi 100% dengan batas maksimal 350px agar otomatis mengecil di HP
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

  dashboardWrapper: {
    minHeight: "100vh",
    backgroundColor: "#fdfbf7",
    padding: "20px",
  },

  // Ditambahkan flexWrap agar tombol "Logout" dan "Lihat Web" bisa turun ke bawah jika layar sempit
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

  // flexBasis 100% memastikan kotaknya langsung mengambil lebar penuh saat turun ke bawah
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
  inputField: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
    width: "100%",
    outline: "none",
    backgroundColor: "white",
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
  th: { padding: "12px", fontSize: "15px" },
  td: { padding: "12px", fontSize: "15px", color: "#444" },

  // Tambahan padding agar pop-up tidak mepet tepi layar
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

  // Tambahan maxHeight & overflowY agar jika struk panjang, bisa di-scroll di dalam HP
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
