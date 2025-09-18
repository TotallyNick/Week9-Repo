module.exports = async function add(products){
  const seed = [
    { id: 1, name: 'VisionX Ultra HD 50', description: '50” 4K panel', price: 649.00, units: 10 },
    { id: 2, name: 'NovaScreen OLED 55',  description: '55” OLED',     price: 1299.00, units: 5  },
    { id: 3, name: 'LumaTech Smart 43',   description: '43” Smart TV', price: 429.00,  units: 25 },
  ];
  // Simple validation for lengths
  for (const p of seed){
    p.name = String(p.name).slice(0,50);
    p.description = String(p.description).slice(0,255);
    p.price = Math.round(p.price * 100) / 100;
    p.units = parseInt(p.units, 10) || 0;
  }
  await products.insertMany(seed);
};
