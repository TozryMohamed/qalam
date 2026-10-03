export default function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-border/60 rounded ${className}`} />
  );
}

export function PostCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="w-full aspect-[16/10]" />
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
}