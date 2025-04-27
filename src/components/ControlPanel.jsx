import React, { useState } from "react";

const defaultParams = {
  strike: 0,
  dip: 30,
  rake: 90,
  depth: 10,
  magnitude: 6,
  distance: 20,
  interpolation: 1,
  modes: 1,
  plotTime: 40,
  scaling: "Size and Time",
  sourceModel: "Cous1983m",
};

const ControlPanel = ({ onGenerate }) => {
  const [params, setParams] = useState(defaultParams);

  const handleChange = (field) => (e) =>
    setParams({ ...params, [field]: e.target.value });

  return (
    <div className="flex flex-col gap-6 p-6 bg-gradient-to-br from-indigo-100 to-purple-100 shadow-2xl rounded-3xl w-full max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-4">
        Seismic Source Parameters
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {[
          ["Strike/Rec (°)", "strike"],
          ["Fault Dip (°)", "dip"],
          ["Fault Rake (°)", "rake"],
          ["Depth (km)", "depth"],
          ["Magnitude", "magnitude"],
          ["Distance (km)", "distance"],
          ["Interpolation", "interpolation"],
          ["Modes", "modes"],
          ["Plot time (s)", "plotTime"],
        ].map(([label, key], idx) => (
          <div key={idx} className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">
              {label}
            </label>
            <input
              type="number"
              value={params[key]}
              onChange={handleChange(key)}
              className="border-2 border-indigo-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        ))}

        <div className="col-span-full flex flex-col sm:col-span-2">
          <label className="text-sm font-semibold text-gray-700 mb-1">
            Scaling
          </label>
          <select
            value={params.scaling}
            onChange={handleChange("scaling")}
            className="border-2 border-indigo-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option>Size and Time</option>
            <option>Time only</option>
            <option>Size only</option>
          </select>
        </div>

        <div className="col-span-full flex flex-col sm:col-span-2">
          <label className="text-sm font-semibold text-gray-700 mb-1">
            Source Model
          </label>
          <select
            value={params.sourceModel}
            onChange={handleChange("sourceModel")}
            className="border-2 border-indigo-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option>Cous1983m</option>
            <option>Brune1970</option>
          </select>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => onGenerate(params)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Generate Waveform
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
