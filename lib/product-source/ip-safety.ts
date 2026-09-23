import { isIP } from "node:net";

function ipv4ToNumber(ip: string): number {
  return ip
    .split(".")
    .reduce((acc, octet) => acc * 256 + Number(octet), 0);
}

function isIPv4InRange(ip: string, start: string, end: string): boolean {
  const value = ipv4ToNumber(ip);
  return value >= ipv4ToNumber(start) && value <= ipv4ToNumber(end);
}

export function isPrivateOrReservedIp(ip: string): boolean {
  const version = isIP(ip);

  if (version === 4) {
    return (
      isIPv4InRange(ip, "0.0.0.0", "0.255.255.255") ||
      isIPv4InRange(ip, "10.0.0.0", "10.255.255.255") ||
      isIPv4InRange(ip, "100.64.0.0", "100.127.255.255") ||
      isIPv4InRange(ip, "127.0.0.0", "127.255.255.255") ||
      isIPv4InRange(ip, "169.254.0.0", "169.254.255.255") ||
      isIPv4InRange(ip, "172.16.0.0", "172.31.255.255") ||
      isIPv4InRange(ip, "192.0.0.0", "192.0.0.255") ||
      isIPv4InRange(ip, "192.0.2.0", "192.0.2.255") ||
      isIPv4InRange(ip, "192.168.0.0", "192.168.255.255") ||
      isIPv4InRange(ip, "198.18.0.0", "198.19.255.255") ||
      isIPv4InRange(ip, "198.51.100.0", "198.51.100.255") ||
      isIPv4InRange(ip, "203.0.113.0", "203.0.113.255") ||
      isIPv4InRange(ip, "224.0.0.0", "239.255.255.255") ||
      isIPv4InRange(ip, "240.0.0.0", "255.255.255.255")
    );
  }

  if (version === 6) {
    const normalized = ip.toLowerCase();

    return (
      normalized === "::" ||
      normalized === "::1" ||
      normalized.startsWith("fc") ||
      normalized.startsWith("fd") ||
      normalized.startsWith("fe8") ||
      normalized.startsWith("fe9") ||
      normalized.startsWith("fea") ||
      normalized.startsWith("feb") ||
      normalized.startsWith("ff")
    );
  }

  return true;
}
