import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { AppDispatch } from '../../state/store';
import { login, selectAuthLoading, selectAuthError } from '../../state/slices/auth.slice';
import type { LoginRequest } from '../../types/auth';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';

const Login = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
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
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('sign_in_to_account')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('or')}{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              {t('create_new_account')}
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={credentials.email}
                onChange={handleChange}
                label={t('email')}
                placeholder={t('enter_your_email')}
                error={error ? '' : undefined}
              />
            </div>
            <div className="mb-4">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={credentials.password}
                onChange={handleChange}
                label={t('password')}
                placeholder={t('enter_your_password')}
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
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                {t('remember_me')}
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                {t('forgot_password')}
              </Link>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">
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
            >
              {t('sign_in')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 