const { publicEncrypt, privateDecrypt, constants } = require('crypto');

const encryptMessageContent = (content, publicKey) => {
  console.log("je suis dans cryptoOOOOO");
  console.log(content, publicKey);

  // const encryptedBuffer = publicEncrypt(publicKey, Buffer.from(content));
  const encryptedBuffer = publicEncrypt(
    {
      key: publicKey,
      padding: constants.RSA_NO_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(content, "base64")
  );
  console.log("je suis apres cryP11");
  return encryptedBuffer.toString('base64');
};

const decryptMessageContent = (content, privateKey) => {
  console.log("je suis dans cryptoOOOOO222222");
  // privateKey = "-----BEGIN ENCRYPTED PRIVATE KEY-----\nMIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAK5voy7cmCzpxzM0qV9NHeRcJ9EvNCbLRqI+S8vFMdQNi3nyfhury4UeIK2YUP8AwfneR7ycNWIDSmjsEZXCNcXy3WlXStrG2kEPpI8zt4gnfEYR5DxbdMPaeiBu16GRXzEtymBvzY9qj9suWSZK46M9JZsqsqFAUJIk9azlZYNnAgMBAAECgYA6P1UCRO8bsESwOJmGFT4yDwPMujJz8dT4QE0XEhX9dThp1CuAGfGv1cubrAz/2cTsJulVdePtgqPKPWnx1BQYIwr57ZzOROjMZispgkZaZ783lynrByR1bBn6/MoOmMyot4WlxmiCjlmMqsXQEgTMA23pbxTrN8XMggKFNRVqIQJBAPFvR7QfHTvlLOhyUSIaFPyUeYpeGGsE86S6G/Jcolp4Y/nun+fU73/tXwIivr+AXsuETyWXDEUZKKP+UuYZp5MCQQC49aFTi55z5lLp21podoLFiN2IrRe2y3j7mClHf97Y/5VslvPQkOAJAGiQIbBm4TVH0ncmlVrndVCc0aVuTbFdAkEAwrM9/Oj2l126uH2wJjMoZ4SI+2fkgzGMFnSroujHWPQrk9u3Aqt6tQzFCKDieObaC3/Yn/TOxU6DsrSfP8bClwJAXfUJevNWDvJV9E5l4uMxEz+vqhqkDUvXrZdigNvITNupAHy+Zpjx9iCq/Wzfu6Nz+YRE2ujMQQArbz5gl2QIUQJAZghu7jZOREHuIdjNktrIEyEzm/8sUkx4DkoBtKmpjOhsf/LK8nbdwZvDxIbTLdc2J6WjzJgg+cmLIA2+Wo91KQ==\n-----END ENCRYPTED PRIVATE KEY-----"
  console.log("con", content);
  console.log("cryp", privateKey);
  // const decryptedBuffer = privateDecrypt(privateKey, content);
  const decryptedBuffer = privateDecrypt(
    {
      key: privateKey,
      padding: constants.RSA_NO_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(content, "base64")
  );
  console.log("je suis apres cryptoOOOOO222222");
  return decryptedBuffer.toString("utf8");
};


module.exports = { encryptMessageContent, decryptMessageContent };
