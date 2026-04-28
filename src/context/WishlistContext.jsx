// src/context/WishlistContext.jsx

import { createContext, useContext } from 'react';
import useWishlist from '../hooks/useWishlist';

const WishlistContext = createContext(null);

function WishlistProvider({ children }) {
  const wishlist = useWishlist();

  return (
    <WishlistContext.Provider value={wishlist}>
      {children}
    </WishlistContext.Provider>
  );
}

function useWishlistContext() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error(
      'useWishlistContext must be used inside WishlistProvider'
    );
  }
  return context;
}

export { WishlistProvider, useWishlistContext };