require('dotenv').config();
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const Product = require('./models/Product');

// config is automatically picked up from process.env.CLOUDINARY_URL

const uploadsDir = path.join(__dirname, 'uploads');

async function rescue() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({});
    console.log(`Found ${products.length} products to process.`);

    for (const product of products) {
      let updated = false;

      if (product.images && product.images.length > 0) {
        const newImages = [];
        for (const imgUrl of product.images) {
          if (imgUrl.startsWith('/uploads/')) {
            const filename = imgUrl.replace('/uploads/', '');
            const localPath = path.join(uploadsDir, filename);
            if (fs.existsSync(localPath)) {
              console.log(`Uploading ${filename}...`);
              const result = await cloudinary.uploader.upload(localPath, { folder: 'vrishti' });
              newImages.push(result.secure_url);
              updated = true;
            } else {
              newImages.push(imgUrl);
            }
          } else {
            newImages.push(imgUrl);
          }
        }
        product.images = newImages;
      }

      if (product.colors && product.colors.length > 0) {
        for (const color of product.colors) {
          if (color.images && color.images.length > 0) {
            const newColorImages = [];
            for (const imgUrl of color.images) {
              if (imgUrl.startsWith('/uploads/')) {
                const filename = imgUrl.replace('/uploads/', '');
                const localPath = path.join(uploadsDir, filename);
                if (fs.existsSync(localPath)) {
                  console.log(`Uploading color image ${filename}...`);
                  const result = await cloudinary.uploader.upload(localPath, { folder: 'vrishti' });
                  newColorImages.push(result.secure_url);
                  updated = true;
                } else {
                  newColorImages.push(imgUrl);
                }
              } else {
                newColorImages.push(imgUrl);
              }
            }
            color.images = newColorImages;
          }
        }
      }

      if (updated) {
        await product.save();
        console.log(`Updated product: ${product.name}`);
      }
    }

    console.log('Finished rescuing images!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

rescue();
