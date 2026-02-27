import crypto from 'crypto';

export const verifyHmacSig = (
  secret: string,
  payload: string,
  signature: string,
  algorithm = 'sha256'
): boolean => {
  try {
    const expected = crypto
      .createHmac(algorithm, secret)
      .update(payload)
      .digest('hex');
    // Return false immediately if lengths differ (timing-safe)
    if (expected.length !== signature.length) return false;
    // Constant-time string comparison to prevent timing attacks
    let result = 0;
    for (let i = 0; i < expected.length; i++) {
      result |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
    }
    return result === 0;
  } catch {
    return false;
  }
};
