import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useForm from '../hooks/useForm';
import FormField from '../components/FormField';
import bgLogin from '../../photos/background login.jfif';
import cardImg from '../../photos/shirt_pics/sample1.jpg';

const VALIDATION_RULES = {
  name: {
    required: true,
    requiredMessage: 'Name is required',
    minLength: 2,
    minLengthMessage: 'Name must be at least 2 characters',
  },
  email: {
    required: true,
    requiredMessage: 'Email is required',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    patternMessage: 'Please enter a valid email address',
  },
  password: {
    required: true,
    requiredMessage: 'Password is required',
    minLength: 6,
    minLengthMessage: 'Password must be at least 6 characters',
  },
};

const INITIAL_VALUES = {
  name: '',
  email: '',
  password: '',
};

function SignUpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const from = location.state?.from?.pathname || '/';

  const [showAdminField, setShowAdminField] = useState(false);
  const [roleSecret, setRoleSecret] = useState('');

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(INITIAL_VALUES, VALIDATION_RULES);

  const onSubmit = async (formValues) => {
    try {
      await register(formValues.name, formValues.email, formValues.password, roleSecret);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  return (
    <>
      <style>{signupCSS}</style>
      <div className="signup-page">
        <div className="signup-card">
          <h1 className="signup-title">Create an Account</h1>
          <p className="signup-subtitle">Sign up to join Aam Admii</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="signup-fields">
              <FormField label="Full Name" name="name" type="text" value={values.name} onChange={handleChange} onBlur={handleBlur} error={errors.name} touched={touched.name} placeholder="Jane Doe" required />
              <FormField label="Email Address" name="email" type="email" value={values.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} touched={touched.email} placeholder="you@example.com" required />
              <FormField label="Password" name="password" type="password" value={values.password} onChange={handleChange} onBlur={handleBlur} error={errors.password} touched={touched.password} placeholder="••••••••" required />
              
              <div className="admin-toggle-wrap">
                <button type="button" className="admin-toggle-btn" onClick={() => setShowAdminField(!showAdminField)}>
                  {showAdminField ? 'Registering as Admin' : 'Register as Customer?'}
                </button>
              </div>

              {showAdminField && (
                <div className="admin-secret-field">
                  <FormField 
                    label="Admin Secret Key" 
                    name="roleSecret" 
                    value={roleSecret} 
                    onChange={(e) => setRoleSecret(e.target.value)} 
                    placeholder="Enter admin secret"
                    hint="Required for admin accounts"
                  />
                </div>
              )}
            </div>

            <button type="submit" disabled={isSubmitting} className="signup-submit-btn">
              {isSubmitting ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>

          <div className="signup-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="signup-link">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

const signupCSS = `
  .signup-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    background: var(--color-bg-elevated);
    position: relative;
  }
  .signup-card {
    position: relative;
    background: var(--color-bg-card);
    padding: 50px 40px;
    border-radius: 16px;
    width: 100%;
    max-width: 460px;
    box-shadow: 0 16px 48px rgba(0,0,0,0.06);
    overflow: hidden;
    animation: scaleIn 0.6s var(--ease-out);
    border: 1px solid var(--color-border);
    z-index: 2;
  }
  .signup-card > * {
    position: relative;
    z-index: 2;
  }
  .signup-title {
    font-family: var(--font-display);
    font-size: 2rem;
    font-weight: 800;
    color: var(--color-text-primary);
    margin-bottom: 8px;
    text-align: center;
    letter-spacing: 0.5px;
  }
  .signup-subtitle {
    color: var(--color-text-secondary);
    text-align: center;
    margin-bottom: 36px;
    font-size: 0.85rem;
    font-weight: 500;
    letter-spacing: 0.5px;
  }
  .signup-fields {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 24px;
  }
  .admin-toggle-wrap {
    display: flex;
    justify-content: center;
    margin: 10px 0;
  }
  .admin-toggle-btn {
    background: transparent;
    border: none;
    color: var(--color-gold);
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    opacity: 0.8;
    transition: all 0.2s;
  }
  .admin-toggle-btn:hover {
    opacity: 1;
    text-decoration: underline;
  }
  .admin-secret-field {
    animation: fadeIn 0.3s ease;
    padding: 15px;
    background: var(--color-gold-dim);
    border: 1px dashed var(--color-gold);
    border-radius: 8px;
  }
  .signup-submit-btn {
    width: 100%;
    padding: 16px;
    background: var(--color-gold);
    color: #ffffff;
    border: none;
    font-family: var(--font-display);
    font-size: 0.95rem;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .signup-submit-btn:hover:not(:disabled) {
    background: var(--color-gold-light);
    transform: translateY(-2px);
    box-shadow: 0 4px 14px var(--color-gold-glow);
  }
  .signup-submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .signup-footer {
    margin-top: 24px;
    text-align: center;
    color: var(--color-text-muted);
    font-size: 0.9rem;
  }
  .signup-link {
    color: var(--color-gold);
    font-weight: 800;
    text-decoration: none;
    transition: color 0.2s;
  }
  .signup-link:hover {
    color: var(--color-gold-light);
    text-decoration: underline;
  }
`;

export default SignUpPage;
