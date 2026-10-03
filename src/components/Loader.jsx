export default function Loader({ label = 'Chargement…' }) {
  return (
    <div className="flex items-center justify-center py-20 text-muted text-sm">
      {label}
    </div>
  );
}