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
  TextField
} from '@mui/material';
import { convertToPercent, convertToGeneral } from '../compfunctions/TableFunctions';
import db from '../../services/tempdb';
import backgroundImage from '../../images/image5.jpg'

const small = { // < 1500
    i1: 15, i2: 40, i3: 65, //1280
    f1: 10, f2: 9, f3: 13,
    perc: 19
  }
  
  const m1 = { //< 2000
    i1: 15, i2: 40, i3: 65, //1280
    f1: 12, f2: 11, f3: 14,
    perc: 18
  }
  
  const medium = { 
    i1: 15, i2: 40, i3: 65, //2307
    f1: 13, f2: 12, f3: 15,
    perc: 17
  }
  
  const m2 = {
    i1: 15, i2: 40, i3: 65, //1280
    f1: 14, f2: 13, f3: 16,
    perc: 16
  }
  
  const large = { // > 3000
    i1: 25, i2: 65, i3: 100,
    f1: 15, f2: 13, f3: 17,
    perc: 15
  }

const NWC = () => {
    const [nwc, setNwc] = useState([]);
    const [sections, setSections] = useState([]);
    const [currVal, setValue] = useState('')
    const [editing, setEditing] = useState([])

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
        const data = db.nwc;
        
        const dict = {};

        data.forEach((line) => {
            if(!Object.keys(dict).includes(line.section)) {
                dict[line.section] = {};
                dict[line.section][line.subsection] = [line.metric];
            } else if(!Object.keys(dict[line.section]).includes(line.subsection)) {
                dict[line.section][line.subsection] = [line.metric];
            } else if(!dict[line.section][line.subsection].includes(line.metric)) {
                dict[line.section][line.subsection].push(line.metric);
            }
        })

        setNwc(data);
        setSections(dict)
    }, [])

    const retrieveData = (year, section, subsection, metric) => {
        const sectiondata = nwc.filter(item => item.section === section)
        const subsectdata = sectiondata.filter(item => item.subsection === subsection)
        const metricData = subsectdata.filter(item => item.metric === metric)
        for(let i = 0; i < metricData.length; i++) {
            if(metricData[i].year - year === 0) {
                return metricData[i].value;
            }
        }
    }

    const isEditing = (section, subsection, metric, year) => {
        return editing[0]===section && editing[1] === subsection && editing[2] === metric && editing[3] === year;
    }

    const handleFocus = (section, subsection, metric, year) => (event) => {
        setEditing([section, subsection, metric, year]);
        console.log('hi')
    }

    const handleChange = () => (event) => {
        setValue(event.target.value);
    }

    const handleBlur = (section, subsection, metric, year) => (event) => {
        const val = parseFloat(currVal)
        if(val) {
            const cdata = [...nwc];
            const sectiondata = cdata.filter(item => item.section === section)
            const subsectdata = sectiondata.filter(item => item.subsection === subsection)
            const metricData = subsectdata.filter(item => item.metric === metric)
            for(let i = 0; i < metricData.length; i++) {
            if(metricData[i].year - year === 0) {
                metricData[i].value = val;
            }
        }
            setNwc(cdata);
        }
        setValue("")
        setEditing([])
    }

    const generateTable = (section, subsection, indent) => {
        const metrics = sections[section][subsection];
        const years = Array.from({ length: db.metadata['nwc'].totalYears }, (_, i) => (db.metadata['nwc'].startYear + i).toString());
        const indent_rows = indent===0 ? [9,10] : [15,16];
        const percent_rows = indent===0 ? [9,13,15,16] : [2,4,5];
        const underlines = indent===0 ? [2,6] : [8,12];

        return (
            <Box
                key={subsection}
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
                        padding: '6px',          // Reduce padding (default is 16px)
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
                        <TableCell sx={{width: `${size.perc}%`}} style={{fontSize: size.f1}}>{subsection}</TableCell>
                        {years.map((year) => (
                            <TableCell key={year} align='center' sx={{width: `${(100-size.perc)/years.length}%`}} style={{fontSize: size.f1}}>{year}</TableCell>
                        ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {metrics.map((metric, index) => (
                            <TableRow key={metric+index} style={{
                                backgroundColor: index % 2 === 0 ? fadedColor : undefined,
                            }}>
                                <TableCell sx={{borderRight: '2px solid rgba(0, 0, 0, 0.2)'}} style={indent_rows.includes(index) ? {paddingLeft: size.i2, fontSize: size.f1} : {paddingLeft: size.i1, fontSize: size.f1}}>{metric}</TableCell>
                                
                                {years.map((year) => {
                                    let value = retrieveData(year, section, subsection, metric) || 0;
                                    value = percent_rows.includes(index) ? convertToPercent(value) : convertToGeneral(value)
                                    const editing = isEditing(section, subsection, metric, year);
                                    return (
                                        <TableCell key={year} align='right' style={{borderBottom: underlines.includes(index) ? '2px solid black' : undefined, fontSize: size.f2}}
                                        onClick={handleFocus(section, subsection, metric, year)}>
                                            {editing ? (
                                                <TextField
                                                value={currVal}
                                                autoFocus
                                                onChange={handleChange()}
                                                onBlur={handleBlur(section, subsection, metric, year)}
                                                variant='standard'
                                                size='small'
                                                fullWidth
                                                InputProps={{
                                                    disableUnderline: true,
                                                }}
                                                inputProps={{
                                                    style: { textAlign: 'right', padding: 1, fontSize: size.f1 }
                                                }}
                                                sx={{
                                                    padding: 0,
                                                    width: '100%',
                                                    '& .MuiInputBase-root': {
                                                        width: '100%'
                                                    },
                                                }}
                                                />
                                            ) : (
                                                value
                                            )}
                                        </TableCell>
                                    ) 
                                ;})}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </TableContainer>
            </Box>
        );
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
              <h2 style={{ margin: 0 }}>Net Working Capital (USD)</h2>
            </div>

            {Object.keys(sections).map((section, index) => (
                <div key={section}>
                    <div
                        style={{
                        backgroundColor: '#ffffff',
                        marginBottom: '4rem',
                        marginTop: '4rem',
                        textAlign: 'center',
                        borderRadius: '4px',
                        opacity: '.9',
                        width: '65%',
                        marginLeft: '4rem',
                        padding: '1px',
                        fontSize: `${size.f3}px`
                    }}>
                        <h2> {section} </h2>
                    </div>

                    {Object.keys(sections[section]).map((subsection) => (
                        <div key={subsection}> 
                            {generateTable(section, subsection, index)}
                        </div>
                    ))}
                </div>
            ))}
            <div style={{height: 50}}>

            </div>
        </div>
    );
}

export default NWC;