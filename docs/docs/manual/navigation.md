# Navigation and Controls

The Model Intelligence HyperTools interface provides intuitive navigation between different stages of your analysis workflow. Understanding the navigation flow ensures smooth operation and efficient use of the tools.

## Setup Screen Navigation

The Setup screen consists of two sequential steps that must be completed in order:

### Step 1: Function Selection
Step 1 (Setup) must be completed before it is possible to use the *Next* button to move to Step 2 (Results).
- A function must be selected from the available functions table
- All required function details must be verified

### Step 2: Parameter Configuration
Before proceeding to Results, the following must be completed:
- For **Response Surface Modeling**: Parameter ranges must be fully populated with valid minimum and maximum values
- For **Uncertainty Quantification**: Parameter distributions must be fully defined with appropriate statistical parameters

!!! note "Validation Required"
    The system validates all inputs before allowing progression to the Results screen. Incomplete or invalid configurations will prevent navigation to the next step.

## Results Screen Navigation

At Step 2 (Results) users can navigate anytime back to previous steps to modify function selection and parameter range/distribution values.

### Back Navigation
- **Edit Function**: Return to Step 1 to select a different function
- **Edit Parameters**: Return to Step 2 setup to modify parameter ranges or distributions
- **Apply Changes**: Any modifications automatically update the results when returning to the Results screen
