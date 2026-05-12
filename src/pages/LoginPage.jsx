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
    background-image: url(${bgLogin});
    background-size: cover;
    background-position: center;
    position: relative;
  }
  .login-page::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(8px);
  }
  .login-card {
    position: relative;
    background-image: url(${cardImg});
    background-size: cover;
    background-position: center;
    padding: 60px 50px;
    border-radius: 20px;
    width: 100%;
    max-width: 500px;
    box-shadow: var(--shadow-xl);
    overflow: hidden;
    animation: scaleIn 0.6s var(--ease-out);
    border: 2px solid var(--color-gold);
    z-index: 2;
  }
  .login-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.95));
    z-index: 1;
  }
  .login-card > * {
    position: relative;
    z-index: 2;
  }
  .login-title {
    font-family: var(--font-display);
    font-size: 2rem;
    font-weight: 900;
    color: #ffffff;
    margin-bottom: 8px;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  .login-subtitle {
    color: var(--color-gold);
    text-align: center;
    margin-bottom: 40px;
    font-size: 0.8rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .login-fields {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 32px;
  }
  .login-submit-btn {
    width: 100%;
    padding: 18px;
    background: var(--color-gold);
    color: #000000;
    border: none;
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 900;
    letter-spacing: 2px;
    text-transform: uppercase;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .login-submit-btn:hover:not(:disabled) {
    background: var(--color-gold-light);
    transform: translateY(-2px);
    box-shadow: var(--shadow-gold);
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
