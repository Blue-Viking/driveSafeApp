import { useState, useEffect } from 'react';
import axios from 'axios';
import CatalogTabs from '../../components/CatalogTabs';
import ProductCard from '../../components/ProductCard';

export default function AdminCatalog() {
  const [sponsors, setSponsors] = useState([]);
  const [selectedSponsor, setSelectedSponsor] = useState('');
  const [tab, setTab] = useState('my');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [products, setProducts] = useState([]);
  const [ebayProducts, setEbayProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/sponsors')
      .then(response => setSponsors(response.data))
      .catch(error => console.error('Failed to fetch sponsors:', error));
  }, []);

  useEffect(() => {
    if (!selectedSponsor) {
      setProducts([]);
      return;
    }
    if (tab === 'my') {
      axios.get(`/api/admin/catalog?sponsorId=${selectedSponsor}`)
        .then(response => setProducts(response.data.catalogItems))
        .catch(error => console.error('Failed to fetch catalog:', error));
    }
  }, [tab, selectedSponsor]);

  useEffect(() => {
    if (!selectedSponsor) return;
    if (tab === 'add' && search.length > 2) {
      axios.get(`/api/sponsors/ebay-items?q=${encodeURIComponent(search)}&sponsorId=${selectedSponsor}`)
        .then(response => setEbayProducts(response.data))
        .catch(error => console.error('Failed to search eBay:', error));
    }
  }, [search, tab, selectedSponsor]);

  const handleRemove = async (product) => {
    try {
      await axios.delete(`/api/admin/catalog`, {
        params: { sponsorId: selectedSponsor, itemId: product.itemId || product.product_id }
      });
      setProducts(prev => prev.filter(p => (p.itemId || p.product_id) !== (product.itemId || product.product_id)));
    } catch (error) {
      console.error('Failed to remove product:', error);
      alert('Failed to remove product.');
    }
  };

  const handleAdd = async (product) => {
    try {
      await axios.post('/api/admin/catalog', {
        sponsorId: selectedSponsor,
        item: {
          itemId: product.itemId,
          title: product.title,
          price: parseFloat(product.price?.value) || 0,
          imageUrl: product.imageUrl || '',
          description: product.condition || '',
        }
      });
      alert('Item added to catalog!');
    } catch (error) {
      console.error('Failed to add product:', error);
      alert('Failed to add item.');
    }
  };

  const filteredProducts = (tab === 'my' ? products : ebayProducts)
    .filter(product => (product.name || product.title || '').toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const aName = a.name || a.title || '';
      const bName = b.name || b.title || '';
      const aPrice = a.price_in_points || a.price?.value || 0;
      const bPrice = b.price_in_points || b.price?.value || 0;
      if (sort === 'az') return aName.localeCompare(bName);
      if (sort === 'low-high') return aPrice - bPrice;
      if (sort === 'high-low') return bPrice - aPrice;
      return 0;
    });

  return (
    <div style={{ padding: '20px' }}>
      <h2 className="text-2xl font-bold mb-6">Admin Catalog Management</h2>

      <div className="mb-6">
        <label className="mr-2">Pick Sponsor:</label>
        <select
          value={selectedSponsor}
          onChange={(e) => setSelectedSponsor(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">— Select a Sponsor —</option>
          {sponsors.map((s) => (
            <option key={s.sponsorId} value={s.sponsorId}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {selectedSponsor && (
        <>
          <CatalogTabs tab={tab} setTab={setTab} search={search} setSearch={setSearch} sort={sort} setSort={setSort} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {filteredProducts.map(product => (
              <ProductCard
                key={product.itemId || product.product_id}
                product={{
                  ...product,
                  name: product.name || product.title,
                  price_in_points: product.price_in_points || product.price?.value || 0,
                  image_url: product.imageUrl || product.image_url || '/placeholder.png',
                }}
                onRemove={tab === 'my' ? handleRemove : undefined}
                onAdd={tab === 'add' ? handleAdd : undefined}
                isDriver={false}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

