import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import type { AppDispatch } from '../../state/store';
import {
  fetchOrganizationById,
  updateOrganization,
  selectSelectedOrganization,
  selectOrganizationsLoading,
  selectOrganizationsError
} from '../../state/slices/organizations.slice';
import type { OrganizationUpdateRequest } from '../../types/organization';
import type { FormErrors } from '../../types/ui';
import LoadingScreen from '../../components/common/Loading/LoadingScreen';
import { OrganizationEdit as OrganizationEditComponent } from '../../components/organizations';

const OrganizationEdit = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const organization = useSelector(selectSelectedOrganization);
  const isLoading = useSelector(selectOrganizationsLoading);
  const error = useSelector(selectOrganizationsError);
  
  const [formData, setFormData] = useState<OrganizationUpdateRequest>({
    organizationId: 0,
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchOrganizationById(parseInt(id, 10)));
    }
  }, [dispatch, id]);
  
  useEffect(() => {
    if (organization) {
      setFormData({
        organizationId: organization.id,
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
    const errors: FormErrors = {};
    
    if (!formData.name?.trim()) {
      errors.name = 'Name is required';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
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
          organizationData: formData,
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

  const handleCancel = () => {
    if (id) {
      navigate(`/organizations/${id}`);
    } else {
      navigate('/organizations');
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
            <h3 className="text-sm font-medium text-yellow-800">Organization not found</h3>
          </div>
          <div className="mt-4">
            <button
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => navigate('/organizations')}
            >
              Back to organizations
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <OrganizationEditComponent
      formData={formData}
      formErrors={formErrors}
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      error={error}
      organizationName={organization?.name}
      onSubmit={handleSubmit}
      onChange={handleChange}
      onCancel={handleCancel}
    />
  );
};

export default OrganizationEdit; 