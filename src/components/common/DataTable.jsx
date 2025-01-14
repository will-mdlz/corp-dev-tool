import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Divider,
  TextField
} from '@mui/material';
import { convertToPercent, convertToDollar, convertToGeneral } from '../compfunctions/TableFunctions';
import db from '../../services/tempdb';
import backgroundImage from '../../images/image1.jpg'
import '../pages/css/InputPages.css'

const small = { // < 1500
  i1: 15, i2: 40, i3: 65, //1280
  f1: 10, f2: 9
}

const m1 = { //< 2000
  i1: 15, i2: 40, i3: 65, //1280
  f1: 12, f2: 11
}

const medium = { 
  i1: 15, i2: 40, i3: 65, //2307
  f1: 13, f2: 12
}

const m2 = {
  i1: 15, i2: 40, i3: 65, //1280
  f1: 14, f2: 13
}

const large = { // > 3000
  i1: 25, i2: 65, i3: 100,
  f1: 15, f2: 13,
}

const DataTable = ({ title, metrics, years, yearRange, rangeData, ref, dollar_rows, perc_rows, single_indent_rows, double_indent_rows, editable_rows }) => {
  const fadedColor = 'gainsboro';

  const w1 = 13;
  const w2 = 2;
  const w3 = (100-w1-w2) / (years.length + yearRange.length);

  const [data, setData] = useState([]);
  const [currVal, setValue] = useState('')
  const [editing, setEditing] = useState([])
  
  const [size, setSize] = React.useState(small)

  React.useEffect(() => {
    const calculateSize = () => {
      const ws = window.innerWidth;
      const newSize = ws < 1500 ? small : ws < 2000 ? m1 : ws < 2500 ? medium : ws < 3000 ? m2 : large
      setSize(newSize);
    }
    
    calculateSize();

    window.addEventListener("resize", calculateSize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", calculateSize);
  }, [])

  useEffect(() => {
    const cdata = db[ref];
    setData(cdata);
  }, [ref]);

    const retrieveData = (ref, year, metric, index) => {
        // const data = db[ref];
        let metricData = data.filter(item => item.metric === metric)
        if(metricData.length===0) {
          const truemetric = db.metadata[ref].truemetrics[index];
          metricData = data.filter(item => item.metric === truemetric);
        }
        for(let i = 0; i < metricData.length; i++) {
            if(metricData[i].year - year === 0) {
                return metricData[i].value;
            }
        }
        return 0;
    }

    const isEditing = (metric, year, rowIndex) => {
      return editing[0]===metric && editing[1]===year && editing[2]===rowIndex;
  }

  const handleFocus = (metric, year, rowIndex) => (event) => {
      setEditing([metric, year, rowIndex]);
  }

  const handleChange = () => (event) => {
      setValue(event.target.value)
  }

  const handleBlur = (metric, year) => (event) => {
      const val = parseFloat(currVal)
      if(val) {
          const cdata = [...data];
          const metricData = cdata.filter(item => item.metric === metric)
          for(let i = 0; i < metricData.length; i++) {
              if(metricData[i].year - year === 0) {
                  metricData[i].value = val;
              }
          }
          setData(cdata);
      }
      setValue("")
      setEditing([])
  }

  return (
    <div className="data-table" style={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '95vh',
      width: '100%', 
      margin: '0 auto', 
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover', /* Adjust background size as needed */
      backgroundRepeat: 'no-repeat' }}>
      <div className='title-header'>
        <h2 style={{ margin: 0 }}>{title}</h2>
      </div>

      <Box
          sx={{ 
          width: '100%',
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          margin: 0,
          marginTop: '4rem'
          }}
            >
        <TableContainer 
          component={Paper} 
          sx={{ 
            border: '2px solid rgba(0, 0, 0, 0.2)',
            width: '95%',
            margin: '0',
            backgroundColor: 'transparent'
          }}
        >
          <Table 
            sx={{ 
              minWidth: 650,
              '& .MuiTableCell-root': {  // Apply to all table cells
                padding: '8px',          // Reduce padding (default is 16px)
                // fontSize: '0.875rem',     // Smaller font size (14px)
              }
            }} 
            aria-label="data table"
            size="small"                  // Makes the table more compact
          >
            <TableHead>
              <TableRow sx={{ 
                '& th': { 
                  borderBottom: '2px solid rgba(0, 0, 0, 0.2)'
                }
              }}>
                <TableCell style={{backgroundColor: 'white'}} sx={{width: `${w1}%`}}></TableCell>
                {years.map((year) => (
                  <TableCell className='years-container' key={year} align="center" sx={{width: `${w3}%`}} style={{fontSize: size.f1}}>{year}</TableCell>
                ))}
                <TableCell className='separator-header' sx={{width: `${w2}%`}}></TableCell>
                {yearRange.map((range) => (
                  <TableCell className='years-container' align='center' key={range} sx={{width: `${w3}%`}} style={{fontSize: size.f1}}>{range}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {metrics.map((metric, rowIndex) => {
                const dollar = dollar_rows.includes(rowIndex);
                const percent = perc_rows.includes(rowIndex);
                const single = single_indent_rows.includes(rowIndex);
                const double = double_indent_rows.includes(rowIndex);
               return (
                <TableRow 
                  key={metric + rowIndex}
                >
                  <TableCell 
                    component="th" 
                    scope="row"
                    align='left'
                    style={{
                      fontSize: size.f1, 
                      overflowX: 'auto', 
                      fontWeight: dollar ? 'bold' : undefined,
                      paddingLeft: double ? size.i3 : single ? size.i2 : size.i1,
                      backgroundColor: dollar ? fadedColor : 'white'
                    }}
                    sx={{ borderRight: '2px solid rgba(0, 0, 0, 0.2)', minWidth: 100 }}
                  >
                    {metric}
                  </TableCell>
                  {years.map((year) => {
                    let value = retrieveData(ref, year, metric, rowIndex) || 0;
                    value = dollar ? convertToDollar(value) : percent ? convertToPercent(value) : convertToGeneral(value);
                    const editing = isEditing(metric, year, rowIndex);
                    return (
                    <TableCell key={year} align="right" style={{
                      fontSize: size.f2,
                      fontWeight: dollar ? "bold" : undefined,
                      fontStyle: percent ? 'italic' : undefined,
                      backgroundColor: dollar ? fadedColor : 'white',
                    }}
                    onClick={handleFocus(metric, year, rowIndex)}
                    >
                      {editing ? (
                        <TextField
                          value={editing ? currVal : value}
                          autoFocus
                          onChange={handleChange()}
                          onBlur={handleBlur(metric, year)}
                          variant='standard'
                          size='small'
                          fullWidth
                          InputProps={{
                              disableUnderline: true,
                          }}
                          inputProps={{
                              style: { textAlign: 'right', padding: 1, fontSize: editing ? size.f1 : size.f2}
                          }}
                          sx={{
                              padding: 0,
                          }}
                          />
                      ) : (
                        value
                      )}
                    </TableCell>
                  )})}
                  <TableCell 
                      padding="none" 
                      sx={{ 
                      border: 'none',
                      borderBottom: 'none'  // This is needed specifically for MUI TableCell
                    }}>
                    <Divider orientation="vertical" />
                  </TableCell>
                  {rangeData[rowIndex].map((value, colIndex) => (
                    <TableCell align='right' key={`range-${rowIndex}-${colIndex}`} style={{
                      fontSize: size.f2, 
                      backgroundColor: dollar ? fadedColor : 'white',
                    }}>{convertToPercent(value)}</TableCell>
                  ))}
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <div style={{height: '30px'}}>

      </div>
    </div>
  );
};

export default DataTable; 