import React from 'react';
import DataDisplay from '../common/DataDisplay';
import db from '../../services/tempdb';
// import backgroundImage from '../../images/image1.jpg'

const FinancialDisplay = ({ type }) => {
  // Common years for all tables
  const years = Array.from({ length: 11 }, (_, i) => (2022 + i));

  
  // Metrics for each table type
  const tableConfigs = {
    leverageProfile: {
      title: 'Leverage Profile',
      years: years,//Array.from({ length: db.metadata['ProFormaPL (USD)'].totalYears }, (_, i) => (db.metadata['ProFormaPL (USD)'].startYear + i).toString()),
      metrics: [
        "Mondelez Status Quo Net Leverage", "Debt from Acquisition", "Cumulative (Cash Flow) / Deficit", "Incremental Net Debt", "Base EBITDA from Acquisition", 
        "Synergy Credit", "Synergized EBITDA for Leverage", "Pro Forma Net Leverage", "Change vs. Status Quo"
      ],
      ref: 'leverageprofile',
      dollar_rows: [3,6],
      perc_rows: [],
      indent_rows: [1,2,4,5,8],
      pp_rows: [0,7,8]
    },
    cashflow: {
      title: 'Cash Flow',
      years: years,//Array.from({ length: db.metadata['Dis-Synergies (USD)'].totalYears }, (_, i) => (db.metadata['Dis-Synergies (USD)'].startYear + i).toString()),
      metrics: [
        "Adjusted EBIT", "Blended Cash Tax %", "NOPAT", "Plus: D&A", "Minus: CapEx", "Less: (Increase) / Plus Decrease in NWC", "Less: After Tax One Time Costs",
        "Return on Excess Cash", "Net Cash Flow Impact (Unlevered)", "After Tax Interest on Acquisition Debt", "Less: Return on Excess Cash in Unlevered Scenario",
        "Net Cash Flow Impact (Levered)"
      ],
      ref: 'cashflow',
      dollar_rows: [2,8,11],
      perc_rows: [1],
      indent_rows: [1]
    },
    consolidatedpnl: {
      title: 'Consolidated P&L',
      years: Array.from({ length: db.metadata['base'].totalYears }, (_, i) => (db.metadata['base'].startYear + i).toString()),
      metrics: [
        "Base Revenue", "Revenue Synergies", "Total Net Revenue", "% growth", "Gross Profit", "% margin", "A&C", "% revenue", "SG&A and Other",
        "% revenue", "Adjusted EBIT", "% margin", "Adjusted EBITDA", "% margin"
        ],
      ref: 'consolidatedpnl',
      dollar_rows: [2,4,10,12],
      perc_rows: [3,5,7,9,11,13],
      indent_rows: [0,1,3,5,6,8,11,13],
      double_indent_rows: [7,9]
    },
    standalonepnl: {
        title: 'Standalone P&L',
        years: Array.from({ length: db.metadata['base'].totalYears }, (_, i) => (db.metadata['base'].startYear + i).toString()),
        metrics: [
            "Total Volume", "% growth", "Total Net Revenue", "% growth", "Gross Profit", "% margin", "A&C", "% revenue", "SG&A and Other",
            "% revenue", "Adjusted EBIT", "% margin", "Adjusted EBITDA", "% margin"
            ],
        ref: 'standalonepnl',
        dollar_rows: [0,2,4,10,12],
        perc_rows: [3,5,7,9,11,13],
        indent_rows: [1,3,5,6,8],
        double_indent_rows: [7,9,11,13]
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
      <DataDisplay
        title={config.title}
        metrics={config.metrics}
        years={config.years}
        yearRange={yearRange}
        rangeData={generateRangeData(config.metrics)}
        ref={config.ref}
        dollar_rows={config.dollar_rows}
        perc_rows={config.perc_rows}
        indent_rows={config.indent_rows}
        double_indent_rows={config.double_indent_rows}
        pp_rows={config.pp_rows}
      />
    </div>
  );
};

export default FinancialDisplay; 