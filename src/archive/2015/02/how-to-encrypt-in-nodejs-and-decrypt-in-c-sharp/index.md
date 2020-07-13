---
layout: post
tags: post
date: 2015-02-16

title: How to Encrypt in Node.js and Decrypt in C#
category: Node.js, .NET
---

Are you trying to send messages to a .NET application from node.js and you want to encrypt them?

You can find here a simple example to accomplish it.

<!--excerpt-->

Encrypt in node.js:

    var crypto = require('crypto');
    var key = '00000000000000000000000000000000'; //replace with your key
    var iv = '0000000000000000'; //replace with your IV
    var cipher = crypto.createCipheriv('aes256', key, iv)
    var crypted = cipher.update(authorizationKey, 'utf8', 'base64')
    crypted += cipher.final('base64');
    console.log(crypted);


Decrypt with C#:

    string keyString = "00000000000000000000000000000000"; //replace with your key
    string ivString = "0000000000000000"; //replace with your iv
            
    byte[] key = Encoding.ASCII.GetBytes(keyString);
    byte[] iv = Encoding.ASCII.GetBytes(ivString);

    using (var rijndaelManaged =
            new RijndaelManaged { Key = key, IV = iv, Mode = CipherMode.CBC })
            {
                rijndaelManaged.BlockSize = 128;
                rijndaelManaged.KeySize = 256;
                using (var memoryStream =
                       new MemoryStream(Convert.FromBase64String(AuthorizationCode)))
                using (var cryptoStream =
                       new CryptoStream(memoryStream,
                           rijndaelManaged.CreateDecryptor(key, iv),
                           CryptoStreamMode.Read))
                {
                    return new StreamReader(cryptoStream).ReadToEnd();
                }
            }


Hope this helps.
