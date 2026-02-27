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
    const expectedBuf = Buffer.from(expected, 'hex');
    const receivedBuf = Buffer.from(signature, 'hex');
    if (expectedBuf.length !== receivedBuf.length) return false;
    return crypto.timingSafeEqual(new Uint8Array(expectedBuf), new Uint8Array(receivedBuf));
  } catch {
    return false;
  }
};
