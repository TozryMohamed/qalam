import Button from './ui/Button';

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-16 flex justify-center items-center gap-2">
      <Button
        variant="outline"
        disabled={page === 0}
        onClick={() => onChange(page - 1)}
      >
        ←
      </Button>
      <span className="text-sm text-muted">
        {page + 1} / {totalPages}
      </span>
      <Button
        variant="outline"
        disabled={page >= totalPages - 1}
        onClick={() => onChange(page + 1)}
      >
        →
      </Button>
    </div>
  );
}