import React, { useState, useEffect } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import './Header.css';

const Header = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown')) {
                setActiveDropdown(null);
            }
        };

        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const handleClick = (menu, event) => {
        event.stopPropagation();
        setActiveDropdown(activeDropdown === menu ? null : menu);
    };

    return (
        <header className="header">
            <div className="header-left">
                <div className="logo-container">
                    <CorporateFareIcon sx={{ fontSize: 24, marginRight: '8px' }} />
                    <h1>MDLZ M&A</h1>
                </div>
                <nav>
                    <ul>
                        <li className="dropdown">
                            <span onClick={(e) => handleClick('output', e)} className="nav-item">
                                Output
                            </span>
                            {activeDropdown === 'output' && (
                                <ul className="dropdown-menu">
                                    <li>Overview</li>
                                    <li>Financial Metrics</li>
                                    <li>Reports</li>
                                </ul>
                            )}
                        </li>
                        <li className="dropdown">
                            <span onClick={(e) => handleClick('input', e)} className="nav-item">
                                Input
                            </span>
                            {activeDropdown === 'input' && (
                                <ul className="dropdown-menu">
                                    <li>Data Entry</li>
                                    <li>Upload Files</li>
                                    <li>Settings</li>
                                </ul>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="header-right">
                <SettingsIcon className="settings-icon" sx={{ fontSize: '30px'}} />
            </div>
        </header>
    );
};

export default Header;