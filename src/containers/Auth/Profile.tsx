import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/store';
import { useTranslation } from 'react-i18next';
import { Camera, CheckCircle2, AlertCircle } from 'lucide-react';
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
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    userName: '',
    email: '',
    phoneNumber: '',
    notifyByEmail: false,
    notifyBySMS: false,
  });
  const [, setAvatar] = useState<File | null>(null);
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
    <div className="p-4 sm:py-6 sm:px-8 bg-background dark:bg-background-dark min-h-[calc(100vh-60px)]">
      <div className="w-full">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-textPrimary dark:text-textPrimary-dark mb-6">{t('profile')}</h1>

        <div className="rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Avatar section */}
            <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full overflow-hidden bg-ink-100 dark:bg-ink-800 flex items-center justify-center">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt={user?.userName || 'User'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-leaf-600 text-white text-2xl font-semibold">
                        {user?.userName?.charAt(0).toUpperCase() || '?'}
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-full p-1.5 shadow-md cursor-pointer text-textSecondary dark:text-textSecondary-dark hover:text-leaf-600 dark:hover:text-leaf-400 transition-colors"
                  >
                    <Camera className="h-4 w-4" aria-hidden />
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
                <h2 className="text-lg font-semibold text-textPrimary dark:text-textPrimary-dark">{user?.userName}</h2>
                <p className="text-sm text-textMuted dark:text-textMuted-dark">{user?.email}</p>
                <p className="mt-4 text-sm text-textMuted dark:text-textMuted-dark">{t('change_photo_description')}</p>
              </div>
            </div>

            <div className="border-t border-border dark:border-border-dark pt-6">
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
                        className="h-4 w-4 text-leaf-600 focus:ring-leaf-500 border-border dark:border-border-dark rounded"
                      />
                      <label htmlFor="notifyByEmail" className="ml-2 block text-sm text-textSecondary dark:text-textSecondary-dark">
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
                        className="h-4 w-4 text-leaf-600 focus:ring-leaf-500 border-border dark:border-border-dark rounded"
                      />
                      <label htmlFor="notifyBySMS" className="ml-2 block text-sm text-textSecondary dark:text-textSecondary-dark">
                        {t('notify_by_sms')}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {success && (
              <div className="flex items-center gap-2 rounded-lg bg-successBg dark:bg-successBg-dark text-successText dark:text-successText-dark p-3 text-sm font-medium">
                <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden />
                {success}
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-dangerBg dark:bg-dangerBg-dark text-dangerText dark:text-dangerText-dark p-3 text-sm font-medium">
                <AlertCircle className="h-5 w-5 shrink-0" aria-hidden />
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
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