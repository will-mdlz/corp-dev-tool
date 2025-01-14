import React from 'react';
import DataTable from '../common/DataTable';
import db from '../../services/tempdb';
// import backgroundImage from '../../images/image1.jpg'

const FinancialTables = ({ type }) => {
  // Common years for all tables
  //const years = Array.from({ length: 15 }, (_, i) => (2018 + i));

  // const isDataEmpty = (type) => {
  //   // Check if metadata exists and if the specific type has data
  //   return !db.metadata[type];
  // };
  
  // Metrics for each table type
  const tableConfigs = {
    proFormaPL: {
      title: 'Pro Forma P&L (USD)',
      years: Array.from({ length: db.metadata['proforma'].totalYears }, (_, i) => (db.metadata['proforma'].startYear + i).toString()),
      metrics: db.getMetrics('proforma'),
      ref: 'proforma',
      dollar_rows: [0,2,4,6,11,14,16,24,26,28,30],
      perc_rows: [1,3,5,7,10,12,15,17,19,21,23,25,27,29,31,33],
      single_indent_rows: [1,3,5,7,8,10,12,13,15,17,18,20,22,25,27,29,31,33],
      double_indent_rows: [19,21,23],
      editable_rows: []
    },
    disSynergies: {
      title: 'Dis-Synergies (USD)',
      years: Array.from({ length: db.metadata['dis'].totalYears }, (_, i) => (db.metadata['dis'].startYear + i).toString()),
      metrics: db.getMetrics('dis'),
      ref: 'dis',
      dollar_rows: [0,2,4,7,9,14,17,19,27,29,31,33],
      perc_rows: [1,3,5,6,8,10,13,15,18,20,22,24,26,28,30,32,34,36],
      single_indent_rows: [1,3,5,6,8,10,11,13,15,16,18,20,21,23,25,28,30,32,34,36],
      double_indent_rows: [22,24,26],
      editable_rows: []
    },
    totalRevSyn: {
      title: 'Total Revenue Synergies (USD)',
      years: Array.from({ length: db.metadata['rev'].totalYears }, (_, i) => (db.metadata['rev'].startYear + i).toString()),
      metrics: db.getMetrics('rev'),
      ref: 'rev',
      dollar_rows: [0,2,4,7,9,14,17,19,27,29,31,33],
      perc_rows: [1,3,5,6,8,10,13,15,18,20,22,24,26,28,30,32,34,36],
      single_indent_rows: [1,3,5,6,8,10,11,13,15,16,18,20,21,23,25,28,30,32,34,36],
      double_indent_rows: [22,24,26],
      editable_rows: []
    },
    costSyn: {
      title: 'Cost Synergies (USD)',
      years: Array.from({ length: db.metadata['cost'].totalYears }, (_, i) => (db.metadata['cost'].startYear + i).toString()),
      metrics: db.getMetrics('cost'),
      ref: 'cost',
      dollar_rows: [0,2,4,6,11,14,16,24,26,28,29],
      perc_rows: [1,3,5,7,10,12,15,17,19,21,23,25,27,30],
      single_indent_rows: [1,3,5,7,8,10,12,13,15,17,18,20,22,25,27,30],
      double_indent_rows: [19,21,23],
      editable_rows: []
    },
    totalBase: {
      title: 'Total Base (USD)',
      years: Array.from({ length: db.metadata['base'].totalYears }, (_, i) => (db.metadata['base'].startYear + i).toString()),
      metrics: db.getMetrics('base'),
      ref: 'base',
      dollar_rows: [0,2,4,6,11,14,16,24,26,28,30],
      perc_rows: [1,3,5,7,10,12,15,17,19,21,23,25,27,29,31,33],
      single_indent_rows: [1,3,5,7,8,10,12,13,15,17,18,20,22,25,27,29,31,33],
      double_indent_rows: [19,21,23],
      editable_rows: []
    },
  };

  const convertDisplays = (displays) => {
    let displayData = []
    for(let i = 0; i < displays.length; i++) {
      displayData.push(`'${(displays[i][0] + '').substring(2, 4)}-'${(displays[i][1] + '').substring(2, 4)}`)
    }
    return displayData
  }

  const yearRange = convertDisplays(db.control.Displays)

  // Generate sample range data (accumulated values)
  const generateRangeData = (metrics) => {
    return metrics.map(() =>
      yearRange.map(() => Math.random())
    );
  };

  // Get the configuration for the requested table type
  const config = tableConfigs[type];

  // Return null or an error message if the table type doesn't exist
  if (!config) {
    return null;
  }

  return (
    <div className="financial-table">
      <DataTable
        title={config.title}
        metrics={config.metrics}
        years={config.years}
        yearRange={yearRange}
        rangeData={generateRangeData(config.metrics)}
        ref={config.ref}
        dollar_rows={config.dollar_rows}
        perc_rows={config.perc_rows}
        single_indent_rows={config.single_indent_rows}
        double_indent_rows={config.double_indent_rows}
        editable_rows={config.editable_rows}
      />
    </div>
  );
};

export default FinancialTables; 