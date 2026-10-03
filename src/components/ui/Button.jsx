export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  as: Tag = 'button',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium transition-colors rounded focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variants = {
    primary: 'bg-accent text-white hover:bg-accent/90',
    secondary: 'bg-ink text-white hover:bg-ink/90',
    outline: 'border border-border text-ink hover:border-accent hover:text-accent',
    ghost: 'text-ink hover:bg-border/40',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <Tag className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Tag>
  );
}