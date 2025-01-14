import React, { useState, useEffect } from 'react';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { TextField } from '@mui/material';
import { convertToDollar, convertToPercent, convertToGeneral } from '../compfunctions/TableFunctions';
import './css/ControlPage.css'
import db from '../../services/tempdb';
import backgroundImage from '../../images/image3.jpg'

const small = {
  f1: '1.5rem', f2: 17, f3: 13,
  i1: '15px'
}

const medium = {
  f1: '2rem', f2: 21, f3: 17,
  i1: '35px'
}

const large = {
  f1: '2rem', f2: 25, f3: 19,
  i1: '50px'
}

const ControlPage = () => {
  const [projectName, setProjectName] = useState(db.control["Project Name"]);
  const [isPrivate, setIsPrivate] = useState(db.control["Ownership"] === 'Private');
  const [entries, setEntries] = useState([
    { id: 1, name: 'First Year for DCF', type: 'float', value: db.control["First Year for DCF"] },
    { id: 2, name: 'MDLZ Tax Rate', type: 'percent', value: db.control["MDLZ Tax Rate"] },
    { id: 3, name: 'Target Tax Rate', type: 'percent', value: db.control["Target Tax Rate"] },
    { id: 4, name: 'Interest Rate', type: 'percent', value: db.control["Interest Rate"] },
    { id: 5, name: '% of Interest Deductible', type: 'percent', value: db.control["% of Interest Deductible"] },
    { id: 6, name: 'Synergy Credit for Leverage', type: 'percent', value: db.control["Synergy Credit for Leverage"] },
    { id: 7, name: 'Run Rate Cost Synergies', type: 'dollar', value: db.control["Run Rate Cost Synergies"] },
    { id: 8, name: 'Transaction Amortization (%)', type: 'percent', value: db.control["Transaction Amortization (%)"] },
    { id: 9, name: 'Transaction Amortization (Years)', type: 'int', value: db.control["Transaction Amortization (Years)"] },
    { id: 10, name: 'Close Date', type: 'date', value: db.control["Close date"]},
    { id: 11, name: 'Year 1 P&Ls', type: 'int', value: db.control["Year 1 P&Ls"] },
    { id: 12, name: 'NWC Days', type: 'int', value: db.control["NWC Days"] },
    { id: 13, name: 'Blended WACC', type: 'percent', value: db.control["Blended WACC"] },
    { id: 14, name: 'PGR', type: 'percent', value: db.control["PGR"] },
    { id: 15, name: 'Purchase Multiple', type: 'float', value: db.control["Purchase Multiple"] },
  ]);
  const [publicEntries, setPublicEntries] = useState([
    { id: 16, name: 'Current Share Price', type: 'dollar', value: db.control["Current Share Price"] },
    { id: 17, name: 'Shares Outstanding', type: 'float', value: db.control["Shares Outstanding"] },
    { id: 18, name: 'Current Net Debt', type: 'dollar', value: db.control["Current Net Debt"] },
  ]);
  const [value, setValue] = useState('')
  const [editing, setEditing] = useState([])

  const [size, setSize] = useState(small)

    useEffect(() => {
    const calculateSize = () => {
        const ws = window.innerWidth;
        const newSize = ws < 1750 ? small : ws < 2500 ? medium : large
        setSize(newSize);
    }
    
    calculateSize();

    window.addEventListener("resize", calculateSize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", calculateSize);
    }, [])

  const handleFocus = (table, key) => (event) => {
    setEditing([table, key]);
  }

  const handleInputChange = (table, key) => (event) => {
    setValue(event.target.value);
  }

  const isEditing = (table, key) => {
    return editing[0]===table && editing[1] === key;
  }

  const handleBlur = (table, key) => (event) => {
    const currVal = event.target.value;
    if(currVal !== "") {
        switch (table) {
            case 0: 
                setProjectName(currVal);
                db.control["Project Name"] = currVal;
                break;
            case 1: {
                const entry = entries.find(e => e.id === key);
                if(entry.type === 'date') {
                    setEntries(entries.map(entry => 
                        entry.id === key ? { ...entry, value: currVal } : entry
                    ));
                    db.control["Close date"] = currVal;
                    break;
                }
                const numVal = Number(currVal);
                
                if (isNaN(numVal)) {
                    // Handle invalid number input
                    console.warn('Invalid number input');
                    break;
                }
                
                const finalValue = entry.type === 'percent' ? (numVal / 100) : numVal;
                setEntries(entries.map(entry => 
                    entry.id === key ? { ...entry, value: finalValue } : entry
                ));
                db.control[entry.name] = finalValue;
                break;
            }
            case 2: {
                const entry = publicEntries.find(e => e.id === key);
                const numVal = Number(currVal);
                
                if (isNaN(numVal)) {
                    // Handle invalid number input
                    console.warn('Invalid number input');
                    break;
                }
                
                const finalValue = entry.type === 'percent' ? (numVal / 100) : numVal;
                setPublicEntries(publicEntries.map(entry => 
                    entry.id === key ? { ...entry, value: finalValue } : entry
                ));
                db.control[entry.name] = finalValue;
                break;
            }
            default:
                return null;
        }
    }
    setValue('');
    setEditing([]);
  }

  const flipOwnership = () => {
    setIsPrivate(!isPrivate);
    db.control["Ownership"] = isPrivate ? 'Public' : 'Private';
  }

  const renderInputField = (entry) => {
    const displayValue = isEditing(1, entry.id) ? value : (
      entry.type === 'date' ? entry.value :
      entry.type === 'percent' ? convertToPercent(entry.value, 1) :
      entry.type === 'dollar' ? convertToDollar(entry.value) :
      entry.type === 'int' ? convertToGeneral(entry.value, 0) :
      convertToGeneral(entry.value)
    );

    return (
      <TextField
        type={entry.type === 'date' ? 'date' : 'text'}
        value={displayValue}
        onFocus={handleFocus(1, entry.id)}
        onChange={handleInputChange(1, entry.id)}
        onBlur={handleBlur(1, entry.id)}
        size="small"
        label={entry.type === 'percent' ? '%' : entry.type === 'dollar' ? '$' : ''}
        variant="outlined"
        sx={{ width: '65%' }}
        inputProps={{
          style: { fontSize: size.f3 }
        }}
      />
    );
  };

  const renderPublicInputField = (entry) => {
    const displayValue = isEditing(2, entry.id) ? value : (
      entry.type === 'percent' ? convertToPercent(entry.value) :
      entry.type === 'dollar' ? convertToDollar(entry.value) :
      entry.type === 'int' ? convertToGeneral(entry.value, 0) :
      convertToGeneral(entry.value)
    );

    return (
      <TextField
        value={displayValue}
        onFocus={handleFocus(2, entry.id)}
        onChange={handleInputChange(2, entry.id)}
        onBlur={handleBlur(2, entry.id)}
        size="small"
        label={entry.type === 'percent' ? '%' : entry.type === 'dollar' ? '$' : ''}
        variant="outlined"
        sx={{ width: '60%' }}
        inputProps={{
          style: { fontSize: size.f3 }
        }}
      />
    );
  };

  return (
    <div className="control-page" style = {{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover', /* Adjust background size as needed */
      backgroundRepeat: 'no-repeat', /* Prevent image repetition */
    }}>
      <div className="project-name-container">
        <h1>
          <TextField
            value={isEditing(0, 0) ? value : projectName}
            onFocus={handleFocus(0, 0)}
            onChange={handleInputChange(0, 0)}
            onBlur={handleBlur(0, 0)}
            className="project-name-input"
            variant="standard"
            fullWidth
            inputProps={{ style: { textAlign: 'center', fontSize: size.f1 } }}
            InputProps={{
              disableUnderline: true
            }}
          />
        </h1>
      </div>
      <div className="content-boxes">
        <div className="box">
          <h2 style={{fontSize: size.f2}}>
            Ownership: <i>{isPrivate ? "Private" : "Public"}</i>
            <button 
              style={{ float: 'right', marginRight: size.i1, background: 'none', border: 'none', cursor: 'pointer' }} 
              onClick={flipOwnership}
            >
              <CompareArrowsIcon style={{ width: '32px', height: '32px' }} />
            </button>
          </h2>
          <div className="entries">
            {entries.map(entry => (
              <div key={entry.id} className="entry" style={{fontSize: size.f3}}>
                <label>{entry.name}</label>
                {renderInputField(entry)}
              </div>
            ))}
          </div>
        </div>
        <div className={`box ${isPrivate ? 'disabled' : ''}`}>
          <h2 style={{fontSize: size.f2}}>If Public</h2>
          {publicEntries.map(entry => (
              <div key={entry.id} className="entry" style={{fontSize: size.f3}}>
                <label>{entry.name}</label>
                {renderPublicInputField(entry)}
              </div>
            ))}
        </div>
      </div>
      <div style={{height: '30px'}}>

      </div>
    </div>
  );
};

export default ControlPage;
