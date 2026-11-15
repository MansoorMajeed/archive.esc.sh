---
title: "Fix Synology Docker Containers No  Internet Access"
author: "Mansoor"
date: "2025-02-09T17:58:19Z"
lastmod: "2025-02-12T02:32:18Z"
draft: false
url: "/blog/synology-nas-container-no-internet/"
tags: ["Synology", "SelfHosting", "wiki"]
featuredImage: "/content/images/2025/02/nas-docker.jpg"
images: ["/content/images/2025/02/nas-docker.jpg"]
---

## The Problem

You have started a new container in your Synology NAS using Container Manager, but for some reason it does not have internet access.

## The Solution

Fortunately, it is very easy to fix. It is most probably due to your Synology's firewall rules. So, all we have to do is add the docker container's IP ranges to the firewall

### Step 1 : Find your docker container's IP range

Open "Container Manager" and go to your container that is having issues. Go to `General` -> `Network`



<figure class="kg-card kg-image-card"><img alt="" class="kg-image" loading="lazy" sizes="(min-width: 720px) 720px" src="/content/images/2025/02/image-15.png" srcset="/content/images/size/w600/2025/02/image-15.png 600w, /content/images/size/w1000/2025/02/image-15.png 1000w, /content/images/2025/02/image-15.png 1056w" width="1056"/></figure>



Here, you should be able to see the IP address assigned to your container. Make note of that.

### Step 2 : Update firewall rules

Open `Control Panel` -> `Security` -> `Firewall` and `Edit rules`



<figure class="kg-card kg-image-card"><img alt="" class="kg-image" loading="lazy" sizes="(min-width: 720px) 720px" src="/content/images/2025/02/image-16.png" srcset="/content/images/size/w600/2025/02/image-16.png 600w, /content/images/size/w1000/2025/02/image-16.png 1000w, /content/images/2025/02/image-16.png 1156w" width="1156"/></figure>



This should show all your current firewall rules. Click on `Create`

- Ports: `All`
- Source IP: `Specific IP` -> `Select`-> Choose `Subnet`
  - IP Address: Put the IP address from previous step, but replace the last number with `0`. For example: `172.18.0.0` in my case. This will be the network address of our docker container
  - And under `Subnet mask` : `255.255.255.0`



<figure class="kg-card kg-image-card"><img alt="" class="kg-image" loading="lazy" src="/content/images/2025/02/image-17.png" srcset="/content/images/size/w600/2025/02/image-17.png 600w, /content/images/2025/02/image-17.png 703w" width="703"/></figure>



- Action: `Allow`
- Make sure to check `Enabled`
- Press `OK`

### Very Important!!

This would have created a firewall rule allowing your container's network. However, if you have a deny rule, it most probably is above this rule. So, **drag your new firewall rule above the `Deny` rule. Check the screenshot**



<figure class="kg-card kg-image-card"><img alt="" class="kg-image" loading="lazy" sizes="(min-width: 720px) 720px" src="/content/images/2025/02/image-18.png" srcset="/content/images/size/w600/2025/02/image-18.png 600w, /content/images/2025/02/image-18.png 775w" width="775"/></figure>



That should be it!
