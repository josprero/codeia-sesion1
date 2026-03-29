import { useRef } from 'react';

interface Props {
  value: string;
  onSearch: (q: string) => void;
}

export default function SearchInput({ value, onSearch }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleClear = () => {
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative flex items-center w-64 md:w-96">
      {/* Search icon */}
      <svg
        className="pointer-events-none absolute left-4 h-4 w-4 text-slate-400"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Buscar películas..."
        className="w-full rounded-full border border-white/15 bg-white/10 py-2.5 pl-11 pr-10 text-sm text-white placeholder-slate-400 backdrop-blur-md outline-none transition-all focus:border-primary/60 focus:bg-white/15 focus:ring-2 focus:ring-primary/20"
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full bg-slate-600 text-xs text-white hover:bg-slate-500 transition-colors"
          aria-label="Limpiar búsqueda"
        >
          ✕
        </button>
      )}
    </div>
  );
}
