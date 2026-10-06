import { useState } from "react";

export function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    onSearch(query);
  };

  return (
    <form className="item-form" onSubmit={handleSearch}>
      <input
        type="search"
        placeholder="Search items..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <button type="submit">
        Search
      </button>
    </form>
  );
}
