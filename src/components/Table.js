import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import FilterDropdown from './FilterDropdown';
import FormComponent from './FormComponent';
import { api } from '../API/Api';
import '../App.css';

const Table = () => {
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const data = await api.getAllOffers();
      setTableData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const offer = tableData.find(item => item.id === id);
      const updatedOffer = await api.updateOffer(id, { ...offer, isEnabled: !offer.isEnabled });
      setTableData(prevData =>
        prevData.map(item =>
          item.id === id ? updatedOffer : item
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value.toLowerCase());
  };

  const handleFilterChange = (value) => {
    setStatusFilter(value);
  };

  const handleAddOffer = async (offerData) => {
    try {
      if (editingOffer) {
        const updatedOffer = await api.updateOffer(editingOffer.id, offerData);
        setTableData(prevData =>
          prevData.map(item =>
            item.id === editingOffer.id ? updatedOffer : item
          )
        );
      } else {
        const createdOffer = await api.createOffer(offerData);
        setTableData(prevData => [...prevData, createdOffer]);
      }
      setIsFormVisible(false);
      setEditingOffer(null);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        await api.deleteOffer(id);
        setTableData(prevData => prevData.filter(item => item.id !== id));
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    }
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingOffer(null);
  };

  const filteredData = tableData.filter(item => {
    const matchesSearch = 
      item.discountCode?.toLowerCase().includes(searchTerm) ||
      item.impressions?.toString().includes(searchTerm) ||
      item.conversions?.toString().includes(searchTerm) ||
      item.revenue?.toString().includes(searchTerm) ||
      item.conversionRate?.toString().includes(searchTerm);

    const matchesStatus = 
      statusFilter === 'all' ? true :
      statusFilter === 'enabled' ? item.isEnabled :
      !item.isEnabled;

    return matchesSearch && matchesStatus;
  });

  const totals = filteredData.reduce((acc, item) => ({
    impressions: acc.impressions + (item.impressions || 0),
    conversions: acc.conversions + (item.conversions || 0),
    revenue: acc.revenue + (item.revenue || 0)
  }), { impressions: 0, conversions: 0, revenue: 0 });

  const totalConversionRate = totals.impressions > 0 
    ? ((totals.conversions / totals.impressions) * 100).toFixed(2)
    : '0.00';

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

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
            <button 
              className="create-button"
              onClick={() => setIsFormVisible(true)}
            >
              Create New Offer
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Status</th>
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
                    <td>{item.revenue?.toFixed(2)}</td>
                    <td>{item.conversionRate?.toFixed(2)}</td>
                    <td>
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
                  <td>{totalConversionRate}%</td>
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
