export default function Avatar({ src, name, size = 40, className = '' }) {
  const initial = name?.[0]?.toUpperCase() || '?';
  return (
    <div
      className={`rounded-full overflow-hidden bg-border shrink-0 flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt={name || ''} className="w-full h-full object-cover" />
      ) : (
        <span className="font-serif text-sm text-muted">{initial}</span>
      )}
    </div>
  );
}