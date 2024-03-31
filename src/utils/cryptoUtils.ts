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
    /*console.log("IN DECRYPT");
    console.log(privateKey);
    console.log(content);
    console.log("==============================================================================================================================");*/
  const decryptedBuffer = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(content, "base64")
  );
  /*console.log("RESULT");
  console.log(decryptedBuffer.toString("utf8"));
  console.log("==============================================================================================================================");*/
    return decryptedBuffer.toString("utf8");
};


