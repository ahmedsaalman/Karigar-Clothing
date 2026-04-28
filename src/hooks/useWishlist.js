// src/hooks/useWishlist.js

import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

function useWishlist() {
  const [wishlistItems, setWishlistItems] = useLocalStorage(
    'karigar_wishlist',
    []
  );

  const addToWishlist = useCallback(
    product => {
      setWishlistItems(prev => {
        const exists = prev.some(item => item.id === product.id);
        if (exists) return prev;
        return [...prev, { ...product, addedAt: Date.now() }];
      });
    },
    [setWishlistItems]
  );

  const removeFromWishlist = useCallback(
    productId => {
      setWishlistItems(prev =>
        prev.filter(item => item.id !== productId)
      );
    },
    [setWishlistItems]
  );

  const toggleWishlist = useCallback(
    product => {
      const exists = wishlistItems.some(item => item.id === product.id);
      if (exists) {
        removeFromWishlist(product.id);
        return false;
      } else {
        addToWishlist(product);
        return true;
      }
    },
    [wishlistItems, addToWishlist, removeFromWishlist]
  );

  const isWishlisted = useCallback(
    productId => wishlistItems.some(item => item.id === productId),
    [wishlistItems]
  );

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
  }, [setWishlistItems]);

  return {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isWishlisted,
    clearWishlist,
    wishlistCount: wishlistItems.length,
  };
}

export default useWishlist;