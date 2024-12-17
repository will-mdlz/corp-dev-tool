import React, { useState } from 'react';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import './css/ControlPage.css'

const ControlPage = () => {
  const [projectName, setProjectName] = useState('Project Name');
  const [isPrivate, setIsPrivate] = useState(true);
  const [entries, setEntries] = useState([
    { id: 1, name: 'Entry 1', type: 'percent', value: '' },
    { id: 2, name: 'Entry 2', type: 'dollar', value: '' },
    { id: 3, name: 'Entry 3', type: 'general', value: '' },
    { id: 4, name: 'Entry 4', type: 'date', value: '' },
  ]);

  const handleProjectNameChange = (e) => {
    setProjectName(e.target.value);
  };

  const handleEntryChange = (id, value) => {
    setEntries(entries.map(entry => entry.id === id ? { ...entry, value } : entry));
  };

  const renderInputField = (entry) => {
    switch (entry.type) {
      case 'percent':
        return <input type="number" value={entry.value} onChange={(e) => handleEntryChange(entry.id, e.target.value)} placeholder="%" />;
      case 'dollar':
        return <input type="number" value={entry.value} onChange={(e) => handleEntryChange(entry.id, e.target.value)} placeholder="$" />;
      case 'general':
        return <input type="text" value={entry.value} onChange={(e) => handleEntryChange(entry.id, e.target.value)} />;
      case 'date':
        return <input type="date" value={entry.value} onChange={(e) => handleEntryChange(entry.id, e.target.value)} />;
      default:
        return null;
    }
  };

  return (
    <div className="control-page">
      <div className="project-name-container">
        <h1>
          <input 
            type="text" 
            value={projectName} 
            onChange={handleProjectNameChange}
            className="project-name-input"
          />
        </h1>
      </div>
      <div className="content-boxes">
        <div className="box">
          <h2>
            Ownership: {isPrivate ? "Private" : "Public"}
            <button 
              style={{ float: 'right', marginRight: '50px', background: 'none', border: 'none', cursor: 'pointer' }} 
              onClick={() => setIsPrivate(!isPrivate)}
            >
              <CompareArrowsIcon style={{ width: '32px', height: '32px' }} />
            </button>
          </h2>
          <div className="entries">
            {entries.map(entry => (
              <div key={entry.id} className="entry">
                <label>{entry.name}</label>
                {renderInputField(entry)}
              </div>
            ))}
          </div>
        </div>
        <div className={`box ${isPrivate ? 'disabled' : ''}`}>
          <h2>If Public</h2>
          {/* Content for public section will go here */}
        </div>
      </div>
    </div>
  );
};

export default ControlPage;
