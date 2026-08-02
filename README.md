# Kamagatos

A theme-free Hugo site for chronological writing, evergreen collections, and interactive essays.

## Write locally

Install Hugo Extended, then run:

```sh
make dev
```

Create content with one of the three content types:

```sh
hugo new content posts/my-article.md
hugo new content pages/my-evergreen-page.md
hugo new content experiments/my-interactive/index.md
```

Posts are dated and appear under `/writing/`. Pages are timeless and appear at the root. Experiments appear under `/lab/`; a leaf bundle (`index.md` plus adjacent CSS and JavaScript) gives each interactive article isolated assets. `field-lines` is a working example.

Before publishing, review the site metadata in `hugo.toml`, then change `draft: true` to `draft: false` or remove it from new content. The canonical `baseURL` is already set to `https://www.kamagatos.com/`.

## Deploy with Caddy

Build the static site on your machine or VPS:

```sh
hugo --minify --gc
```

Copy the repository to `/srv/kamagatos` (or change `SITE_ROOT`). Install Hugo and Caddy on the VPS, then run Caddy with:

```sh
sudo SITE_ROOT=/srv/kamagatos/public caddy run --config /srv/kamagatos/Caddyfile
```

For a persistent service, put `SITE_ROOT` in Caddy's systemd environment and point the packaged Caddy service at this Caddyfile. Ensure DNS for `www.kamagatos.com`, `kamagatos.com`, and `blog.kamagatos.com` points to the VPS and ports 80 and 443 are open. Caddy serves the site at `www.kamagatos.com`, redirects the other two hostnames to it, and obtains and renews TLS certificates automatically. Caddy does not need an email address to issue a certificate; add one to its global options later if you want expiry notifications.

After each update, rebuild `public/`; Caddy serves the new files immediately and does not need a restart.

## Production

The production server is `kamagatos-web` in Hetzner's Nuremberg location. It serves `www.kamagatos.com`; the apex domain and `blog.kamagatos.com` redirect to the canonical hostname.

Publishing is automatic. Push a commit to `main` and the `kamagatos-deploy.timer` service checks GitHub within five minutes, performs a fast-forward-only update, builds into a temporary release, and atomically switches the generated `public/` directory.

Useful administrative commands on the server:

```sh
systemctl list-timers kamagatos-deploy.timer
sudo systemctl start kamagatos-deploy.service
sudo journalctl -u kamagatos-deploy.service
sudo journalctl -u caddy
```

Changes to `Caddyfile` require validation and a reload after the repository has updated:

```sh
sudo install -o root -g root -m 0644 /srv/kamagatos/Caddyfile /etc/caddy/Caddyfile
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```
