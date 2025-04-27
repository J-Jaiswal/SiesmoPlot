import React, { useState } from "react";
import ControlPanel from "./components/ControlPanel";
import SeismogramPlot from "./components/SeismogramPlot";
import WaveformForm from "./components/WaveformForm";
import Generateplot from "./components/GeneratePlot";

function App() {
  const [submittedParams, setSubmittedParams] = useState(null);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">SeismoPlot </h1>
      <ControlPanel onGenerate={setSubmittedParams} />
      {/* <SeismogramPlot params={submittedParams} /> */}
      {/* <WaveformForm /> */}
      <Generateplot />
    </div>
  );
}

export default App;
