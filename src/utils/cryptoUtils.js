const { publicEncrypt, privateDecrypt, constants } = require('crypto');

const encryptMessageContent = (content, publicKey) => {
  console.log("je suis dans cryptoOOOOO");
  console.log(content, publicKey);

  const encryptedBuffer = publicEncrypt(
    {
      key: publicKey,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    content);
  console.log("je suis apres cryP11");
  return encryptedBuffer.toString('base64');
};

const decryptMessageContent = (content, privateKey) => {
  try {
    console.log("je suis dans cryptoOOOOO222222");
    const decryptedBuffer = privateDecrypt(
      {
        key: privateKey,
        // passphrase: 'Hertz eats chipolata all night long',
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      }, content
    );
    console.log("je suis apres cryptoOOOOO222222");
    return decryptedBuffer.toString("utf8");
  } catch (error) {
    console.error("ERROORR decrypting message:", error);
    throw error; // Lève l'erreur pour signaler le problème à l'appelant
  }
};


module.exports = { encryptMessageContent, decryptMessageContent };
