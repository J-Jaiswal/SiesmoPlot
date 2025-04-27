import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Papa from "papaparse";

const WaveformForm = () => {
  const [time, setTime] = useState([]);
  const [amplitude, setAmplitude] = useState([]);

  useEffect(() => {
    // Fetch and parse CSV file
    fetch("/real_data.csv") // 📂 You must place the file inside public/ folder in Vite project
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            const times = results.data.map((row) => row.Time);
            const amplitudes = results.data.map((row) =>
              parseFloat(row.Amplitude)
            );

            setTime(times);
            setAmplitude(amplitudes);
          },
          skipEmptyLines: true,
        });
      });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Real Seismic Data Plot</h2>
      <Plot
        data={[
          {
            x: time,
            y: amplitude,
            type: "scatter",
            mode: "lines",
            name: "Seismogram",
          },
        ]}
        layout={{
          title: "Seismogram (Amplitude vs Time)",
          xaxis: { title: "Time (UTC)", type: "date" },
          yaxis: { title: "Amplitude" },
          margin: { l: 50, r: 20, t: 50, b: 70 },
        }}
        style={{ width: "100%", height: "500px" }}
      />
    </div>
  );
};

export default WaveformForm;
