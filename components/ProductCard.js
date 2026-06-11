import React from 'react';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';

export default function ProductCard({ product, onRemove, onAdd, isDriver, onAddWishlist, onAddCart }) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', textAlign: 'center' }}>
      <img
        src={product.image_url || product.imageUrl || '/images/placeholder.png'}
        alt={product.name || product.title || 'No title'}
        style={{ width: '100%', height: '200px', objectFit: 'cover', marginBottom: '10px' }}
        onError={(e) => e.target.src = '/images/placeholder.png'}
      />
      <h3>{product.name || product.title || 'No title'}</h3>
      <p>{product.price_in_points || (product.price?.value || 0)} pts</p>
      <div style={{ marginTop: '10px' }}>
        {onRemove && (
          <button
            onClick={() => onRemove(product)}
            style={{ backgroundColor: 'red', color: 'white', padding: '8px 12px', margin: '5px' }}
          >
            Remove
          </button>
        )}
        {onAdd && (
          <button
            onClick={() => onAdd(product)}
            style={{ backgroundColor: 'green', color: 'white', padding: '8px 12px', margin: '5px' }}
          >
            Add
          </button>
        )}
        {isDriver && (
          <>
            <button
              onClick={() => onAddWishlist(product)}
              style={{ backgroundColor: '#f0f0f0', padding: '8px 12px', margin: '5px', border: '1px solid #ccc' }}
            >
              <FaHeart />
            </button>
            <button
              onClick={() => onAddCart(product)}
              style={{ backgroundColor: '#f0f0f0', padding: '8px 12px', margin: '5px', border: '1px solid #ccc' }}
            >
              <FaShoppingCart />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

