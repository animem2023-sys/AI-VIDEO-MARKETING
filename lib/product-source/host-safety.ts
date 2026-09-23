import { promises as dns } from "node:dns";
import { isIP } from "node:net";
import { isPrivateOrReservedIp } from "./ip-safety";

export async function assertSafeProductSourceHost(
  hostname: string,
): Promise<void> {
  const normalizedHostname = hostname.trim().toLowerCase();

  if (!normalizedHostname) {
    throw new Error("Hostname sản phẩm không hợp lệ.");
  }

  if (isIP(normalizedHostname)) {
    if (isPrivateOrReservedIp(normalizedHostname)) {
      throw new Error("Nguồn sản phẩm trỏ đến địa chỉ IP không được phép.");
    }

    return;
  }

  const addresses = await Promise.all([
    dns.resolve4(normalizedHostname).catch(() => []),
    dns.resolve6(normalizedHostname).catch(() => []),
  ]);

  const resolvedAddresses = addresses.flat();

  if (resolvedAddresses.length === 0) {
    throw new Error("Không thể phân giải hostname của nguồn sản phẩm.");
  }

  if (resolvedAddresses.some(isPrivateOrReservedIp)) {
    throw new Error(
      "Nguồn sản phẩm phân giải đến địa chỉ IP không được phép.",
    );
  }
}
