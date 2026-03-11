const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const publicId = "megashop/products_digital/gxo2ppb7gpugqcjlxqme";
const format = "pdf";

const attachmentUrl = cloudinary.url(`${publicId}.${format}`, {
    secure: true,
    flags: "attachment",
    resource_type: "image",
    sign_url: true
});

console.log("Signed URL:");
console.log(attachmentUrl);

async function check() {
    const res = await fetch(attachmentUrl);
    console.log("Status:", res.status);
}
check();
