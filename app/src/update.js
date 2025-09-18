module.exports = async function update(products, filter, update){
  // Constrain float to 2dp if setting price
  if (update?.$set?.price !== undefined){
    update.$set.price = Math.round(update.$set.price * 100)/100;
  }
  await products.updateOne(filter, update);
};
