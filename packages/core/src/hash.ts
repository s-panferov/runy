import crypto from "node:crypto";

export function base36MD5(input: string): string {
  // Compute MD5 hash
  const md5Hash = crypto.createHash("md5").update(input).digest();
  // Convert buffer to hex string
  const hexString = md5Hash.toString("hex");
  return utf8ToBase36(hexString).slice(0, 8); // Return first 8 characters
}

function utf8ToBase36(input: string) {
  const bytes = Buffer.from(input, "utf8");

  // Convert bytes to a big integer
  let num = 0n;
  for (const byte of bytes) {
    num = num * 256n + BigInt(byte);
  }

  // Handle empty string case
  if (num === 0n) {
    return "0";
  }

  // Convert to base36
  let result = "";
  const base = 36n;
  let temp = num;

  while (temp > 0n) {
    const remainder = temp % base;
    const digit = Number(remainder);

    const char =
      digit < 10
        ? String.fromCharCode(48 + digit) // '0' + digit
        : String.fromCharCode(97 + digit - 10); // 'a' + digit - 10

    result = char + result;
    temp = temp / base;
  }

  return result;
}
