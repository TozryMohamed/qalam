export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-surface border border-border rounded-lg overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}