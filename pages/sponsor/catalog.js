import { useState, useEffect } from 'react';
import axios from 'axios';
import CatalogTabs from '../../components/CatalogTabs';
import ProductCard from '../../components/ProductCard';

export default function SponsorCatalog() {
  const [tab, setTab] = useState('my');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [products, setProducts] = useState([]);
  const [ebayProducts, setEbayProducts] = useState([]);

  // 🔵 NEW: get sponsorId from userSession correctly
  const userSession = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userSession')) : null;
  const sponsorId = userSession?.sponsor_id;

  useEffect(() => {
    if (tab === 'my' && sponsorId) {
      axios.get(`/api/sponsors/catalog?sponsorId=${sponsorId}`)
        .then(response => setProducts(response.data))
        .catch(error => console.error('Failed to fetch catalog:', error));
    }
  }, [tab, sponsorId]);

  useEffect(() => {
    if (tab === 'add' && search.length > 2 && sponsorId) {
      axios.get(`/api/sponsors/ebay-items?q=${encodeURIComponent(search)}&sponsorId=${sponsorId}`)
        .then(response => setEbayProducts(response.data))
        .catch(error => console.error('Failed to search eBay:', error));
    }
  }, [search, tab, sponsorId]);

  const handleRemove = async (product) => {
    try {
      await axios.delete(`/api/sponsors/catalog/${product.product_id}`);
      setProducts(prev => prev.filter(p => p.product_id !== product.product_id));
    } catch (error) {
      console.error('Failed to remove product:', error);
    }
  };

  const handleAdd = async (product) => {
    try {
      await axios.post(`/api/sponsors/catalog?sponsorId=${sponsorId}`, {
        name: product.title,
        price_in_points: product.price?.value || 0,
        image_url: product.imageUrl || null,
      });
      alert('Item added to catalog!');
    } catch (error) {
      console.error('Failed to add product:', error);
      alert('Failed to add item.');
    }
  };

  const filteredProducts = (tab === 'my' ? products : ebayProducts)
    .filter(product => (product.name || product.title).toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'az') return (a.name || a.title).localeCompare(b.name || b.title);
      if (sort === 'low-high') return (a.price_in_points || a.price?.value || 0) - (b.price_in_points || b.price?.value || 0);
      if (sort === 'high-low') return (b.price_in_points || b.price?.value || 0) - (a.price_in_points || a.price?.value || 0);
      return 0;
    });

  return (
    <div style={{ padding: '20px' }}>
      <h2>Catalog Management</h2>
      <CatalogTabs tab={tab} setTab={setTab} search={search} setSearch={setSearch} sort={sort} setSort={setSort} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {filteredProducts.map(product => (
          <ProductCard
            key={product.product_id || product.itemId}
            product={{
              ...product,
              name: product.name || product.title,
              price_in_points: product.price_in_points || product.price?.value || 0,
              image_url: product.image_url || product.imageUrl,
            }}
            onRemove={tab === 'my' ? handleRemove : undefined}
            onAdd={tab === 'add' ? handleAdd : undefined}
            isDriver={false}
          />
        ))}
      </div>
    </div>
  );
}

