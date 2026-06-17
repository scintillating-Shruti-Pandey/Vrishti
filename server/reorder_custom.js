const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const Product = require('./models/Product');
    const products = await Product.find({});
    
    let topBoost = 0;
    let bottomPenalty = 0;
    const now = Date.now();
    const ONE_DAY = 24 * 60 * 60 * 1000;
    
    for (const p of products) {
      if (['Sarees', 'Gopi Dresses'].includes(p.category)) {
        // Boost them to the top (future date to guarantee they are newest)
        // Add a slight variance so they aren't all exactly the same ms
        const newDate = new Date(now + ONE_DAY + topBoost * 1000);
        await Product.collection.updateOne({ _id: p._id }, { $set: { createdAt: newDate } });
        topBoost++;
      } else if (['Shirts', 'Skirts'].includes(p.category)) {
        // Bury them to the bottom
        const newDate = new Date(now - ONE_DAY - bottomPenalty * 1000);
        await Product.collection.updateOne({ _id: p._id }, { $set: { createdAt: newDate } });
        bottomPenalty++;
      }
    }
    
    console.log(`Successfully boosted ${topBoost} products and buried ${bottomPenalty} products!`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
