import React, { useState, useEffect } from 'react';
import '../App.css';

const FormComponent = ({ onSubmit, onCancel, editData = null }) => {
  const [formData, setFormData] = useState({
    id: '',
    offerName: '',
    discountCode: '',
    minimumCartValue: '',
    discountPercentage: '',
    productId: '',
    productVariantId: '',
    backgroundColor: 'FFFFFF',
    fontColor: '000000',
    buttonColor: '4997E0',
    buttonFontColor: 'FFFFFF',
    buttonHoverColor: 'FFFFFF',
    buttonHoverFontColor: '000000',
    expirationDate: '',
    runUntilPaused: false,
    impressions: '100',
    conversions: '90',
    revenue: '1000',
    isEnabled: true
  });

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate conversion rate
    const conversionRate = formData.impressions > 0 
      ? (Number(formData.conversions) / Number(formData.impressions)) * 100 
      : 0;

    // Create offer object
    const offerData = {
      id: formData.id.toUpperCase(),
      offerName: formData.offerName,
      discountCode: formData.discountCode.toUpperCase(),
      minimumCartValue: Number(formData.minimumCartValue),
      discountPercentage: Number(formData.discountPercentage),
      productId: formData.productId,
      productVariantId: formData.productVariantId,
      backgroundColor: formData.backgroundColor,
      fontColor: formData.fontColor,
      buttonColor: formData.buttonColor,
      buttonFontColor: formData.buttonFontColor,
      buttonHoverColor: formData.buttonHoverColor,
      buttonHoverFontColor: formData.buttonHoverFontColor,
      expirationDate: formData.expirationDate,
      runUntilPaused: formData.runUntilPaused,
      impressions: Number(formData.impressions),
      conversions: Number(formData.conversions),
      revenue: Number(formData.revenue),
      conversionRate: conversionRate,
      isEnabled: formData.isEnabled
    };

    onSubmit(offerData);
  };

  return (
    
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="id">Offer ID:</label>
          <input
            type="text"
            id="id"
            name="id"
            value={formData.id}
            onChange={handleChange}
            
            placeholder="Enter offer ID"
            disabled={editData}
          />
        </div>

        <div className="form-group">
          <label htmlFor="offerName">Offer Name (Internal Use Only)</label>
          <input
            type="text"
            id="offerName"
            name="offerName"
            value={formData.offerName}
            onChange={handleChange}
            
            placeholder="e.g. New Offer"
          />
        </div>

        <div className="form-group">
          <label htmlFor="discountCode">Offer Discount Code (Must Be Unique)</label>
          <input
            type="text"
            id="discountCode"
            name="discountCode"
            value={formData.discountCode}
            onChange={handleChange}
            required
            placeholder="e.g. OFFER2020"
          />
        </div>

        <div className="form-group">
          <label htmlFor="minimumCartValue">Minimum Cart Value (to Trigger Offer)</label>
          <input
            type="number"
            id="minimumCartValue"
            name="minimumCartValue"
            value={formData.minimumCartValue}
            onChange={handleChange}
            
            placeholder="$"
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label htmlFor="discountPercentage">Set Offer Discount</label>
          <input
            type="number"
            id="discountPercentage"
            name="discountPercentage"
            value={formData.discountPercentage}
            onChange={handleChange}
            
            placeholder="%"
            min="0"
            max="100"
          />
        </div>

        <div className="form-group">
          <label htmlFor="productId">Choose Your Offer Product</label>
          <select
            id="productId"
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            
          >
            <option value="">Select a product</option>
            {/* Add your product options here */}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="productVariantId">Choose Your Offer Product Variant</label>
          <select
            id="productVariantId"
            name="productVariantId"
            value={formData.productVariantId}
            onChange={handleChange}
            
          >
            <option value="">Select a variant</option>
            {/* Add your variant options here */}
          </select>
        </div>
      
        <div className="form-group">
  <label htmlFor="backgroundColor">Background Color</label>
  <input
    type="text"
    id="backgroundColor"
    name="backgroundColor"
    value={formData.backgroundColor}
    onChange={handleChange}
    placeholder="FFFFFF"
    pattern="^[0-9A-Fa-f]{6}$"
    style={{
      backgroundColor: formData.backgroundColor?.length === 6 ? `#${formData.backgroundColor}` : '#FFFFFF',
      color: formData.backgroundColor?.length === 6 ? '#000000' : 'inherit'
    }}
  />
</div>

<div className="form-group">
  <label htmlFor="fontColor">Font Color</label>
  <input
    type="text"
    id="fontColor"
    name="fontColor"
    value={formData.fontColor}
    onChange={handleChange}
    placeholder="000000"
    pattern="^[0-9A-Fa-f]{6}$"
    style={{
      backgroundColor: formData.fontColor?.length === 6 ? `#${formData.fontColor}` : '#FFFFFF',
      color: formData.fontColor?.length === 6 ? '#FFFFFF' : 'inherit'
    }}
  />
</div>

<div className="form-group">
  <label htmlFor="buttonColor">Button Color</label>
  <input
    type="text"
    id="buttonColor"
    name="buttonColor"
    value={formData.buttonColor}
    onChange={handleChange}
    placeholder="4997E0"
    pattern="^[0-9A-Fa-f]{6}$"
    style={{
      backgroundColor: formData.buttonColor?.length === 6 ? `#${formData.buttonColor}` : '#FFFFFF',
      color: formData.buttonColor?.length === 6 ? '#FFFFFF' : 'inherit'
    }}
  />
</div>

<div className="form-group">
  <label htmlFor="buttonFontColor">Button Font Color</label>
  <input
    type="text"
    id="buttonFontColor"
    name="buttonFontColor"
    value={formData.buttonFontColor}
    onChange={handleChange}
    placeholder="FFFFFF"
    pattern="^[0-9A-Fa-f]{6}$"
    style={{
      backgroundColor: formData.buttonFontColor?.length === 6 ? `#${formData.buttonFontColor}` : '#FFFFFF',
      color: formData.buttonFontColor?.length === 6 ? '#000000' : 'inherit'
    }}
  />
</div>

<div className="form-group">
  <label htmlFor="buttonHoverColor">Button Hover Color</label>
  <input
    type="text"
    id="buttonHoverColor"
    name="buttonHoverColor"
    value={formData.buttonHoverColor}
    onChange={handleChange}
    placeholder="FFFFFF"
    pattern="^[0-9A-Fa-f]{6}$"
    style={{
      backgroundColor: formData.buttonHoverColor?.length === 6 ? `#${formData.buttonHoverColor}` : '#FFFFFF',
      color: formData.buttonHoverColor?.length === 6 ? '#000000' : 'inherit'
    }}
  />
</div>

<div className="form-group">
  <label htmlFor="buttonHoverFontColor">Button Hover Font Color</label>
  <input
    type="text"
    id="buttonHoverFontColor"
    name="buttonHoverFontColor"
    value={formData.buttonHoverFontColor}
    onChange={handleChange}
    placeholder="000000"
    pattern="^[0-9A-Fa-f]{6}$"
    style={{
      backgroundColor: formData.buttonHoverFontColor?.length === 6 ? `#${formData.buttonHoverFontColor}` : '#FFFFFF',
      color: formData.buttonHoverFontColor?.length === 6 ? '#FFFFFF' : 'inherit'
    }}
  />
</div>


        <div className="form-group">
          <label htmlFor="impressions">Impressions:</label>
          <input
            type="number"
            id="impressions"
            name="impressions"
            value={formData.impressions}
            onChange={handleChange}
            disabled
            min="0"
            placeholder="Enter impressions"
          />
        </div>

        <div className="form-group">
          <label htmlFor="conversions">Conversions:</label>
          <input
            type="number"
            id="conversions"
            name="conversions"
            value={formData.conversions}
            onChange={handleChange}
            disabled
            min="0"
            placeholder="Enter conversions"
          />
        </div>

        <div className="form-group">
          <label htmlFor="revenue">Revenue:</label>
          <input
            type="number"
            id="revenue"
            name="revenue"
            value={formData.revenue}
            onChange={handleChange}
            disabled
            min="0"
            step="0.01"
            placeholder="Enter revenue"
          />
        </div>

        <div className="form-group">
          <label htmlFor="expirationDate">Choose Expiration Date</label>
          <input
            type="date"
            id="expirationDate"
            name="expirationDate"
            value={formData.expirationDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="form-group checkbox-group">
          <label htmlFor="runUntilPaused">
            <input
              type="checkbox"
              id="runUntilPaused"
              name="runUntilPaused"
              checked={formData.runUntilPaused}
              onChange={handleChange}
            />
            Run Until Paused
          </label>
        </div>
        
        
        {/*<div className="form-group checkbox-group">
          <label htmlFor="isEnabled">
            <input
              type="checkbox"
              id="isEnabled"
              name="isEnabled"
              checked={formData.isEnabled}
              onChange={handleChange}
            />
            Enable Offer
          </label>
        </div>*/}
      

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onCancel}>
            Back
          </button>
          <button type="submit" className="submit-button">
            {editData ? 'Update' : 'Create Offer'}
          </button>
          </div>
        <div class="offer-preview">
    <h3>Offer Preview</h3>
    <div class="offer-card">
      <img src="product-image.jpg" alt="Product Image" class="product-image"/>
      <div class="offer-details">
        <h4>Berry</h4>
        <p class="discount">25% Discount</p>
        <p class="pricing">
          <span class="original-price">$19.95</span>
          <span class="discounted-price">$14.97</span>
        </p>
      </div>
      <button class="add-button">Add it now!</button>
      </div>  
      </div>  
      </form>
    </div>
  );
};

export default FormComponent;
