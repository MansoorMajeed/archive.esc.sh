# Esc.sh Blog Source


## Set up locally

The theme lives in this repository (`layouts/`, `assets/css/main.css`,
`assets/js/site.js`); there is no theme submodule and nothing to install
besides Hugo.

```sh
hugo server
```

Then open http://localhost:1313. Add `-D` to include drafts.

## Ghost archive import

The ten Ghost-only posts added in November 2026 use `/blog/<ghost-slug>/` URLs.
The existing WireGuard article stays at `/blog/wireguard-vpn-setup/`; the
Let's Encrypt article was updated from Ghost and keeps
`/blog/lets-encrypt-and-nginx-definitive-guide/`.

Imported Ghost images, including responsive variants, live under
`static/content/images/` so these articles do not need Ghost to serve media.
Article links to the eight posts selected for Substack point to
`https://newsletter.esc.sh/p/<slug>`.

Build locally:

```sh
HUGO_RESOURCEDIR=.scratch/resources hugo --destination .scratch/build --noBuildLock
```

This import does not change the live archive-to-Ghost redirects. Remove those
redirects as part of deployment before pointing Ghost URLs back to the archive,
to avoid redirect loops.

## In production

The live site is served by Nginx on `root@us1.linode`, with Cloudflare in
front of it. Verified on 2026-11-15 by matching a public request to the
Linode access log. GitHub Pages is not the current serving path, and this
repository has no GitHub Actions deployment workflow.

- Server checkout: `/var/www/archive.esc.sh`
- Nginx document root: `/var/www/archive.esc.sh/public/`
- Nginx site configuration: `/etc/nginx/sites-enabled/archive.esc.sh`
- Access log: `/var/log/nginx/archive.esc.sh_access.log`

Deployment is manual; pushing or merging this repository does not deploy the
site. Compare the server checkout and live Nginx configuration before updating
either. The homelab repository owns the Nginx configuration under
`cloud-vps/linode/us1/nginx/sites-enabled/archive.esc.sh`; its us1 runbook covers
configuration comparison, backups, validation and rollback.

The live Nginx configuration currently redirects four archive articles to
Ghost: exposing self-hosted services, cross-continent Plex streaming, WireGuard,
and Let's Encrypt/Nginx. As part of the archive rollout, point the first two
directly to their Substack posts and remove the latter two redirects so Nginx
serves their archive pages. These live changes are not included in this import.
