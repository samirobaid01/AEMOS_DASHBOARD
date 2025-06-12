import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Rule form validation
export const ruleFormSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
});

export const ruleFormResolver = yupResolver(ruleFormSchema); 