export function LayarMuat() {
  return (
    <div className="preloader" role="status" aria-live="polite">
      <div className="preloader-card">
        <div className="loader-ring" />
        <img src="/images/logo.png" alt="t.anda" className="preloader-logo" />
        <span>Menyiapkan aplikasi survei...</span>
      </div>
    </div>
  );
}
