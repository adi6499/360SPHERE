#!/bin/sh
# Rebuilds index.html (full standalone PWA document) from sphere-cam.html
# (the body fragment used for Claude Artifact publishing). Run after any edit
# to sphere-cam.html:  sh build.sh
{
  echo '<!doctype html>'
  echo '<html lang="en">'
  echo '<head>'
  echo '<meta charset="utf-8">'
  echo '<link rel="manifest" href="manifest.webmanifest">'
  echo '<meta name="mobile-web-app-capable" content="yes">'
  echo '<meta name="apple-mobile-web-app-capable" content="yes">'
  echo '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">'
  echo '<meta name="apple-mobile-web-app-title" content="SphereCam">'
  echo '<link rel="apple-touch-icon" href="icon-180.png">'
  echo '<meta name="theme-color" content="#0A0C0E">'
  sed 's|^<!-- ================= HOME ================= -->|</head>\n<body>\n<!-- ================= HOME ================= -->|' sphere-cam.html
  echo '</body>'
  echo '</html>'
} > index.html
echo "index.html rebuilt"
