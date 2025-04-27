// import React, { useState } from "react";
// import Plot from "react-plotly.js";
// import Papa from "papaparse";

// const Generateplot = () => {
//   const [time, setTime] = useState([]);
//   const [amplitude, setAmplitude] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [file, setFile] = useState(null);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//     setTime([]);
//     setAmplitude([]);
//   };

//   const handleGeneratePlot = () => {
//     if (!file) return;
//     setLoading(true);

//     Papa.parse(file, {
//       header: true,
//       skipEmptyLines: true,
//       complete: (results) => {
//         const times = results.data.map((row) => row.Time);
//         const amplitudes = results.data.map((row) => parseFloat(row.Amplitude));
//         setTime(times);
//         setAmplitude(amplitudes);
//         setLoading(false);
//       },
//     });
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-6">
//       <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl">
//         <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
//           Upload Seismic CSV & Generate Waveform
//         </h2>

//         <div className="flex flex-col items-center gap-4">
//           <input
//             type="file"
//             accept=".csv"
//             onChange={handleFileChange}
//             className="border-2 border-dashed border-purple-400 p-4 rounded-lg w-full text-center text-gray-600 cursor-pointer hover:border-purple-600"
//           />

//           <button
//             onClick={handleGeneratePlot}
//             disabled={!file}
//             className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg transition mt-2 disabled:opacity-50"
//           >
//             Generate Plot
//           </button>
//         </div>

//         {loading && (
//           <div className="flex flex-col items-center justify-center mt-8">
//             <svg
//               className="animate-spin h-8 w-8 text-purple-600 mb-2"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               ></circle>
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8v8H4z"
//               ></path>
//             </svg>
//             <p className="text-gray-600">Generating plot...</p>
//           </div>
//         )}

//         {!loading && time.length > 0 && amplitude.length > 0 && (
//           <div className="mt-10">
//             <Plot
//               data={[
//                 {
//                   x: time,
//                   y: amplitude,
//                   type: "scatter",
//                   mode: "lines",
//                   name: "Seismogram",
//                   line: { color: "#7e5bef", width: 2 },
//                 },
//               ]}
//               layout={{
//                 title: {
//                   text: "Seismogram (Amplitude vs Time)",
//                   font: { size: 22 },
//                 },
//                 xaxis: { title: "Time (UTC)", type: "date" },
//                 yaxis: { title: "Amplitude" },
//                 margin: { l: 60, r: 30, t: 70, b: 80 },
//                 plot_bgcolor: "#fafafa",
//                 paper_bgcolor: "#fafafa",
//               }}
//               style={{ width: "100%", height: "500px" }}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Generateplot;
import React, { useState } from "react";
import Plot from "react-plotly.js";
import Papa from "papaparse";

const GeneratePlot = () => {
  const [time, setTime] = useState([]);
  const [amplitude, setAmplitude] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setTime([]);
      setAmplitude([]);
    }
  };

  const handleGeneratePlot = async () => {
    if (!file) return;
    setLoading(true);

    const extension = file.name.split(".").pop().toLowerCase();

    if (extension === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (!results.data[0]?.Time || !results.data[0]?.Amplitude) {
            alert("CSV must have 'Time' and 'Amplitude' columns!");
            setLoading(false);
            return;
          }
          const times = results.data.map((row) => row.Time);
          const amplitudes = results.data.map((row) =>
            parseFloat(row.Amplitude)
          );
          setTime(times);
          setAmplitude(amplitudes);
          setLoading(false);
        },
      });
    } else if (extension === "mseed") {
      const reader = new FileReader();
      reader.onload = function (event) {
        try {
          const arrayBuffer = event.target.result;
          const dataView = new DataView(arrayBuffer);

          const samples = [];
          let offset = 0;
          const BLOCK_SIZE = 512;
          const HEADER_SIZE = 48;
          const SAMPLE_START = HEADER_SIZE;
          const sampleRate = 100;
          const startTime = new Date();

          while (offset < dataView.byteLength) {
            for (let i = SAMPLE_START; i < BLOCK_SIZE; i += 2) {
              if (offset + i + 2 <= dataView.byteLength) {
                const sample = dataView.getInt16(offset + i, false);
                samples.push(sample);
              }
            }
            offset += BLOCK_SIZE;
          }

          const times = samples.map(
            (_, idx) =>
              new Date(startTime.getTime() + (idx * 1000) / sampleRate)
          );

          setTime(times);
          setAmplitude(samples);
        } catch (error) {
          console.error("Error parsing MiniSEED file:", error);
        }
        setLoading(false);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert(
        "Unsupported file format! Please upload a CSV or MiniSEED (.mseed) file."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 w-full">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-4xl transition-all">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Upload Seismic File & Generate Waveform
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <label className="w-full sm:w-auto flex-1">
            <div className="border-2 border-dashed border-indigo-400 p-4 rounded-xl text-center text-gray-600 cursor-pointer hover:border-indigo-600 transition-all">
              {file ? (
                <p className="text-sm font-medium text-indigo-700">
                  Selected: {file.name}
                </p>
              ) : (
                <p className="text-sm">Click to select CSV or MiniSEED file</p>
              )}
              <input
                type="file"
                accept=".csv,.mseed"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </label>

          <button
            onClick={handleGeneratePlot}
            disabled={!file}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Plot
          </button>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center mt-10 animate-pulse">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
            <p className="text-gray-600 mt-4 font-medium">
              Processing... Please wait
            </p>
          </div>
        )}

        {!loading && time.length > 0 && amplitude.length > 0 && (
          <div className="mt-12 transition-all">
            <Plot
              data={[
                {
                  x: time,
                  y: amplitude,
                  type: "scatter",
                  mode: "lines",
                  name: "Seismogram",
                  line: { color: "#6366f1", width: 2.5 },
                },
              ]}
              layout={{
                title: {
                  text: "Seismogram (Amplitude vs Time)",
                  font: { size: 24, color: "#4f46e5" },
                },
                xaxis: { title: "Time (UTC)", type: "date" },
                yaxis: { title: "Amplitude" },
                margin: { l: 60, r: 40, t: 80, b: 80 },
                plot_bgcolor: "#fafafa",
                paper_bgcolor: "#fafafa",
              }}
              config={{
                responsive: true,
                displayModeBar: true, // ✅ Toolbar enabled!
                displaylogo: false, // ❌ Remove "Produced with Plotly" logo
                modeBarButtonsToRemove: ["select2d", "lasso2d"], // ✅ Clean toolbar (optional)
              }}
              style={{ width: "100%", height: "500px" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratePlot;
