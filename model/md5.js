var crypto=require("crypto");

module.exports=function (psd) {
    var md5=crypto.createHash("md5");
    var password=md5.update(""+psd).digest("base64");
    return password;

}