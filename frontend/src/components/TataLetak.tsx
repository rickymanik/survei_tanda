import { BarChart3, Gift, Home, LogOut, UserRound } from "lucide-react";
import type { RuteAplikasi, Pengguna } from "../types/domain";
import { judulHalaman } from "../utils/rute";

type TataLetakProps = {
  penggunaAktif: Pengguna;
  route: RuteAplikasi;
  onNavigate: (route: RuteAplikasi) => void;
  onKeluar: () => void;
  children: React.ReactNode;
  pesan: string;
};

export function TataLetak({ penggunaAktif, route, onNavigate, onKeluar, children, pesan }: TataLetakProps) {
  const navItems = [
    { route: { name: "beranda" } as RuteAplikasi, label: "Beranda", icon: Home },
    { route: { name: "survei-saya" } as RuteAplikasi, label: "Survei Saya", icon: BarChart3 },
    { route: { name: "hadiah" } as RuteAplikasi, label: "Hadiah", icon: Gift },
    { route: { name: "profil" } as RuteAplikasi, label: "Profil", icon: UserRound }
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand brand-button" onClick={() => onNavigate({ name: "beranda" })}>
          <img
            src="/images/logo.png"
            alt="t.anda"
            className="brand-logo"
          />
        </button>

        <nav className="nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={route.name === item.route.name ? "active" : ""}
                onClick={() => onNavigate(item.route)}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <button className="sidebar-profile" onClick={() => onNavigate({ name: "profil" })}>
          <div className="avatar">{penggunaAktif.name[0].toUpperCase()}</div>
          <div>
            <strong>{penggunaAktif.name}</strong>
            <small>{penggunaAktif.points} poin</small>
          </div>
        </button>

        <button className="ghost-button icon-button mobile-logout" onClick={onKeluar}>
          <LogOut size={18} />
          Keluar
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">Platform survei online</p>
            <h1>{judulHalaman(route)}</h1>
          </div>
          <button className="ghost-button icon-button" onClick={onKeluar}>
            <LogOut size={18} />
            Keluar
          </button>
        </header>

        {pesan && <div className="flash">{pesan}</div>}
        {children}
      </main>
    </div>
  );
}
