const { cloudinary } = require('./lib/helpers/cloudinary.js'); // Assuming we can run this using ts-node or transpiled

// Since we are running plain node, we might need to configure it manually here
const cloudinaryLib = require("cloudinary").v2;
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

cloudinaryLib.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function main() {
    try {
        const res = await cloudinaryLib.api.resource("megashop/products_digital/gxo2ppb7gpugqcjlxqme", { resource_type: "image" });
        console.log("IMAGE RESOURCE:", res);
    } catch (e) {
        console.log("NOT IMAGE:", e);
    }

    try {
        const res2 = await cloudinaryLib.api.resource("megashop/products_digital/gxo2ppb7gpugqcjlxqme", { resource_type: "raw" });
        console.log("RAW RESOURCE:", res2);
    } catch (e) {
        console.log("NOT RAW:", e);
    }
}

main();
