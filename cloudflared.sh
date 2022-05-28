#!/bin/bash

wget -qO /tmp/cloudflared.deb "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb"
sudo apt-get update
sudo apt-get -y install /tmp/cloudflared.deb
rm /tmp/cloudflared.deb
