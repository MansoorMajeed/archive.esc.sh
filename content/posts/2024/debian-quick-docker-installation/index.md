---
title: "Debian Quick Docker Installation"
author: "Mansoor"
date: "2024-12-13T12:23:17Z"
lastmod: "2024-12-15T01:48:10Z"
draft: false
url: "/blog/debian-quick-docker-installation/"
tags: ["wiki"]
featuredImage: "/content/images/2024/12/debian-docker.jpg"
images: ["/content/images/2024/12/debian-docker.jpg"]
---

This is a quick reference on installing Docker on Debian 12

## [Optional] Install sudo - if it does not exist

The minimal install of Debian 12 does not come with sudo. If you are logging in as root, I recommend that you install `sudo`

```
apt update
apt install sudo
usermod -aG sudo yourusername
```

Logout and log back in as your non root user

## Install Docker

```
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo usermod -aG docker $USER

newgrp docker
```
