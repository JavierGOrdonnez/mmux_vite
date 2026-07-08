import { Box, Button, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Plot from "react-plotly.js";
import { toast } from "react-toastify";
import { useFunctionContext } from "../../context/FunctionContext";
import { useJobContext } from "../../context/JobContext";
import { useMMUXContext } from "../../context/MMUXContext";
import { downloadUqPropagationCsv, ManualUqPropagationRequestBody } from "../../utils/functionUtils";
import { fetchWithRetry } from "../../utils/fetchRetry";
import { triggerBlobDownload } from "../../utils/downloadBlob";
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
  const [downloading, setDownloading] = useState(false);
  // Captures the exact request body of the last *successful* histogram fetch, so
  // "Download CSV" always returns samples matching what's currently plotted, even if
  // the user tweaks distributions/numSamples afterward without re-running.
  const lastRequestBodyRef = useRef<ManualUqPropagationRequestBody | null>(null);

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
        const requestBody: ManualUqPropagationRequestBody = {
          inputVars,
          output: selectedQoI,
          distributions: distribution[selectedFunction?.uid || ""],
          FunctionJobs: filteredJobList,
          numSamples: numSamples[selectedFunction?.uid || ""] || 10000,
          log: false,
          nHistograms: 50,
          seed: 0,
        };
        const response = await fetchWithRetry(`/flask/dakota/manual_uq_propagation_with_uncertainty`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
        if (!response.ok) {
          throw new Error(`Error in UQ response: ${response.status}, ${response.statusText}`);
        }
        const data: DataUQHistogramType = await response.json();
        const newPlotData: Plotly.Data[] = [
          {
            x: Array.from(
              { length: data.binMeans.length },
              (_, i) => data.binsStart + ((data.binsEnd - data.binsStart) / data.binMeans.length) * (i + 0.5),
            ),
            y: data.binMeans,
            type: "bar",
            marker: { color: `${theme.palette.primary.main}` },
            name: "UQ Histogram",
            error_y: {
              type: "data",
              array: data.binStds,
              visible: true,
            },
          },
        ];
        setPlotData(newPlotData);
        setDataUQHistogram(data); // now this is a dict w "mean_histogram" and "std_histogram" keys
        lastRequestBodyRef.current = requestBody;
        setPropagating(false);
      } catch (error) {
        console.warn("Error:", error);
        setPropagating(false);
        setDataUQHistogram(undefined);
        lastRequestBodyRef.current = null;
      }
    })();
  }, [filteredJobList, selectedQoI, numSamples, inputVars, distribution, selectedFunction, theme.palette.primary.main]);

  const handleDownloadCsv = async () => {
    if (!lastRequestBodyRef.current) return;
    try {
      setDownloading(true);
      const { blob, filename } = await downloadUqPropagationCsv(lastRequestBodyRef.current);
      triggerBlobDownload(blob, filename);
      toast.success(`Downloaded ${filename}.`);
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message || "Failed to download UQ propagation CSV.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <JobsLoading jobProgress={jobProgress} message="Creating AI model..." />;
  }

  const layout = {
    title: { text: "Uncertainty Quantification Histogram" },
    xaxis: { title: { text: selectedQoI || "Output" } },
    yaxis: { title: { text: "Density" } },
    plot_bgcolor: `${theme.palette.background.default}`,
    paper_bgcolor: `${theme.palette.background.default}`,
    font: { color: `${theme.palette.text.primary}` },
  };
  const plotStyle = {
    width: "100%",
    height: 400,
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
      {dataUQHistogram !== undefined && (
        <Button
          variant="outlined"
          size="small"
          disabled={propagating || downloading || lastRequestBodyRef.current === null}
          onClick={handleDownloadCsv}
          sx={{ alignSelf: "flex-start" }}
        >
          {downloading ? "Downloading..." : "Download CSV"}
        </Button>
      )}
    </Box>
  );
}
