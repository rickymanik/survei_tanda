import { useState } from "react";

type MasukProps = {
  pesan: string;
  onMasuk: (email: string, password: string) => void;
  onKeDaftar: () => void;
};

export function Masuk({ pesan, onMasuk, onKeDaftar }: MasukProps) {
  const [formMasuk, setFormMasuk] = useState({ email: "", password: "" });

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
          <p className="eyebrow">Selamat datang</p>
          <h2>Masuk</h2>
          <p>Masuk untuk membuat survei, mengisi survei, dan mengelola poin.</p>
        </div>

        <form
          className="form-stack"
          onSubmit={(event) => {
            event.preventDefault();
            onMasuk(formMasuk.email, formMasuk.password);
          }}
        >
          <label>
            Email
            <input
              type="email"
              value={formMasuk.email}
              onChange={(event) => setFormMasuk({ ...formMasuk, email: event.target.value })}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={formMasuk.password}
              onChange={(event) => setFormMasuk({ ...formMasuk, password: event.target.value })}
              required
            />
          </label>
          <button className="primary-button">Masuk</button>
        </form>

        <p className="auth-switch">
          Belum punya akun?{" "}
          <button className="link-button" onClick={onKeDaftar}>
            Daftar sekarang
          </button>
        </p>
      </section>
    </main>
  );
}
