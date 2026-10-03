export default function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium">{label}</label>}
      <textarea
        rows={4}
        className={`w-full bg-surface border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 ${
          error ? 'border-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}