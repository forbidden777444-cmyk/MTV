# MTV News — self-hosted

A small local news site: post headlines, summaries, and images from a
form, and anyone on your network who opens the URL sees them.

## What's inside
- `server.js` — a small Node/Express server that stores posts in
  `data/posts.json` and uploaded images in `uploads/`
- `public/index.html` — the site itself
- `data/`, `uploads/` — created automatically the first time you run it

## Requirements
- [Node.js](https://nodejs.org) version 18 or later (includes `npm`)

## Run it
1. Open a terminal in this folder.
2. Install dependencies (only needed once):
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
4. Open **http://localhost:3000** in your browser.

That's it — "Post news" now works for real, with an optional image
attached to each post. Posts and images are saved to disk, so they'll
still be there next time you start the server.

## Sharing it on your network
By default the site is only reachable from your own computer. To let
other devices on the same Wi-Fi see it:
1. Find your computer's local IP address (e.g. `192.168.1.24`) —
   on Windows run `ipconfig`, on Mac/Linux run `ifconfig` or `ip a`.
2. Others on the same network can visit `http://<that-ip>:3000`.
3. Your computer needs to stay on and the server needs to keep running
   for the site to stay reachable.

## Putting it on the real internet (optional)
To make it reachable from anywhere, not just your local network, you'd
deploy it to a hosting service (e.g. Render, Railway, a VPS) rather
than running it on your own machine. That's a separate step from
self-hosting — ask if you want help with it.

## Notes
- Images are capped at 8MB and must be jpg/png/gif/webp.
- There's no login system — anyone with access to the site's "Post
  news" button can post or remove posts. Fine for personal/local use;
  add authentication if you plan to open this up publicly.
