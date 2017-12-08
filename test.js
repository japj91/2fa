var speakeasy = require("speakeasy");



// Generate a secret key.
var secret = speakeasy.generateSecret({length: 20});
// Access using secret.ascii, secret.hex, or secret.base32.

var token = speakeasy.totp({
    secret: secret.base32,
    encoding: 'base32'
});

var tokenValidates = speakeasy.totp.verify({
    secret: secret.base32,
    encoding: 'base32',
    token: '123456',
    window: 6
});


var QRCode = require('qrcode');

// Get the data URL of the authenticator URL
QRCode.toDataURL(secret.otpauth_url, function(err, data_url) {
    console.log(secret.otpauth_url);
    var jap = secret.base32;
    // Display this data URL to the user in an <img> tag
    // Example:n
    res.send('<img src="' + data_url + '">');
});



// seems like store the token (the secret.base32) then use that base to create a token
// going to need to create a web page where user scans verifies
// then re create the token based on the user.