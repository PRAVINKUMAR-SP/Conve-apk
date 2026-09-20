/**
 * Utility for End-to-End Encryption using WebCrypto API
 * Generates ECDH keys (P-256) and encrypts using AES-GCM.
 */

// Convert ArrayBuffer to Base64 String
function bufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert Base64 String to ArrayBuffer
function base64ToBuffer(base64) {
  const binary_string = atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Generate a new ECDH key pair.
 */
export async function generateKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256"
    },
    true,
    ["deriveKey", "deriveBits"]
  );

  const exportedPublicKey = await window.crypto.subtle.exportKey(
    "raw",
    keyPair.publicKey
  );

  const exportedPrivateKey = await window.crypto.subtle.exportKey(
    "pkcs8",
    keyPair.privateKey
  );

  return {
    publicKey: bufferToBase64(exportedPublicKey),
    privateKey: bufferToBase64(exportedPrivateKey)
  };
}

/**
 * Derive an AES-GCM shared key from our private key and their public key.
 */
export async function deriveSharedKey(myPrivateKeyB64, theirPublicKeyB64) {
  const privateKey = await window.crypto.subtle.importKey(
    "pkcs8",
    base64ToBuffer(myPrivateKeyB64),
    {
      name: "ECDH",
      namedCurve: "P-256"
    },
    false,
    ["deriveKey"]
  );

  const publicKey = await window.crypto.subtle.importKey(
    "raw",
    base64ToBuffer(theirPublicKeyB64),
    {
      name: "ECDH",
      namedCurve: "P-256"
    },
    false,
    []
  );

  return await window.crypto.subtle.deriveKey(
    {
      name: "ECDH",
      public: publicKey
    },
    privateKey,
    {
      name: "AES-GCM",
      length: 256
    },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypt a plaintext message with the shared AES-GCM key.
 */
export async function encryptMessage(sharedKey, plaintext) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encodedPlaintext = new TextEncoder().encode(plaintext);

  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    sharedKey,
    encodedPlaintext
  );

  return {
    ciphertext: bufferToBase64(ciphertext),
    iv: bufferToBase64(iv)
  };
}

/**
 * Decrypt a ciphertext message with the shared AES-GCM key.
 */
export async function decryptMessage(sharedKey, ciphertextB64, ivB64) {
  try {
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(base64ToBuffer(ivB64))
      },
      sharedKey,
      base64ToBuffer(ciphertextB64)
    );

    return new TextDecoder().decode(decryptedBuffer);
  } catch (e) {
    console.error("Decryption failed", e);
    return "[Encrypted Message]";
  }
}
