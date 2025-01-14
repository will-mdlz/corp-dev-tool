import React, { useState, useEffect } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import './Header.css';
import LandingPage from '../pages/LandingPage';
import ExcelImportPage from '../pages/ExcelImportPage';
import ControlPage from '../pages/ControlPage';
import FinancialTables from '../pages/FinancialTables';
import FinancialDisplay from '../pages/FinancialDisplay';
import NWC from '../pages/NWC';
import XCosts from '../pages/1xCosts';
import AVP from '../pages/AVP';
import NPVWaterfall from '../pages/Waterfall';
import db from '../../services/tempdb';
import { Dvr } from '@mui/icons-material';
 

const small = {
    marginLeft: '4rem',
    marginRight: '3rem',
    spaceBetween: '3rem',
}

const medium = {
    marginLeft: '7rem',
    marginRight: '5rem',
    spaceBetween: '4.5rem',
}

const large = {
    marginLeft: '10rem',
    marginRight: '8rem',
    spaceBetween: '7rem',
}

const Header = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [displayContent, setDisplayContent] = useState([]); // State variable to control displayed content
    const [dropdownTop, setDropdownTop] = useState(0);

    const data_items = ["AVP", "Leverage Profile", "Cash Flow", "Consolidated P&L", "Standalone P&L", "NPV Waterfall"];
    const input_items = ["Total Base", "Total Cost Syn", "Total Rev Syn", "Dis-Syn", "NWC", "ProFormaPL", "1xCosts"];
    const settings_items = ["Control Panel", "Import Data"]

    const [size, setSize] = useState(small)

    useEffect(() => {
    const calculateSize = () => {
        const ws = window.innerWidth;
        const newSize = ws < 1250 ? small : ws < 1800 ? medium : large
        setSize(newSize);
    }
    
    calculateSize();

    window.addEventListener("resize", calculateSize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", calculateSize);
    }, [])

    useEffect(() => {
        // Update header height dynamically
        const updateDropdownPosition = () => {
            setActiveDropdown(false)
        };

        // Set initial header height
        updateDropdownPosition();

        // Listen for window resize and scroll
        window.addEventListener('scroll', updateDropdownPosition);
        window.addEventListener('resize', updateDropdownPosition);

        return () => {
            window.removeEventListener('scroll', updateDropdownPosition);
            window.removeEventListener('resize', updateDropdownPosition);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown')) {
                setActiveDropdown(null);
            }
        };

        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const handleGetStarted = () => {
        setDisplayContent([2, 1])
    }

    const renderContent = () => {
        const [section, index] = displayContent;
        
        // Data Tables section
        if (section === 0) {
            switch (index) {
                case 0: return <AVP/>;
                case 1: return <FinancialDisplay type="leverageProfile" />;
                case 2: return <FinancialDisplay type='cashflow' />;
                case 3: return <FinancialDisplay type='consolidatedpnl' />;
                case 4: return <FinancialDisplay type='standalonepnl' />;
                case 5: return <NPVWaterfall />;
                default: return <LandingPage handleGetStarted={handleGetStarted}/>;
            }
        }
        
        // Input Tables section
        if (section === 1) {
            switch (index) {
                case 0: return db.metadata['base'] ? <FinancialTables type="totalBase" /> : <ExcelImportPage />;
                case 1: return db.metadata['cost'] ? <FinancialTables type="costSyn" /> : <ExcelImportPage />;
                case 2: return db.metadata['rev'] ? <FinancialTables type="totalRevSyn" /> : <ExcelImportPage />;
                case 3: return db.metadata['dis'] ? <FinancialTables type="disSynergies" /> : <ExcelImportPage />;
                case 4: return db.metadata['nwc'] ? <NWC /> : <ExcelImportPage />; 
                case 5: return db.metadata['proforma'] ? <FinancialTables type="proFormaPL" /> : <ExcelImportPage />;
                case 6: return db.metadata['xcost'] ? <XCosts /> : <ExcelImportPage />;
                default: return <LandingPage handleGetStarted={handleGetStarted}/>;
            }
        }
        
        // Settings section
        if (section === 2) {
            switch (index) {
                case 0: return db.metadata['control'] ? <ControlPage /> : <ExcelImportPage />;
                case 1: return <ExcelImportPage />;
                default: return <LandingPage handleGetStarted={handleGetStarted}/>;
            }
        }
        
        return <LandingPage handleGetStarted={handleGetStarted}/>;
    };

    const handleContentChange = (i, j) => {
        setDisplayContent([i, j]);
        setActiveDropdown(null);
    };

    const handleClick = (menu, event) => {
        event.stopPropagation();
        setActiveDropdown(activeDropdown === menu ? null : menu);
        const header = document.querySelector('.header');
        const rect = header?.getBoundingClientRect();
        setDropdownTop(rect?.bottom - 8 || 0);
    };

    return (
        <div>
        <header className="header">
            <div className="header-left" style={{marginLeft: size.marginLeft}}>
                <div className="logo-container"  onClick={() => handleContentChange(-1, -1)}>
                    <CorporateFareIcon sx={{ fontSize: 24, marginRight: '8px' }} />
                    <h1>MDLZ M&A</h1>
                </div>
                <nav>
                    <ul>
                        <li className="dropdown">
                            <span onClick={(e) => handleClick('output', e)} className={`nav-item ${activeDropdown === 'output' ? 'active' : ''}`} style={{marginLeft: size.spaceBetween}}>
                                Data Tables
                            </span>
                            {activeDropdown === 'output' && (
                                <ul className="dropdown-menu" style={{ top: `${dropdownTop}px` }}>
                                    {data_items.map((item, index) => {
                                        return (
                                            <li 
                                                key={index} 
                                                onClick={() => handleContentChange(0, index)}
                                            >
                                                {item}
                                            </li>
                                        )
                                    })}
                                </ul>
                            )}
                        </li>
                        <li className="dropdown">
                            <span onClick={(e) => handleClick('input', e)} className={`nav-item ${activeDropdown === 'input' ? 'active' : ''}`} style={{marginLeft: size.spaceBetween}}>
                                Input Tables
                            </span>
                            {activeDropdown === 'input' && (
                                <ul className="dropdown-menu" style={{ top: `${dropdownTop}px` }}>
                                    {input_items.map((item, index) => {
                                        return (
                                            <li 
                                                key={index} 
                                                onClick={() => handleContentChange(1, index)}
                                            >
                                                {item}
                                            </li>
                                        )
                                    })}
                                </ul>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="header-right">
                <div className="dropdown">
                    <SettingsIcon onClick={(e) => handleClick('settings', e)} className="settings-icon" style={{ marginRight: size.marginRight }} sx={{ fontSize: '30px'}} />
                    {activeDropdown === 'settings' && (
                        <ul className="dropdown-menu" style={{ top: `${dropdownTop}px` }}>
                            {settings_items.map((item, index) => {
                                return (
                                    <li 
                                        key={index} 
                                        onClick={() => handleContentChange(2, index)}
                                    >
                                        {item}
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </header>
        {renderContent()}
        </div>
    );
};

export default Header;