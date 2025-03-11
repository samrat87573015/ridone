import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ProductFilter = ({ products }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeFilters, setActiveFilters] = useState({
    category: searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    minPrice: Number(searchParams.get('minPrice')) || 0,
    maxPrice: Number(searchParams.get('maxPrice')) || 1000,
    attributes: {},
    sort: searchParams.get('sort') || 'featured'
  });

  // Group products by categories
  const categories = products?.reduce((acc, product) => {
    const category = product.category?.name;
    if (!acc[category]) {
      acc[category] = {
        name: category,
        subcategories: new Set()
      };
    }
    if (product.subcategory?.name) {
      acc[category].subcategories.add(product.subcategory.name);
    }
    return acc;
  }, {});

  // Extract unique attributes
  const extractAttributes = () => {
    const attrs = {};
    products?.forEach(product => {
      product.product_attributes?.forEach(attr => {
        const { name } = attr.attribute;
        const optionName = attr.attribute_option.name;
        if (!attrs[name]) {
          attrs[name] = new Set();
        }
        attrs[name].add(optionName);
      });
    });
    return attrs;
  };

  const attributes = extractAttributes();

  // Price range handler
  const handlePriceChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setActiveFilters(prev => ({
      ...prev,
      [name]: Number(value)
    }));
    updateURL({ [name]: value });
  };

  // Category handler
  const handleCategoryChange = (categoryName) => {
    setActiveFilters(prev => ({
      ...prev,
      category: categoryName,
      subcategory: '' // Reset subcategory when category changes
    }));
    updateURL({ category: categoryName, subcategory: '' });
  };

  // Subcategory handler
  const handleSubcategoryChange = (subcategoryName) => {
    setActiveFilters(prev => ({
      ...prev,
      subcategory: subcategoryName
    }));
    updateURL({ subcategory: subcategoryName });
  };

  // Attribute handler
  const handleAttributeChange = (attributeName, optionName) => {
    setActiveFilters((prev) => {
      const newAttributes = { ...prev.attributes };
  
      // Ensure the attributeName key exists as a Set
      if (!newAttributes[attributeName]) {
        newAttributes[attributeName] = new Set();
      }
  
      // Toggle the optionName in the Set
      if (newAttributes[attributeName].has(optionName)) {
        newAttributes[attributeName].delete(optionName);
      } else {
        newAttributes[attributeName].add(optionName);
      }
  
      return {
        ...prev,
        attributes: newAttributes,
      };
    });
  
    // Update URL after the state change
    updateURL({ attributes: JSON.stringify(activeFilters.attributes) });
  };
  

  // Sort handler
  const handleSortChange = (e) => {
    const value = e.target.value;
    setActiveFilters(prev => ({
      ...prev,
      sort: value
    }));
    updateURL({ sort: value });
  };

  // Update URL with new parameters
  const updateURL = (params) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  const handleAttributeSelect = (
    attributeId,
    attributeOptionId,
    optionName,
    attributeName
  ) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeId]: {
        attributeOptionId,
        optionName,
        attributeName,
      },
    }));
  
    // Modify filter attributes simultaneously
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      
      // Ensure attributes object exists
      if (!newFilters.attributes) {
        newFilters.attributes = {};
      }
  
      // If attribute doesn't exist, create a new array
      if (!newFilters.attributes[attributeName]) {
        newFilters.attributes[attributeName] = [];
      }
  
      // Toggle attribute option ID
      const currentOptions = newFilters.attributes[attributeName];
      const index = currentOptions.indexOf(attributeOptionId);
      
      if (index > -1) {
        // Remove if already exists
        currentOptions.splice(index, 1);
      } else {
        // Add if not exists
        currentOptions.push(attributeOptionId);
      }
  
      return newFilters;
    });
  };


  return (
    <div className="w-full filter">
      {/* Category Filter Section */}
      <div className="mb-8">
        <h5 className="text-lg font-semibold mb-4">Categories</h5>
        <div className="space-y-2">
          {Object.entries(categories || {}).map(([categoryName, category]) => (
            <div key={categoryName} className="border-b border-gray-200">
              <button
                onClick={() => handleCategoryChange(categoryName)}
                className={`w-full text-left py-2 px-3 flex items-center justify-between ${
                  activeFilters.category === categoryName ? 'bg-gray-100' : ''
                }`}
              >
                <span>{categoryName}</span>
                <span className="text-sm text-gray-500">
                  {category.subcategories.size}
                </span>
              </button>
              
              {/* Subcategories */}
              {activeFilters.category === categoryName && (
                <div className="ml-4 mt-2 mb-2">
                  {Array.from(category.subcategories).map(subcat => (
                    <button
                      key={subcat}
                      onClick={() => handleSubcategoryChange(subcat)}
                      className={`block w-full text-left py-1 px-3 text-sm ${
                        activeFilters.subcategory === subcat ? 'text-blue-600' : 'text-gray-600'
                      }`}
                    >
                      {subcat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-8">
        <h5 className="text-lg font-semibold mb-4">Price Range</h5>
        <div className="px-3">
          <div className="flex items-center gap-4 mb-4">
            <input
              type="number"
              name="minPrice"
              value={activeFilters.minPrice}
              onChange={handlePriceChange}
              className="w-24 px-2 py-1 border border-gray-300 rounded"
            />
            <span>to</span>
            <input
              type="number"
              name="maxPrice"
              value={activeFilters.maxPrice}
              onChange={handlePriceChange}
              className="w-24 px-2 py-1 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Attribute Filters */}
      {Object.entries(attributes || {}).map(([attributeName, options]) => (
  <div key={attributeName} className="mb-8">
    <h5 className="text-lg font-semibold mb-4">{attributeName}</h5>
    <div className="space-y-2">
      {Array.from(options).map((option) => (
        <label
          key={option}
          className="flex items-center gap-2 cursor-pointer px-3 py-1 hover:bg-gray-50"
        >
          <input
  type="checkbox"
  checked={!!activeFilters.attributes[attributeName]?.has(option)}
  onChange={() => handleAttributeChange(attributeName, option)}
  className="w-4 h-4 rounded border-gray-300"
/>

          <span className="text-gray-700">{option}</span>
        </label>
      ))}
    </div>
  </div>
))}


      {/* Sort Options */}
      <div className="mb-8">
        <h5 className="text-lg font-semibold mb-4">Sort By</h5>
        <select
          value={activeFilters.sort}
          onChange={handleSortChange}
          className="w-full px-3 py-2 border border-gray-300 rounded bg-white"
        >
          <option value="featured">Featured</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="newest">Newest First</option>
          <option value="rating">Average Rating</option>
        </select>
      </div>

      {/* Active Filters Display */}
      {(activeFilters.category || activeFilters.subcategory || 
        Object.keys(activeFilters.attributes).length > 0 ||
        activeFilters.minPrice > 0 || activeFilters.maxPrice < 1000) && (
        <div className="mb-8">
          <h5 className="text-lg font-semibold mb-4">Active Filters</h5>
          <div className="flex flex-wrap gap-2">
            {activeFilters.category && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {activeFilters.category}
                <button
                  onClick={() => handleCategoryChange('')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {/* Add more active filter tags here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilter;