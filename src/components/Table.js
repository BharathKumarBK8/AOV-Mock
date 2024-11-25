import React, { useState } from 'react';
import SearchBar from './SearchBar';
import FilterDropdown from './FilterDropdown';
import FormComponent from './FormComponent';
import '../App.css';

const Table = () => {
  const [tableData, setTableData] = useState([
    { 
      id: 'BERRY25',
      offerName: 'Berry Summer Sale',
      discountCode: 'BERRY25',
      minimumCartValue: 50.00,
      discountPercentage: 25,
      productId: 'PROD001',
      productVariantId: 'VAR001',
      backgroundColor: 'FFFFFF',
      fontColor: '000000',
      buttonColor: '4997E0',
      buttonFontColor: 'FFFFFF',
      buttonHoverColor: 'FFFFFF',
      buttonHoverFontColor: '000000',
      expirationDate: '2024-12-31',
      runUntilPaused: true,
      impressions: 133,
      conversions: 19,
      revenue: 284.43,
      conversionRate: 14.29,
      isEnabled: true 
    },
    { 
      id: 'DISPLAY24',
      offerName: 'Display Discount',
      discountCode: 'DISPLAY24',
      minimumCartValue: 75.00,
      discountPercentage: 24,
      productId: 'PROD002',
      productVariantId: 'VAR002',
      backgroundColor: 'F5F5F5',
      fontColor: '333333',
      buttonColor: '2C5282',
      buttonFontColor: 'FFFFFF',
      buttonHoverColor: '2B6CB0',
      buttonHoverFontColor: 'FFFFFF',
      expirationDate: '2024-11-30',
      runUntilPaused: false,
      impressions: 104,
      conversions: 14,
      revenue: 209.58,
      conversionRate: 13.49,
      isEnabled: false 
    },
    { 
      id: 'LAN100',
      offerName: 'Landing Page Special',
      discountCode: 'LAN100',
      minimumCartValue: 100.00,
      discountPercentage: 30,
      productId: 'PROD003',
      productVariantId: 'VAR003',
      backgroundColor: 'FAFAFA',
      fontColor: '222222',
      buttonColor: '38A169',
      buttonFontColor: 'FFFFFF',
      buttonHoverColor: '48BB78',
      buttonHoverFontColor: 'FFFFFF',
      expirationDate: '2024-10-31',
      runUntilPaused: true,
      impressions: 84,
      conversions: 8,
      revenue: 119.76,
      conversionRate: 9.52,
      isEnabled: true 
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  const handleToggle = (id) => {
    setTableData(tableData.map(item => 
      item.id === id ? { ...item, isEnabled: !item.isEnabled } : item
    ));
  };

  const handleSearch = (value) => {
    setSearchTerm(value.toLowerCase());
  };

  const handleFilterChange = (value) => {
    setStatusFilter(value);
  };

  const handleAddOffer = (newOffer) => {
    if (editingOffer) {
      // Update existing offer
      setTableData(prevData => 
        prevData.map(item => 
          item.id === newOffer.id ? newOffer : item
        )
      );
      setEditingOffer(null);
    } else {
      // Add new offer
      setTableData(prevData => [...prevData, newOffer]);
    }
    setIsFormVisible(false);
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setIsFormVisible(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      setTableData(prevData => prevData.filter(item => item.id !== id));
    }
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingOffer(null);
  };

  const filteredData = tableData.filter(item => {
    const matchesSearch = (
      item.id.toLowerCase().includes(searchTerm) ||
      item.impressions.toString().includes(searchTerm) ||
      item.conversions.toString().includes(searchTerm) ||
      item.revenue.toString().includes(searchTerm) ||
      item.conversionRate.toString().includes(searchTerm)
    );

    const matchesStatus = 
      statusFilter === 'all' ? true :
      statusFilter === 'enabled' ? item.isEnabled :
      !item.isEnabled;

    return matchesSearch && matchesStatus;
  });

  // Calculate totals from filtered data
  const totals = filteredData.reduce((acc, item) => {
    return {
      impressions: acc.impressions + item.impressions,
      conversions: acc.conversions + item.conversions,
      revenue: acc.revenue + item.revenue,
    };
  }, { impressions: 0, conversions: 0, revenue: 0 });

  // Calculate overall conversion rate
  const totalConversionRate = totals.impressions > 0 
    ? (totals.conversions / totals.impressions) * 100 
    : 0;

  return (
    <div className="dashboard-container">
      {isFormVisible ? (
        <FormComponent 
          onSubmit={handleAddOffer}
          onCancel={handleCancel}
          editData={editingOffer}
        />
      ) : (
        <>
          <div className='table-controls'>
          <div className="table-controls-left">
            <SearchBar onSearch={handleSearch} />
            <FilterDropdown 
              onFilterChange={handleFilterChange}
              currentFilter={statusFilter}
            />
            </div>
            <div className='table-controls-right'>
            <button 
              className="create-button"
              onClick={() => setIsFormVisible(true)}
            >
              Create New Offer
            </button>
          </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Offer</th>
                  <th>Impressions</th>
                  <th>Conversions</th>
                  <th>Revenue ($)</th>
                  <th>Conversion Rate (%)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={item.isEnabled}
                          onChange={() => handleToggle(item.id)}
                        />
                        <span className="slider round"></span>
                      </label>
                    </td>
                    <td>{item.discountCode}</td>
                    <td>{item.impressions}</td>
                    <td>{item.conversions}</td>
                    <td>{item.revenue.toFixed(2)}</td>
                    <td>{item.conversionRate.toFixed(2)}</td>
                    <td className="action-buttons">
                      <button 
                        className="edit-button"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="totals-row">
                  <td></td>
                  <td>Total</td>
                  <td>{totals.impressions}</td>
                  <td>{totals.conversions}</td>
                  <td>${totals.revenue.toFixed(2)}</td>
                  <td>{totalConversionRate.toFixed(2)}%</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Table;
