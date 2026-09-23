import { describe, expect, it } from "vitest";
import { isPrivateOrReservedIp } from "@/lib/product-source/ip-safety";

describe("isPrivateOrReservedIp", () => {
  it("blocks localhost IPv4", () => {
    expect(isPrivateOrReservedIp("127.0.0.1")).toBe(true);
  });

  it("blocks private IPv4 ranges", () => {
    expect(isPrivateOrReservedIp("10.0.0.1")).toBe(true);
    expect(isPrivateOrReservedIp("172.16.0.1")).toBe(true);
    expect(isPrivateOrReservedIp("192.168.1.1")).toBe(true);
  });

  it("blocks link-local IPv4", () => {
    expect(isPrivateOrReservedIp("169.254.1.1")).toBe(true);
  });

  it("blocks multicast IPv4", () => {
    expect(isPrivateOrReservedIp("224.0.0.1")).toBe(true);
  });

  it("blocks localhost and private IPv6", () => {
    expect(isPrivateOrReservedIp("::1")).toBe(true);
    expect(isPrivateOrReservedIp("fc00::1")).toBe(true);
    expect(isPrivateOrReservedIp("fd00::1")).toBe(true);
  });

  it("blocks link-local IPv6", () => {
    expect(isPrivateOrReservedIp("fe80::1")).toBe(true);
  });

  it("allows a public IPv4 address", () => {
    expect(isPrivateOrReservedIp("8.8.8.8")).toBe(false);
  });

  it("allows a public IPv6 address", () => {
    expect(isPrivateOrReservedIp("2001:4860:4860::8888")).toBe(false);
  });

  it("blocks invalid IP input", () => {
    expect(isPrivateOrReservedIp("not-an-ip")).toBe(true);
  });
});
