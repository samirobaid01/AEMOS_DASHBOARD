import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import * as authService from '../../services/auth.service';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  
  const validateEmail = (): boolean => {
    if (!email.trim()) {
      setError(t('email_required'));
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t('invalid_email'));
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      await authService.forgotPassword(email);
      setSuccess(t('password_reset_email_sent'));
      setEmail('');
    } catch (error: any) {
      setError(error.response?.data?.message || t('something_went_wrong'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('forgot_password')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('enter_email_for_reset')}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={handleChange}
              label={t('email')}
              placeholder={t('enter_your_email')}
              error={error || undefined}
            />
          </div>
          
          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">{success}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                {t('back_to_login')}
              </Link>
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              variant="primary"
            >
              {t('reset_password')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword; 