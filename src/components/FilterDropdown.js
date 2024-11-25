import React from 'react';

const FilterDropdown = ({ onFilterChange, currentFilter }) => {
  return (
    <select 
      className="filter-dropdown"
      value={currentFilter}
      onChange={(e) => onFilterChange(e.target.value)}
    >
      <option value="all">All</option>
      <option value="enabled">Enabled</option>
      <option value="disabled">Disabled</option>
    </select>
  );
};

export default FilterDropdown;
