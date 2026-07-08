import { Box, Tooltip, useTheme } from "@mui/material";
import Metric from "./Metric";
import MetricRow from "./MetricRow";

function HistogramStats(props: DataUQHistogramType) {
  const theme = useTheme();
  const { mean, std, min, max, surrogateUncertaintyStd, inputSamplingStd } = props;

  return (
    <Box width="100%" display="flex" flexDirection="column" justifyContent="left">
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          marginLeft: "8px",
          textAlign: "left",
        }}
      >
        <MetricRow width={1080}>
          <Metric metricName="Mean" metricValue={mean} />
          <Metric metricName="Std (total)" metricValue={std} />
          <Metric metricName="Min" metricValue={min} />
          <Metric metricName="Max" metricValue={max} />
        </MetricRow>
        <MetricRow width={1080}>
          <Tooltip title="Epistemic: uncertainty from the surrogate model itself (lack of training data). Reducible with more/better training data, NOT with more UQ samples.">
            <Box>
              <Metric
                metricName="Surrogate model uncertainty"
                metricValue={surrogateUncertaintyStd}
                color={theme.palette.secondary.main}
              />
            </Box>
          </Tooltip>
          <Tooltip title="Aleatoric: uncertainty from the input parameter distributions themselves. Irreducible -- intrinsic to the chosen parameter uncertainty.">
            <Box>
              <Metric metricName="Parameter uncertainty" metricValue={inputSamplingStd} color={theme.palette.primary.main} />
            </Box>
          </Tooltip>
        </MetricRow>
      </Box>
    </Box>
  );
}

export default HistogramStats;
