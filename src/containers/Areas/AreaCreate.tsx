import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { AppDispatch } from '../../state/store';
import { createArea, selectAreasLoading, selectAreasError } from '../../state/slices/areas.slice';
import { fetchOrganizations, selectOrganizations } from '../../state/slices/organizations.slice';
import type { AreaCreateRequest } from '../../types/area';
import type { FormErrors } from '../../types/ui';
import { AreaCreate as AreaCreateComponent } from '../../components/areas';

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
    // description: '',
    status: 'active',
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  
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
    const errors: FormErrors = {};
    
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

  const handleCancel = () => {
    if (organizationId) {
      navigate(`/organizations/${organizationId}`);
    } else {
      navigate('/areas');
    }
  };
  
  return (
    <AreaCreateComponent
      formData={formData}
      formErrors={formErrors}
      isLoading={isLoading}
      error={error}
      organizations={organizations}
      onSubmit={handleSubmit}
      onChange={handleChange}
      onCancel={handleCancel}
    />
  );
};

export default AreaCreate; 