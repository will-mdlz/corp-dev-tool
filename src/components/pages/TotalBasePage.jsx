import React from 'react';

const TotalBasePage = () => {
  // Sample data structure - you can replace with your actual data
  const metrics = ['Metric 1', 'Metric 2', 'Metric 3', 'Metric 4'];
  const years = ['2020', '2021', '2022', '2023'];
  
  // Sample data matrix (replace with actual data)
  const data = [
    [100, 110, 120, 130],
    [200, 210, 220, 230],
    [300, 310, 320, 330],
    [400, 410, 420, 430],
  ];

  return (
    <div className="total-base">
      <h2>Total Base</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th></th> {/* Empty corner cell */}
              {years.map((year) => (
                <th key={year}>{year}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric, rowIndex) => (
              <tr key={metric}>
                <td>{metric}</td>
                {data[rowIndex].map((value, colIndex) => (
                  <td key={`${rowIndex}-${colIndex}`}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TotalBasePage; 