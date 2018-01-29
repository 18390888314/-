var gm=require("gm");
var fs = require('fs')
module.exports=function (img,w,h,x,y,callback) {
    console.log(w+" "+h+" "+x+" "+y);
    gm("./head/"+img)
        .crop(w,h,x,y)
        .resize(200, 200,"!")
        .write("./head/"+img, function (err) {
            if (!err) {
                console.log('done');
                callback();
            }
        });
}
// resize and remove EXIF profile data
