import { useState } from "react";
import type { Pengguna } from "../types/domain";

type ProfilProps = {
  penggunaAktif: Pengguna;
  onSubmit: (form: Pick<Pengguna, "name" | "age" | "gender" | "city" | "occupation">) => void;
  onGantiPassword: (currentPassword: string, nextPassword: string) => boolean;
};

export function Profil({ penggunaAktif, onSubmit, onGantiPassword }: ProfilProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: penggunaAktif.name,
    age: penggunaAktif.age,
    gender: penggunaAktif.gender,
    city: penggunaAktif.city,
    occupation: penggunaAktif.occupation
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", nextPassword: "", confirmPassword: "" });

  function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    onSubmit(form);
    setEditing(false);
  }

  function savePassword(event: React.FormEvent) {
    event.preventDefault();
    if (passwordForm.nextPassword !== passwordForm.confirmPassword) return;
    const ok = onGantiPassword(passwordForm.currentPassword, passwordForm.nextPassword);
    if (ok) {
      setPasswordForm({ currentPassword: "", nextPassword: "", confirmPassword: "" });
    }
  }

  return (
    <section className="two-column no-card-grid">
      <div className="section-block">
        <div className="section-heading row-heading">
          <div>
            <p className="eyebrow">Data responden</p>
            <h2>Profil akun</h2>
            <p>Profil ini dipakai sebagai konteks responden pada hasil survei.</p>
          </div>
          {!editing && (
            <button className="primary-button" type="button" onClick={() => setEditing(true)}>
              Edit Akun
            </button>
          )}
        </div>

        <form className="form-stack wide-form" onSubmit={saveProfile}>
          <div className="form-grid">
            <label>
              Nama
              <input
                value={form.name}
                disabled={!editing}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
            </label>
            <label>
              Email
              <input value={penggunaAktif.email} disabled />
            </label>
          </div>
          <div className="form-grid">
            <label>
              Umur
              <input
                value={form.age}
                disabled={!editing}
                onChange={(event) => setForm({ ...form, age: event.target.value })}
              />
            </label>
            <label>
              Gender
              <select
                value={form.gender}
                disabled={!editing}
                onChange={(event) => setForm({ ...form, gender: event.target.value })}
              >
                <option value="">Pilih</option>
                <option>Laki-laki</option>
                <option>Perempuan</option>
                <option>Lainnya</option>
              </select>
            </label>
          </div>
          <div className="form-grid">
            <label>
              Kota
              <input
                value={form.city}
                disabled={!editing}
                onChange={(event) => setForm({ ...form, city: event.target.value })}
              />
            </label>
            <label>
              Pekerjaan
              <input
                value={form.occupation}
                disabled={!editing}
                onChange={(event) => setForm({ ...form, occupation: event.target.value })}
              />
            </label>
          </div>
          {editing && (
            <div className="button-row">
              <button className="ghost-button" type="button" onClick={() => setEditing(false)}>
                Batal
              </button>
              <button className="primary-button">Simpan Perubahan</button>
            </div>
          )}
        </form>
      </div>

      <div className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Keamanan</p>
          <h2>Ganti password</h2>
        </div>
        <form className="form-stack" onSubmit={savePassword}>
          <label>
            Password Saat Ini
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })}
              required
            />
          </label>
          <label>
            Password Baru
            <input
              type="password"
              value={passwordForm.nextPassword}
              onChange={(event) => setPasswordForm({ ...passwordForm, nextPassword: event.target.value })}
              required
            />
          </label>
          <label>
            Konfirmasi Password Baru
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(event) => setPasswordForm({ ...passwordForm, confirmPassword: event.target.value })}
              required
            />
          </label>
          <button className="primary-button">Ganti Password</button>
        </form>
      </div>
    </section>
  );
}
