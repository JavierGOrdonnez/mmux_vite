# Response Surface Modeling Tutorial - Sural Nerve Pain Relief Neural Implant Design Optimization

!!! info "Model Intelligence: A Paradigm Shift in Simulation Analysis"

    Meta-modeling (or surrogate modeling) represents a transformative approach to understanding complex simulation models. By creating simplified mathematical representations of computationally intensive simulations, meta-modeling enables rapid exploration of parameter spaces that would otherwise require thousands of time-consuming simulations. This "model intelligence" approach empowers users to gain deeper insights into parameter sensitivities, optimize designs efficiently, quantify uncertainties, and make data-driven decisions with unprecedented speed. For bioelectronic applications, where biological variability and design parameters interact in complex ways, meta-modeling transforms raw simulation data into actionable knowledge - revealing relationships between inputs and outcomes that might remain hidden in traditional simulation approaches. The techniques you'll learn in this tutorial represent a major advancement in simulation analysis, allowing you to extract maximum value from your models while dramatically reducing computational overhead.

## Introduction

This tutorial demonstrates the potential of Model Intelligence HyperTools to provide actionable insights for bioelectronic device design, balancing effectivity and safety.

In particular, a neural implant at the sural nerve will aim to disrupt pain signals for sural nerve pain patients, a chronic pain condition, while keeping within safe stimulation limits to prevent damage to the nerve and neighbouring tissues.

## Preparation

1. Sign into your sim4life.io / sim4life.science account.
2. Click on the *+ New* button on the top left of the *Dashboard*.
3. Under the HyperTools section, choose *Response Surface Modeling*

![HyperTools creation](../assets/MetaModeling_figures/CreateRSMHyperTool.png)
*HyperTools are available in the + New menu.*

## Simulation Pipeline

!!! tip "Pipeline Foundation"
    This tutorial builds upon the sural nerve implant simulation pipeline detailed in the [Pipeline Setup Tutorial](pipeline-setup-tutorial.md). The pipeline includes electrode design parameters, tissue conductivities, electromagnetic simulation, safety metrics extraction, and neurophysiological modeling. For complete details on the computational workflow and Function creation process, please refer to the Pipeline Setup Tutorial.

!!! note "Tutorial Data"
    For this tutorial, the pipeline has already been configured as a Function with pre-executed sampling campaigns, allowing you to directly explore Response Surface Modeling capabilities without running computationally intensive simulations.

## HyperTool Setup

### Starting a Response Surface Modeling HyperTool

- In the Dashboard, press the "+ New" button on the top left
- In the **HyperTools** section, click on the "Response Surface Modeling" option.
- Wait for the service to load.

### Choosing a Function

- In the "Function Setup" step, select the "Nerve Implant Effectivity & Safety" function.
  - It should have the defined design parameters (Inter-Electrode Spacing, Angle Width, Length, Width, and Silicone Padding) as inputs, and the defined QoIs as outputs.
  - The info button allows visualization of the underlying pipeline.
- For this tutorial, parameter ranges have already been determined.

![Function selection interface](../assets/MetaModeling_figures/ChooseFunctionAndRanges.png)
*The HyperTool allows choice of the function to be analyzed, and definition of the parameter ranges of interest. For this tutorial, these ranges have already been set.*

- Once all parameter ranges have been chosen (pre-selected in this tutorial), click "Next" to move to results analysis.
- Wait until the AI model is generated. This operation might take a few minutes.

## Analysis of Results

The Response Surface Modeling HyperTool allows users to visualize the influence of parameters on their output of choice both in 1D, 2D and 3D. If there are additional input parameters, they need to be fixed to constant values in order to obtain a projection that can be visualized. These values can be interactively changed with sliders, thus allowing to explore the full high-dimensional space.

### Validate Model Quality

Model Intelligence HyperTools fit a surrogate model to simulated data (samples), also known as "observations". Based on these, which are considered the ground-truth, but take considerable computational resources to compute, a surrogate model (also called meta-model) is created that maps the input-output relationships of the full simulation pipeline. This low-complexity model can be used to gain insights on high-dimensional parameter dependencies at low computational cost, and for further applications such as surrogate-based optimization, model-based control, uncertainty quantification...

Nonetheless, before using a surrogate model, the user is encouraged to inspect its quality-of-fit, and validate whether it is a suitable approximation of the simulation pipeline. In order to do so, a technique known as Cross-Validation is used, by which a surrogate model is fitted with a portion of the data. Then, the data that was hidden during training (validation set) is used to perform predictions and compare to the real simulated values. This procedure is performed multiple times, until all samples have been used once in the validation set. Comparing the predictions on all samples to their real simulated values provides a lower-bound confidence on the accuracy of the final surrogate model, which will be trained with all samples.

In the first visualization of the Response Modeling HyperTool, a violin plot is displayed, which compares the sample values and distributions of the full-simulation observations versus their cross-validation predictions. Similar distributions, as well as low mean error at the per-sample level, indicates a good quality-of-fit.

Furthermore, the mean and standard deviation of both the observations and the predictions' distribution is displayed, together with the per-sample Mean Absolute Error (MAE) and Root Mean Square Error (RMSE). Comparing these error metrics with the data distribution values can provide an idea of the magnitude of the prediction errors compared to the variance present in the data.

![Violin plot validation](../assets/MetaModeling_figures/ViolinPlotValidation.png)
*The violin plot provides a tool to validate whether the distribution of cross-validation predictions matches that of the ground-truth observations. Moreover, we can compare the scale of the MAE (~4e-3) with the scale of variance in the data (standard deviation ~ 4e-2), showing that prediction error is only ~10% the variability in the data distribution, further strengthening the visual impression of the violin plot that the surrogate model is appropriately fitting the underlying observations.*

Once the surrogate model has been deemed appropriately well fitted, it is time to use it to gain insights into the outputs' (QoI) dependencies on the input parameters. For that purpose, visualizations based on one, two, or three simultaneous parameters can be seamlessly and efficiently generated through the Response Surface Modeling HyperTool. Please click the "Next" button to move to the 1D Curves visualization tool.

!!! note "High-Dimensional Visualization"
    Please note that the data (and the surrogate model fitted to it) is N-dimensional (with N=4 in this tutorial) - which is not possible to visualize. Nonetheless, it is possible to examine lower-dimensional "slices" or "cross-sections" of the model (i.e. by fixing the value of some of the parameters in order to obtain lower-dimensional predictions). These slices, while not able to capture the dependencies on the fixed value parameters, can provide very valuable information on the parameter dependencies displayed. Moreover, by interactively changing the values assigned to the fixed parameters, it is possible to also gain an understanding on their role, both towards the output and their possibly complex interplay with other parameters. Therefore, lower-dimensional visualizations can still allow to gain deep understanding of parameter dependencies of the broader, high-dimensional model.

### 1D Curve Response

In the 1D Curves visualization tool, the X axis represents the range of values of the selected input parameter (selectable at the "Axis" dropdown below the graph), while the Y axis represents the values of the QoI of choice (selectable at the top select box).

!!! note "Gaussian Process Confidence"
    Gaussian Processes (GP), also known as Kriging, are used as surrogate models. These provide the advantage of not only providing a prediction of the data value, but also the associated uncertainty, which is very useful to assess confidence in the results. In the 1D Curve Responses, this confidence is displayed as the shaded area, indicating the 95% confidence interval (i.e. mean ± twice the standard deviation, for a Gaussian error distribution).

Moreover, the values of the other parameters can be dynamically adapted, either using the slider, setting a value in the textbox, or using the up/down arrows in the textbox. We encourage you to play with the interactive visualization to gain understanding on the parameter dependence of the QoIs at different "areas" of the model.

![1D Curve analysis](../assets/MetaModeling_figures/1DCurve.png)
*One-dimensional visualization of the dependence of the Shannon Criteria of safety in neurostimulation with respect to electrode length. A clear dependence is observed - lower length lowers the Shannon Criteria value up to ~1.5mm, from a value over 1.0 to below 0.5, therefore making the device substantially safer. While the uncertainty bands appear relatively wide, they represent a high degree of confidence (95%) on a full-simulation sample lying within the shadowed range, following a normal (Gaussian) distribution around the predicted value. As the parameter dependency effect is still larger than it, thus providing assurance that the effect is soundly supported by the data underlying the model.*

### 2D Surface Response

Two-dimensional response surfaces allows to inspect the parameter dependence of the output with respect to two input parameters simultaneously.

As in the 1D Curves visualization tool, below the graph it is possible to modify the input parameters to visualize with the *Axis 1* and *Axis 2* dropdowns, and the fixed value of the other parameters can be interactively adapted at the sliders or their textbox.

![2D Surface analysis](../assets/MetaModeling_figures/2DSurface_isop50.png)
*Two-dimensional visualization of the 50% isopercentile threshold (i.e. current [mA] necessary to activate 50% of the fibers in the nerve). A lower isopercentile threshold indicates easier stimulability (i.e. less current is needed to achieve the same level of stimulation) and is therefore preferred. Low angle widths (e.g. low coverage of the nerve) naturally result in difficulties to stimulate enough fibers, while it seems to flatten from ~120º - further coverage does not necessarily facilitate stimulation, once the electrode is in close proximity to enough fibers. Minima are observed at ~200º and ~250º, which could indicate proximity to a more superficial fascicle. However, the low relative magnitude of these changes advises caution, as these variations might very well be within the uncertainty associated to the surrogate model and therefore not necessarily reflect a real low-amplitude variation in the modeled simulation pipeline. On the other hand, Inter-Electrode Spacing shows a clearer but smaller influence on the output, with bigger spacing leading to lower stimulation thresholds.*

### 3D Iso-Surface Response

Three-dimensional data can be visualized through iso-surfaces (i.e. the surface of all points with the same value), which are then color-coded. Similar to previous visualization, the parameters of interest can be selected at the dropdowns below the graph, and the fixed-value parameters can be modified at the slider.
This visualization provides the most information on the complex interplay between different parameters.

![3D Iso-Surface analysis](../assets/MetaModeling_figures/3DIsoSurface_isop50.png)
*Three-dimensional visualization of the 50% isopercentile threshold (i.e. current [mA] necessary to activate 50% of the fibers in the nerve). As observed in the two-dimensional visualization, both higher angle widths and inter-electrode spacings contribute towards lower stimulation thresholds. Moreover, lower electrode lengths also seem to contribute in that regard - although, as seen in the one-dimensional, this would have a detrimental effect on the safety-related Shannon Criteria.*

### Extracting Quantitative Insights

The tools shown above allow to gain both qualitative and quantitative insights on output parameter dependence.

In this tutorial, these visualization tools will be used to define design parameters of the sural nerve implant stimulator which appropriately balance effectivity (isopercentile threshold current at 50% fiber recruitment, *isop50*) and safety (Shannon Criteria at the same current level, *shannon50*).

![Multi-objective comparison](../assets/MetaModeling_figures/Isop50Shannon50Comparison.png)
*Three-dimensional visualizations of the two main quantities of interest - 50% isopercentile threshold (i.e. current [mA] necessary to activate 50% of the fibers in the nerve) and Shannon Criteria at that current level - which should both be minimized for enhanced effectivity and safety. While both metrics seem to benefit from large angle widths and inter-electrode spacing, smaller length benefits effectivity but harms safety, advising an intermediate value as a compromise.*

![Comparative 1D analysis](../assets/MetaModeling_figures/1DCurves_Isop50_Shannon50_angleWidth_Length.png)
*The insights gained on the three-dimensional visualizations can be further explored through one-dimensional cross-sections, which also provides estimates of uncertainty. The figure shows dependence on the angle width and length parameters (which play the largest roles) on both 50% isopercentile current and Shannon Criteria. As seen in the three-dimensional visualizations, while both efficiency and safety benefit from wider angle width, we must find a compromise value in terms of length.*

Based on all the visualization explored through this tutorial, the following design parameters were chosen as optimal:
- Angle Width: 250º
- Inter-Electrode Spacing: 1.5mm
- Length: 1mm
- Silicone Padding: 1.5mm

![Optimal design distributions](../assets/MetaModeling_figures/Isop50Shannon50Distributions.png)
*Distribution of the two main outputs of interest (50% isopercentile current and Shannon Criteria at that current level). Based on the insights obtained, the optimal configuration should produce an isopercentile slightly above 0.03mA, and a Shannon Criteria value around -2.2 (the threshold is typically considered to be +1.85, so this can be considered a very safe value).*

### Validation of Design Parameters through Full Simulation Pipeline

In order to validate the chosen design parameters based on the insights provided by the Response Surface Modeling HyperTool, the tool enables to run a parameter configuration of choice to verify that the full simulation results align with predictions.
To this end, the design parameters considered optimal above will be run, using the tool under *Adapt / Extend Sampling* - *Create new sampling campaign* - *Test run*.

![Optimal design validation](../assets/MetaModeling_figures/OptimalDesign.png)
*Pipeline run through the Test Run functionality - which will show in a new tab and in the user's Dashboard. As predicted, this configuration shows both a 50% isopercentile current under 0.05mA and a Shannon Criteria below -2.0, which means it is on the lower (i.e. better) range of the effectivity and safety QoIs simultaneously.*

## Conclusion

In this tutorial, we've explored how Response Surface Modeling can transform complex bioelectronic simulations into actionable design insights. Through the Model Intelligence approach, we were able to:

1. **Analyze complex parameter dependencies** across a multidimensional design space without running thousands of simulations
2. **Visualize critical relationships** between design parameters (electrode dimensions, spacing, angle) and performance metrics
3. **Balance competing objectives** of efficacy (lower isopercentile thresholds) and safety (Shannon criteria)
4. **Make data-driven design decisions** that would be difficult or impossible with traditional parameter sweeps

The analysis revealed several key insights:
- Wider angle coverage (around 250°) significantly improves nerve fiber recruitment
- Larger inter-electrode spacing (1.5mm) reduces stimulation thresholds
- Electrode length presents a tradeoff between efficacy and safety, with 1mm providing optimal balance
- Silicone padding (1.5mm) contributes to the overall optimal design

Most importantly, the surrogate model predictions were validated through full simulation, confirming that our optimized design achieves the desired 50% isopercentile current under 0.05mA while maintaining a Shannon Criteria below -2.0 - well within safety limits.

This tutorial demonstrates how Model Intelligence tools dramatically accelerate the bioelectronic device design process, reducing computational overhead while providing deeper insights into complex parameter relationships. These techniques represent a paradigm shift in simulation analysis, transforming raw data into actionable knowledge that can directly inform better, safer bioelectronic interventions.

## Next Steps

For further exploration, we recommend exploring our additional tutorials that complement the Response Surface Modeling approach:

- **[Pipeline Setup Tutorial](pipeline-setup-tutorial.md)** - Understand the complete simulation workflow and Function creation process that enables all Model Intelligence analysis

- **[Multi-Objective Genetic Algorithm (MOGA) Tutorial](moga-tutorial.md)** - Learn how to systematically optimize competing objectives (like efficacy vs. safety) and discover the Pareto frontier of optimal design tradeoffs. This is particularly valuable when you need to balance multiple conflicting design goals.

- **[Uncertainty Quantification Tutorial](uncertainty-quantification-tutorial.md)** - Establish statistically rigorous confidence intervals for your optimal design parameters when accounting for the inherent variability in human tissue properties. This provides a robust framework for quantifying output variability - a critical requirement for regulatory submission and clinical translation of bioelectronic devices.

The combination of pipeline understanding, RSM for detailed parameter analysis, MOGA for multi-objective optimization, and UQ for robustness assessment provides a comprehensive Model Intelligence workflow for advanced bioelectronic device development.
