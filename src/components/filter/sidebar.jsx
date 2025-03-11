import React, { useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Sidebar({ products, selectedFilters, onFilterChange }) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    attributes: true,
    price: true,
  });

  // Memoized computations for sidebar data
  const { categories, subcategories, attributes, priceRange } = useMemo(() => {
    const categoriesMap = new Map();
    const subcategoriesMap = new Map();
    const attributesMap = new Map();
    let minPrice = Infinity;
    let maxPrice = -Infinity;

    products.forEach((product) => {
      // Categories
      if (!categoriesMap.has(product.category?.id)) {
        categoriesMap.set(product.category?.id, product.category);
      }

      // Subcategories
      if (!subcategoriesMap.has(product.subcategory?.id)) {
        subcategoriesMap.set(product.subcategory?.id, product.subcategory);
      }

      // Attributes
      product.product_attributes.forEach((attr) => {
        const attrName = attr.attribute.name;
        if (!attributesMap.has(attrName)) {
          attributesMap.set(attrName, new Map());
        }
        const optionsMap = attributesMap.get(attrName);
        if (!optionsMap.has(attr.attribute_option.id)) {
          optionsMap.set(attr.attribute_option.id, attr.attribute_option);
        }
      });

      // Price range
      const price = parseFloat(product.price);
      minPrice = Math.min(minPrice, price);
      maxPrice = Math.max(maxPrice, price);
    });

    return {
      categories: Array.from(categoriesMap.values()),
      subcategories: Array.from(subcategoriesMap.values()),
      attributes: Array.from(attributesMap.entries()).map(
        ([name, options]) => ({
          name,
          options: Array.from(options.values()),
        })
      ),
      priceRange: {
        min: Math.floor(minPrice),
        max: Math.ceil(maxPrice),
      },
    };
  }, [products]);

  const [priceValue, setPriceValue] = useState([0, 100]);

  useEffect(() => {
    if (priceRange.min !== undefined && priceRange.max !== undefined) {
      setPriceValue([priceRange.min, priceRange.max]);
    }
  }, [priceRange]);

  const handlePriceChange = (event, newValue) => {
    setPriceValue(newValue);
  };

  const handlePriceChangeCommitted = (event, newValue) => {
    onFilterChange("price", `${newValue[0]}-${newValue[1]}`);
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (categorySlug) => {
    onFilterChange("category", categorySlug);
  };

  const handleSubcategoryChange = (subcategorySlug) => {
    onFilterChange("subcategory", subcategorySlug);
  };

  return (
    <aside className="col-lg-3 col-md-4 mb-6 mb-md-0 filter-sidebar">
      <div className="offcanvas-body ps-lg-2 pt-lg-0">
        {/* Categories Section */}
        <div className="mb-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0">Categories</h5>
            <button
              className="btn btn-link p-0"
              onClick={() => toggleSection("categories")}
            >
              {expandedSections.categories ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
          </div>
          {expandedSections.categories && (
            <ul className="nav flex-column">
            {categories.map((category) => {
              // Get subcategories related to this category
              const relatedSubcategories = subcategories.filter(
                (sub) => sub?.category_id === category?.id
              );
          
              // Check if the current category is active
              const isActiveCategory = selectedFilters.category === category.slug;
          
              return (
                <li
                  key={category?.id}
                  className={`nav-item border-bottom w-100 ${isActiveCategory ? 'active' : ''}`}
                >
                  <a
                    href="#"
                    className="nav-link d-flex justify-content-between"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCategoryChange(category.slug);
                    }}
                  >
                    {category.name}
                    {/* Show the ChevronUp/Down based on subcategories */}
                    {relatedSubcategories.length > 0 && (
                      isActiveCategory ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )
                    )}
                  </a>
          
                  {/* Subcategories */}
                  {isActiveCategory && relatedSubcategories.length > 0 && (
                    <ul className="nav flex-column ms-3">
                      {relatedSubcategories.map((subcategory) => {
                        const isActiveSubcategory = selectedFilters.subcategory === subcategory.slug;
          
                        return (
                          <li
                            key={subcategory?.id}
                            className={`nav-item ${isActiveSubcategory ? 'active' : ''}`}
                          >
                            <a
                              href="#"
                              className="nav-link d-flex justify-content-between"
                              onClick={(e) => {
                                e.preventDefault();
                                handleSubcategoryChange(subcategory.slug);
                              }}
                            >
                              {subcategory.name}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
          
          )}
        </div>

        {/* Attributes Section */}
        <div className="mb-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0">Filters</h5>
            <button
              className="btn btn-link p-0"
              onClick={() => toggleSection("attributes")}
            >
              {expandedSections.attributes ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
          </div>
          {expandedSections.attributes &&
            attributes.map(({ name, options }) => (
              <div key={name} className="mb-4">
                <h6 className="mb-3">{name}</h6>
                {options.map((option) => (
                  <div className="form-check" key={option.id}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`attribute-${name}-${option.id}`}
                      checked={selectedFilters.attributes[name]?.includes(option.id.toString())}
                      onChange={() => onFilterChange("attribute", `${name}|${option.id}`)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`attribute-${name}-${option.id}`}
                    >
                      {option.name}
                    </label>
                  </div>
                ))}
              </div>
            ))}
        </div>

        {/* Price Range Section */}
        <div className="mb-8" style={{width:'95%'}}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0">Price Range</h5>
            <button
              className="btn btn-link p-0"
              onClick={() => toggleSection("price")}
            >
              {expandedSections.price ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
          </div>
          
          {expandedSections.price && (
            <Box sx={{ width: '100%', px: 1 }}>
              <Slider
                value={priceValue}
                onChange={handlePriceChange}
                onChangeCommitted={handlePriceChangeCommitted}
                valueLabelDisplay="off"
                min={priceRange.min}
                max={priceRange.max}
                sx={{
                  '& .MuiSlider-thumb': {
                    height: 24,
                    width: 24,
                    backgroundColor: '#fff',
                    border: '2px solid currentColor',
                    '&:focus, &:hover, &.Mui-active': {
                      boxShadow: 'inherit',
                    },
                  },
                  '& .MuiSlider-track': {
                    height: 4,
                  },
                  '& .MuiSlider-rail': {
                    height: 4,
                    opacity: 0.5,
                    backgroundColor: '#bfbfbf',
                  },
                }}
              />
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  {formatPrice(priceValue[0])}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatPrice(priceValue[1])}
                </Typography>
              </Box>
            </Box>
          )}
        </div>
      </div>
    </aside>
  );
}
