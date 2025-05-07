import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { AppDispatch } from '../../state/store';
import { createArea, selectAreasLoading, selectAreasError } from '../../state/slices/areas.slice';
import { fetchOrganizations, selectOrganizations } from '../../state/slices/organizations.slice';
import type { AreaCreateRequest } from '../../types/area';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';

const AreaCreate = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const organizationId = searchParams.get('organizationId');
  
  const isLoading = useSelector(selectAreasLoading);
  const error = useSelector(selectAreasError);
  const organizations = useSelector(selectOrganizations);
  
  const [formData, setFormData] = useState<AreaCreateRequest>({
    name: '',
    organizationId: organizationId ? parseInt(organizationId, 10) : 0,
    description: '',
    status: true,
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);
  
  useEffect(() => {
    if (organizationId) {
      setFormData(prev => ({
        ...prev,
        organizationId: parseInt(organizationId, 10)
      }));
    }
  }, [organizationId]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if ((e.target as HTMLInputElement).type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
      return;
    }
    
    if (name === 'organizationId') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value, 10),
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
    
    if (!formData.name.trim()) {
      errors.name = t('name_required');
    }
    
    if (!formData.organizationId) {
      errors.organizationId = t('organization_required');
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
      const resultAction = await dispatch(createArea(formData));
      if (createArea.fulfilled.match(resultAction)) {
        if (organizationId) {
          navigate(`/organizations/${organizationId}`);
        } else {
          navigate('/areas');
        }
      }
    } catch (error) {
      console.error('Error creating area:', error);
    }
  };
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">{t('new_area')}</h1>
          <Button
            variant="outline"
            onClick={() => organizationId ? navigate(`/organizations/${organizationId}`) : navigate('/areas')}
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
                  placeholder={t('enter_area_name')}
                  error={formErrors.name}
                />
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="organizationId" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('organization')}
                </label>
                <select
                  id="organizationId"
                  name="organizationId"
                  className={`block w-full rounded-md border ${
                    formErrors.organizationId ? 'border-red-300' : 'border-gray-300'
                  } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  value={formData.organizationId || ''}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t('select_organization')}</option>
                  {organizations.map(org => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
                {formErrors.organizationId && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.organizationId}</p>
                )}
              </div>
              
              <div className="sm:col-span-6">
                <div className="flex flex-col">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('description')}
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description || ''}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder={t('enter_area_description')}
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <div className="flex items-center mt-4">
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
                onClick={() => organizationId ? navigate(`/organizations/${organizationId}`) : navigate('/areas')}
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {t('create')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AreaCreate; 