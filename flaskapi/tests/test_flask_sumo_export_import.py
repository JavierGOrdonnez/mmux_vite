"""
Tests for SuMo model export/import functionality.
"""

import uuid
from pathlib import Path

import pytest

from mmux_flaskapi.utils.sumo_model_store import (
    move_exported_files_to_models_dir,
    read_model_metadata,
    write_model_metadata,
)


def test_sumo_model_store_utils():
    """Test the utility functions for SuMo model storage."""
    # Test write and read metadata
    models_dir = Path("/tmp/test_models")
    model_id = uuid.uuid4().hex

    # Write metadata
    write_model_metadata(
        models_dir=models_dir,
        model_id=model_id,
        conf_block_text="test conf block",
        input_descriptors=["input1", "input2"],
        output_descriptor="output1",
        export_format="text_archive",
    )

    # Read metadata
    metadata = read_model_metadata(models_dir, model_id)
    assert metadata is not None
    assert metadata["conf_block_text"] == "test conf block"
    assert metadata["input_descriptors"] == ["input1", "input2"]
    assert metadata["output_descriptor"] == "output1"
    assert metadata["export_format"] == "text_archive"

    # Test non-existent metadata
    assert read_model_metadata(models_dir, "nonexistent") is None

    # Cleanup
    import shutil

    shutil.rmtree(models_dir, ignore_errors=True)


def test_move_exported_files_to_models_dir():
    """Test moving exported files to models directory."""
    # This is a basic test - actual file movement would require more setup
    models_dir = Path("/tmp/test_models")
    run_dir = Path("/tmp/test_run")

    # Create test directory structure
    run_dir.mkdir(parents=True, exist_ok=True)
    models_dir.mkdir(parents=True, exist_ok=True)

    # Create a test file
    test_file = run_dir / "test_model_file.txt"
    test_file.write_text("test content")

    # Move file
    move_exported_files_to_models_dir(run_dir, "test_model", models_dir)

    # Check that file was moved
    moved_file = models_dir / "test_model_file.txt"
    assert moved_file.exists()

    # Cleanup
    import shutil

    shutil.rmtree(run_dir, ignore_errors=True)
    shutil.rmtree(models_dir, ignore_errors=True)


@pytest.mark.parametrize(
    "invalid_id",
    [
        "not-a-uuid",
        "1234567890123456789012345678901",  # Too short
        "123456789012345678901234567890123",  # Too long
    ],
)
def test_sumo_import_model_request_validation(invalid_id):
    """Test validation of sumo_model_id in import request."""
    # This test would be in the dakota_models.py test file
    # We're just documenting the expected behavior here
    pass


def test_get_models_dir_default():
    """Test getting the default models directory."""
    # This test would verify the default path resolution
    pass


def test_model_metadata_roundtrip():
    """Test writing and reading model metadata roundtrip."""
    models_dir = Path("/tmp/test_models")
    model_id = uuid.uuid4().hex

    # Write metadata
    write_model_metadata(
        models_dir=models_dir,
        model_id=model_id,
        conf_block_text="test conf block",
        input_descriptors=["input1", "input2"],
        output_descriptor="output1",
        export_format="text_archive",
    )

    # Read it back
    metadata = read_model_metadata(models_dir, model_id)
    assert metadata is not None

    # Verify all fields match
    assert metadata["conf_block_text"] == "test conf block"
    assert metadata["input_descriptors"] == ["input1", "input2"]
    assert metadata["output_descriptor"] == "output1"
    assert metadata["export_format"] == "text_archive"

    # Cleanup
    import shutil

    shutil.rmtree(models_dir, ignore_errors=True)
