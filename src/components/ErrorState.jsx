import Button from './ui/Button';

export default function ErrorState({ message = 'Une erreur est survenue', onRetry }) {
  return (
    <div className="text-center py-20">
      <p className="text-red-600 mb-6">{message}</p>
      {onRetry && <Button onClick={onRetry}>Réessayer</Button>}
    </div>
  );
}