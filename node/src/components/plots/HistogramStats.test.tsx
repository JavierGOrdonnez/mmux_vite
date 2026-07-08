import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HistogramStats from "./HistogramStats";

const baseProps: DataUQHistogramType = {
  binsStart: 0,
  binsEnd: 10,
  binMeans: [0.1, 0.2],
  binStds: [0.01, 0.02],
  q1: 3,
  median: 5,
  q3: 7,
  whiskerMin: 0,
  whiskerMax: 10,
  outliers: [],
  mean: 5,
  std: 2,
  min: 0,
  max: 10,
  surrogateUncertaintyStd: 1.5,
  inputSamplingStd: 1.2,
};

describe("HistogramStats", () => {
  it("renders the total, surrogate, and parameter uncertainty metrics", () => {
    render(<HistogramStats {...baseProps} />);

    expect(screen.getByText(/Mean:/)).toBeDefined();
    expect(screen.getByText(/Std \(total\):/)).toBeDefined();
    expect(screen.getByText(/Surrogate model uncertainty:/)).toBeDefined();
    expect(screen.getByText(/Parameter uncertainty:/)).toBeDefined();
    expect(screen.getByText(/1\.500/)).toBeDefined();
    expect(screen.getByText(/1\.200/)).toBeDefined();
  });
});
