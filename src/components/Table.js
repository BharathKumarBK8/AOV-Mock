import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import SearchBar from './SearchBar';
import FilterDropdown from './FilterDropdown';
import FormComponent from './FormComponent';
import Loader from './Loader';
import { api } from '../API/Api';
import '../App.css';

const Table = () => {
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [totals, setTotals] = useState({
    impressions: 0,
    conversions: 0,
    revenue: 0,
    conversionRate: '0.00'
  });

  // Fetch data effect
  useEffect(() => {
    fetchOffers();
  }, []);

  // Filter data effect
  useEffect(() => {
    const filtered = tableData.filter(item => {
      const matchesStatus = 
        statusFilter === 'all' ? true :
        statusFilter === 'enabled' ? item.isEnabled :
        !item.isEnabled;

      return matchesStatus;
    });

    setFilteredData(filtered);
  }, [tableData, statusFilter]);

  // Calculate totals effect
  useEffect(() => {
    const calculatedTotals = filteredData.reduce((acc, item) => ({
      impressions: acc.impressions + (item.impressions || 0),
      conversions: acc.conversions + (item.conversions || 0),
      revenue: acc.revenue + (item.revenue || 0)
    }), { impressions: 0, conversions: 0, revenue: 0 });

    const totalConversionRate = calculatedTotals.impressions > 0 
      ? ((calculatedTotals.conversions / calculatedTotals.impressions) * 100).toFixed(2)
      : '0.00';

    setTotals({
      ...calculatedTotals,
      conversionRate: totalConversionRate
    });
  }, [filteredData]);

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

  const debouncedSearch = useCallback(
    debounce(async (searchValue) => {
      try {
        setOperationLoading(true);
        // If search is empty or null, fetch all offers instead
        const searchResults = !searchValue 
          ? await api.getAllOffers()
          : await api.searchOffers(searchValue);
        setTableData(searchResults);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setOperationLoading(false);
      }
    }, 500),
    []
  );
  
  const handleSearch = (value) => {
    // Handle empty string or null cases
    const trimmedValue = value?.trim() || '';
    setSearchTerm(trimmedValue.toLowerCase());
    debouncedSearch(trimmedValue.toLowerCase());
  };
  
  const handleToggle = async (id) => {
    try {
      setOperationLoading(true);
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
    } finally {
      setOperationLoading(false);
    }
  };

  const handleFilterChange = (value) => {
    setStatusFilter(value);
  };

  const handleAddOffer = async (offerData) => {
    try {
      setOperationLoading(true);
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
    } finally {
      setOperationLoading(false);
    }
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        setOperationLoading(true);
        await api.deleteOffer(id);
        setTableData(prevData => prevData.filter(item => item.id !== id));
      } catch (err) {
        console.error(err);
        alert(err.message);
      } finally {
        setOperationLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingOffer(null);
  };

  return (
    <div className="dashboard-container">
      {!isFormVisible && (
        <div className='table-controls'>
          <div className="table-controls-left">
            <SearchBar 
              onSearch={handleSearch} 
              value={searchTerm}
            />
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
      )}

      <Loader isLoading={loading || operationLoading}>
        {error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            {isFormVisible ? (
              <FormComponent 
                onSubmit={handleAddOffer}
                onCancel={handleCancel}
                editData={editingOffer}
              />
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Offer</th>
                    <th>Impressions</th>
                    <th>Conversions</th>
                    <th>Revenue</th>
                    <th>Conversion Rate</th>
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
                      <td>$ {item.revenue?.toFixed(2)}</td>
                      <td>{item.conversionRate?.toFixed(2)} %</td>
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
                    <td>{totals.conversionRate}%</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            )}
          </>
        )}
      </Loader>
    </div>
  );
};

export default Table;
