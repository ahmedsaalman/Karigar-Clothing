import { createContext, useContext, useState, useRef } from 'react';

const AccordionContext = createContext();

export function Accordion({ children, style }) {
  const [activeItem, setActiveItem] = useState(null);

  const toggleItem = (id) => {
    setActiveItem(prev => (prev === id ? null : id));
  };

  return (
    <AccordionContext.Provider value={{ activeItem, toggleItem }}>
      <div style={{ ...styles.accordion, ...style }}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({ id, children, style }) {
  return (
    <div style={{ ...styles.item, ...style }}>
      {/* We pass down the id implicitly or use Context. 
          Actually, we can just render the children and let them access context.
          Wait, children need to know the 'id'. We can clone children and pass the id,
          but using a specific context or passing props is easier. */}
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { id });
        }
        return child;
      })}
    </div>
  );
}

export function AccordionHeader({ id, children, style }) {
  const { activeItem, toggleItem } = useContext(AccordionContext);
  const isActive = activeItem === id;

  return (
    <button
      style={{ ...styles.header, ...style }}
      onClick={() => toggleItem(id)}
      aria-expanded={isActive}
    >
      <span style={styles.headerText}>{children}</span>
      <span style={styles.icon}>
        {isActive ? '−' : '+'}
      </span>
    </button>
  );
}

export function AccordionPanel({ id, children, style }) {
  const { activeItem } = useContext(AccordionContext);
  const isActive = activeItem === id;
  const contentRef = useRef(null);

  return (
    <div
      style={{
        ...styles.panel,
        ...style,
        maxHeight: isActive && contentRef.current ? `${contentRef.current.scrollHeight}px` : '0px',
        opacity: isActive ? 1 : 0,
      }}
    >
      <div ref={contentRef} style={styles.panelContent}>
        {children}
      </div>
    </div>
  );
}

import React from 'react';

const styles = {
  accordion: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  item: {
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background-color 0.2s',
  },
  headerText: {
    fontSize: '1.05rem',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  icon: {
    fontSize: '1.5rem',
    color: '#d4af37',
    fontWeight: '300',
    lineHeight: '1',
  },
  panel: {
    overflow: 'hidden',
    transition: 'max-height 0.3s ease, opacity 0.3s ease',
  },
  panelContent: {
    padding: '0 24px 24px 24px',
    color: '#555',
    fontSize: '0.95rem',
    lineHeight: '1.6',
  },
};
