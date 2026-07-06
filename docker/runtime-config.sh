#!/bin/sh
set -eu

cat <<EOF > /usr/share/nginx/html/config.js
window.__APP_CONFIG__ = {
  CORE_API_URL: "${CORE_API_URL:-}"
};
EOF
