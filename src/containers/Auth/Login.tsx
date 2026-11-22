import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/store';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { login, selectAuthLoading, selectAuthError } from '../../state/slices/auth.slice';
import type { LoginRequest } from '../../types/auth';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import AuthCard from '../../components/auth/AuthCard';

const Login = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  
  const [credentials, setCredentials] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(login(credentials));
      if (login.fulfilled.match(resultAction)) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const subtitle = (
    <>
      {t('or')}{' '}
      <Link to="/signup" className="font-medium text-leaf-600 hover:text-leaf-700 transition-colors duration-200">
        {t('auth.createAccount')}
      </Link>
    </>
  );
  
  return (
    <AuthCard
      title={t('auth.signIn')}
      subtitle={subtitle}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={credentials.email}
              onChange={handleChange}
              label={t('email')}
              placeholder={t('auth.email')}
              error={error ? '' : undefined}
            />
          </div>
          <div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={credentials.password}
              onChange={handleChange}
              label={t('password')}
              placeholder={t('auth.password')}
              error={error ? '' : undefined}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-leaf-600 focus:ring-leaf-500 border-border dark:border-border-dark rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-textSecondary dark:text-textSecondary-dark">
              {t('auth.rememberMe')}
            </label>
          </div>

          <div className="text-sm">
            <Link to="/forgot-password" className="font-medium text-leaf-600 hover:text-leaf-700 dark:text-leaf-400 dark:hover:text-leaf-300 transition-colors duration-200">
              {t('auth.forgotPassword')}
            </Link>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm mt-2 bg-red-50 p-3 rounded-md border border-red-100">
            {error}
          </div>
        )}

        <div>
          <Button
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
            fullWidth
            variant="primary"
            className="focus:ring-leaf-500"
          >
            {t('auth.signIn')}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
};

export default Login; 