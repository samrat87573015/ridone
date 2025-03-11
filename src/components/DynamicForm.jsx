import React, { useState, useEffect } from 'react';

const DynamicForm = ({ 
  fields, 
  onSubmit, 
  submitButtonText = 'Submit',
  className = '',
  showTerms = false,
  termsText = '',
  extraContent = null,
  buttonWrapperClassName = 'col-12'
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [previews, setPreviews] = useState({}); 
  const [files, setFiles] = useState({});

  // Initialize form data with field values
  useEffect(() => {
    const initialData = {};
    Object.entries(fields).forEach(([name, field]) => {
      if (field.value !== undefined) {
        initialData[name] = field.value;
      }
    });
    setFormData(initialData);
  }, [fields]);

  const validateField = (name, value) => {
    let error = '';
    
    if (!value && fields[name].required) {
      error = `Please select ${fields[name].label?.toLowerCase() || name}.`;
    }
    
    if (fields[name].type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = 'Please enter a valid email address.';
      }
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'file') {
      const file = e.target.files[0];
      if (file) {
        // Store file in files state
        setFiles(prev => ({ ...prev, [name]: file }));
        
        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
          setPreviews(prev => ({ ...prev, [name]: reader.result }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(fields).forEach((fieldName) => {
      newErrors[fieldName] = validateField(fieldName, formData[fieldName]);
    });
    setErrors(newErrors);
    
    // Check if there are any validation errors
    if (Object.values(newErrors).every((error) => !error)) {
      const formDataToSend = new FormData();
      
      // Append regular form data
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formDataToSend.append(key, value);
        }
      });
      
      // Append files
      Object.entries(files).forEach(([key, file]) => {
        formDataToSend.append(key, file);
      });
      
      onSubmit(formDataToSend);
    }
  };

  const renderField = (name, field) => {
    const { 
      label, 
      type, 
      placeholder, 
      options, 
      required, 
      columnClassName, 
      className,
      hideLabel,
      accept 
    } = field;

    const fieldValue = formData[name] || '';

    return (
      <div key={name} className={`mb-3 ${columnClassName || 'col'}`}>
        {!hideLabel && type !== 'checkbox' && (
          <label htmlFor={name} className="form-label">
            {label}
            {required && <span className="text-danger">*</span>}
          </label>
        )}

        {type === 'select' ? (
          <select
            id={name}
            name={name}
            className={`form-select ${errors[name] && touched[name] ? 'is-invalid' : ''} ${className || ''}`}
            value={fieldValue}
            onChange={handleChange}
            onBlur={handleBlur}
            required={required}
          >
            <option value="">Select {label}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === 'checkbox' ? (
          <div className="form-check">
            <input
              type="checkbox"
              id={name}
              name={name}
              className={`form-check-input ${errors[name] && touched[name] ? 'is-invalid' : ''} ${className || ''}`}
              checked={!!fieldValue}
              onChange={handleChange}
              onBlur={handleBlur}
              required={required}
            />
            <label className="form-check-label" htmlFor={name}>
              {label}
              {required && <span className="text-danger">*</span>}
            </label>
          </div>
        ) : type === 'file' ? (
          <>
            <input
              type="file"
              id={name}
              name={name}
              className={`form-control ${errors[name] && touched[name] ? 'is-invalid' : ''} ${className || ''}`}
              accept={accept}
              onChange={handleChange}
              onBlur={handleBlur}
              required={required}
            />
            {previews[name] && (
              <div className="mt-3">
                <img
                  src={previews[name]}
                  alt="Preview"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
              </div>
            )}
            {fieldValue && !previews[name] && type === 'file' && (
              <div className="mt-3">
                <img
                  src={fieldValue}
                  alt="Current"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
              </div>
            )}
          </>
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            className={`form-control ${errors[name] && touched[name] ? 'is-invalid' : ''} ${className || ''}`}
            placeholder={placeholder || ''}
            value={fieldValue}
            onChange={handleChange}
            onBlur={handleBlur}
            required={required}
          />
        )}

        {errors[name] && touched[name] && (
          <div className="invalid-feedback">{errors[name]}</div>
        )}
      </div>
    );
  };

  return (
    <form 
      className={`needs-validation ${className}`} 
      onSubmit={handleSubmit} 
      noValidate
    >
      {Object.entries(fields).map(([name, field]) => renderField(name, field))}
      
      {showTerms && (
        <div className="mb-3">
          <small className="form-text">
            {termsText}
          </small>
        </div>
      )}
      
      <div className={buttonWrapperClassName}>
        {extraContent}
        <button type="submit" className="btn btn-primary">
          {submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default DynamicForm;