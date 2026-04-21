import { Search } from 'lucide-react';
import { City } from '../api/types';

interface WeatherSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  loading: boolean;
  suggestions: City[];
  onSearch: (e: React.FormEvent) => void;
  onSelectCity: (city: City) => void;
}

export function WeatherSearch({
  searchQuery,
  setSearchQuery,
  loading,
  suggestions,
  onSearch,
  onSelectCity,
}: WeatherSearchProps) {
  return (
    <div className="search-wrapper">
      <form onSubmit={onSearch} className="search-bar">
        <Search size={20} color="#fff" />
        <input
          type="text"
          placeholder="Поиск города..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {loading && <div className="spinner-small"></div>}
      </form>
      
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => onSelectCity(suggestion)}>
              {suggestion.name}, {suggestion.country} 
              {suggestion.state ? ` (${suggestion.state})` : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
