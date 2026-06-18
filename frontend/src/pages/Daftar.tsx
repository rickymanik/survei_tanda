import { useState } from "react";
import type { Pengguna } from "../types/domain";

type DaftarProps = {
  pesan: string;
  onDaftar: (form: Omit<Pengguna, "id" | "points">) => void;
  onKeMasuk: () => void;
};

export function Daftar({ pesan, onDaftar, onKeMasuk }: DaftarProps) {
  const [formDaftar, setFormDaftar] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    city: "",
    occupation: ""
  });

  return (
    <main className="auth-grid">
      <section className="auth-hero">
        <div className="brand">
          <img src="/images/logo.png" alt="t.anda" className="auth-logo" />
        </div>
        <h1>Ruang survei sederhana untuk pembuat riset dan responden.</h1>
        <p>Buat survei, isi survei yang tersedia, kumpulkan poin, lalu tukarkan dengan hadiah.</p>
        <div className="hero-stats">
          <span>
            <strong>Dapatkan poin setiap isi survei</strong>
          </span>
          <span>
            <strong>Gratis buat survei</strong>
          </span>
        </div>
      </section>

      <section className="auth-panel">
        {pesan && <div className="flash">{pesan}</div>}
        <div className="section-heading">
          <p className="eyebrow">Akun baru</p>
          <h2>Daftar</h2>
          <p>Buat akun untuk mulai mengisi survei dan mengumpulkan poin.</p>
        </div>

        <form
          className="form-stack"
          onSubmit={(event) => {
            event.preventDefault();
            onDaftar(formDaftar);
          }}
        >
          <label>
            Nama Lengkap
            <input
              value={formDaftar.name}
              onChange={(event) => setFormDaftar({ ...formDaftar, name: event.target.value })}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={formDaftar.email}
              onChange={(event) => setFormDaftar({ ...formDaftar, email: event.target.value })}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={formDaftar.password}
              onChange={(event) => setFormDaftar({ ...formDaftar, password: event.target.value })}
              required
            />
          </label>
          <div className="form-grid">
            <label>
              Umur
              <input
                value={formDaftar.age}
                onChange={(event) => setFormDaftar({ ...formDaftar, age: event.target.value })}
              />
            </label>
            <label>
              Gender
              <select
                value={formDaftar.gender}
                onChange={(event) => setFormDaftar({ ...formDaftar, gender: event.target.value })}
              >
                <option value="">Pilih</option>
                <option>Laki-laki</option>
                <option>Perempuan</option>
                <option>Lainnya</option>
              </select>
            </label>
          </div>
          <label>
            Kota
            <input
              value={formDaftar.city}
              onChange={(event) => setFormDaftar({ ...formDaftar, city: event.target.value })}
            />
          </label>
          <label>
            Pekerjaan
            <input
              value={formDaftar.occupation}
              onChange={(event) => setFormDaftar({ ...formDaftar, occupation: event.target.value })}
            />
          </label>
          <button className="primary-button">Buat Akun</button>
        </form>

        <p className="auth-switch">
          Sudah punya akun?{" "}
          <button className="link-button" onClick={onKeMasuk}>
            Masuk
          </button>
        </p>
      </section>
    </main>
  );
}
