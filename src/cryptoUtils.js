const { generateKeyPair, publicEncrypt } = require('crypto');
const { createClient } = require('@supabase/supabase-js');

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

const generateUserKeyPair = async () => {
    return new Promise((resolve, reject) => {
        generateKeyPair('rsa', {
            modulusLength: 530,
            publicExponent: 0x10101,
            publicKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-192-cbc',
                passphrase: 'Hertz eats chipolata all night long'
            }
        }, async (err, publicKey, privateKey) => {
            if (!err) {
                try {
                    const supabase = createClient();
                    const { data, error } = await supabase.from('public.users').update({ public_key: publicKey }).eq('id', 'id_de_utilisateur');
                    if (error) {
                        console.error("Error saving public key to Supabase database:", error.message);
                        reject(error);
                    } else {
                        console.log("Public key saved successfully to Supabase database!");
                        // TODO: crypt private key
                        let date = new Date();
                        const time = date.getTime();
                        const expireTime = time + 30 * 24 * 60 * 60 * 1000; // 1 month
                        date.setTime(expireTime);
                        document.cookie = "privateKey="+privateKey+";expires="+date.toUTCString()+"; path=/;";
                        console.log("Private key saved locally!");
                        resolve({ publicKey, privateKey });
                    }
                } catch (error) {
                    console.error("Error communicating with Supabase database:", error.message);
                    reject(error);
                }
            } else {
                console.log("Error: ", err);
                reject(err);
            }
        });
    });
};

module.exports = { encryptMessageContent, generateUserKeyPair };