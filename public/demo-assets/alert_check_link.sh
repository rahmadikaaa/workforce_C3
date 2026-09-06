#!/bin/bash

echo "=== $(date '+%Y-%m-%d %H:%M:%S') ==="

# Docker container keyword/name
CONTAINER_KEYWORD="link"

IP_ADDRESS=$(hostname -I | awk '{print $1}')
HOSTNAME=$(hostname)
ALERT_ID="${HOSTNAME}_$(date +%s)"

echo "Checking Docker service for container keyword: ${CONTAINER_KEYWORD} ..."

# Check docker container
CONTAINER_STATUS=$(docker ps -a | grep -i "${CONTAINER_KEYWORD}")

# Check localhost service
echo "Checking service https://localhost:449 ..."
CURL_STATUS=$(curl -k -s --max-time 5 https://localhost:449)

# Condition check
if [[ -n "$CONTAINER_STATUS" && -n "$CURL_STATUS" ]]; then
    echo "Docker container and localhost service are running normally. No alert needed."
else
    echo "One or more checks failed, sending alert..."

    curl -s -X POST http://10.250.197.49:1111/send-alert \
      -H "Content-Type: application/json" \
      -d '{
        "alert_id":"'"$ALERT_ID"'",
        "message":"Docker service (link) or localhost:449 is DOWN",
        "start_time":"'"$(date +"%Y-%m-%dT%H:%M:%S")"'",
        "state":"open",
        "application_name":"Telkomsel Portal(WEC FMC)",
        "application_id":"APP139",
        "hostname":"'"$HOSTNAME"'",
        "ip_address":"'"$IP_ADDRESS"'",
        "service":"docker-link"
      }'
fi