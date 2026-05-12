import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useForm from '../hooks/useForm';
import FormField from '../components/FormField';
import heroImage from '../../photos/shirt_pics/sample2.jpg';

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
      await register(formValues.name, formValues.email, formValues.password);
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled by context toast
      console.error('Registration failed', error);
    }
  };

  return (
    <>
      <style>{signupCSS}</style>
      <div className="signup-page">
        <div className="signup-card">
          <h1 className="signup-title">Create an Account</h1>
          <p className="signup-subtitle">Sign up to join Karigar</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="signup-fields">
              <FormField
                label="Full Name"
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.name}
                touched={touched.name}
                placeholder="Jane Doe"
                required
              />
              
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
              className="signup-submit-btn"
            >
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
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    background: var(--color-bg);
  }
  .signup-card {
    background: var(--color-bg-elevated);
    padding: 48px;
    border-radius: 12px;
    border: 1px solid var(--color-border);
    width: 100%;
    maxWidth: 480px;
    box-shadow: 0 32px 64px rgba(0,0,0,0.4);
    animation: panelFadeUp 0.5s ease;
  }
  .signup-title {
    font-family: var(--font-display);
    font-size: 2.2rem;
    font-weight: 900;
    color: #ffffff;
    margin-bottom: 8px;
    text-align: center;
  }
  .signup-subtitle {
    color: var(--color-text-muted);
    text-align: center;
    margin-bottom: 32px;
    font-size: 0.95rem;
  }
  .signup-fields {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 32px;
  }
  .signup-submit-btn {
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
  .signup-submit-btn:hover:not(:disabled) {
    background: var(--color-gold-light);
    transform: translateY(-2px);
    box-shadow: var(--shadow-gold);
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
