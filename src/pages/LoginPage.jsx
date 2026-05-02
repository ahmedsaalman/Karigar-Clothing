import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useForm from '../hooks/useForm';
import FormField from '../components/FormField';
import heroImage from '../../photos/shirt_pics/sample1.jpg';

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
    <div style={styles.page}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Please log in to continue</p>
        
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div style={styles.fieldGroup}>
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
            style={{
              ...styles.submitBtn,
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
          >
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', color: '#555' }}>
          <p>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#1a1a1a', fontWeight: '600', textDecoration: 'none' }}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    backgroundImage: `linear-gradient(rgba(34, 23, 17, 0.72), rgba(34, 23, 17, 0.82)), url(${heroImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    animation: 'softZoom 700ms ease',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: '48px',
    borderRadius: '4px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    width: '100%',
    maxWidth: '480px',
    animation: 'panelFadeUp 480ms ease',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '8px',
    textAlign: 'center',
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: '32px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '32px',
  },
  submitBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '700',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    borderRadius: '2px',
    transition: 'opacity 0.2s',
  },
};

export default LoginPage;
