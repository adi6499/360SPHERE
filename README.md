# SphereCam — 360° camera in the browser

A web version of Google Pixel's Photo Sphere camera, so **iPhone (and Android) users can capture 360° photo spheres with no app install**.

**Live app (after enabling GitHub Pages):** `https://adi6499.github.io/360SPHERE/`

## What it does
0. **Three capture modes** — **Wide** (front view, 6 shots → normal photo), **Panorama** (one 360° ring → interactive strip), **Sphere** (full 360°, all around).
1. **Guided capture** — opens the rear camera, reads the gyroscope, and shows glowing dots around you. Aim the circle at each dot, hold steady, and the shot snaps itself onto the sphere. Each shot is then pixel-aligned against the overlap and exposure-matched before painting.
2. **Live stitching** — every frame is projected onto an equirectangular panorama on your phone's GPU (WebGL). A mini map shows the sphere filling in as you go. Nothing is uploaded anywhere.
3. **Interactive viewer** — drag (or turn your phone, with Gyro on) to look around the result. Also opens any existing 2:1 equirectangular 360 photo.
4. **Real 360° export** — saves a JPEG with Google GPano XMP metadata embedded, so Google Photos, Facebook and VR viewers recognize it as an interactive 360.

## Files
- `index.html` — the entire app, one self-contained file. No build step, no dependencies, no server code. Host it on any HTTPS site.
- `sphere-cam.html` — the same app as a body-fragment (used for Claude Artifact publishing).

## Requirements
- **HTTPS** (camera + motion sensors are blocked on plain HTTP) — GitHub Pages provides this.
- iOS Safari 13+ or Android Chrome. The browser will ask once for Camera and Motion & Orientation access.
- Capture needs a phone (gyroscope). The viewer also works on desktop.

## Honest limitations (v1)
- Stitching is gyroscope-based with feathered blending — expect visible seams and small misalignments, especially up close. This is a "cool and useful" stitch, not Pixel-perfect computational photography.
- Assumes ~66° field of view on the long side of the frame; if seams consistently overlap or gap on a device, that constant (`FOV_LONG` in the script) is the tuning knob.
- Rotate on the spot; stepping sideways between shots causes parallax ghosting.
