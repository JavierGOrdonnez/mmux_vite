# MMUX Vite

This repository is under active development. It aims to bring up meta-modeling functionality in an interactive, user-friendly, guided step-by-step way.

It uses Vite (and React) for the front-end, and Python (via Flask) for the backend. Additionally, it connects to the OSPARC backend through its API (which is actively being expanded with "Functions" and related content to allow for meta-modeling functionality).

## Development

To setup your development environment, you need to fill it with the API access data from your oSPARC's account. Login on a deployment with your account and create a `New API Key` and use that data to fill out the generated `.env` file:

```shell
make .env
```

Make sure your images have been build (since they are used as a base for mounting the loca source folders)

```shell
make build
```

Install and run the repository hooks before opening a PR:

```shell
uvx prek install
make prek
```

Start for development mode with
```shell
make run-develop
```

NOTE: code will be running inside docker containers.

When the run target selects a fallback port such as `8889`, run these commands
from an elevated Windows PowerShell prompt to make the fallback ports reachable
from Windows:

```powershell
$WSL_IP = (wsl.exe -- hostname -I).Trim().Split(' ', [System.StringSplitOptions]::RemoveEmptyEntries)[0]
for ($port = 8889; $port -le 8892; $port++) {
	netsh interface portproxy delete v4tov4 listenaddress=0.0.0.0 listenport=$port
	netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=$port connectaddress=$WSL_IP connectport=$port
	netsh advfirewall firewall delete rule name="MMUX WSL port $port"
	netsh advfirewall firewall add rule name="MMUX WSL port $port" dir=in action=allow protocol=TCP localport=$port profile=any
}
netsh interface portproxy show v4tov4
```

The commands forward ports `8889`-`8892` to the current WSL IP and allow them
through Windows Firewall. Re-run them after WSL restarts because the WSL IP can
change. To remove the mappings later, run the `portproxy delete` command for
each port.

### Final validation step

When done editing always validate the production build of the app with the below command, since it's the only one giving some minor guarantee on the corectness of your changes.

```shell
make run-prod-local
```

## Updating the ospsarc package

The backend relies on the `osparc` package to interact with the oSPARC's API server. If he API server specs change, you would most likley need to create a new release of this service.
Instructions:

Fork https://github.com/ITISFoundation/osparc-simcore-clients  and clone your fork locally

```shell
cd api
make openapi-osparc-simore-master-branch
git commit -am "updated specs form osparc-simcore master branch"
```

Push your changes and create a PR which needs to be merged.

After the PR is merged, the CI will automatically publish a new version of this client which can be found here https://pypi.org/project/osparc/0.8.3.post0.dev27/#history
Get the latest version and repalce it in `falskapi/Dockerfile`. At the time of writing this it was `osparc==0.8.3.post0.dev27`.
