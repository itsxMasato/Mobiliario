import React from 'react';

export default function SearchBox({ value, onChange, placeholder }) {
  return (
    <div className="searchbox-component">
      <input
        type="text"
        placeholder={placeholder || '🔍 Buscar por nombre, código, descripción o estado...'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
      />
    </div>
  );
}
