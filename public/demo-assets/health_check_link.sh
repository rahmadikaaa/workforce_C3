#!/bin/bash
set -euo pipefail

ipaddr=$(hostname -I | awk '{print $1}')
hostname=$(hostname)

SERVICE_BAD_LIST=()
CONTAINER_KEYWORD="link"

# Cek Docker container
collect_link_service() {
  local container_status
  container_status=$(docker ps -a | grep -i "${CONTAINER_KEYWORD}" || true)

  if [[ -z "${container_status}" ]]; then
    SERVICE_BAD_LIST+=("docker-${CONTAINER_KEYWORD}")
    echo "      {"
    echo "        \"Service\": \"docker-${CONTAINER_KEYWORD}\","
    echo "        \"Status\": \"NOT_OK\","
    echo "        \"Desc\": \"Docker container not found\""
    echo "      }"
  else
    local container_list
    container_list=$(echo "${container_status}" | awk '{print $1}' | tr '\n' ',')

    echo "      {"
    echo "        \"Service\": \"docker-${CONTAINER_KEYWORD}\","
    echo "        \"Status\": \"OK\","
    echo "        \"Desc\": \"Container ID(s): ${container_list%,}\""
    echo "      }"
  fi
}

# Cek localhost service
collect_localhost_service() {
  local curl_status
  curl_status=$(curl -k -s --max-time 5 https://localhost:449 || true)

  if [[ -z "${curl_status}" ]]; then
    SERVICE_BAD_LIST+=("localhost:449")
    echo "      {"
    echo "        \"Service\": \"localhost:449\","
    echo "        \"Status\": \"NOT_OK\","
    echo "        \"Desc\": \"No response from localhost:449\""
    echo "      }"
  else
    echo "      {"
    echo "        \"Service\": \"localhost:449\","
    echo "        \"Status\": \"OK\","
    echo "        \"Desc\": \"Response received\""
    echo "      }"
  fi
}

# --- Main output JSON ---
echo "{"
echo "  \"Hostname\": \"${hostname}\","
echo "  \"IP\": \"${ipaddr}\","
echo "  \"Services\": ["
collect_link_service
echo ","
collect_localhost_service
echo "  ],"

# Status overall
if [ ${#SERVICE_BAD_LIST[@]} -eq 0 ]; then
  echo "  \"Service\": \"All\","
  echo "  \"Status\": \"OK\","
  echo "  \"Desc\": \"All services are running normally.\""
  echo "}"
else
  echo "  \"Service\": \"All\","
  echo "  \"Status\": \"NOT_OK\","
  echo "  \"Desc\": \"Problematic service(s): ${SERVICE_BAD_LIST[*]}\""
  echo "}"
fi

exit 0
