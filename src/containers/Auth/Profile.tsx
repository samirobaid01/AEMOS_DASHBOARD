import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { AppDispatch } from '../../state/store';
import { selectCurrentUser, fetchUserProfile } from '../../state/slices/auth.slice';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import LoadingScreen from '../../components/common/Loading/LoadingScreen';

type ProfileFormData = {
  userName: string;
  email: string;
  phoneNumber: string;
  notifyByEmail: boolean;
  notifyBySMS: boolean;
};

const Profile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectCurrentUser);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    userName: '',
    email: '',
    phoneNumber: '',
    notifyByEmail: false,
    notifyBySMS: false,
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        await dispatch(fetchUserProfile());
        setLoading(false);
      } catch (error) {
        console.error('Error loading profile:', error);
        setLoading(false);
      }
    };

    loadProfile();
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        notifyByEmail: user.notifyByEmail || false,
        notifyBySMS: user.notifyBySMS || false,
      });
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(null);
    setError(null);

    try {
      // TODO: Implement API call to update profile
      // For demonstration, just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(t('profile_updated'));
    } catch (error) {
      setError(t('profile_update_failed'));
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">{t('profile')}</h1>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Avatar section */}
            <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt={user?.userName || 'User'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white text-2xl font-medium">
                        {user?.userName?.charAt(0).toUpperCase() || '?'}
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md cursor-pointer"
                  >
                    <svg
                      className="h-5 w-5 text-gray-700"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    <input
                      id="avatar-upload"
                      name="avatar"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-lg font-medium text-gray-900">{user?.userName}</h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <p className="mt-4 text-sm text-gray-500">{t('change_photo_description')}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <Input
                    id="userName"
                    name="userName"
                    type="text"
                    value={formData.userName}
                    onChange={handleChange}
                    label={t('user_name')}
                  />
                </div>

                <div className="sm:col-span-3">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    label={t('email')}
                    disabled
                  />
                </div>

                <div className="sm:col-span-3">
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    label={t('phone_number')}
                  />
                </div>

                <div className="sm:col-span-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="notifyByEmail"
                        name="notifyByEmail"
                        type="checkbox"
                        checked={formData.notifyByEmail}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="notifyByEmail" className="ml-2 block text-sm text-gray-700">
                        {t('notify_by_email')}
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="notifyBySMS"
                        name="notifyBySMS"
                        type="checkbox"
                        checked={formData.notifyBySMS}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="notifyBySMS" className="ml-2 block text-sm text-gray-700">
                        {t('notify_by_sms')}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {success && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">{success}</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={saving}
                disabled={saving}
              >
                {t('save')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile; 