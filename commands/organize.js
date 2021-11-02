let fs = require("fs");
let path = require("path");

let types = {
    archives: ["zip", "rar", "tar", "7z", "iso", "ar", "xz"],
    media: ["mp4", "mkv"],
    documents: ["docx", "doc", "pdf", "xlsx", "odt", "ods", "odp", "txt", "ps", "tex"],
    app: ["exe", "dmg", "pkg", "deb"],
    photos: ["jpg", "jpeg", "png"]
}

function organizeFn(dirPath) {
    let destPath;
    if (dirPath == undefined) {
        console.log("Enter the path first");
        return;
    } else {
        let doesExist = fs.existsSync(dirPath);
        if (doesExist) {
            destPath = path.join(dirPath, "organized_files");
            if (fs.existsSync(destPath) == false) {
                fs.mkdirSync(destPath);
            }
            organizeHelper(dirPath, destPath);
        } else {
            console.log("Kindly enter the corect path");
            return;
        }
    }
}

function organizeHelper(src, dest) {
    let childNames = fs.readdirSync(src);
    for (let i = 0; i < childNames.length; i++) {
        let childAddress = path.join(src, childNames[i]);
        let isFile = fs.lstatSync(childAddress).isFile();
        if (isFile) {
            let category = getCategory(childNames[i]);
            sendFiles(childAddress, dest, category);
        }
    }
}

function getCategory(name) {
    let ext = path.extname(name);
    ext = ext.slice(1);
    for (let type in types) {
        let cTypeArray = types[type];
        for (let i = 0; i < cTypeArray.length; i++) {
            if (ext == cTypeArray[i]) {
                return type;
            }
        }
    }
    return "others";
}

function sendFiles(srcFilePath, dest, category) {
    let categoryPath = path.join(dest, category);
    if (fs.existsSync(categoryPath) == false) {
        fs.mkdirSync(categoryPath);
    }
    let fileName = path.basename(srcFilePath);
    let destPath = path.join(categoryPath, fileName);
    fs.copyFileSync(srcFilePath, destPath);
}

module.exports = {
    organizeKey: organizeFn
}