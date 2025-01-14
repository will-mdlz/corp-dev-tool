import React, {useState, useEffect} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Divider
} from '@mui/material';
import { convertToPercent, convertToDollar, convertToPP } from '../compfunctions/TableFunctions';
import db from '../../services/tempdb';
import backgroundImage from '../../images/image4.jpg'

const small = { // < 1500
  i1: 20, i2: 45, i3: 65, //1280
  f1: 11, f2: 10, f3: 8
}

const m1 = { //< 2000
  i1: 20, i2: 45, i3: 65, //1280
  f1: 13, f2: 12, f3: 9
}

const medium = { 
  i1: 20, i2: 45, i3: 65, //2307
  f1: 14, f2: 13, f3: 10
}

const m2 = {
  i1: 20, i2: 45, i3: 65, //1280
  f1: 20, f2: 14, f3: 11
}

const large = { // > 3000
  i1: 25, i2: 65, i3: 100,
  f1: 16, f2: 15, f3: 11
}

const AVP = () => {

    const prices = [1,2,3,4,5]

    //console.log(size)

    const fadedColor = 'gainsboro';
    const borderColor = '#4F2170'

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

    // const retrieveData = (ref, year, metric) => {
    //     // const data = db[ref];
    //     // const metricData = data.filter(item => item.metric === metric)
    //     // for(let i = 0; i < metricData.length; i++) {
    //     //     if(metricData[i].year - year === 0) {
    //     //         return metricData[i].value;
    //     //     }
    //     // }
    //     return Math.random();
    // }

    const createDivider = (num) => {
        return (
          <TableRow>
            <TableCell colSpan={num} style={{ padding: 5 }}>
              {/* <Divider sx={{ borderBottomWidth: 2, backgroundColor: 'black', borderStyle: 'dashed' }} /> */}
              <Divider 
                sx={{ 
                    borderBottomWidth: 1, 
                    borderStyle: 'dashed', // Set the border style to dashed
                    borderColor: 'black',  // Set the border color
                    backgroundColor: 'transparent', // Ensure no solid background
                }} 
                />
            </TableCell>
          </TableRow>
        );
      }

    const transMult = (isPublic) => {
      return (
        <>
        <TableRow style={{backgroundColor: fadedColor}}>
          <TableCell rowSpan={isPublic ? 8 : 4} width={100} align='center' style={{fontSize: size.f1, color: 'white', backgroundColor: borderColor}}>Transaction Multiples</TableCell>
          <TableCell align='left' style={{fontSize: size.f1, paddingLeft: size.i1, fontWeight: 'bold'}}>Enterprise Value</TableCell>
          <TableCell align='center' style={{fontSize: size.f1,}}>Metric</TableCell>
          {prices.map((price) => (
          <TableCell key={price} align="center" style={{fontSize: size.f1}}>{convertToDollar(price)}</TableCell>
          ))}
      </TableRow>
      <TableRow>
          <TableCell align='left' style={{paddingLeft: size.i2, fontSize: size.f1,}}>2022E EBITDA</TableCell>
          <TableCell align='center'>{convertToDollar(0)}</TableCell>
          {[0,0,0,0,0].map((val, index) => (
              <TableCell key={index} align='center' style={{fontSize: size.f2}}>{convertToPP(val)}</TableCell>
          ))}
      </TableRow>
      <TableRow  style={{backgroundColor: fadedColor}}>
          <TableCell align='left' style={{paddingLeft: size.i2, fontSize: size.f1,}}>2023E EBITDA</TableCell>
          <TableCell align='center' style={{fontSize: size.f2}}>{convertToDollar(0)}</TableCell>
          {[0,0,0,0,0].map((val, index) => (
              <TableCell key={index} align='center' style={{fontSize: size.f2}}>{convertToPP(val)}</TableCell>
          ))}
      </TableRow>
      <TableRow>
          <TableCell align='left' style={{paddingLeft: size.i2, fontSize: size.f1}}>2024E EBITDA + Run Rate Cost Synergies</TableCell>
          <TableCell align='center'>{convertToDollar(0)}</TableCell>
          {[0,0,0,0,0].map((val, index) => (
              <TableCell key={index} align='center' style={{fontSize: size.f2}}>{convertToPP(val)}</TableCell>
          ))}
      </TableRow>
      {isPublic ? (
        <>
        <TableRow>
          <TableCell align='left' style={{fontSize: size.f1, paddingLeft: size.i1, fontWeight: 'bold'}}>Equity Value</TableCell>
          <TableCell></TableCell>
          {[0,0,0,0,0].map((val, index) => (
              <TableCell key={index} align='center' style={{fontSize: size.f2}}>{convertToPP(val)}</TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell align='left' style={{fontSize: size.f1, paddingLeft: size.i1, fontWeight: 'bold'}}>Implied Price per share (MYR)</TableCell>
          <TableCell></TableCell>
          {[0,0,0,0,0].map((val, index) => (
              <TableCell key={index} align='center' style={{fontSize: size.f2}}>{convertToPP(val)}</TableCell>
          ))}
        </TableRow>
        <TableRow>
        <TableCell align='left' style={{paddingLeft: size.i2, fontSize: size.f1}}>Offer premium over current price (MYR)</TableCell>
        <TableCell align='center' style={{fontSize: size.f2}}>MYR X</TableCell>
        {[0,0,0,0,0].map((val, index) => (
              <TableCell key={index} align='center' style={{fontSize: size.f2}}>{convertToPP(val)}</TableCell>
          ))}
        </TableRow>
        <TableRow>
        <TableCell align='left' style={{paddingLeft: size.i2, fontSize: size.f1}}>Offer premium over 3 month vWAP (MYR)</TableCell>
        <TableCell align='center' style={{fontSize: size.f2}}>MYR Y</TableCell>
        {[0,0,0,0,0].map((val, index) => (
              <TableCell key={index} align='center' style={{fontSize: size.f2}}>{convertToPP(val)}</TableCell>
          ))}
        </TableRow>
        </>
      ) : (
        <></>
      )}
      </>
      )
    }

  return (
    <div className="data-table" style={{ 
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '95vh',
        margin: '0 auto', 
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover', /* Adjust background size as needed */
        backgroundRepeat: 'no-repeat' 
        }}
    >
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '1rem',
        marginBottom: '2rem',
        textAlign: 'center',
        borderRadius: '4px',
        opacity: '.85',
      }}>
        <h2 style={{ margin: 0 }}>{"Analysis at Various Prices"}</h2>
      </div>
      <Box
        sx={{ 
          width: '100%',
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          margin: 0,
          marginTop: '2rem'
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
                fontSize: '0.875rem',     // Smaller font size (14px)
              }
            }} 
            aria-label="data table"
            size="small"                  // Makes the table more compact
          >
            <TableHead>
                <TableRow sx={{padding: 0}}>
                <TableCell 
                    key={0}
                    align= 'left'
                    style={{
                        fontSize: size.f3,
                        fontStyle: 'italic',
                        paddingLeft: size.i1,
                        paddingBottom: 2,
                        paddingTop: 2,
                        width: '14%'
                    }}
                    >(USD million, except per share data)
                </TableCell>
                <TableCell key={1} sx={{width: '26%'}}></TableCell>
                <TableCell key={2} sx={{width: '10%'}}></TableCell>
                <TableCell key={3} sx={{width: '10%'}}></TableCell>
                <TableCell key={4} sx={{width: '10%'}}></TableCell>
                <TableCell key={5} sx={{width: '10%'}}></TableCell>
                <TableCell key={6} sx={{width: '10%'}}></TableCell>
                <TableCell key={7} sx={{width: '10%'}}></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>

                {transMult(db.control["Ownership"]==='Public')}

                {createDivider(8)}

                <TableRow  style={{backgroundColor: fadedColor}}>
                    <TableCell rowSpan={3} width={100} align='center' style={{color: 'white', backgroundColor: borderColor, fontSize: size.f1}}>IRR Analysis</TableCell>
                    <TableCell align='left' style={{paddingLeft: size.i1, fontSize: size.f1}}>2022E EBITDA</TableCell>
                    <TableCell></TableCell>
                    {[0,0,0,0,0].map((val, index) => (
                        <TableCell key={index} align='center' style={{fontSize: size.f2}}>{convertToPercent(val)}</TableCell>
                    ))}
                </TableRow>
                <TableRow>
                    <TableCell align='left' style={{paddingLeft: size.i1, fontSize: size.f1}}>2023E EBITDA</TableCell>
                    <TableCell></TableCell>
                    {[0,0,0,0,0].map((val, index) => (
                        <TableCell key={index} align='center' style={{fontSize: size.f2}}>{convertToPercent(val)}</TableCell>
                    ))}
                </TableRow>
                <TableRow  style={{backgroundColor: fadedColor}}>
                    <TableCell align='left' style={{paddingLeft: size.i1, fontSize: size.f2}}>2024E EBITDA + Run Rate Cost Synergies</TableCell>
                    <TableCell></TableCell>
                    {[0,0,0,0,0].map((val, index) => ( 
                        <TableCell key={index} align='center' style={{fontSize: size.f2}}>{convertToPercent(val)}</TableCell>
                    ))}
                </TableRow>

                {createDivider(8)}

                <TableRow>
                    <TableCell rowSpan={3} width={100} align='center' style={{color: 'white', backgroundColor: borderColor, fontSize: size.f1}}>GAAP Accretion</TableCell>
                    <TableCell align='left' style={{paddingLeft: size.i1, fontSize: size.f1}}>Year 1</TableCell>
                    <TableCell></TableCell>
                    {[0,0,0,0,0].map((val, index) => (
                        <TableCell key={index} align='center' style={{fontSize: size.f2}}>{convertToDollar(val)}</TableCell>
                    ))}
                </TableRow>
                <TableRow  style={{backgroundColor: fadedColor}}>
                    <TableCell align='left' style={{paddingLeft: size.i1, fontSize: size.f1}}>Year 2</TableCell>
                    <TableCell></TableCell>
                    {[0,0,0,0,0].map((val, index) => (
                        <TableCell key={index} align='center' style={{fontSize: size.f2}}>{convertToDollar(val)}</TableCell>
                    ))}
                </TableRow>
                <TableRow>
                    <TableCell align='left' style={{paddingLeft: size.i1, fontSize: size.f1}}>Year 3</TableCell>
                    <TableCell></TableCell>
                    {[0,0,0,0,0].map((val, index) => (
                        <TableCell key={index} align='center' style={{fontSize: size.f2}}>{convertToDollar(val)}</TableCell>
                    ))}
                </TableRow>

                {createDivider(8)}

                <TableRow  style={{backgroundColor: fadedColor}}>
                    <TableCell align='center' style={{color: 'white', backgroundColor: borderColor, fontSize: size.f1}}>Leverage Impact</TableCell>
                    <TableCell style={{paddingLeft: size.i1, fontSize: size.f1}}>2023E</TableCell>
                    <TableCell></TableCell>
                    {[0,0,0,0,0].map((val, index) => (
                        <TableCell key={index} align='center' style={{fontSize: size.f2}}>{convertToPP(val)}</TableCell>
                    ))}
                </TableRow>

                {createDivider(8)}

                <TableRow>
                    <TableCell rowSpan={2} width={100} align='center' style={{color: 'white', backgroundColor: borderColor, fontSize: size.f1}}>NR Accretion (Yr 1 - Yr 4)</TableCell>
                    <TableCell align='left' style={{paddingLeft: size.i1,  fontSize: size.f1}}>MDLZ</TableCell>
                    <TableCell></TableCell>
                    {[0,0,0,0,0].map((val, index) => (
                        <TableCell key={index} align='center' style={{fontSize: size.f2}}>{convertToDollar(val)}</TableCell>
                    ))}
                </TableRow>
                <TableRow  style={{backgroundColor: fadedColor}}>
                    <TableCell align='left' style={{paddingLeft: size.i1, fontSize: size.f1}}>[Region]</TableCell>
                    <TableCell></TableCell>
                    {[0,0,0,0,0].map((val, index) => (
                        <TableCell key={index} align='center' style={{fontSize: size.f2}}>{convertToDollar(val)}</TableCell>
                    ))}
                </TableRow>

            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <div style={{flexGrow: 1, height: 30}}>

      </div>
    </div>
  );
};

export default AVP; 