// Nodejs encryption with CTR
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'Roy Fielding';

function decrypt(text){
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}

// outputs hello world
console.log("hi");
console.log(decrypt("6d6cc50e4ff16c20cbed53036f87a59587715f205180989111288751"));