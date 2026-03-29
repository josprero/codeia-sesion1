import { useState } from 'react';

interface Props {
  value: string;
  onSearch: (q: string) => void;
}

export default function SearchInput({ value, onSearch }: Props) {
  const [term, setTerm] = useState(value);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(term);
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Buscar películas..."
        className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-primary"
      />
      <button
        type="submit"
        className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-[#f40612]"
      >
        Buscar
      </button>
    </form>
  );
}
