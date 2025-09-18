module.exports = async function remove(products, filter){
  await products.deleteOne(filter);
};
