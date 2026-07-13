# MMUX Docs

MkDocs site for the MMUX / Model Intelligence documentation that now lives in
this repository under `docs/`.

## Local preview

From the repo root:

```bash
make docs-serve
```

From `docs/` directly:

```bash
make devenv
make serve
```

The root `make docs-serve` wrapper resolves a browser-facing port starting at
`8001`, prints the final URLs, and serves through Docker port publishing:

- `http://localhost:<resolved-port>/` from the WSL shell
- `http://<WSL-IP>:<resolved-port>/` from a Windows browser

Windows `localhost:<resolved-port>` only works when Windows is explicitly
forwarding that WSL port. If the printed WSL-IP URL is also unreachable from
Windows, refresh any stale Windows `netsh portproxy` rule for the resolved port
and check Windows firewall rules for that port. If you want the old host-native
MkDocs path for debugging, `make serve` inside `docs/` still runs it directly
from the local virtualenv.

Stop the Docker-backed preview from the repo root with:

```bash
make docs-stop
```

## Build

```bash
make docs-build
```

## Deploy

```bash
make docs-gh-deploy
```

CI also deploys docs automatically from `main` when `docs/**` changes via
`.github/workflows/docs.yml`.
