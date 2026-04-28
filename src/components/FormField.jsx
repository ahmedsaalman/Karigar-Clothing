// src/components/FormField.jsx

function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  required = false,
  disabled = false,
  options = [],
  rows = 4,
  hint,
}) {
  const showError = touched && error;
  const showSuccess = touched && !error && value;

  const inputStyle = {
    ...styles.input,
    borderColor: showError
      ? '#e74c3c'
      : showSuccess
      ? '#27ae60'
      : '#e0e0e0',
    backgroundColor: disabled ? '#f9f9f9' : '#ffffff',
  };

  return (
    <div style={styles.fieldWrapper}>

      <label style={styles.label} htmlFor={name}>
        {label}
        {required && <span style={styles.required}> *</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          style={{ ...inputStyle, ...styles.textarea }}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          style={{ ...inputStyle, ...styles.select }}
        >
          <option value="">Select {label}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === 'checkbox' ? (
        <div style={styles.checkboxWrapper}>
          <input
            id={name}
            name={name}
            type="checkbox"
            checked={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            style={styles.checkbox}
          />
          <span style={styles.checkboxLabel}>{placeholder}</span>
        </div>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          style={inputStyle}
          autoComplete="off"
        />
      )}

      {hint && !showError && (
        <p style={styles.hint}>{hint}</p>
      )}

      {showError && (
        <p style={styles.errorText}>⚠ {error}</p>
      )}

      {showSuccess && type !== 'checkbox' && type !== 'select' && (
        <p style={styles.successText}>✓ Looks good</p>
      )}

    </div>
  );
}

const styles = {
  fieldWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.82rem',
    fontWeight: '600',
    color: '#333',
    letterSpacing: '0.3px',
  },
  required: {
    color: '#e74c3c',
  },
  input: {
    padding: '12px 14px',
    border: '1px solid #e0e0e0',
    borderRadius: '2px',
    fontSize: '0.9rem',
    color: '#1a1a1a',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
    boxSizing: 'border-box',
  },
  textarea: {
    resize: 'vertical',
    minHeight: '100px',
    fontFamily: 'inherit',
  },
  select: {
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage:
      'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23888\' d=\'M6 8L1 3h10z\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    paddingRight: '36px',
  },
  checkboxWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  checkboxLabel: {
    fontSize: '0.85rem',
    color: '#555',
    lineHeight: '1.4',
  },
  hint: {
    fontSize: '0.76rem',
    color: '#aaa',
    lineHeight: '1.4',
  },
  errorText: {
    fontSize: '0.78rem',
    color: '#e74c3c',
    lineHeight: '1.4',
  },
  successText: {
    fontSize: '0.78rem',
    color: '#27ae60',
  },
};

export default FormField;