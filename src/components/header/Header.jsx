import React, { useState, useEffect } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import './Header.css';
import LandingPage from '../pages/LandingPage';
import TotalBasePage from '../pages/TotalBasePage';
import ExcelImportPage from '../pages/ExcelImportPage';
import ControlPage from '../pages/ControlPage';


const Header = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [displayContent, setDisplayContent] = useState([]); // State variable to control displayed content

    const data_items = ["AVP", "Leverage Profile", "Cash Flow", "P&L", "NPV Waterfall"];
    const input_items = ["Total Base", "Total Cost Syn", "Total Rev Syn", "Dis-Syn", "NWC", "ProFormaPL", "1xCosts"];
    const settings_items = ["Control Panel", "Import Data"]

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
                // case 0: return <AVPPage />;
                // case 1: return <LeverageProfilePage />;
                // case 2: return <CashFlowPage />;
                // case 3: return <PLPage />;
                // case 4: return <NPVWaterfallPage />;
                default: return <LandingPage handleGetStarted={handleGetStarted}/>;
            }
        }
        
        // Input Tables section
        if (section === 1) {
            switch (index) {
                case 0: return <TotalBasePage />;
                // case 1: return <TotalCostSynPage />;
                // case 2: return <TotalRevSynPage />;
                // case 3: return <DisSynPage />;
                // case 4: return <NWCPage />;
                // case 5: return <ProFormaPLPage />;
                // case 6: return <OnexCostsPage />;
                default: return <LandingPage handleGetStarted={handleGetStarted}/>;
            }
        }
        
        // Settings section
        if (section === 2) {
            switch (index) {
                case 0: return <ControlPage />;
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
    };

    return (
        <>
        <header className="header">
            <div className="header-left">
                <div className="logo-container" onClick={() => handleContentChange(-1, -1)}>
                    <CorporateFareIcon sx={{ fontSize: 24, marginRight: '8px' }} />
                    <h1>MDLZ M&A</h1>
                </div>
                <nav>
                    <ul>
                        <li className="dropdown">
                            <span onClick={(e) => handleClick('output', e)} className={`nav-item ${activeDropdown === 'output' ? 'active' : ''}`}>
                                Data Tables
                            </span>
                            {activeDropdown === 'output' && (
                                <ul className="dropdown-menu">
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
                            <span onClick={(e) => handleClick('input', e)} className={`nav-item ${activeDropdown === 'input' ? 'active' : ''}`}>
                                Input Tables
                            </span>
                            {activeDropdown === 'input' && (
                                <ul className="dropdown-menu">
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
                    <SettingsIcon onClick={(e) => handleClick('settings', e)} className="settings-icon" sx={{ fontSize: '30px'}} />
                    {activeDropdown === 'settings' && (
                        <ul className="dropdown-menu">
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
        </>
    );
};

export default Header;