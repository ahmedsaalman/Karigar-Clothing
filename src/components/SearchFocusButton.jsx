// src/components/SearchFocusButton.jsx
// A button that focuses the search input on the products page

import { useNavigate } from 'react-router-dom';

function SearchFocusButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/products')}
      style={styles.btn}
      title="Search products"
    >
      🔍
    </button>
  );
}

const styles = {
  btn: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '4px 8px',
  },
};

export default SearchFocusButton;