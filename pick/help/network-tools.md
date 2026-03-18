---
title: "Pick: Network Tools"
description: Troubleshooting port scan no results, traffic capture fails, SSDP/mDNS empty, and WiFi scan empty.
nav_order: 10
parent: "Pick"
---

This guide covers common issues with Pick's network reconnaissance tools.

## Port scan returns no results

**Symptom:** Running `port_scan` against a target returns zero open ports.

**Possible causes:**

- **Target is unreachable** — The host is down or not on the same network.
- **Firewall blocking** — A firewall is dropping outbound connection attempts.
- **Wrong port range** — The specified range doesn't include any open ports.

**Debugging:**

```bash
# Verify the target is reachable
ping -c 3 <target>

# Test a known open port manually
nc -zv <target> 22

# Run with debug logging
RUST_LOG=pick_connector::tools=debug cargo run -p pick-connector
```

Look for:

```
pick_connector::tools: port_scan starting target="10.0.0.1" ports="1-1024"
pick_connector::tools: port_scan connection_timeout port=80 err="connection timed out"
```

> **Tip:** If scanning takes a long time, the target may have a firewall that drops packets silently (no RST response). Reduce the port range or increase the timeout.
## Traffic capture fails

**Symptom:** The `traffic_capture` tool returns an error or no packets.

**Possible causes:**

- **Missing privileges** — Packet capture requires root or `cap_net_raw`. See the [Privileges guide](/pick/help/privileges/).
- **Wrong network interface** — The tool is capturing on the wrong interface.
- **No traffic** — There's simply no traffic on the specified interface during the capture window.

**Debugging:**

```bash
# Check available interfaces
ip link show   # Linux
ifconfig       # macOS

# Verify raw socket access
sudo tcpdump -i any -c 5
```

If `tcpdump` works but Pick doesn't, the issue is likely missing capabilities on the Pick binary.

## SSDP/UPnP discovery returns empty

**Symptom:** `ssdp_discover` finds no devices.

**Possible causes:**

- **No UPnP devices on the network** — Not all networks have UPnP-enabled devices.
- **Multicast blocked** — The network blocks UDP multicast traffic.
- **Wrong interface** — The discovery is happening on a loopback or inactive interface.
- **Firewall blocking UDP 1900** — SSDP uses UDP port 1900 for multicast.

**Debugging:**

```bash
# Test SSDP manually
echo -e "M-SEARCH * HTTP/1.1\r\nHOST: 239.255.255.250:1900\r\nMAN: \"ssdp:discover\"\r\nMX: 3\r\nST: ssdp:all\r\n\r\n" | socat - UDP4-DATAGRAM:239.255.255.250:1900

# Check firewall rules (Linux)
sudo iptables -L -n | grep 1900
```

## mDNS discovery returns empty

**Symptom:** `network_discover` (mDNS) finds no services.

**Possible causes:**

- **No mDNS services advertised** — No devices are advertising via mDNS/Bonjour.
- **mDNS port blocked** — Port 5353/UDP must be open for multicast.
- **Avahi not running (Linux)** — The mDNS responder service may not be active.

**Debugging:**

```bash
# Test mDNS manually
# Linux
avahi-browse -a -t

# macOS
dns-sd -B _http._tcp
```

If manual tools find services but Pick doesn't, check that Pick is binding to the correct interface.

## WiFi scan returns empty

**Symptom:** `wifi_scan` returns no networks.

**Possible causes:**

- **Missing privileges** — WiFi scanning requires root or `cap_net_admin`. See the [Privileges guide](/pick/help/privileges/).
- **No WiFi interface** — The system doesn't have a wireless adapter, or it's disabled.
- **Driver issues** — The WiFi driver doesn't support scan operations via the nl80211 interface.

**Debugging:**

```bash
# Check for WiFi interfaces (Linux)
iw dev

# Run a manual scan (Linux, requires root)
sudo iw dev wlan0 scan

# macOS
/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -s
```

> **Note:** WiFi scanning on headless Linux servers without a wireless adapter will always return empty. This tool is designed for devices with WiFi hardware.