#!/bin/bash
set -euo pipefail

ipaddr=$(hostname -I | awk '{print $1}')
hostname=$(hostname)

CONTAINER_KEYWORD="link"
APP_DIR="/apps/link"
RESTART_CMD="${APP_DIR}/auuto-restart.sh"
LOG_FILE="/home/apps/itsmops/link_monitor.log"

# --- FUNCTIONS ---
check_link_container() {
docker ps -a --format '{{.Names}}' | grep -i "${CONTAINER_KEYWORD}" > /dev/null 2>&1
}

check_localhost() {
curl -k -s --max-time 5 https://localhost:449 > /dev/null 2>&1
}

# --- 1) CEK AWAL SEKALI ---
link_status=$(check_link_container && echo "OK" || echo "NOT_OK")
link_desc=$(check_link_container && echo "Docker container '${CONTAINER_KEYWORD}' found" || echo "Docker container '${CONTAINER_KEYWORD}' not found")

localhost_status=$(check_localhost && echo "OK" || echo "NOT_OK")
localhost_desc=$(check_localhost && echo "localhost:449 responding" || echo "localhost:449 not responding")

# --- 2) RESTART JIKA SALAH SATU / KEDUA NOK ---
if [[ "${link_status}" == "NOT_OK" || "${localhost_status}" == "NOT_OK" ]]; then

    echo "$(date '+%Y-%m-%d %H:%M:%S') | Issue detected — executing restart script" >> "${LOG_FILE}"

    if [[ -x "${RESTART_CMD}" ]]; then

        if (cd "${APP_DIR}" && "${RESTART_CMD}") >> "${LOG_FILE}" 2>&1; then

            echo "$(date '+%Y-%m-%d %H:%M:%S') | Restart executed, waiting service..." >> "${LOG_FILE}"

            sleep 8

            # Re-check status
            link_status=$(check_link_container && echo "OK" || echo "NOT_OK")
            link_desc=$(check_link_container && echo "Container recovered — restart successful" || echo "Container still missing")

            localhost_status=$(check_localhost && echo "OK" || echo "NOT_OK")
            localhost_desc=$(check_localhost && echo "localhost:449 recovered" || echo "localhost:449 still not responding")

            echo "$(date '+%Y-%m-%d %H:%M:%S') | Restart DONE — check services" >> "${LOG_FILE}"

        else

            link_status="NOT_OK"
            link_desc="Restart script execution failed"

            localhost_status="NOT_OK"
            localhost_desc="Restart script execution failed"

            echo "$(date '+%Y-%m-%d %H:%M:%S') | ERROR — restart script returned non-zero" >> "${LOG_FILE}"

        fi

    else

        link_status="NOT_OK"
        link_desc="Restart script not found or not executable"

        localhost_status="NOT_OK"
        localhost_desc="Restart script not found or not executable"

        echo "$(date '+%Y-%m-%d %H:%M:%S') | ERROR — restart script missing or not executable" >> "${LOG_FILE}"

    fi
fi

# --- 3) OUTPUT JSON FINAL ---
echo "{"
echo "  \"Hostname\": \"${hostname}\","
echo "  \"IP\": \"${ipaddr}\","
echo "  \"Services\": ["
echo "      {"
echo "        \"Service\": \"docker-${CONTAINER_KEYWORD}\","
echo "        \"Status\": \"${link_status}\","
echo "        \"Desc\": \"${link_desc}\""
echo "      },"
echo "      {"
echo "        \"Service\": \"localhost:449\","
echo "        \"Status\": \"${localhost_status}\","
echo "        \"Desc\": \"${localhost_desc}\""
echo "      }"
echo "  ],"
echo "  \"Service\": \"All\","

if [[ "${link_status}" == "OK" && "${localhost_status}" == "OK" ]]; then
  echo "  \"Status\": \"OK\","
  echo "  \"Desc\": \"All services are running normally.\""
else
  echo "  \"Status\": \"NOT_OK\","
  echo "  \"Desc\": \"Problematic service(s) detected (see log).\""
fi

echo "}"

exit 0
