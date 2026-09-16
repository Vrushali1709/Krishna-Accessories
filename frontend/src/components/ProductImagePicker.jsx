import React, { useRef, useState } from 'react';
import { ImageIcon, Upload } from 'lucide-react';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Unable to read image file'));
    reader.readAsDataURL(file);
  });
}

export default function ProductImagePicker({ value, onChange, required = false, alt }) {
  const inputRef = useRef(null);
  const [error, setError] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      setError('Please choose an image smaller than 5 MB.');
      event.target.value = '';
      return;
    }

    try {
      setError('');
      onChange(await fileToDataUrl(file));
    } catch {
      setError('This image could not be loaded. Please try another file.');
    }
  };

  return (
    <div className="flex-1 min-w-0">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="sr-only"
        required={required && !value}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-left text-[11px] outline-none hover:bg-white hover:border-zinc-400 focus:border-zinc-400 transition"
      >
        <span className="flex items-center gap-1.5 font-medium text-zinc-700">
          <Upload className="h-3.5 w-3.5 shrink-0" />
          {value ? 'Replace selected image' : 'Choose image from device'}
        </span>
      </button>
      <p className="text-[10px] text-zinc-400 mt-1">JPG, PNG or WEBP, max 5 MB</p>
      {error && <p className="text-[10px] text-red-600 mt-1">{error}</p>}
    </div>
  );
}

export function ProductImagePreview({ value, alt }) {
  return value ? (
    <img
      src={value}
      alt={alt}
      className="h-full w-full object-contain p-0.5"
      onError={event => { event.currentTarget.style.display = 'none'; }}
    />
  ) : (
    <ImageIcon className="h-5 w-5 text-zinc-300" />
  );
}