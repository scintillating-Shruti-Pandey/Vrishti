const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Product = require('../models/Product');

const sampleProducts = [
  // T-Shirts
  {
    name: 'Monsoon Breeze Cotton Tee',
    description: 'A lightweight cotton t-shirt perfect for the monsoon season. Features a relaxed fit with breathable fabric that keeps you comfortable all day. The subtle rain-drop pattern adds a unique touch.',
    price: 799,
    images: ['/images/seed/tshirt-1.jpg'],
    category: 'T-Shirts',
    gender: 'Men',
    ageGroup: 'Adults (20+)',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Forest Green', hex: '#228B22' }, { name: 'Sky Blue', hex: '#87CEEB' }],
    material: 'Cotton',
    brand: 'Vrishti',
    stock: 45,
    featured: true,
  },
  {
    name: 'Urban Glow Graphic Tee',
    description: 'Make a statement with this bold graphic tee featuring contemporary urban art. Made from premium cotton blend for ultimate comfort and durability.',
    price: 899,
    images: ['/images/seed/tshirt-2.jpg'],
    category: 'T-Shirts',
    gender: 'Unisex',
    ageGroup: 'Teens (13-19)',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [{ name: 'Black', hex: '#1a1a1a' }, { name: 'White', hex: '#FFFFFF' }],
    material: 'Cotton Blend',
    brand: 'Vrishti',
    stock: 60,
    featured: true,
  },
  {
    name: 'Petrichor V-Neck Tee',
    description: 'Inspired by the scent of rain on dry earth, this v-neck tee combines earthy tones with modern minimalism. Ultra-soft fabric with a tailored fit.',
    price: 699,
    images: ['/images/seed/tshirt-3.jpg'],
    category: 'T-Shirts',
    gender: 'Women',
    ageGroup: 'Adults (20+)',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Terracotta', hex: '#E2725B' }, { name: 'Sage', hex: '#9DC183' }],
    material: 'Cotton',
    brand: 'Vrishti',
    stock: 35,
    featured: false,
  },

  // Shirts
  {
    name: 'Cascade Linen Shirt',
    description: 'A premium linen shirt that flows like a waterfall. Perfect for both casual and semi-formal occasions. Features mother-of-pearl buttons and a Mandarin collar.',
    price: 1499,
    images: ['/images/seed/shirt-1.jpg'],
    category: 'Shirts',
    gender: 'Men',
    ageGroup: 'Adults (20+)',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Ivory', hex: '#FFFFF0' }, { name: 'Olive', hex: '#808000' }],
    material: 'Linen',
    brand: 'Vrishti',
    stock: 30,
    featured: true,
  },
  {
    name: 'Drizzle Check Shirt',
    description: 'Classic checkered pattern meets contemporary design. This slim-fit shirt is crafted from breathable cotton with a comfortable stretch.',
    price: 1299,
    images: ['/images/seed/shirt-2.jpg'],
    category: 'Shirts',
    gender: 'Men',
    ageGroup: 'Adults (20+)',
    sizes: ['M', 'L', 'XL'],
    colors: [{ name: 'Navy Blue', hex: '#000080' }, { name: 'Burgundy', hex: '#800020' }],
    material: 'Cotton',
    brand: 'Vrishti',
    stock: 25,
    featured: false,
  },

  // Dresses
  {
    name: 'Rainfall Maxi Dress',
    description: 'A flowing maxi dress that captures the grace of rainfall. Features a flattering A-line silhouette, adjustable straps, and a beautiful botanical print.',
    price: 2199,
    images: ['/images/seed/dress-1.jpg'],
    category: 'Dresses',
    gender: 'Women',
    ageGroup: 'Adults (20+)',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [{ name: 'Teal', hex: '#008080' }, { name: 'Coral', hex: '#FF7F50' }],
    material: 'Chiffon',
    brand: 'Vrishti',
    stock: 20,
    featured: true,
  },
  {
    name: 'Dewdrop Mini Dress',
    description: 'A chic mini dress with delicate embroidery inspired by morning dewdrops. Perfect for brunches and casual outings. Features a fitted bodice and flared skirt.',
    price: 1799,
    images: ['/images/seed/dress-2.jpg'],
    category: 'Dresses',
    gender: 'Women',
    ageGroup: 'Teens (13-19)',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Lavender', hex: '#E6E6FA' }, { name: 'Mint', hex: '#98FF98' }],
    material: 'Cotton Blend',
    brand: 'Vrishti',
    stock: 15,
    featured: true,
  },

  // Jeans
  {
    name: 'Thunderbolt Slim Jeans',
    description: 'Slim-fit jeans with just the right amount of stretch. Dark wash denim with a clean finish. Built to last through every adventure.',
    price: 1899,
    images: ['/images/seed/jeans-1.jpg'],
    category: 'Jeans',
    gender: 'Men',
    ageGroup: 'Adults (20+)',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Dark Indigo', hex: '#2B0057' }, { name: 'Charcoal', hex: '#36454F' }],
    material: 'Denim',
    brand: 'Vrishti',
    stock: 40,
    featured: false,
  },
  {
    name: 'Cloud Nine Mom Jeans',
    description: 'High-waisted mom jeans with a relaxed fit that feels like floating on clouds. Light wash with subtle distressing for an effortlessly cool look.',
    price: 1699,
    images: ['/images/seed/jeans-2.jpg'],
    category: 'Jeans',
    gender: 'Women',
    ageGroup: 'Adults (20+)',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [{ name: 'Light Blue', hex: '#ADD8E6' }, { name: 'White', hex: '#FFFFFF' }],
    material: 'Denim',
    brand: 'Vrishti',
    stock: 30,
    featured: true,
  },

  // Trousers
  {
    name: 'Mist Walker Chinos',
    description: 'Versatile chinos that transition seamlessly from office to weekend. Wrinkle-resistant fabric with a comfortable tapered fit.',
    price: 1599,
    images: ['/images/seed/trouser-1.jpg'],
    category: 'Trousers',
    gender: 'Men',
    ageGroup: 'Adults (20+)',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Khaki', hex: '#C3B091' }, { name: 'Navy', hex: '#000080' }],
    material: 'Cotton Twill',
    brand: 'Vrishti',
    stock: 35,
    featured: false,
  },
  {
    name: 'Nimbus Wide-Leg Trousers',
    description: 'Elegant wide-leg trousers with a high waist. Flowy fabric drapes beautifully, creating a sophisticated silhouette. Includes a matching fabric belt.',
    price: 1899,
    images: ['/images/seed/trouser-2.jpg'],
    category: 'Trousers',
    gender: 'Women',
    ageGroup: 'Adults (20+)',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Cream', hex: '#FFFDD0' }, { name: 'Black', hex: '#1a1a1a' }],
    material: 'Polyester Blend',
    brand: 'Vrishti',
    stock: 20,
    featured: false,
  },

  // Skirts
  {
    name: 'Puddle Splash Pleated Skirt',
    description: 'A playful pleated midi skirt that swirls like splashing puddles. Features an elastic waistband for comfortable wear and a charming accordion pleat design.',
    price: 1299,
    images: ['/images/seed/skirt-1.jpg'],
    category: 'Skirts',
    gender: 'Women',
    ageGroup: 'Teens (13-19)',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Blush Pink', hex: '#DE5D83' }, { name: 'Forest Green', hex: '#228B22' }],
    material: 'Georgette',
    brand: 'Vrishti',
    stock: 18,
    featured: false,
  },

  // Jackets
  {
    name: 'Storm Shield Denim Jacket',
    description: 'A rugged denim jacket built to weather any storm. Classic trucker silhouette with modern detailing. Sherpa-lined for extra warmth.',
    price: 2499,
    images: ['/images/seed/jacket-1.jpg'],
    category: 'Jackets',
    gender: 'Unisex',
    ageGroup: 'Adults (20+)',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Dark Wash', hex: '#1B3A4B' }, { name: 'Black', hex: '#1a1a1a' }],
    material: 'Denim',
    brand: 'Vrishti',
    stock: 25,
    featured: true,
  },
  {
    name: 'Zephyr Windbreaker',
    description: 'A lightweight windbreaker perfect for rainy days. Water-resistant outer shell with mesh lining. Packs into its own pocket for easy carrying.',
    price: 1999,
    images: ['/images/seed/jacket-2.jpg'],
    category: 'Jackets',
    gender: 'Unisex',
    ageGroup: 'Adults (20+)',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Emerald', hex: '#50C878' }, { name: 'Storm Grey', hex: '#708090' }],
    material: 'Nylon',
    brand: 'Vrishti',
    stock: 30,
    featured: false,
  },

  // Hoodies
  {
    name: 'Cloudburst Oversized Hoodie',
    description: 'An ultra-cozy oversized hoodie that wraps you like a warm cloud. Features a kangaroo pocket, brushed fleece interior, and embroidered Vrishti logo.',
    price: 1799,
    images: ['/images/seed/hoodie-1.jpg'],
    category: 'Hoodies',
    gender: 'Unisex',
    ageGroup: 'Teens (13-19)',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Heather Grey', hex: '#9E9E9E' }, { name: 'Moss Green', hex: '#8A9A5B' }],
    material: 'Fleece',
    brand: 'Vrishti',
    stock: 50,
    featured: true,
  },
  {
    name: 'Aurora Zip-Up Hoodie',
    description: 'A premium zip-up hoodie with gradient coloring inspired by the northern lights. Made from sustainable organic cotton with recycled polyester.',
    price: 2199,
    images: ['/images/seed/hoodie-2.jpg'],
    category: 'Hoodies',
    gender: 'Women',
    ageGroup: 'Adults (20+)',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Purple Dusk', hex: '#7B2D8E' }, { name: 'Ocean Blue', hex: '#0077B6' }],
    material: 'Organic Cotton',
    brand: 'Vrishti',
    stock: 20,
    featured: false,
  },

  // Ethnic Wear
  {
    name: 'Varsha Silk Kurta',
    description: 'An exquisite silk kurta inspired by the beauty of Indian monsoons. Hand-block printed with traditional motifs and finished with delicate thread work.',
    price: 2999,
    images: ['/images/seed/ethnic-1.jpg'],
    category: 'Ethnic Wear',
    gender: 'Women',
    ageGroup: 'Adults (20+)',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Saffron', hex: '#F4C430' }, { name: 'Royal Blue', hex: '#4169E1' }],
    material: 'Silk',
    brand: 'Vrishti',
    stock: 15,
    featured: true,
  },
  {
    name: 'Megha Cotton Kurta Set',
    description: 'A comfortable cotton kurta paired with matching palazzo pants. Cloud-like comfort meets elegant design. Perfect for festivals and daily wear.',
    price: 2499,
    images: ['/images/seed/ethnic-2.jpg'],
    category: 'Ethnic Wear',
    gender: 'Women',
    ageGroup: 'Adults (20+)',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Peach', hex: '#FFDAB9' }, { name: 'Sea Green', hex: '#2E8B57' }],
    material: 'Cotton',
    brand: 'Vrishti',
    stock: 25,
    featured: false,
  },
  {
    name: 'Baarish Nehru Jacket',
    description: 'A sophisticated Nehru jacket with subtle rain-inspired embroidery. Pairs perfectly with kurtas or even western shirts for a fusion look.',
    price: 1999,
    images: ['/images/seed/ethnic-3.jpg'],
    category: 'Ethnic Wear',
    gender: 'Men',
    ageGroup: 'Adults (20+)',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Maroon', hex: '#800000' }, { name: 'Navy', hex: '#000080' }],
    material: 'Cotton Silk',
    brand: 'Vrishti',
    stock: 20,
    featured: false,
  },

  // Activewear
  {
    name: 'Typhoon Training Shorts',
    description: 'High-performance training shorts with moisture-wicking technology. Built-in compression liner and zippered pocket for your essentials.',
    price: 999,
    images: ['/images/seed/active-1.jpg'],
    category: 'Activewear',
    gender: 'Men',
    ageGroup: 'Adults (20+)',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Black', hex: '#1a1a1a' }, { name: 'Electric Blue', hex: '#0892D0' }],
    material: 'Polyester',
    brand: 'Vrishti',
    stock: 40,
    featured: false,
  },
  {
    name: 'Nimbus Sports Bra',
    description: 'Medium-support sports bra with buttery-soft fabric. Features removable pads and adjustable straps for a perfect fit during any workout.',
    price: 899,
    images: ['/images/seed/active-2.jpg'],
    category: 'Activewear',
    gender: 'Women',
    ageGroup: 'Adults (20+)',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [{ name: 'Dusty Rose', hex: '#DCAE96' }, { name: 'Midnight', hex: '#191970' }],
    material: 'Nylon Spandex',
    brand: 'Vrishti',
    stock: 35,
    featured: false,
  },

  // Kids
  {
    name: 'Little Raindrop Dungaree',
    description: 'An adorable dungaree for little ones with cute raindrop embroidery. Soft, durable fabric that withstands playtime adventures. Adjustable shoulder straps.',
    price: 999,
    images: ['/images/seed/kids-1.jpg'],
    category: 'T-Shirts',
    gender: 'Kids',
    ageGroup: 'Kids (2-12)',
    sizes: ['XS', 'S', 'M'],
    colors: [{ name: 'Denim Blue', hex: '#1560BD' }, { name: 'Sunshine Yellow', hex: '#FFDA03' }],
    material: 'Cotton Denim',
    brand: 'Vrishti',
    stock: 30,
    featured: false,
  },
  {
    name: 'Rainbow Cloud T-Shirt',
    description: 'A fun and colorful t-shirt for kids featuring a rainbow peeking through clouds. Made from 100% organic cotton that is gentle on young skin.',
    price: 599,
    images: ['/images/seed/kids-2.jpg'],
    category: 'T-Shirts',
    gender: 'Kids',
    ageGroup: 'Kids (2-12)',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Light Pink', hex: '#FFB6C1' }],
    material: 'Organic Cotton',
    brand: 'Vrishti',
    stock: 50,
    featured: true,
  },

  // Accessories
  {
    name: 'Monsoon Bucket Hat',
    description: 'A stylish bucket hat for those rainy day adventures. Water-resistant exterior with a soft cotton lining. Packable and reversible design.',
    price: 599,
    images: ['/images/seed/accessory-1.jpg'],
    category: 'Accessories',
    gender: 'Unisex',
    ageGroup: 'Adults (20+)',
    sizes: ['M', 'L'],
    colors: [{ name: 'Olive', hex: '#808000' }, { name: 'Beige', hex: '#F5F5DC' }],
    material: 'Nylon',
    brand: 'Vrishti',
    stock: 60,
    featured: false,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('☁️  Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert sample products
    const created = await Product.insertMany(sampleProducts);
    console.log(`🌱 Seeded ${created.length} products successfully!`);

    console.log('\n📦 Products by category:');
    const categories = {};
    created.forEach((p) => {
      categories[p.category] = (categories[p.category] || 0) + 1;
    });
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDB();
