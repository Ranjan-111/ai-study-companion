import { HiOutlineSearch } from 'react-icons/hi';
import './SearchBar.css';

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="search-bar">
      <HiOutlineSearch className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button className="search-clear" onClick={() => onChange('')}>
          ×
        </button>
      )}
    </div>
  );
}
