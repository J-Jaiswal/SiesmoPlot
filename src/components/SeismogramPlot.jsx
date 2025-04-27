import React from "react";
import Plot from "react-plotly.js";

const SeismogramPlot = ({ params }) => {
  if (!params) return null;

  const sampleRate = 50;
  const numPoints = sampleRate * Number(params.plotTime);
  const t = Array.from({ length: numPoints }, (_, i) => i / sampleRate);

  // Example waveform: sine decay scaled by magnitude
  const amp = t.map(
    (ti) =>
      Math.sin(2 * Math.PI * ti) *
      params.magnitude *
      Math.exp(-ti / params.plotTime)
  );

  return (
    <div className="bg-white shadow-2xl rounded-3xl p-6 mt-6">
      <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
        📈 Simulated Seismic Waveform
      </h2>

      <Plot
        data={[
          {
            x: t,
            y: amp,
            type: "scatter",
            mode: "lines",
            name: "Waveform",
            line: {
              color: "#7e5bef",
              width: 2.5,
              shape: "spline", // Makes the lines smoother
              smoothing: 1.3,
            },
          },
        ]}
        layout={{
          title: {
            text: "Amplitude vs Time",
            font: { size: 24, color: "#4f46e5" },
            xref: "paper",
            x: 0.5,
          },
          xaxis: {
            title: {
              text: "Time (seconds)",
              font: { size: 18, color: "#333" },
            },
            showgrid: true,
            zeroline: false,
            gridcolor: "#eee",
          },
          yaxis: {
            title: {
              text: "Amplitude",
              font: { size: 18, color: "#333" },
            },
            showgrid: true,
            zeroline: false,
            gridcolor: "#eee",
          },
          margin: { l: 60, r: 40, t: 80, b: 70 },
          plot_bgcolor: "#fafafa",
          paper_bgcolor: "#fafafa",
        }}
        config={{
          responsive: true,
          displayModeBar: false,
        }}
        style={{ width: "100%", height: "500px" }}
      />
    </div>
  );
};

export default SeismogramPlot;
