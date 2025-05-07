import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { AppDispatch } from '../../state/store';
import { signup, selectAuthLoading, selectAuthError } from '../../state/slices/auth.slice';
import type { SignupRequest } from '../../types/auth';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import AuthCard from '../../components/auth/AuthCard';

const Signup = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
  const [userData, setUserData] = useState<SignupRequest>({
    userName: '',
    email: '',
    password: '',
    phoneNumber: '',
    notifyByEmail: true,
    notifyBySMS: false,
    termsAndConditions: false,
  });
  
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'passwordConfirm') {
      setPasswordConfirm(value);
      if (userData.password !== value) {
        setFormErrors(prev => ({ 
          ...prev, 
          passwordConfirm: t('passwords_dont_match') 
        }));
      } else {
        setFormErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.passwordConfirm;
          return newErrors;
        });
      }
      return;
    }
    
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setUserData(prev => ({
      ...prev,
      [name]: fieldValue,
    }));
  };
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!userData.userName.trim()) {
      errors.userName = t('name_required');
    }
    
    if (!userData.email.trim()) {
      errors.email = t('email_required');
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.email = t('invalid_email');
    }
    
    if (!userData.password) {
      errors.password = t('password_required');
    } else if (userData.password.length < 8) {
      errors.password = t('password_too_short');
    }
    
    if (userData.password !== passwordConfirm) {
      errors.passwordConfirm = t('passwords_dont_match');
    }
    
    if (!userData.termsAndConditions) {
      errors.termsAndConditions = t('terms_required');
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const resultAction = await dispatch(signup(userData));
      if (signup.fulfilled.match(resultAction)) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const subtitle = (
    <>
      {t('already_have_account')}{' '}
      <Link to="/login" className="font-medium text-leaf-600 hover:text-leaf-700 transition-colors duration-200">
        {t('sign_in')}
      </Link>
    </>
  );
  
  return (
    <AuthCard
      title={t('create_account')}
      subtitle={subtitle}
      icon="🌱"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            id="userName"
            name="userName"
            type="text"
            autoComplete="name"
            required
            value={userData.userName}
            onChange={handleChange}
            label={t('user_name')}
            placeholder={t('enter_your_name')}
            error={formErrors.userName}
            className="border-soil-200 focus:border-leaf-500 focus:ring-leaf-500"
          />
          
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={userData.email}
            onChange={handleChange}
            label={t('email')}
            placeholder={t('enter_your_email')}
            error={formErrors.email}
            className="border-soil-200 focus:border-leaf-500 focus:ring-leaf-500"
          />
          
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={userData.password}
            onChange={handleChange}
            label={t('password')}
            placeholder={t('enter_password')}
            error={formErrors.password}
            className="border-soil-200 focus:border-leaf-500 focus:ring-leaf-500"
          />
          
          <Input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            autoComplete="new-password"
            required
            value={passwordConfirm}
            onChange={handleChange}
            label={t('confirm_password')}
            placeholder={t('confirm_your_password')}
            error={formErrors.passwordConfirm}
            className="border-soil-200 focus:border-leaf-500 focus:ring-leaf-500"
          />
          
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            autoComplete="tel"
            value={userData.phoneNumber || ''}
            onChange={handleChange}
            label={t('phone_number')}
            placeholder={t('enter_phone_number')}
            helperText={t('phone_number_description')}
            className="border-soil-200 focus:border-leaf-500 focus:ring-leaf-500"
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="notifyByEmail"
              name="notifyByEmail"
              type="checkbox"
              checked={userData.notifyByEmail}
              onChange={handleChange}
              className="h-4 w-4 text-leaf-600 focus:ring-leaf-500 border-soil-300 rounded"
            />
            <label htmlFor="notifyByEmail" className="ml-2 block text-sm text-soil-700">
              {t('notify_by_email')}
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="notifyBySMS"
              name="notifyBySMS"
              type="checkbox"
              checked={userData.notifyBySMS}
              onChange={handleChange}
              className="h-4 w-4 text-leaf-600 focus:ring-leaf-500 border-soil-300 rounded"
            />
            <label htmlFor="notifyBySMS" className="ml-2 block text-sm text-soil-700">
              {t('notify_by_sms')}
            </label>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="termsAndConditions"
                name="termsAndConditions"
                type="checkbox"
                checked={userData.termsAndConditions}
                onChange={handleChange}
                className="h-4 w-4 text-leaf-600 focus:ring-leaf-500 border-soil-300 rounded"
              />
            </div>
            <div className="ml-2 text-sm">
              <label htmlFor="termsAndConditions" className="font-medium text-soil-700">
                {t('agree_to_terms')}{' '}
                <a href="#" className="text-leaf-600 hover:text-leaf-700 transition-colors duration-200">
                  {t('terms_and_conditions')}
                </a>
              </label>
              {formErrors.termsAndConditions && (
                <p className="text-red-500 text-sm mt-1">{formErrors.termsAndConditions}</p>
              )}
            </div>
          </div>
        </div>
        
        {error && (
          <div className="text-red-500 text-sm p-3 bg-red-50 rounded-md border border-red-100">
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
            {t('sign_up')}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
};

export default Signup; 