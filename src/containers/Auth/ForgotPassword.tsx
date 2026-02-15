import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import AuthCard from '../../components/auth/AuthCard';
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
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || t('something_went_wrong'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AuthCard
      title={t('forgot_password')}
      subtitle={t('enter_email_for_reset')}
      icon="🌱"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
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
            placeholder={t('auth.email')}
            error={error || undefined}
            className="border-soil-200 focus:border-leaf-500 focus:ring-leaf-500"
          />
        </div>
        
        {success && (
          <div className="rounded-md bg-leaf-50 p-4 border border-leaf-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-leaf-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-leaf-800">{success}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link to="/login" className="font-medium text-leaf-600 hover:text-leaf-700 transition-colors duration-200">
              {t('auth.backToLogin')}
            </Link>
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            variant="primary"
            className="bg-leaf-600 hover:bg-leaf-700 focus:ring-leaf-500"
          >
            {t('reset_password')}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
};

export default ForgotPassword; 