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
  TextField,
  Divider
} from '@mui/material';
import { convertToGeneral, convertToDollar } from '../compfunctions/TableFunctions';
import db from '../../services/tempdb';
import backgroundImage from '../../images/image1.jpg'
import './css/InputPages.css'

const small = { // < 1500
    i1: 15, i2: 40, i3: 65, //1280
    f1: 11, f2: 10
  }

const m1 = { //< 2000
    i1: 15, i2: 40, i3: 65, //1280
    f1: 13, f2: 12
}

const medium = { 
    i1: 15, i2: 40, i3: 65, //2307
    f1: 14, f2: 13
}

const m2 = {
    i1: 15, i2: 40, i3: 65, //1280
    f1: 15, f2: 14
}

const large = { // > 3000
    i1: 25, i2: 65, i3: 100,
    f1: 16, f2: 15,
}

const XCosts = () => {
    const [data, setData] = useState([]);
    const [years, setYears] = useState([]);
    const [metrics, setMetrics] = useState([]);
    const [dead_metrics, setDead] = useState([]);
    const [currVal, setValue] = useState('')
    const [editing, setEditing] = useState([])

    const dollar_rows = [0,2,8,9,12,13,14,15,16];
    const indent_rows = [2,3,4,5,6,7,8,10,11,12,14];
    const underlines = [7,11];
    const bold_labels = [0,7,812,13,15,16]

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

    useEffect(() => {
        const data = db.xcosts;
        const years = Array.from({ length: db.metadata['xcost'].totalYears }, (_, i) => (db.metadata['xcost'].startYear + i).toString());
        const metrics = db.metadata["xcost"].metrics;
        const dead_metrics = db.metadata["xcost"].dead_metrics;
        setData(data)
        setYears(years);
        setDead(dead_metrics);
        setMetrics(metrics);
    }, []);

    const retrieveData = (year, metric) => {
        const metricData = data.filter(item => item.metric === metric)
        for(let i = 0; i < metricData.length; i++) {
            if(metricData[i].year - year === 0) {
                return metricData[i].value;
            }
        }
    }

    const isEditing = (metric, year) => {
        return editing[0]===metric && editing[1]===year;
    }

    const handleFocus = (metric, year) => (event) => {
        setEditing([metric, year]);
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
            backgroundRepeat: 'no-repeat',
            zIndex: 0
            }}>
            <div className='title-header'>
              <h2 style={{ margin: 0 }}>One Time Costs (USD)</h2>
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
                    justifyContent: "center",
                    backgroundColor: 'transparent'
                }}
                >
                <Table 
                    sx={{ 
                    minWidth: 650,
                    '& .MuiTableCell-root': {  // Apply to all table cells
                        padding: '2px',          // Reduce padding (default is 16px)
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
                        <TableCell className='regular' padding="none" sx={{width: '20%'}}></TableCell>
                        {years.map((year) => (
                            <TableCell className='years-container' key={year} padding="none" align='center' sx={{width: `${70/years.length}%`}} style={{fontSize: size.f1}}>{year + "E"}</TableCell>
                        ))}
                        <TableCell className='separator-header' sx={{width: '3%'}}></TableCell>
                        <TableCell className='years-container' align='center' sx={{width: '7%'}} style={{fontSize: size.f1}}>Cummulative</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {metrics.map((metric, index) => (
                            <TableRow key={index} style={{
                            }}>
                                <TableCell padding="none" sx={{borderRight: '2px solid rgba(0, 0, 0, 0.2)'}} style={{
                                    paddingLeft: indent_rows.includes(index) ? size.i2 : size.i1,
                                    textDecoration: dead_metrics.includes(metric) ? 'underline' : undefined,
                                    fontWeight: bold_labels.includes(index) ? 'bold' : undefined,
                                    backgroundColor: index%2===0 ? fadedColor : 'white',
                                    fontSize: size.f1,
                                }}>{metric}</TableCell>
                                {years.map((year) => {
                                    const dead = dead_metrics.includes(metric)
                                    const value = dead ? "" : dollar_rows.includes(index) ? convertToDollar(retrieveData(year, metric) || 0) : convertToGeneral(retrieveData(year, metric) || 0);
                                    const editing = isEditing(metric, year);
                                    return !dead ? (
                                        <TableCell key={year} align='right' style={{
                                            borderBottom: underlines.includes(index) ? '2px solid black' : undefined,                                  
                                            backgroundColor: index%2===0 ? fadedColor : 'white',
                                        }}
                                        onClick={handleFocus(metric, year)}
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
                                    ) : (
                                        <TableCell key={year} align='right' style={{
                                            borderBottom: underlines.includes(index) ? '2px solid black' : undefined,
                                            backgroundColor: index%2===0 ? fadedColor : 'white',
                                        }}></TableCell>
                                    )
                                ;})}
                                <TableCell 
                                    padding="none" 
                                    sx={{ 
                                    border: 'none',
                                    borderBottom: 'none'  // This is needed specifically for MUI TableCell
                                }}>
                                <Divider orientation="vertical" />
                                </TableCell>
                                <TableCell padding="none" align='right' style={{
                                    borderBottom: underlines.includes(index) ? '2px solid black' : undefined,
                                    backgroundColor: index%2===0 ? fadedColor : 'white',

                                }}>0</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </TableContainer>
            </Box>

        </div>
    );
};

export default XCosts;