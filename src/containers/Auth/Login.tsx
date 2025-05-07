import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { AppDispatch } from '../../state/store';
import { login, selectAuthLoading, selectAuthError } from '../../state/slices/auth.slice';
import type { LoginRequest } from '../../types/auth';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import AuthCard from '../../components/auth/AuthCard';

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

  const subtitle = (
    <>
      {t('or')}{' '}
      <Link to="/signup" className="font-medium text-leaf-600 hover:text-leaf-700 transition-colors duration-200">
        {t('create_new_account')}
      </Link>
    </>
  );
  
  return (
    <AuthCard 
      title={t('sign_in_to_account')}
      subtitle={subtitle}
      icon="🌾"
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
              placeholder={t('enter_your_email')}
              error={error ? '' : undefined}
              className="border-soil-200 focus:border-leaf-500 focus:ring-leaf-500"
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
              placeholder={t('enter_your_password')}
              error={error ? '' : undefined}
              className="border-soil-200 focus:border-leaf-500 focus:ring-leaf-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-leaf-600 focus:ring-leaf-500 border-soil-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-soil-700">
              {t('remember_me')}
            </label>
          </div>

          <div className="text-sm">
            <Link to="/forgot-password" className="font-medium text-wheat-600 hover:text-wheat-700 transition-colors duration-200">
              {t('forgot_password')}
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
            className="bg-leaf-600 hover:bg-leaf-700 focus:ring-leaf-500"
          >
            {t('sign_in')}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
};

export default Login; 