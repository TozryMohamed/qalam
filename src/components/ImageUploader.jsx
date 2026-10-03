import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadImage } from '../services/storage';

export default function ImageUploader({ bucket, folder, value, onChange, label = 'Image' }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const url = await uploadImage(file, bucket, folder);
      onChange(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium">{label}</label>}

      {value ? (
        <div className="relative aspect-[16/9] rounded overflow-hidden bg-border">
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 end-2 bg-black/60 text-white rounded-full p-1"
            aria-label="Retirer"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center aspect-[16/9] border-2 border-dashed border-border rounded cursor-pointer hover:border-accent transition">
          <Upload size={20} className="text-muted mb-2" />
          <span className="text-sm text-muted">
            {uploading ? 'Envoi…' : 'Choisir une image'}
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFile}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}