'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';

interface AddressData {
  address: string;
  postalCode: string;
  city: string;
  province: string;
  country: string;
}

interface Suggestion {
  description: string;
  place_id: string;
}

interface AddressAutocompleteProps {
  onAddressSelect: (data: AddressData) => void;
  placeholder?: string;
  initialValue?: string;
}

export function AddressAutocomplete({ onAddressSelect, placeholder = 'Busca tu dirección...', initialValue = '' }: AddressAutocompleteProps) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (input: string) => {
    if (input.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/address?input=${encodeURIComponent(input)}`);
      const data = await res.json();
      setSuggestions(data);
      setIsOpen(data.length > 0);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const handleSelect = async (suggestion: Suggestion) => {
    setQuery(suggestion.description);
    setSuggestions([]);
    setIsOpen(false);

    try {
      const res = await fetch(`/api/address/details?placeId=${suggestion.place_id}`);
      const data: AddressData = await res.json();
      onAddressSelect(data);
    } catch {
      onAddressSelect({
        address: suggestion.description,
        postalCode: '',
        city: '',
        province: '',
        country: '',
      });
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => { if (suggestions.length > 0) setIsOpen(true); }}
          placeholder={placeholder}
          className="w-full pl-9 pr-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          autoComplete="off"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-900 border rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((s) => (
            <li key={s.place_id}>
              <button
                type="button"
                onClick={() => handleSelect(s)}
                className="w-full text-left px-3 py-2.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border-b last:border-b-0 border-zinc-100 dark:border-zinc-800"
              >
                <MapPin className="inline h-3.5 w-3.5 mr-2 text-muted-foreground" />
                {s.description}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
