---
title: "Dubernetes: Vibe Coding A Dumb Container Orchestrator"
author: "Mansoor"
date: "2025-09-28T03:57:49Z"
lastmod: "2025-12-30T23:34:16Z"
draft: false
url: "/blog/vibecoding-dubernetes/"
tags: ["SoftwareEngineering", "SRE", "Kubernetes", "claude-code"]
description: "In this post I share my experience of vibe coding a dumb container orchestration tool using claude code"
featuredImage: "/content/images/2025/09/dubernetes-wide.png"
images: ["/content/images/2025/09/dubernetes-wide.png"]
---

## TL;DR Give me code

Alright. Here <https://github.com/MansoorMajeed/Dubernetes>

## But Why?

A while ago I wrote about how Kubernetes runs containers under the hood



<figure class="kg-card kg-bookmark-card"><a class="kg-bookmark-container" href="https://newsletter.esc.sh/p/kubernetes-containers-linux-processes"><div class="kg-bookmark-content"><div class="kg-bookmark-title">How Kubernetes Runs Containers : A Practical Deep Dive</div><div class="kg-bookmark-description">Taking a deep dive into how Kubernetes runs containers as Linux processes</div><div class="kg-bookmark-metadata"><img alt="" class="kg-bookmark-icon" src="/content/images/icon/favicon-4.png"/><span class="kg-bookmark-author">Esc.sh</span><span class="kg-bookmark-publisher">Mansoor</span></div></div><div class="kg-bookmark-thumbnail"><img alt="" onerror="this.style.display = 'none'" src="/content/images/thumbnail/Kubernetes-linux2-2.png"/></div></a></figure>



And this was my "dumb architecture" from that article



<figure class="kg-card kg-image-card"><img alt="" class="kg-image" loading="lazy" sizes="(min-width: 720px) 720px" src="/content/images/2025/09/container-orch.png" srcset="/content/images/size/w600/2025/09/container-orch.png 600w, /content/images/size/w1000/2025/09/container-orch.png 1000w, /content/images/size/w1600/2025/09/container-orch.png 1600w, /content/images/2025/09/container-orch.png 1840w" width="1840"/></figure>



So I thought, why don't I vibe code a dumb one? It could be a valuable resource for someone learning container orchestration. I initially thought of writing it by myself, but a quick look at my graveyard of half-baked projects convinced me otherwise.

## Requirements - How should it work?

I want to write down a desired state for my app in a `yaml` file, use a command line tool similar to `kubectl` and Dubernetes should then use that to create Docker containers to run my application.

The Yaml should be something like this

```yaml
name: myapp
image: myapp-image:latest
replicas: 3
access:
  host: myapp.local
```

It is as simple as it can be

- Give a name
- Specify a docker image to run (no sidecars in Dubernetes sorry)
- Specify how many replicas (docker containers)
- Expose it via a domain name (Built-in ingress)

## Building it

### Step 1 : Deciding on the basics

- **Language** : When it came to the language, was there ever any doubt? It had to be **Go**. It’s the native tongue of Kubernetes and is fantastic for building the kind of system-level tools like Dubernetes
- **AI Assistant**: I decided to go with `Claude code`

### Step 2: Brainstorming with Claude Code

I spent a bit of time talking to Claude about what we are going to build. We discussed about the `yaml` structure, and the need for keeping everything simple. Initially it suggested a whole lot of complicated features. But added the following lines in `CLAUDE.md` to curb Claude's enthusiasm a little bit

> **Design Goals**\
> Maximum Simplicity: One orchestrator, one proxy, minimal components\
> Learning Focus: Understand orchestration without enterprise complexity

Claude can be opinionated if you don't drive the conversation. So be very vocal about your vision and you will of course be bombarded with the classic `You're absolutely right`



<figure class="kg-card kg-image-card"><img alt="" class="kg-image" loading="lazy" src="/content/images/2025/09/absolutely-right2.jpg" srcset="/content/images/2025/09/absolutely-right2.jpg 600w" width="600"/></figure>



Take as much time as needed in this step. Make sure to not overload the context with unnecessary information.

#### Coming up with a high level architecture

After talking to claude for some time, we came up with an architecture.

You can find the detailed architecture [here](https://github.com/MansoorMajeed/Dubernetes/blob/main/architecture.md). Here is a high level view of the overall system



<figure class="kg-card kg-image-card kg-card-hascaption"><img alt="" class="kg-image" loading="lazy" sizes="(min-width: 720px) 720px" src="/content/images/2025/09/dubernetes-arch.png" srcset="/content/images/size/w600/2025/09/dubernetes-arch.png 600w, /content/images/size/w1000/2025/09/dubernetes-arch.png 1000w, /content/images/size/w1600/2025/09/dubernetes-arch.png 1600w, /content/images/size/w2400/2025/09/dubernetes-arch.png 2400w" width="2000"/><figcaption><span style="white-space: pre-wrap;">dubernetes architecture</span></figcaption></figure>



- A **single binary** `Orchestrator`
  - It has API endpoints where the user can make requests about the desired state of the containers (more on this later)
  - This state is stored in an SQLite database
  - It will have a `reconciler` component that will run in a loop and make sure that the actual state of the running containers matches the desired state in the database
    - It uses the `docker` command to manage docker containers on the host machine
- `dubectl` the command line tool for the user to interact with the API
- An in built `Nginx` container that act as an ingress to route traffic from outside the "cluster"

### Step 3 : Creating an implementation plan

Once the architecture is clear, next step was to have Claude create an implementation plan.

I wanted to make sure that with each change, Claude will not break existing functionality. So I decided to go with **Test Driven Development**

> Building Dubernetes using Test-Driven Development (TDD) approach. Each phase starts with writing tests, then implementing the functionality to make tests pass.

So we wrote down the implementation plan into a markdown file. You can find that [HERE](https://github.com/MansoorMajeed/Dubernetes/blob/main/IMPLEMENTATION_PLAN.md)

At this point I also made sure to update the `CLAUDE.md` to reflect these documents and the vision. Check it out [HERE](https://github.com/MansoorMajeed/Dubernetes/blob/main/CLAUDE.md)

### Step 4 : Session Continuity made easy!

After creating a clear direction, I asked claude to use a markdown file [PROJECT\_STATUS.md](https://github.com/MansoorMajeed/Dubernetes/blob/main/PROJECT_STATUS.md) to keep the status updated after each session. Exact instruction in CLAUDE.md

```Markdown
**Session Continuity**
Status File: PROJECT_STATUS.md - Contains current progress and context
Resume Protocol: When starting new sessions, check PROJECT_STATUS.md for:
- Current implementation phase
- Completed tasks and checklist status
- Active development context
- Next steps and priorities
- Key Design Principles
```

Additionally, this line

> When user says "let us wrap up for the day", update PROJECT\_STATUS.md with current progress and context for seamless session resumption.

### Step 5: Vibe!!

Once the plan was locked in, I stepped back and let Claude handle the implementation.! I did not look at the code, not even once!

### Step 6 : Reset often

After finishing a milestone (tests passing – both manual and unit), commit it, have Claude update the `PROJECT_STATUS` and `/reset` to free up context! I found that this simple act made Claude very consistent.



<figure class="kg-card kg-image-card kg-card-hascaption"><img alt="" class="kg-image" loading="lazy" src="/content/images/2025/09/forgot-no-memories.gif" width="498"/><figcaption><span style="white-space: pre-wrap;">no memory</span></figcaption></figure>



While you might think you have ample context window to spare, an LLM's performance actually degrades significantly as the context grows, well before reaching the advertised maximum. There's a sharp drop-off, which this graph illustrates perfectly.



<figure class="kg-card kg-image-card"><img alt="" class="kg-image" loading="lazy" sizes="(min-width: 720px) 720px" src="/content/images/2025/09/hero_plot.png" srcset="/content/images/size/w600/2025/09/hero_plot.png 600w, /content/images/size/w1000/2025/09/hero_plot.png 1000w, /content/images/2025/09/hero_plot.png 1189w" width="1189"/></figure>



Source: <https://research.trychroma.com/context-rot#results>

## The Code Flow

### Step 1 : The Yaml

Let's take the previous example yaml

```yaml
name: myapp
image: myapp-image:latest
replicas: 3
access:
  host: myapp.local
```

We want the `myapp-image:latest` docker container to run with 3 containers and have it respond at the domain `myapp.local`

### Step 2 : Applying it using dubectl

PodSpec looks like this

`cmd/dubectl/types.go`

```go
type PodSpec struct {
	Name     string      `yaml:"name" json:"name"`
	Image    string      `yaml:"image" json:"image"`
	Replicas int         `yaml:"replicas,omitempty" json:"replicas,omitempty"`
	Access   *AccessSpec `yaml:"access,omitempty" json:"access,omitempty"`
}
```

The CLI tool Makes an API call

`cmd/dubectl/types.go`

```go
// CreatePod creates a new pod via the API
func (c *APIClient) CreatePod(podSpec *PodSpec) error {
	// Convert PodSpec to API request format
	requestData := map[string]interface{}{
		"name":     podSpec.Name,
		"image":    podSpec.Image,
		"replicas": podSpec.Replicas,
	}
```

### Step 3 : The Orchestrator API receives the request

`pkg/api/handlers.go`

Upon receiving the `POST` request, orchestrator does some validation and calls `CreatePod`

```go
// createPod handles POST /pods
func (h *Handler) createPod(w http.ResponseWriter, r *http.Request) {

    // ----snip-----

	// Create pod
	pod, err := h.orchestrator.CreatePod(r.Context(), req)
	if err != nil {
		h.writeError(w, http.StatusInternalServerError, "failed to create pod", "CREATE_FAILED", err.Error())
		return
	}
}
```

`cmd/orchestrator/main.go`

```go
// CreatePod creates a new pod
// Simply creates a database entry for the pod
func (o *OrchestratorImpl) CreatePod(ctx context.Context, req api.PodRequest) (*api.PodResponse, error) {

    //-----snip-----

	// Convert API request to database pod
	dbPod := &database.Pod{
		Name:         req.Name,
		Image:        req.Image,
		Replicas:     replicas,
		DesiredState: "running",
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	err := o.db.CreatePod(dbPod)
	if err != nil {
		return nil, err
	}
    //-----snip-----
}
```

### Step 4 : Reconciler creates containers

`pkg/reconciler/reconciler.go`

Finally, create the docker container, update Ingress nginx configuration

```go
// ReconcileOnce performs a single reconciliation cycle
func (r *Reconciler) ReconcileOnce() error {
	// Get all pods from database
	// Reconcile each pod
	// Update nginx configuration
}


// reconcileRunningPod ensures a pod has the correct number of running replicas
func (r *Reconciler) reconcileRunningPod(pod *database.Pod, replicas []*database.Replica) error {
	runningReplicas := 0
	var replicasToRestart []*database.Replica

	// Count running replicas and identify failed ones
	// Restart failed replicas
	// Remove excess replicas if needed
    // Create additional replicas if needed
}

func (r *Reconciler) createReplica(pod *database.Pod) error {
	// Allocate port
	// Generate replica ID
	// Create replica record first

	// Create container
	req := &docker.RunContainerRequest{
		Image:  pod.Image,
		Name:   replicaID,
		Port:   port,
		Labels: map[string]string{
			"dubernetes.pod":     pod.Name,
			"dubernetes.replica": replicaID,
		},
	}
	containerID, err := r.docker.RunContainer(req)
}
```

## Running it!

### Build and start the orchestrator

```bash
make build
./bin/orchestrator &
```

### Run a demo pod

```bash
./bin/dubectl apply -f examples/whoami-service.yaml
```



<figure class="kg-card kg-image-card kg-width-wide kg-card-hascaption"><img alt="" class="kg-image" loading="lazy" sizes="(min-width: 1200px) 1200px" src="/content/images/2025/09/Screenshot-2025-09-28-at-12.19.03-AM.png" srcset="/content/images/size/w600/2025/09/Screenshot-2025-09-28-at-12.19.03-AM.png 600w, /content/images/size/w1000/2025/09/Screenshot-2025-09-28-at-12.19.03-AM.png 1000w, /content/images/size/w1600/2025/09/Screenshot-2025-09-28-at-12.19.03-AM.png 1600w, /content/images/size/w2400/2025/09/Screenshot-2025-09-28-at-12.19.03-AM.png 2400w" width="2000"/><figcaption><span style="white-space: pre-wrap;">app running as docker containers</span></figcaption></figure>



We can see that the 3 app containers and the nginx (which acts as the ingress) container running

### Making a request

We can make a request using `curl` and the `--resolve` flag to map the domain `whoami.local` to `127.0.0.1`, letting us send a proper request as if the hostname resolved normally

```text
$ curl localhost  --resolve whoami.local:80:127.0.0.1
Hostname: 53b4ab629c3e
IP: 127.0.0.1
IP: ::1
IP: 172.17.0.3
RemoteAddr: 172.17.0.2:42188
GET / HTTP/1.1
Host: localhost
User-Agent: curl/8.7.1
Accept: */*
Connection: close
X-Forwarded-For: 192.168.65.1
X-Forwarded-Proto: http
X-Real-Ip: 192.168.65.1
```

okay it works!

## Conclusion

It turned out to be surprisingly easy to vibe-code the whole thing without Claude melting down. I think the main reason was sticking to test-driven development and regularly resetting the context. I had a ton of fun and I hope you had a decent read too!
