# Surrogate Models & Gaussian Processes

This page is a compact pilot for the repository's docs-as-we-go approach. It ties the math-facing documentation directly to the code that builds and visualizes the surrogate model.

## Why the app uses a surrogate

The backend does not run the expensive simulation directly for every view update. Instead, it builds a surrogate model that approximates the underlying simulation response from sampled training points. In this codebase, the Dakota configuration currently hardcodes a Gaussian Process surrogate via `gaussian_process surfpack` in `flaskapi/src/mmux_flaskapi/dakota/funs_create_dakota_conf.py`.

That choice matters because a Gaussian Process gives two outputs at prediction time:

- a mean prediction for the quantity of interest
- an uncertainty estimate for that prediction

The backend also exports the approximate variance file when the surrogate type is Gaussian Process, so the uncertainty estimate is available to downstream analysis.

## How that appears in the UI

The 1D curve plot in `node/src/components/plots/Curves1DPlot.tsx` consumes three arrays per axis:

- `x`: the sampled input axis values
- `yHat`: the predicted mean response
- `stdHat`: the predicted standard deviation around that response

When the arrays line up, the plot renders the mean trace plus a shaded band at `yHat ± 2 * stdHat`. The legend labels that band as a `95% Confidence Interval`.

The important interpretation detail is that the shaded region is model uncertainty, not the spread of raw observations. A narrow band means the surrogate is confident in that slice of the design space; a wide band means the model wants more evidence there.

## Reading the plots

Use the curve plot as a quick sanity check for three things:

1. Whether the response trend is smooth enough for a surrogate to capture it.
2. Whether the uncertainty grows near sparse regions of the training data.
3. Whether the selected axis shows a strong or weak effect on the quantity of interest.

In practice, the plot is useful because it turns the backend's `yHat`/`stdHat` pair into something a domain user can reason about immediately: expected value versus confidence.

## What to extend next

This pilot page is intentionally small. The next docs-as-we-go pages should explain the more specialized math already present in the app, such as validation metrics, uncertainty propagation, and multi-objective trade-offs.
