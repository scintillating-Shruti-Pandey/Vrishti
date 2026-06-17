const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const Product = require('./models/Product');
    const products = await Product.find({}).sort({ _id: -1 });
    
    const groups = {
      'Women': [],
      'Men': [],
      'Boys': [],
      'Girls': [],
      'Unisex': []
    };
    
    products.forEach(p => {
      if (groups[p.gender]) {
        groups[p.gender].push(p);
      } else {
        groups['Unisex'].push(p);
      }
    });
    
    const interleaved = [];
    let hasMore = true;
    while(hasMore) {
      hasMore = false;
      for (const gender of ['Women', 'Men', 'Girls', 'Boys', 'Unisex']) {
        if (groups[gender].length > 0) {
          interleaved.push(groups[gender].shift());
          hasMore = true;
        }
      }
    }
    
    const now = Date.now();
    for (let i = 0; i < interleaved.length; i++) {
      const p = interleaved[i];
      const newDate = new Date(now - i * 60000); // 1 minute apart
      
      await Product.collection.updateOne({ _id: p._id }, { $set: { createdAt: newDate } });
    }
    
    console.log('Successfully interleaved ' + interleaved.length + ' products with updateOne!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
