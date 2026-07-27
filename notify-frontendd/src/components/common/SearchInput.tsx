'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchInputProps {
  placeholder?: string;
  onSearch: (value: string) => void;
}

export function SearchInput({ placeholder = 'Search…', onSearch }: SearchInputProps) {
  const [value, setValue] = useState('');
  const debounced = useDebounce(value);

  useEffect(() => {
    onSearch(debounced);
  }, [debounced]);

  return (
    <div className="relative w-64">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        className="pl-8"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}