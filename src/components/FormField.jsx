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

  return (
    <>
      <style>{formCSS}</style>
      <div className="form-field">
        <label className="form-label" htmlFor={name}>
          {label}
          {required && <span className="form-required"> *</span>}
        </label>

        <div className="form-input-wrap">
          {type === 'textarea' ? (
            <textarea
              id={name}
              name={name}
              className={`form-input form-textarea ${showError ? 'form-input--error' : ''} ${showSuccess ? 'form-input--success' : ''}`}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
            />
          ) : type === 'select' ? (
            <select
              id={name}
              name={name}
              className={`form-input form-select ${showError ? 'form-input--error' : ''} ${showSuccess ? 'form-input--success' : ''}`}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
            >
              <option value="">Select {label}</option>
              {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : type === 'checkbox' ? (
            <div className="form-checkbox-wrap">
              <input
                id={name}
                name={name}
                type="checkbox"
                className="form-checkbox"
                checked={value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
              />
              <span className="form-checkbox-label">{placeholder}</span>
            </div>
          ) : (
            <input
              id={name}
              name={name}
              type={type}
              className={`form-input ${showError ? 'form-input--error' : ''} ${showSuccess ? 'form-input--success' : ''}`}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              disabled={disabled}
              autoComplete="off"
            />
          )}
        </div>

        {hint && !showError && <p className="form-hint">{hint}</p>}
        {showError && <p className="form-error-msg">⚠ {error}</p>}
      </div>
    </>
  );
}

const formCSS = `
  .form-field { display: flex; flex-direction: column; gap: 8px; width: 100%; margin-bottom: 4px; }
  .form-label { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: var(--color-text-muted); }
  .form-required { color: var(--color-error); }
  
  .form-input-wrap { position: relative; }
  
  .form-input { 
    width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.03); 
    border: 1px solid var(--color-border); border-radius: 6px; 
    font-size: 0.95rem; color: #ffffff; outline: none; transition: all 0.2s; 
    font-family: var(--font-body);
  }
  .form-input:focus { border-color: var(--color-gold); background: rgba(255,255,255,0.05); }
  .form-input--error { border-color: var(--color-error); }
  .form-input--success { border-color: var(--color-success); }
  .form-input:disabled { opacity: 0.5; cursor: not-allowed; }

  .form-textarea { resize: vertical; min-height: 100px; }
  
  .form-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23FFB800' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 16px center; padding-right: 44px; cursor: pointer; }
  .form-select option { background: var(--color-bg-elevated); color: #ffffff; }

  .form-checkbox-wrap { display: flex; align-items: center; gap: 12px; cursor: pointer; padding: 4px 0; }
  .form-checkbox { width: 18px; height: 18px; border-radius: 4px; border: 1px solid var(--color-border); background: transparent; cursor: pointer; accent-color: var(--color-gold); }
  .form-checkbox-label { font-size: 0.9rem; color: var(--color-text-secondary); }

  .form-hint { font-size: 0.75rem; color: var(--color-text-muted); font-style: italic; }
  .form-error-msg { font-size: 0.75rem; color: var(--color-error); font-weight: 700; margin-top: 2px; }
`;

export default FormField;