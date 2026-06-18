type KartuMetrikProps = {
  label: string;
  value: string;
};

export function KartuMetrik({ label, value }: KartuMetrikProps) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
