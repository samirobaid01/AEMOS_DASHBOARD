import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { AppDispatch } from '../../state/store';
import {
  fetchOrganizationById,
  updateOrganization,
  selectSelectedOrganization,
  selectOrganizationsLoading,
  selectOrganizationsError
} from '../../state/slices/organizations.slice';
import type { OrganizationUpdateRequest } from '../../types/organization';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import LoadingScreen from '../../components/common/Loading/LoadingScreen';

const OrganizationEdit = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const organization = useSelector(selectSelectedOrganization);
  const isLoading = useSelector(selectOrganizationsLoading);
  const error = useSelector(selectOrganizationsError);
  
  const [formData, setFormData] = useState<OrganizationUpdateRequest>({
    name: '',
    status: true,
    detail: '',
    address: '',
    zip: '',
    email: '',
    contactNumber: '',
    isParent: true,
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchOrganizationById(parseInt(id, 10)));
    }
  }, [dispatch, id]);
  
  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name,
        status: organization.status,
        detail: organization.detail || '',
        address: organization.address || '',
        zip: organization.zip || '',
        email: organization.email || '',
        contactNumber: organization.contactNumber || '',
        isParent: organization.isParent || false,
      });
    }
  }, [organization]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if ((e.target as HTMLInputElement).type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      errors.name = t('name_required');
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t('invalid_email');
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !id) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const resultAction = await dispatch(
        updateOrganization({
          id: parseInt(id, 10),
          organizationData: formData
        })
      );
      
      if (updateOrganization.fulfilled.match(resultAction)) {
        navigate(`/organizations/${id}`);
      }
    } catch (error) {
      console.error('Error updating organization:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading && !organization) {
    return <LoadingScreen />;
  }
  
  if (!organization && !isLoading) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-yellow-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-yellow-800">{t('organization_not_found')}</h3>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => navigate('/organizations')}
            >
              {t('back_to_organizations')}
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            {t('edit_organization')} - {organization?.name}
          </h1>
          <Button
            variant="outline"
            onClick={() => navigate(`/organizations/${id}`)}
          >
            {t('cancel')}
          </Button>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  label={t('name')}
                  error={formErrors.name}
                />
              </div>
              
              <div className="sm:col-span-3">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  label={t('email')}
                  error={formErrors.email}
                />
              </div>
              
              <div className="sm:col-span-3">
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  type="tel"
                  value={formData.contactNumber || ''}
                  onChange={handleChange}
                  label={t('contact_number')}
                />
              </div>
              
              <div className="sm:col-span-6">
                <div className="flex flex-col">
                  <label htmlFor="detail" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('description')}
                  </label>
                  <textarea
                    id="detail"
                    name="detail"
                    rows={3}
                    value={formData.detail || ''}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <div className="flex flex-col">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('address')}
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={2}
                    value={formData.address || ''}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <Input
                  id="zip"
                  name="zip"
                  type="text"
                  value={formData.zip || ''}
                  onChange={handleChange}
                  label={t('zip_code')}
                />
              </div>
              
              <div className="sm:col-span-2">
                <div className="flex items-center mt-8">
                  <input
                    id="isParent"
                    name="isParent"
                    type="checkbox"
                    checked={formData.isParent}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isParent" className="ml-2 block text-sm text-gray-700">
                    {t('is_parent_organization')}
                  </label>
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <div className="flex items-center mt-8">
                  <input
                    id="status"
                    name="status"
                    type="checkbox"
                    checked={formData.status}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="status" className="ml-2 block text-sm text-gray-700">
                    {t('active')}
                  </label>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/organizations/${id}`)}
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                disabled={isSubmitting}
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

export default OrganizationEdit; 