import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box
} from '@mui/material';
import { convertToPercent, convertToDollar, convertToPP } from '../compfunctions/TableFunctions';
// import db from '../../services/tempdb';
import backgroundImage from '../../images/image4.jpg'

const small = { // < 1500
  i1: 20, i2: 45, i3: 65, //1280
  f1: 11, f2: 10, f3: 11,
  mb: .4
}

const m1 = { //< 2000
  i1: 20, i2: 45, i3: 65, //1280
  f1: 13, f2: 12, f3: 11,
  mb: .6
}

const medium = { 
  i1: 20, i2: 45, i3: 65, //2307
  f1: 14, f2: 13, f3: 11,
  mb: .8
}

const m2 = {
  i1: 20, i2: 45, i3: 65, //1280
  f1: 20, f2: 14, f3: 11,
  mb: 1
}

const large = { // > 3000
  i1: 25, i2: 65, i3: 100,
  f1: 16, f2: 15, f3: 11,
  mb: 1
}

const DataDisplay = ({ title, metrics, years, yearRange, rangeData, ref, dollar_rows, perc_rows, indent_rows, double_indent_rows, pp_rows }) => {

  const fadedColor = 'gainsboro';

  const [size, setSize] = useState(small)

    useEffect(() => {
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

    const retrieveData = (ref, year, metric) => {
        // const data = db[ref];
        // const metricData = data.filter(item => item.metric === metric)
        // for(let i = 0; i < metricData.length; i++) {
        //     if(metricData[i].year - year === 0) {
        //         return metricData[i].value;
        //     }
        // }
        return Math.random();
    }

    const percStyle = {
      fontStyle: 'italic',
      fontSize: size.f2
    };

    const dollarStyle = {
      fontWeight: "bold",
      backgroundColor: fadedColor,
      fontSize: size.f2
    };

    const genStyle = {
      fontSize: size.f2
    };

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
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '1rem',
        marginBottom: size.mb,
        textAlign: 'center',
        borderRadius: '4px',
        opacity: '.85',
      }}>
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
            width: '90%',
            margin: '0',
            justifyContent: "center"
          }}
        >
          <Table 
            sx={{ 
              minWidth: 650,
              '& .MuiTableCell-root': {  // Apply to all table cells
                padding: '8px',          // Reduce padding (default is 16px)
                //fontSize: '0.875rem',     // Smaller font size (14px)
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
                <TableCell
                  align= 'left'
                  style={{
                    fontSize: size.f3,
                    fontStyle: 'italic',
                    paddingLeft: size.i1
                  }}
                >(USD million)</TableCell>
                {years.map((year) => (
                  <TableCell key={year} align="center" style={{fontSize: size.f1}}>{year + "E"}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {metrics.map((metric, rowIndex) => (
                <TableRow 
                  key={title + metric + rowIndex}
                  // sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}
                  sx={dollar_rows.includes(rowIndex) ? {backgroundColor: fadedColor} : {}}
                >
                  <TableCell 
                    component="th" 
                    scope="row"
                    align='left'
                    style={{
                      paddingLeft: (double_indent_rows && double_indent_rows.includes(rowIndex)) ? size.i3 : indent_rows.includes(rowIndex) ? size.i2 : size.i1, // Adjust padding for indentation
                      fontSize: dollar_rows.includes(rowIndex) ? size.f1 : size.f2
                    }}
                    sx={{ borderRight: '2px solid rgba(0, 0, 0, 0.2)', minWidth: 180 }}
                  >
                    {metric}
                  </TableCell>
                  {years.map((year) => (
                    <TableCell key={year} align="right" style={dollar_rows.includes(rowIndex) ? dollarStyle : perc_rows.includes(rowIndex) ? percStyle : genStyle}>
                      {(pp_rows&&pp_rows.includes(rowIndex)) ? convertToPP(retrieveData(ref, year, metric)) : perc_rows.includes(rowIndex) ? convertToPercent(retrieveData(ref, year, metric)) : convertToDollar(retrieveData(ref, year, metric))}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <div style={{flexGrow: 1, height: 30}}>

      </div>
    </div>
  );
};

export default DataDisplay; 