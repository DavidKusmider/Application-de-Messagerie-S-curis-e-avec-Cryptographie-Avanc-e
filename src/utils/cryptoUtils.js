const { publicEncrypt } = require('crypto');

const encryptMessageContent = (content, publicKey) => {
    const encryptedBuffer = publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        },
        Buffer.from(content)
    );
    return encryptedBuffer.toString('base64');
};

module.exports = { encryptMessageContent, generateUserKeyPair };