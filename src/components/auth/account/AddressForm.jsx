import React, { useState } from 'react';

const AddressForm = ({ initialValues, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialValues?.name || '',
    address: initialValues?.address || '',
    city: initialValues?.city || '',
    phone: initialValues?.phone || '',
    type: initialValues?.type || 'home',
    is_default: initialValues?.is_default || false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.length > 255 ? 'Name cannot exceed 255 characters' : '';
      case 'address':
        return value.length > 500 ? 'Address cannot exceed 500 characters' : '';
      case 'city':
        return value.length > 100 ? 'City cannot exceed 100 characters' : '';
      case 'phone':
        return value.length > 15 
          ? 'Phone number cannot exceed 15 characters'
          : !/^[0-9\-\+\s\(\)]+$/.test(value) && value 
            ? 'Invalid phone number format' 
            : '';
      case 'type':
        return !['office', 'home', 'other'].includes(value) 
          ? 'Address type must be office, home, or other' 
          : '';
      default:
        return '';
    }
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    return newErrors;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Validate field on change if it's been touched
    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  // Handle input blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const formErrors = validateForm();
    setErrors(formErrors);

    // Mark all fields as touched
    const touchedFields = {};
    Object.keys(formData).forEach(key => {
      touchedFields[key] = true;
    });
    setTouched(touchedFields);

    // If no errors, submit the form
    if (Object.keys(formErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="mb-3">
        <label className="form-label">Full Name</label>
        <input
          type="text"
          name="name"
          className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.name && errors.name && (
          <div className="invalid-feedback">{errors.name}</div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Address</label>
        <textarea
          name="address"
          className={`form-control ${errors.address && touched.address ? 'is-invalid' : ''}`}
          value={formData.address}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.address && errors.address && (
          <div className="invalid-feedback">{errors.address}</div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">City</label>
        <input
          type="text"
          name="city"
          className={`form-control ${errors.city && touched.city ? 'is-invalid' : ''}`}
          value={formData.city}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.city && errors.city && (
          <div className="invalid-feedback">{errors.city}</div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Phone Number</label>
        <input
          type="text"
          name="phone"
          className={`form-control ${errors.phone && touched.phone ? 'is-invalid' : ''}`}
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.phone && errors.phone && (
          <div className="invalid-feedback">{errors.phone}</div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Address Type</label>
        <select
          name="type"
          className={`form-select ${errors.type && touched.type ? 'is-invalid' : ''}`}
          value={formData.type}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="home">Home</option>
          <option value="office">Office</option>
          <option value="other">Other</option>
        </select>
        {touched.type && errors.type && (
          <div className="invalid-feedback">{errors.type}</div>
        )}
      </div>

      <div className="mb-3 form-check">
        <input
          type="checkbox"
          name="is_default"
          className="form-check-input"
          checked={formData.is_default}
          onChange={handleChange}
        />
        <label className="form-check-label">Set as Default Address</label>
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {initialValues ? 'Update Address' : 'Add Address'}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;