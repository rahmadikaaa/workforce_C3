#!/bin/bash

# =========================
# automate_1 -- ORDER-TRACKING External Party Get Detail Order CO
# Index     : app_fesw
# Event     : ORDER-TRACKING_ORDER-EXTERNAL_PARTY-GET_DETAIL_ORDER_CO
# =========================
#
# USAGE:
#   sh automate_1.sh
#
# DEBUG: DEBUG=1 sh automate_1.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/config/.env"

if [ -f "$ENV_FILE" ]; then
    set -a
    source "$ENV_FILE"
    set +a
else
    echo "<div style=\"color:red\"><b>Config Error:</b> File config/.env tidak ditemukan.<br>Salin config/.env.example ke config/.env lalu isi nilainya.</div>"
    exit 1
fi

# Validasi variabel wajib
for _VAR in SPLUNK_URL SPLUNK_USER SPLUNK_PASS; do
    if [ -z "${!_VAR:-}" ]; then
        echo "<div style=\"color:red\"><b>Config Error:</b> Variabel '$_VAR' belum diisi di config/.env</div>"
        exit 1
    fi
done

URL="$SPLUNK_URL"
USER="$SPLUNK_USER"
PASS="$SPLUNK_PASS"

TEAMS_API_URL="${TEAMS_API_URL:-}"
TEAMS_CHAT_ID="${TEAMS_CHAT_ID:-}"

EARLIEST="${EARLIEST:-"-1d@d"}"
LATEST="now"

# =========================
# QUERY
# =========================

SEARCH_QUERY="
search index=\"app_fesw\" event=\"ORDER-TRACKING_ORDER-EXTERNAL_PARTY-GET_DETAIL_ORDER_CO\" AOi4260717084816904ce0430
earliest=\"${EARLIEST}\"
latest=\"${LATEST}\"
| spath input=response path=transaction.transaction_id output=transaction_id
| spath input=response path=order.channel_transaction_id output=channel_transaction_id
| spath input=response path=order.order_id output=order_id
| spath input=response path=order.order_channel output=order_channel
| spath input=response path=order.order_receiver_email output=order_receiver_email
| spath input=response path=order.order_receiver_id_type output=order_receiver_id_type
| eval datetime=strftime(_time,\"%Y-%m-%d %H:%M:%S\")
| table datetime transaction_id channel_transaction_id order_id order_channel order_receiver_email order_receiver_id_type status_code url
"

# =========================
# CALL SPLUNK
# =========================
response=$(curl -s -k -w "\nHTTP_STATUS:%{http_code}" \
    -u "$USER:$PASS" \
    --data-urlencode search="$SEARCH_QUERY" \
    -d output_mode=csv \
    "$URL")

http_status=$(echo "$response" | tail -n1 | cut -d':' -f2)
data=$(echo "$response" | sed '$d')

# DEBUG: aktifkan dengan DEBUG=1 sh automate_1.sh
if [ "${DEBUG:-0}" = "1" ]; then
    echo "STEP        : Get Detail Order CO"
    echo "QUERY       : $SEARCH_QUERY" >&2
    echo "--- RAW DATA (first 5 lines) ---" >&2
    echo "$data" | head -5 >&2
    echo "=== END DEBUG ===" >&2
fi

# =========================
# TEAMS NOTIFICATION
# =========================
send_to_teams() {
    local MESSAGE="$1"

    if [ -z "$TEAMS_API_URL" ] || [ -z "$TEAMS_CHAT_ID" ]; then
        return 0
    fi

    curl -s -X POST "$TEAMS_API_URL" \
        -H "Content-Type: application/json" \
        -d "{
            \"chat_id\":\"$TEAMS_CHAT_ID\",
            \"message\":\"$MESSAGE\"
        }" >/dev/null 2>&1
}

# =========================
# ERROR HANDLING
# =========================

# 1. HTTP non-200 error
if [ "$http_status" != "200" ]; then
    error_msg=$(echo "$data" | sed -n 's:.*<msg[^>]*>\(.*\)</msg>.*:\1:p')
    [ -z "$error_msg" ] && error_msg="Unknown Error"

    cat <<EOF
<div style="color:red">
<b>Failed get data from Splunk</b><br>
HTTP Status : $http_status<br>
Error       : $error_msg
</div>
EOF
    exit 1
fi

# 2. Splunk internal error dalam body (HTTP 200 tapi ada <msg> tag error)
if echo "$data" | grep -q '<msg'; then
    splunk_error=$(echo "$data" | sed -n 's:.*<msg[^>]*>\(.*\)</msg>.*:\1:p')
    [ -z "$splunk_error" ] && splunk_error="Splunk returned an error response. Check Splunk availability or query syntax."

    cat <<EOF
<div style="background-color:#3a2800;border:1px solid #c9a227;color:#ffe082;padding:10px;border-radius:6px;font-family:monospace;font-size:11px;">
<b>Splunk Error</b><br><br>
$splunk_error
</div>
EOF
    exit 1
fi

# =========================
# EMPTY DATA
# =========================
rows=$(echo "$data" | wc -l)

if [ "$rows" -le 1 ]; then
    echo "<b>No Data Found</b>"
    exit 0
fi

# =========================
# INFORMATION (portal mode only -- non-interactive)
# =========================
if [ ! -t 1 ]; then
    cat <<EOF
<div style="padding:8px;margin-bottom:10px;background-color:#fff3cd;border:1px solid #ffeeba;color:#856404;">
<b>Information:</b> Pencarian dilakukan dengan rentang waktu: <b>24 Jam Kebelakang.</b>
</div>
EOF
fi

#########################################
# PRINT TABLE
#########################################

if [ -t 1 ]; then
    echo "======================================================================================================================="
    echo " ORDER-TRACKING -- External Party Get Detail Order CO"
    echo "======================================================================================================================="
    echo " Time Range : $EARLIEST to $LATEST"
    echo "======================================================================================================================="
    printf "%-3s | %-19s | %-36s | %-36s | %-12s | %-13s | %-30s | %-18s | %-11s | %s\n" \
        "No" \
        "Datetime" \
        "Transaction ID" \
        "Channel Trx ID" \
        "Order ID" \
        "Order Channel" \
        "Receiver Email" \
        "Receiver ID Type" \
        "Status Code" \
        "URL"
    echo "-----------------------------------------------------------------------------------------------------------------------"
else
    cat <<EOF
<table border="1" cellspacing="0" cellpadding="4" style="border-collapse:collapse;font-size:11px;width:100%;word-break:break-all;">
<tr style="background-color:#555;color:#fff;">
<th>No</th>
<th>Datetime</th>
<th>Transaction ID</th>
<th>Channel Trx ID</th>
<th>Order ID</th>
<th>Order Channel</th>
<th>Receiver Email</th>
<th>Receiver ID Type</th>
<th>Status Code</th>
<th>URL</th>
</tr>
EOF
fi

counter=1

while IFS= read -r record
do
    # Skip CSV header
    if [[ "$record" == datetime,* ]]; then
        continue
    fi

    datetime=$(echo "$record"               | cut -d',' -f1 | tr -d '"')
    transaction_id=$(echo "$record"         | cut -d',' -f2 | tr -d '"')
    channel_transaction_id=$(echo "$record" | cut -d',' -f3 | tr -d '"')
    order_id=$(echo "$record"               | cut -d',' -f4 | tr -d '"')
    order_channel=$(echo "$record"          | cut -d',' -f5 | tr -d '"')
    order_receiver_email=$(echo "$record"   | cut -d',' -f6 | tr -d '"')
    order_receiver_id_type=$(echo "$record" | cut -d',' -f7 | tr -d '"')
    status_code=$(echo "$record"            | cut -d',' -f8 | tr -d '"')
    url=$(echo "$record"                    | cut -d',' -f9 | tr -d '"')

    [ -z "$transaction_id" ]         && transaction_id="-"
    [ -z "$channel_transaction_id" ] && channel_transaction_id="-"
    [ -z "$order_id" ]               && order_id="-"
    [ -z "$order_channel" ]          && order_channel="-"
    [ -z "$order_receiver_email" ]   && order_receiver_email="-"
    [ -z "$order_receiver_id_type" ] && order_receiver_id_type="-"
    [ -z "$status_code" ]            && status_code="-"
    [ -z "$url" ]                    && url="-"

    # Color logic berdasarkan status_code
    if echo "$status_code" | grep -qE '^[45][0-9][0-9]$'; then
        row_style="background-color:#f8d7da;color:#721c24;"
    elif echo "$status_code" | grep -qE '^2[0-9][0-9]$'; then
        row_style="background-color:#d4edda;color:#155724;"
    else
        row_style="background-color:#fff3cd;color:#856404;"
    fi

    if [ -t 1 ]; then
        printf "%-3s | %-19s | %-36s | %-36s | %-12s | %-13s | %-30s | %-18s | %-11s | %s\n" \
            "$counter" "$datetime" "$transaction_id" "$channel_transaction_id" \
            "$order_id" "$order_channel" "$order_receiver_email" \
            "$order_receiver_id_type" "$status_code" "$url"
    else
        cat <<EOF
<tr style="$row_style">
<td>$counter</td>
<td>$datetime</td>
<td>$transaction_id</td>
<td>$channel_transaction_id</td>
<td>$order_id</td>
<td>$order_channel</td>
<td>$order_receiver_email</td>
<td>$order_receiver_id_type</td>
<td><b>$status_code</b></td>
<td>$url</td>
</tr>
EOF
    fi

    counter=$((counter + 1))

done <<< "$data"

if [ -t 1 ]; then
    echo "-----------------------------------------------------------------------------------------------------------------------"
else
    echo "</table>"
fi