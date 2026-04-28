// src/hooks/useForm.js

import { useState, useCallback } from 'react';

function useForm(initialValues, validationRules) {

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function validate(fieldValues = values) {
    const newErrors = {};

    Object.keys(validationRules).forEach(field => {
      const rule = validationRules[field];
      const value = fieldValues[field];

      if (rule.required && (!value || value.toString().trim() === '')) {
        newErrors[field] = rule.requiredMessage || `${field} is required`;
        return;
      }

      if (value && rule.minLength && value.length < rule.minLength) {
        newErrors[field] =
          rule.minLengthMessage ||
          `Minimum ${rule.minLength} characters required`;
        return;
      }

      if (value && rule.maxLength && value.length > rule.maxLength) {
        newErrors[field] =
          rule.maxLengthMessage ||
          `Maximum ${rule.maxLength} characters allowed`;
        return;
      }

      if (value && rule.pattern && !rule.pattern.test(value)) {
        newErrors[field] = rule.patternMessage || `Invalid ${field}`;
        return;
      }

      if (value && rule.custom) {
        const customError = rule.custom(value, fieldValues);
        if (customError) {
          newErrors[field] = customError;
        }
      }
    });

    return newErrors;
  }

  const handleChange = useCallback(e => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setValues(prev => ({ ...prev, [name]: newValue }));

    if (touched[name]) {
      const newErrors = validate({ ...values, [name]: newValue });
      setErrors(prev => ({
        ...prev,
        [name]: newErrors[name] || '',
      }));
    }
  }, [values, touched]);

  const handleBlur = useCallback(e => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const newErrors = validate(values);
    setErrors(prev => ({ ...prev, [name]: newErrors[name] || '' }));
  }, [values]);

  const handleSubmit = useCallback(
    onSubmit => async e => {
      e.preventDefault();

      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
      setTouched(allTouched);

      const newErrors = validate(values);
      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) return;

      setIsSubmitting(true);
      try {
        await onSubmit(values);
        setIsSubmitted(true);
      } catch (err) {
        console.error('Form submission error:', err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setIsSubmitted(false);
  }, [initialValues]);

  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const isValid = Object.keys(validate(values)).length === 0;

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isSubmitted,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
  };
}

export default useForm;