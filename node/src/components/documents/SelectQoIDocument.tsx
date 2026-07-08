import { Card, CardContent, Typography } from "@mui/material";
import Header from "../navigation/Header";
import { getManualLink } from "../navigation/TutorialManualLinks";

const SelectQoIDocument = (
  <Card sx={{ padding: "8px", borderRadius: "16px", maxWidth: "800px" }}>
    <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "left" }}>
      <Header headerType="subTitle" tabTitle="Select Quantity of Interest" infoText="" />
      <Typography variant="body1" fontFamily="inherit" flex={1} mb={1}>
        Once selected, your input parameter probability distributions are propagated through a Gaussian Process surrogate model
        (SuMo).
      </Typography>
      <Typography variant="body1" fontFamily="inherit" flex={1} mb={1}>
        This surrogate model is fitted to the response surface of your chosen quantity of interest.
      </Typography>
      <Typography variant="body1" fontFamily="inherit" flex={1} mb={1}>
        {`The propagated uncertainty combines two distinct sources: `}
        <strong>parameter uncertainty</strong>
        {` (from the spread of your input distributions themselves) and `}
        <strong>surrogate model uncertainty</strong>
        {` (from the Gaussian Process's own predictive variance, which can be large far from your
        training data). These are reported separately, and the two shaded bands on the histogram
        show a parameter-uncertainty-only band nested inside the wider total-uncertainty band --
        the gap between them is how much the surrogate model itself is adding.`}
      </Typography>
      <Typography variant="body1" fontFamily="inherit" flex={1} mb={1}>
        {`The error bars on the histogram bars are a separate, third quantity: statistical noise
        from estimating the histogram itself with a finite number of samples. Unlike the two
        uncertainty sources above, this noise legitimately shrinks as you increase the number of
        samples -- it is not a measure of the underlying uncertainty.`}
      </Typography>
      <Typography variant="body1" fontFamily="inherit" sx={{ marginTop: "16px" }}>
        For additional information on how add variable distributions, please refer to the {getManualLink()}.
      </Typography>
    </CardContent>
  </Card>
);

export default SelectQoIDocument;
