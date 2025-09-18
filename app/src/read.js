module.exports = async function read(products){
  const all = await products.find({}).toArray();
  console.table(all.map(({_id, ...rest}) => rest));
};
