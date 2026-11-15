---
title: "Change Ollama storage location in Windows 11"
author: "Mansoor"
date: "2025-02-01T17:02:15Z"
lastmod: "2025-02-05T02:49:16Z"
draft: false
url: "/blog/change-ollama-storage-location-in-windows-11/"
tags: ["Ollama", "LLM", "wiki"]
description: "How to easily change the location where ollama stores models. This allows to free up space on your C drive"
featuredImage: "/content/images/2025/02/ollama-windows.jpg"
images: ["/content/images/2025/02/ollama-windows.jpg"]
---

## TL;DR

1. Move the models from `C:\Users\%username%\.ollama\models` to wherever you want
2. Edit your user's environment variables (search for `Edit environment variables`) and set `OLLAMA_MODELS` to the new location

## Slightly longer version

Ollama by default uses `C:\Users\%username%\.ollama\models` to store the models and if you started playing around with Ollama and running a bunch of models, you probably have noticed that you are running out of disk in your C drive. This post will show you how to move that to any other disk

> 💡
>
> Make sure to use a fast SSD to store these models or it will take a long time for ollama to load these models into memory/VRAM

### Step 1 : Quit Ollama

We don't want to cause any issues by moving the models while ollama is running.

Find the ollama icon in the task bar, right click and `quit ollama`



<figure class="kg-card kg-image-card"><img alt="" class="kg-image" loading="lazy" src="/content/images/2025/02/image-4.png" width="242"/></figure>



### Step 2 : Move the models to the new location

Open windows explorer and go to `C:\Users\%username%\.ollama\`

You can copy and paste the location in the explorer's address bar

Now copy the folder `models` to the new location. For example, `D:\Apps\Ollama\.ollama\models`

### Step 3 : Edit your environment variable

Now we need to tell Ollama where to look for the models when it runs. This is done through an environment variable called `OLLAMA_MODELS`

Open windows `settings` app and search for `Environment` and click on `Edit environment variables for your account`



<figure class="kg-card kg-image-card"><img alt="" class="kg-image" loading="lazy" src="/content/images/2025/02/Screenshot-2025-02-01-112626.png" width="323"/></figure>



Click on `New..` and fill in

- Variable name: `OLLAMA_MODELS`
- Variable value: `Your new path to the models folder`

> 💡
>
> You can browse to the new folder instead of manually typing the path



<figure class="kg-card kg-image-card"><img alt="" class="kg-image" loading="lazy" src="/content/images/2025/02/Screenshot-2025-02-01-113454.png" srcset="/content/images/size/w600/2025/02/Screenshot-2025-02-01-113454.png 600w, /content/images/2025/02/Screenshot-2025-02-01-113454.png 647w" width="647"/></figure>



and press `OK`

### Step 4 : Start Ollama and verify

At this point, you can simply start ollama and verify that your models are present by running `ollama ls` which should list your previously downloaded models. If it does not show any of your old models, you probably mis spelled the variable name or the path, double check that
