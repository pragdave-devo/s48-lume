---
title: Tools
description: Built-in penetration testing tools in Pick.
nav_order: 7
parent: "Pick"
---

Pick ships with nine built-in tools for network reconnaissance, device discovery, and system interaction. Each tool can be triggered from the Pick UI or remotely via the Prospector Studio API.

![Tools](/assets/img/pick/screenshots/tools.png)

## Port Scan

Performs TCP port scanning with configurable concurrency.

- **Target**: IP address or hostname
- **Port range**: Start and end ports
- **Concurrency**: Number of simultaneous connection attempts

Results list open ports with service identification where available.

## Device Info

Gathers system information from the host machine:

- Hostname, OS, kernel version
- CPU, memory, disk usage
- Network interfaces and addresses

## WiFi Scan

Enumerates visible WiFi networks. Returns SSID, signal strength, channel, and encryption type.

Requires elevated privileges on most platforms.

## ARP Table

Reads the local ARP cache to identify devices on the same network segment. Returns IP address, MAC address, and interface.

## SSDP Discover

Sends UPnP Simple Service Discovery Protocol (SSDP) multicast queries to find devices and services on the local network. Returns device descriptions and service URLs.

## Network Discover

Uses mDNS (Bonjour/Avahi) to discover services advertised on the local network. Returns service names, types, and addresses.

## Screenshot

Captures a screenshot of the host's display and returns it as a base64-encoded PNG. Useful for visual confirmation during remote operations.

## Traffic Capture

Captures network packets on a specified interface. Returns raw packet data for analysis.

Requires elevated privileges (root or `CAP_NET_RAW`).

## Execute Command

Executes a shell command on the host and returns stdout, stderr, and exit code. Commands run in the default shell (`/bin/sh` on Unix, `cmd.exe` on Windows).

## Remote Execution

All tools can be triggered remotely through the Prospector Studio API. When connected to Prospector Studio (via StrikeHub or hosted directly), tools are registered and can be invoked by:

- Other users through the Strike48 dashboard
- AI agents via the Prospector Studio API
- Automated workflows and pipelines
