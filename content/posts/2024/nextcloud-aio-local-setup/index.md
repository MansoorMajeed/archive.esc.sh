---
title: "NextCloud Easy Local Setup"
author: "Mansoor"
date: "2024-12-13T13:13:49Z"
lastmod: "2025-01-01T18:52:58Z"
draft: false
url: "/blog/nextcloud-aio-local-setup/"
tags: ["wiki"]
description: "How to setup a nextcloud instance using the nextcloud AIO container. This tutorial uses docker compose to setup a fully fledged production ready nextcloud instance including TLS/SSL certificates"
featuredImage: "/content/images/2025/01/Nextcloud_Logo.svg.png"
images: ["/content/images/2025/01/Nextcloud_Logo.svg.png"]
---

[NextCloud AIO](https://github.com/nextcloud/all-in-one) is the easiest way to install and operate a self-hosted NextCloud instance. You can read more about it in the official documentation. However, the official installation method requires the nextcloud instance to be available publicly over the internet. There are documentations on how to do that local only, but it is slightly scattered. In this post, I will show you how to setup NextCloud AIO without needing to expose it to the internet.

## Requirements

- A valid domain name: If you do not have one, this will not work
  - I recommend Cloudflare if you are looking to get a new domain
- A Clean Linux (Debian 12 recommended) VM with Docker installed.
  - [You can follow this to install Docker](https://archive.esc.sh/blog/debian-quick-docker-installation/)
  - No other reverse proxies running on port 80 or 443.
- A DNS record pointing your NextCloud domain to the Linux VM.
  - Example : `nextcloud.example.com` points to `192.168.50.100`

> 💡
>
> You don't necessarily have to setup a DNS server in your local network. You can simply create a DNS record in your Domain registrar such as Cloudflare that points to a private IP. This is what I do with many of my private services

## Generate Cloudflare tokens

Since we are using local only NextCloud, we need to use the DNS challenge to retrieve the Let'sencrypt certificates. For that, we need to generate a Cloudflare token which would allow our reverse proxy (we will be using Caddy) to create DNS records in Cloudflare.

You can do this very easily by following the instructions in Caddy documentations

- Cloudflare - If your domain is in Cloudflare, follow [THIS](https://github.com/caddy-dns/cloudflare)
- If you use another provider, you can check if Caddy supports it [HERE](https://github.com/caddy-dns) and follow the instructions in the appropriate provider repo by Caddy

At this point, you should have the necessary tokens ready.

## AIO docker-compose

In the appropriate location on your VM,

```
cd
mkdir -p apps/nextcloud
cd apps/nextcloud
```

create a `docker-compose.yml`

> 💡
>
> Note the image being used for Caddy. If you use something other than cloudflare, you can find the appropriate package [HERE](https://caddyserver.com/download)

```yaml
services:
  caddy:
    # Change the image if you are not using cloudflare
    image: caddybuilds/caddy-cloudflare:alpine
    restart: unless-stopped
    container_name: caddy
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - ./certs:/certs
      - ./config:/config
      - ./data:/data
      - ./sites:/srv
    network_mode: "host"

  nextcloud:
    image: nextcloud/all-in-one:latest
    restart: unless-stopped
    container_name: nextcloud-aio-mastercontainer
    ports:
      - "8080:8080"
    environment:
      - APACHE_PORT=11000
      - SKIP_DOMAIN_VALIDATION=true
    volumes:
      - nextcloud_aio_mastercontainer:/mnt/docker-aio-config
      - /var/run/docker.sock:/var/run/docker.sock:ro
    depends_on:
      - caddy

volumes:
  nextcloud_aio_mastercontainer:
    name: nextcloud_aio_mastercontainer
```

> 💡
>
> Do not start the containers yet

### Configuring Caddy

In the same directory, create another file named `Caddyfile` with the following content.

Make sure to update the domain name to yours. Also, the `tls` configuration needs to be updated with your token. If you are not using Cloudflare, you can find instructions [HERE](https://github.com/caddy-dns) for other providers

```
https://nextcloud.yourdomain.com:443 {
    header Strict-Transport-Security max-age=31536000;
    reverse_proxy localhost:11000

    tls {
        dns cloudflare your-cloudflare-token
    }
}
```

## Bring it up!

Run `docker compose up -d` from the same directory and the AIO container should get to work right away

I also like to do `docker compose logs -f` to see what is going on in the container

> 💡
>
> The AIO container itself does not run the NextCloud service, instead it manages all the containers needed by NextCloud

At this point, the AIO container logs should tell you what to do

Open `https://your server internal ip:8080` in a browser and you will be treated with the AIO dashboard

## AIO Setup

In the AIO dashboard, you will be greeted with a password. Note it down in your password manager of choice. This is the password you will use to login to your AIO dashboard.

- Click on Nextcloud AIO login
- Paste the password you just copied -> Login
- Enter the domain name, this should be the same domain name you configured in Caddy
- Under optional addons, you can choose whatever you like. Keep in mind that some of the addons take up a good amount of resources
- Save changes
- Start containers

> 💡
>
> The progress bar should start to spin now. It will take a few minutes, so leave it alone and be patient.

## Grab the initial Nextcloud password

Once the initial setup is done, AIO dashboard should show the initial username (`admin`) and the password. Note this down too.

## Login to NextCloud

Now you should be able to login to NextCloud using your domain name.

Good luck!
