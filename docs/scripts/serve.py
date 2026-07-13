#!/usr/bin/env python3

import os

from mkdocs.commands import serve as mkdocs_serve
from mkdocs.livereload import _serve_url as default_serve_url


def _public_serve_url(host: str, port: int, path: str) -> str:
    public_host = os.environ.get("MKDOCS_PUBLIC_HOST", host)
    public_port = int(os.environ.get("MKDOCS_PUBLIC_PORT", str(port)))
    return default_serve_url(public_host, public_port, path)


mkdocs_serve._serve_url = _public_serve_url
mkdocs_serve.serve(dev_addr=os.environ.get("MKDOCS_DEV_ADDR", "0.0.0.0:8001"))
