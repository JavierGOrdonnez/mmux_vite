import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { toast } from "react-toastify";
import UncertainUQ from "./UncertainUQ";
import { downloadUqPropagationCsv } from "../../utils/functionUtils";
import { triggerBlobDownload } from "../../utils/downloadBlob";
import { fetchWithRetry } from "../../utils/fetchRetry";

// Stable references (react-vitest-testing.md pitfall): these values feed the
// component's useEffect dependency array, so a fresh literal per mock call would
// change identity every render and spin the effect forever.
const filteredJobList = [{ uid: "job1" }];
const distribution = { func1: { x1: { distribution: "normal", mean: 0, std: 1 } } };
const numSamples = { func1: 100 };
const inputVars = ["x1"];
const selectedFunction = { uid: "func1" };

vi.mock("../../context/FunctionContext", () => ({
  useFunctionContext: () => ({
    selectedFunction,
    inputVars,
    distribution,
  }),
}));

vi.mock("../../context/JobContext", () => ({
  useJobContext: () => ({
    fetchedJobCollections: [],
    filteredJobList,
  }),
}));

vi.mock("../../context/MMUXContext", () => ({
  useMMUXContext: () => ({
    numSamples,
    selectedQoI: "y",
  }),
}));

vi.mock("react-plotly.js", () => ({
  default: () => <div data-testid="plot" />,
}));

vi.mock("../../utils/fetchRetry");
vi.mock("../../utils/functionUtils", () => ({
  downloadUqPropagationCsv: vi.fn(),
}));
vi.mock("../../utils/downloadBlob", () => ({
  triggerBlobDownload: vi.fn(),
}));

const histogramResponse = {
  binsStart: 0,
  binsEnd: 10,
  binMeans: [1, 2, 3],
  binStds: [0.1, 0.2, 0.3],
  q1: 2,
  median: 5,
  q3: 8,
  whiskerMin: 0,
  whiskerMax: 10,
  outliers: [],
  mean: 5,
  std: 1,
  min: 0,
  max: 10,
};

function mockLoadingProps() {
  return { loading: false, jobProgress: 0, colsFetched: { current: 0 }, jobsFetched: { current: 0 } };
}

describe("UncertainUQ", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.mocked(fetchWithRetry).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: () => Promise.resolve(histogramResponse),
    } as never);
  });

  it("disables the Download CSV button until a histogram has loaded, then downloads on click", async () => {
    vi.mocked(downloadUqPropagationCsv).mockResolvedValueOnce({
      blob: new Blob(["csv"]),
      filename: "uq_propagation_y.csv",
    });
    const toastSuccessSpy = vi.spyOn(toast, "success").mockImplementation(() => "" as never);

    render(<UncertainUQ {...mockLoadingProps()} />);

    const downloadButton = await screen.findByRole("button", { name: "Download CSV" });
    await waitFor(() => expect(downloadButton).toBeEnabled());

    fireEvent.click(downloadButton);

    await waitFor(() => expect(downloadUqPropagationCsv).toHaveBeenCalledTimes(1));
    expect(downloadUqPropagationCsv).toHaveBeenCalledWith(
      expect.objectContaining({ inputVars: ["x1"], output: "y", numSamples: 100, nHistograms: 50, seed: 0 }),
    );
    expect(triggerBlobDownload).toHaveBeenCalledWith(expect.any(Blob), "uq_propagation_y.csv");
    expect(toastSuccessSpy).toHaveBeenCalled();
  });

  it("shows an error toast when the download fails", async () => {
    vi.mocked(downloadUqPropagationCsv).mockRejectedValueOnce(new Error("boom"));
    const toastErrorSpy = vi.spyOn(toast, "error").mockImplementation(() => "" as never);

    render(<UncertainUQ {...mockLoadingProps()} />);

    const downloadButton = await screen.findByRole("button", { name: "Download CSV" });
    await waitFor(() => expect(downloadButton).toBeEnabled());
    fireEvent.click(downloadButton);

    await waitFor(() => expect(toastErrorSpy).toHaveBeenCalledWith("boom"));
    expect(triggerBlobDownload).not.toHaveBeenCalled();
  });
});
