import crypto from 'crypto';

export const encryptMessageContent = (content: any, publicKey : any) => {
  const encryptedBuffer = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    Buffer.from(content, "utf8")
  );
  //console.log("encryptedBuffer : ", encryptedBuffer.toString('base64'));
  return encryptedBuffer.toString('base64');
};

export const decryptMessageContent = (content:any, privateKey:any) => {
  const decryptedBuffer = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(content, "base64")
  );
    return decryptedBuffer.toString("utf8");
};


