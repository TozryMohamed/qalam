export default function EmptyState({ title, description, action }) {
  return (
    <div className="text-center py-20">
      <h2 className="font-serif text-2xl text-ink mb-2">{title}</h2>
      {description && <p className="text-muted mb-6">{description}</p>}
      {action}
    </div>
  );
}