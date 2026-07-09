"""Utility module for managing SuMo model export/import operations.

This module provides functions to:
- Resolve the models directory path (with env override and default anchoring)
- Write model metadata sidecar files
- Read model metadata files
- Move exported model files into the models directory
"""

import json
import shutil
from pathlib import Path
from typing import Any


def _default_models_dir() -> Path:
    """Get the default models directory path, anchored to this file's location."""
    return Path(__file__).resolve().parents[3] / "runs_models"


def get_models_dir() -> Path:
    """Get the models directory path, respecting environment override."""
    env_dir = Path.cwd().parent.parent.parent / "runs_models"
    if env_dir.exists():
        return env_dir
    return _default_models_dir()


def write_model_metadata(
    models_dir: Path,
    model_id: str,
    conf_block_text: str,
    input_descriptors: list[str],
    output_descriptor: str,
    export_format: str,
) -> None:
    """Write metadata for a SuMo model to a JSON sidecar file."""
    metadata = {
        "conf_block_text": conf_block_text,
        "input_descriptors": input_descriptors,
        "output_descriptor": output_descriptor,
        "export_format": export_format,
    }

    metadata_file = models_dir / f"{model_id}.metadata.json"
    with open(metadata_file, "w") as f:
        json.dump(metadata, f, indent=2)


def read_model_metadata(models_dir: Path, model_id: str) -> dict[str, Any] | None:
    """Read metadata for a SuMo model from its JSON sidecar file."""
    metadata_file = models_dir / f"{model_id}.metadata.json"
    if not metadata_file.exists():
        return None

    with open(metadata_file) as f:
        return json.load(f)


def move_exported_files_to_models_dir(run_dir: Path, model_id: str, models_dir: Path) -> None:
    """Move exported model files from run_dir to models_dir."""
    models_dir.mkdir(parents=True, exist_ok=True)

    # Move all files that match the model_id pattern
    for file in run_dir.glob(f"{model_id}.*"):
        shutil.move(str(file), str(models_dir / file.name))
