import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/store';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createOrganization, selectOrganizationsLoading, selectOrganizationsError } from '../../state/slices/organizations.slice';
import type { OrganizationCreateRequest } from '../../types/organization';
import type { FormErrors } from '../../types/ui';
import { OrganizationCreate as OrganizationCreateComponent } from '../../components/organizations';

const OrganizationCreate = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectOrganizationsLoading);
  const error = useAppSelector(selectOrganizationsError);
  
  const [formData, setFormData] = useState<OrganizationCreateRequest>({
    name: '',
    status: 'active',
    detail: '',
    address: '',
    zip: '',
    email: '',
    contactNumber: '',
    isParent: true,
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  
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
    const errors: FormErrors = {};
    
    if (!formData.name.trim()) {
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
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const resultAction = await dispatch(createOrganization(formData));
      if (createOrganization.fulfilled.match(resultAction)) {
        navigate('/organizations');
      }
    } catch (error) {
      console.error('Error creating organization:', error);
    }
  };

  const handleCancel = () => {
    navigate('/organizations');
  };
  
  return (
    <OrganizationCreateComponent
      formData={formData}
      formErrors={formErrors}
      isLoading={isLoading}
      error={error}
      onSubmit={handleSubmit}
      onChange={handleChange}
      onCancel={handleCancel}
    />
  );
};

export default OrganizationCreate; 