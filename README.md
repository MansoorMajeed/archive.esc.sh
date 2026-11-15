# Esc.sh Blog Source


## Set up locally

```
git submodule init
git submodule update -r
```

if for whatever reason it does not work and the `themes/hugo-coder` directory is empty, then run

```
git submodule add https://github.com/luizdepra/hugo-coder.git themes/hugo-coder
hugo
```

## Ghost archive import

The ten Ghost-only posts added in November 2026 use `/blog/<ghost-slug>/` URLs.
The existing WireGuard article stays at `/blog/wireguard-vpn-setup/`; the
Let's Encrypt article was updated from Ghost and keeps
`/blog/lets-encrypt-and-nginx-definitive-guide/`.

Imported Ghost images, including responsive variants, live under
`static/content/images/` so these articles do not need Ghost to serve media.
Article links to the eight posts selected for Substack point to
`https://newsletter.esc.sh/p/<slug>`.

Build locally with the pinned theme:

```sh
git submodule update --init
HUGO_RESOURCEDIR=.scratch/resources hugo --destination .scratch/build --noBuildLock
```

This import does not change the live archive-to-Ghost redirects. Remove those
redirects as part of deployment before pointing Ghost URLs back to the archive,
to avoid redirect loops.

## In production

Runs via Github pages (the github action definition can be found under `.github/workflows/hugo.yml`)
