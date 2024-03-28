import crypto from 'crypto';

const encryptMessageContent = (content, publicKey) => {
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

const decryptMessageContent = (content, privateKey) => {
  const decryptedBuffer = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(content, "base64")
  );
  console.log(decryptedBuffer.toString("utf8"));
  return decryptedBuffer.toString("utf8");
};


module.exports = { encryptMessageContent, decryptMessageContent };
