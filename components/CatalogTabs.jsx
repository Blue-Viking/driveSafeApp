import React from 'react';

export default function CatalogTabs({ tab, setTab, search, setSearch, sort, setSort }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div>
        <button
          style={{ marginRight: '10px', backgroundColor: tab === 'my' ? '#007bff' : '#ccc', color: 'white', padding: '10px' }}
          onClick={() => setTab('my')}
        >
          My Catalog
        </button>
        <button
          style={{ backgroundColor: tab === 'add' ? '#007bff' : '#ccc', color: 'white', padding: '10px' }}
          onClick={() => setTab('add')}
        >
          Add to Catalog
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px', width: '300px', marginRight: '10px' }}
        />
        {tab === 'my' && (
          <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ padding: '8px' }}>
            <option value="">Sort By</option>
            <option value="az">Alphabetical (A-Z)</option>
            <option value="low-high">Price Low to High</option>
            <option value="high-low">Price High to Low</option>
          </select>
        )}
      </div>
    </div>
  );
}

