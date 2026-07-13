# Copilot Instructions for Model Intelligence Documentation

## Project Overview

This is a MkDocs documentation site for Sim4Life's **Model Intelligence** framework - an advanced meta-modeling suite that transforms computationally intensive simulations into fast, accurate mathematical surrogates for bioelectronic applications. The documentation covers HyperTools for Response Surface Modeling (RSM) and Uncertainty Quantification (UQ).

## Architecture & Structure

### Core Components
- **Documentation Source**: `/docs/` - All Markdown content (manual, tutorials, getting-started)
- **Build System**: MkDocs with Material theme, controlled via `Makefile` and `mkdocs.yml`
- **Assets**: Mathematical figures in `/docs/assets/MetaModeling_figures/` for simulation visualizations
- **Custom Styling**: `/src/css/custom.css` with Sim4Life brand colors and specialized code block styling
- **MathJax Integration**: `/src/js/mathjax.js` for LaTeX math rendering in documentation

### Content Organization
- **Manual**: Reference docs for HyperTool creation, navigation, setup, RSM, and UQ workflows
- **Tutorials**: Step-by-step guides with real bioelectronic use cases (sural nerve implants)
- **Getting Started**: Conceptual overview of meta-modeling and key workflows

## Development Workflows

### Local Development
```bash
make devenv    # Creates .venv with mkdocs, mkdocs-material, pymdown-extensions
make serve     # Serves docs at 0.0.0.0:8001 (note non-standard port)
make build     # Builds to /site directory
```

### Deployment
```bash
make gh-deploy # Deploys to GitHub Pages via gh-pages branch
```

### Virtual Environment Pattern
- Uses Make-managed virtual environment in `.venv/`
- All MkDocs commands run through `$(VENV_DIR)/bin/mkdocs`
- Specific versions pinned: mkdocs-material>=9.0.0, pymdown-extensions>=10.0

## Project-Specific Conventions

### Documentation Style
- **Admonition Blocks**: Heavy use of `!!! info` for meta-modeling paradigm explanations
- **Card Grids**: Homepage uses Material theme card grids for navigation (`<div class="grid cards">`)
- **Mathematical Content**: LaTeX math via MathJax for statistical formulations
- **Mermaid Diagrams**: Configured for workflow visualizations

### Image Assets
- All figures stored in `/docs/assets/MetaModeling_figures/` with descriptive names
- Screenshot naming pattern: `CreateRSMHyperTool.png`, `ChooseFunctionAndRanges.png`
- Always include alt text describing the interface or concept shown

### Content Patterns
- **Functions**: Core concept representing immutable simulation workflow snapshots
- **HyperTools**: RSM and UQ tools are the primary user interfaces
- **Evaluations/Campaigns**: Terminology for simulation runs and parameter sampling
- **QoIs**: "Quantities of Interest" - standard term for simulation outputs

### MkDocs Configuration Specifics
- **Site URL**: Configured for `ZurichMedTech.github.io/model-intelligence/`
- **Theme**: Material with slate palette, navigation tabs, code copy features
- **Extensions**: Configured for code highlighting, tabs, details, math rendering
- **Search**: Uses built-in search with mkdocstrings for API documentation

## Key Files to Understand

- `mkdocs.yml`: Central configuration with nav structure and Material theme settings
- `Makefile`: Development workflow automation with virtual environment management
- `docs/index.md`: Homepage showcasing meta-modeling paradigm and HyperTools overview
- `docs/manual/setup.md`: Critical workflow documentation for function selection and configuration
- `src/css/custom.css`: Brand-specific styling with Sim4Life color scheme

## Integration Points

- **GitHub Pages**: Automated deployment via `make gh-deploy` to gh-pages branch
- **MathJax**: Mathematical notation rendering for statistical formulations
- **Material Theme**: Heavily customized with navigation features and search integration
- **External CDNs**: MathJax and Material icons loaded from CDNs via `extra_javascript`

When working on this documentation, focus on maintaining the educational tone about meta-modeling benefits, use consistent terminology (Functions, HyperTools, QoIs), and ensure all mathematical content is properly formatted with MathJax.
