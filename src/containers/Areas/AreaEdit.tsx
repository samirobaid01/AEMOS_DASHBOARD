import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { AppDispatch } from '../../state/store';
import {
  fetchAreaById,
  updateArea,
  selectSelectedArea,
  selectAreasLoading,
  selectAreasError
} from '../../state/slices/areas.slice';
import { fetchOrganizations, selectOrganizations } from '../../state/slices/organizations.slice';
import type { AreaUpdateRequest } from '../../types/area';
import LoadingScreen from '../../components/common/Loading/LoadingScreen';
import { AreaEdit as AreaEditComponent } from '../../components/areas';

const AreaEdit = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const area = useSelector(selectSelectedArea);
  const organizations = useSelector(selectOrganizations);
  const isLoading = useSelector(selectAreasLoading);
  const error = useSelector(selectAreasError);
  
  const [formData, setFormData] = useState<AreaUpdateRequest>({
    name: '',
    description: '',
    status: true,
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchAreaById(parseInt(id, 10)));
      dispatch(fetchOrganizations());
    }
  }, [dispatch, id]);
  
  useEffect(() => {
    if (area) {
      setFormData({
        name: area.name,
        description: area.description || '',
        status: area.status,
      });
    }
  }, [area]);
  
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
        updateArea({
          id: parseInt(id, 10),
          areaData: formData
        })
      );
      
      if (updateArea.fulfilled.match(resultAction)) {
        navigate(`/areas/${id}`);
      }
    } catch (error) {
      console.error('Error updating area:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (id) {
      navigate(`/areas/${id}`);
    } else {
      navigate('/areas');
    }
  };
  
  if (isLoading && !area) {
    return <LoadingScreen />;
  }
  
  if (!area && !isLoading) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-yellow-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-yellow-800">{t('area_not_found')}</h3>
          </div>
          <div className="mt-4">
            <button
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              onClick={() => navigate('/areas')}
            >
              {t('back_to_areas')}
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <AreaEditComponent
      formData={formData}
      formErrors={formErrors}
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      error={error}
      areaName={area?.name}
      onSubmit={handleSubmit}
      onChange={handleChange}
      onCancel={handleCancel}
    />
  );
};

export default AreaEdit; 