import React, {useState, useEffect} from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Box } from "@mui/material";
import backgroundImage from '../../images/image6.jpg'
import './css/InputPages.css'

const data = {
    "Total Standalone Value": 745,
    "Cost Synergies": 171,
    "Revenue Synergies": 114,
    "Working Capital Synergies": 0,
    "Dis-Synergies & Integration Costs": -13,
    "Transaction Fees": 0,
    // "Total Value to MDLZ": 1016,
  }; 

const NPVWaterfall = () => {
    const [processedData, setProcessedData] = useState([]);
    const green = "#4caf50";
    const red = "#f44336";
    const purple = "#4F2170";
    const b1 = '#ffffff';
    // const b2 = '#fff4e7';
    const e = 1e-4;

  useEffect(() => {
    const newData = [];
    let prior = 0;
    let currVal = 0;
    Object.keys(data).forEach((name) => {
        const val = data[name];
        currVal += val;
        const color = name==="Total Standalone Value" ? purple : val < 0 ? red : green
        newData.push({name: name, value: val, NPV: [prior, currVal], color: color})
        prior = currVal;
    })
    newData.push({name: "Total Value to MDLZ", value: currVal, NPV: [0, currVal], color: purple})
    setProcessedData(newData);
    newData.forEach((val) => {
        console.log(val.NPV, val.color)
    })
  }, [])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0]; // Access the first data entry for the bar
      console.log(data)
      const text = data.payload.value < 0 ? "$(" + data.payload.value*-1 + ")" : Math.abs(data.payload.value) < e ? 0 : "$" + data.payload.value;
      return (
        <div
          style={{
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '10px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          <p style={{ textAlign: 'center', margin: 0, color: data.payload.color }}>{text}</p>
        </div>
      );
    }
    return null;
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
        <div className='title-header' style={{marginBottom: '4rem'}}>
          <h2 style={{ margin: 0 }}>NPV Waterfall (USD)</h2>
        </div>
    <Box sx={{
          width: '100%',
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          margin: 0,
          }}>
    <ResponsiveContainer width="85%" height={700} style={{backgroundColor: b1,}}>
      <BarChart
        data={processedData}
        margin={{
          top: 40,
          right: 40,
          left: 40,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        
        <Bar 
        dataKey="NPV" 
        barSize={100} 
        fill= {({ payload }) => payload.color}
        // label={{ position: 'top', fontSize: 20 }}
        label = {({ x, y, width, height, index}) => {
          const data = processedData[index]
          const fitsInsideBar = height > 30;
          const zero = Math.abs(data.value) < e;
          const negative = data.value < 0;
          const newY = zero ? y : fitsInsideBar ? y + 22 : y - 15;
          const text = negative ? "$(" + data.value*-1 + ")" : zero ? 0 : "$" + data.value;
          return (
            <text
              x={x + width/2}
              y={newY}
              textAnchor="middle"
              fontSize={20}
              fill={fitsInsideBar ? "#fff" : "#000"}
            >
              {text}
            </text>
          )
        }}
        > 
        {processedData.map((entry, index) => {
          return (
          <Cell key={index} fill={entry.color} />
        )
        })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
    </Box>
    <div style={{flexGrow: 1, height: 30}}></div>
    </div>
  );
};

export default NPVWaterfall;
