import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useForm from '../hooks/useForm';
import FormField from '../components/FormField';
import bgLogin from '../../photos/background login.jfif';
import cardImg from '../../photos/shirt_pics/sample1.jpg';

const VALIDATION_RULES = {
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
  email: '',
  password: '',
};

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/';

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
      await login(formValues.email, formValues.password);
      // Send them back to the page they tried to visit when they were redirected to the login page. Use { replace: true } so we don't create another entry in the history stack for the login page.
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled by context toast
      console.error('Login failed', error);
    }
  };

  return (
    <>
      <style>{loginCSS}</style>
      <div className="login-page">
        <div className="login-card">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Please log in to continue</p>
          
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="login-fields">
              <FormField
                label="Email Address"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                touched={touched.email}
                placeholder="you@example.com"
                required
              />
              
              <FormField
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password}
                touched={touched.password}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="login-submit-btn"
            >
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="login-link">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

const loginCSS = `
  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    background: var(--color-bg-elevated);
    position: relative;
  }
  .login-card {
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
  .login-card > * {
    position: relative;
    z-index: 2;
  }
  .login-title {
    font-family: var(--font-display);
    font-size: 2rem;
    font-weight: 800;
    color: var(--color-text-primary);
    margin-bottom: 8px;
    text-align: center;
    letter-spacing: 0.5px;
  }
  .login-subtitle {
    color: var(--color-text-secondary);
    text-align: center;
    margin-bottom: 36px;
    font-size: 0.85rem;
    font-weight: 500;
    letter-spacing: 0.5px;
  }
  .login-fields {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 32px;
  }
  .login-submit-btn {
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
  .login-submit-btn:hover:not(:disabled) {
    background: var(--color-gold-light);
    transform: translateY(-2px);
    box-shadow: 0 4px 14px var(--color-gold-glow);
  }
  .login-submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .login-footer {
    margin-top: 24px;
    text-align: center;
    color: var(--color-text-muted);
    font-size: 0.9rem;
  }
  .login-link {
    color: var(--color-gold);
    font-weight: 800;
    text-decoration: none;
    transition: color 0.2s;
  }
  .login-link:hover {
    color: var(--color-gold-light);
    text-decoration: underline;
  }
`;

export default LoginPage;
