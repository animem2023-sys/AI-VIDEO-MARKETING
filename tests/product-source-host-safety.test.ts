import { beforeEach, describe, expect, it, vi } from "vitest";

const { dnsMock } = vi.hoisted(() => ({
  dnsMock: {
    resolve4: vi.fn(),
    resolve6: vi.fn(),
  },
}));

vi.mock("node:dns", () => ({
  promises: dnsMock,
}));

import { assertSafeProductSourceHost } from "@/lib/product-source/host-safety";

describe("assertSafeProductSourceHost", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows a public IPv4 address", async () => {
    await expect(
      assertSafeProductSourceHost("8.8.8.8"),
    ).resolves.toBeUndefined();

    expect(dnsMock.resolve4).not.toHaveBeenCalled();
    expect(dnsMock.resolve6).not.toHaveBeenCalled();
  });

  it("blocks a private IPv4 address", async () => {
    await expect(
      assertSafeProductSourceHost("192.168.1.1"),
    ).rejects.toThrow("địa chỉ IP không được phép");
  });

  it("blocks localhost IPv6", async () => {
    await expect(
      assertSafeProductSourceHost("::1"),
    ).rejects.toThrow("địa chỉ IP không được phép");
  });

  it("allows a hostname that resolves only to public IPs", async () => {
    dnsMock.resolve4.mockResolvedValue(["93.184.216.34"]);
    dnsMock.resolve6.mockResolvedValue([]);

    await expect(
      assertSafeProductSourceHost("example.com"),
    ).resolves.toBeUndefined();

    expect(dnsMock.resolve4).toHaveBeenCalledWith("example.com");
    expect(dnsMock.resolve6).toHaveBeenCalledWith("example.com");
  });

  it("blocks a hostname if any resolved IP is private", async () => {
    dnsMock.resolve4.mockResolvedValue(["93.184.216.34", "127.0.0.1"]);
    dnsMock.resolve6.mockResolvedValue([]);

    await expect(
      assertSafeProductSourceHost("attacker.example"),
    ).rejects.toThrow("phân giải đến địa chỉ IP không được phép");
  });

  it("blocks a hostname if any resolved IPv6 address is private", async () => {
    dnsMock.resolve4.mockResolvedValue([]);
    dnsMock.resolve6.mockResolvedValue(["2001:4860:4860::8888", "fc00::1"]);

    await expect(
      assertSafeProductSourceHost("attacker.example"),
    ).rejects.toThrow("phân giải đến địa chỉ IP không được phép");
  });

  it("rejects an empty hostname", async () => {
    await expect(
      assertSafeProductSourceHost(""),
    ).rejects.toThrow("Hostname sản phẩm không hợp lệ");
  });

  it("rejects a hostname that resolves to no addresses", async () => {
    dnsMock.resolve4.mockRejectedValue(new Error("ENOTFOUND"));
    dnsMock.resolve6.mockRejectedValue(new Error("ENOTFOUND"));

    await expect(
      assertSafeProductSourceHost("missing.example"),
    ).rejects.toThrow("Không thể phân giải hostname");
  });
});
