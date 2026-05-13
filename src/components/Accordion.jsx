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
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    transition: 'border-color 0.3s ease',
  },
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 32px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background-color 0.2s',
  },
  headerText: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'var(--font-display)',
    letterSpacing: '0.5px',
  },
  icon: {
    fontSize: '1.2rem',
    color: '#d4af37',
    fontWeight: '400',
    lineHeight: '1',
    transition: 'transform 0.3s ease',
  },
  panel: {
    overflow: 'hidden',
    transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
  },
  panelContent: {
    padding: '0 32px 32px 32px',
    color: '#aaa',
    fontSize: '0.95rem',
    lineHeight: '1.8',
    fontFamily: 'var(--font-body)',
  },
};
