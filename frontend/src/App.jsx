import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import { SearchBar } from "./SearchBar.jsx";

function App() {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const apiBaseUrl = useMemo(
    () => import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
    []
  );

  const loadItems = useCallback(
    async (query = "") => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const url = new URL(`${apiBaseUrl}/api/items`);

        if (query.trim()) {
          url.searchParams.set("search", query.trim());
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Unable to load items");
        }

        const data = await response.json();
        setItems(Array.isArray(data) ? data : []);
      } catch {
        setErrorMessage("Failed to load items from backend.");
      } finally {
        setIsLoading(false);
      }
    },
    [apiBaseUrl]
  );

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    void loadItems(query);
  };

  const handleAddItem = async (event) => {
    event.preventDefault();

    if (!newItemName.trim()) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newItemName }),
      });

      if (!response.ok) {
        throw new Error("Unable to add item");
      }

      setNewItemName("");

      // Reload using the current search query
      await loadItems(searchQuery);
    } catch {
      setErrorMessage("Failed to add item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="app">
      <header className="app-header">
        <h1>Inventory Dashboard</h1>
        <p>
          A simple full-stack starter app using React, Node.js, and PostgreSQL.
        </p>
      </header>

      <SearchBar onSearch={handleSearch} />

      <section className="card">
        <h2>Add item</h2>

        <form className="item-form" onSubmit={handleAddItem}>
          <input
            type="text"
            value={newItemName}
            onChange={(event) => setNewItemName(event.target.value)}
            placeholder="Enter item name"
            maxLength={120}
          />

          <button
            type="submit"
            disabled={isSubmitting || !newItemName.trim()}
          >
            {isSubmitting ? "Adding..." : "Add"}
          </button>

          <button
            type="button"
            className="secondary"
            onClick={() => loadItems(searchQuery)}
            disabled={isLoading}
          >
            Refresh
          </button>
        </form>
      </section>

      <section className="card">
        <h2>Items</h2>

        {errorMessage && <p className="error">{errorMessage}</p>}

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td colSpan={2} className="empty">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}

export default App;
