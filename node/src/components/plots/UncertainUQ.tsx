import { Box, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { useFunctionContext } from "../../context/FunctionContext";
import { useJobContext } from "../../context/JobContext";
import { useMMUXContext } from "../../context/MMUXContext";
import { fetchWithRetry } from "../../utils/fetchRetry";
import { JobsLoading } from "../data/JobsLoading";
import CalculatingWarning from "./CalculatingWarning";
import HistogramStats from "./HistogramStats";
import InsufficientDataWarning from "./InsufficientDataWarning";

export default function UncertainUQ(props: LoadingPropsType) {
  const { loading, jobProgress } = props;
  const theme = useTheme();
  const { selectedFunction, inputVars, distribution } = useFunctionContext();
  const { numSamples, selectedQoI } = useMMUXContext();
  const { fetchedJobCollections, filteredJobList } = useJobContext();
  const [dataUQHistogram, setDataUQHistogram] = useState<DataUQHistogramType>();
  const [plotData, setPlotData] = useState<Plotly.Data[]>([]);
  const [propagating, setPropagating] = useState(false);

  useEffect(() => {
    (async () => {
      console.log("running job collections: ", filteredJobList);
      setDataUQHistogram(undefined);
      setPlotData([]);
      setPropagating(true);
      if (filteredJobList.length === 0) {
        console.warn("No jobs selected for UQ propagation.");
        setPropagating(false);
        return;
      }
      try {
        console.info("Propagating UQ...");
        console.info("SelectedQoI: ", selectedQoI);
        const response = await fetchWithRetry(`/flask/dakota/manual_uq_propagation_with_uncertainty`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            inputVars,
            output: selectedQoI,
            distributions: distribution[selectedFunction?.uid || ""],
            FunctionJobs: filteredJobList,
            numSamples: numSamples[selectedFunction?.uid || ""] || 10000,
            log: false,
            nHistograms: 50,
            seed: 0,
          }),
        });
        if (!response.ok) {
          throw new Error(`Error in UQ response: ${response.status}, ${response.statusText}`);
        }
        const data: DataUQHistogramType = await response.json();
        const binCenters = Array.from(
          { length: data.binMeans.length },
          (_, i) => data.binsStart + ((data.binsEnd - data.binsStart) / data.binMeans.length) * (i + 0.5),
        );
        const newPlotData: Plotly.Data[] = [
          {
            x: binCenters,
            y: data.binMeans,
            type: "bar",
            marker: { color: `${theme.palette.primary.main}` },
            name: "UQ Histogram (total, incl. surrogate model)",
            error_y: {
              type: "data",
              array: data.binStds,
              visible: true,
            },
          },
          // Mini forest-plot row (mean ± 1σ) comparing total vs surrogate-only (epistemic) spread,
          // sharing the histogram's x-axis via xaxis2/yaxis2 below.
          {
            x: [data.mean],
            y: ["Total"],
            xaxis: "x2",
            yaxis: "y2",
            type: "scatter",
            mode: "markers",
            marker: { color: theme.palette.primary.main, size: 10 },
            error_x: {
              type: "data",
              array: [data.std],
              visible: true,
              color: theme.palette.primary.main,
              thickness: 3,
              width: 8,
            },
            name: "Total uncertainty (±1σ, parameter + surrogate model)",
          },
          {
            x: [data.mean],
            y: ["Surrogate model uncertainty (epistemic)"],
            xaxis: "x2",
            yaxis: "y2",
            type: "scatter",
            mode: "markers",
            marker: { color: theme.palette.secondary.main, size: 10 },
            error_x: {
              type: "data",
              array: [data.surrogateUncertaintyStd],
              visible: true,
              color: theme.palette.secondary.main,
              thickness: 3,
              width: 8,
            },
            name: "Surrogate model uncertainty (epistemic, ±1σ)",
          },
        ];
        setPlotData(newPlotData);
        setDataUQHistogram(data); // now this is a dict w "mean_histogram" and "std_histogram" keys
        setPropagating(false);
      } catch (error) {
        console.warn("Error:", error);
        setPropagating(false);
        setDataUQHistogram(undefined);
      }
    })();
  }, [
    filteredJobList,
    selectedQoI,
    numSamples,
    inputVars,
    distribution,
    selectedFunction,
    theme.palette.primary.main,
    theme.palette.secondary.main,
  ]);
  if (loading) {
    return <JobsLoading jobProgress={jobProgress} message="Creating AI model..." />;
  }

  const layout = {
    title: { text: "Uncertainty Quantification Histogram" },
    // Two stacked subplots sharing the x-axis: the histogram (bottom, ~72% height) and a mini
    // forest-plot row (top, ~18% height) comparing total vs surrogate-only (epistemic) mean±1σ.
    xaxis: { title: { text: selectedQoI || "Output" }, domain: [0, 1], anchor: "y" as const },
    yaxis: { title: { text: "Density" }, domain: [0, 0.72], anchor: "x" as const },
    xaxis2: { matches: "x" as const, anchor: "y2" as const, showticklabels: false },
    yaxis2: {
      domain: [0.82, 1],
      anchor: "x2" as const,
      type: "category" as const,
      categoryarray: ["Surrogate model uncertainty (epistemic)", "Total"],
      fixedrange: true,
      showgrid: false,
      automargin: true,
    },
    plot_bgcolor: `${theme.palette.background.default}`,
    paper_bgcolor: `${theme.palette.background.default}`,
    font: { color: `${theme.palette.text.primary}` },
    legend: { orientation: "h" as const, y: -0.25 },
  };
  const plotStyle = {
    width: "100%",
    height: 460,
    borderRadius: "8px",
    overflow: "hidden",
  };

  return (
    <Box display="flex" flexDirection="column" gap={1} width="100%">
      {propagating && <CalculatingWarning height={plotStyle.height} dontShowText={plotData.length !== 0} />}
      {!propagating && plotData.length === 0 && (
        <InsufficientDataWarning
          fetchedJobCollections={fetchedJobCollections}
          filteredJobList={filteredJobList}
          height={plotStyle.height}
          numInputVars={inputVars.length}
        />
      )}
      {!propagating && plotData.length !== 0 && <Plot data={plotData} layout={layout} style={plotStyle} />}
      {dataUQHistogram !== undefined && <HistogramStats {...dataUQHistogram} />}
    </Box>
  );
}
