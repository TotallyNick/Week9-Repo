const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017';
const DB_NAME = 'mydb';
const COLL = 'products';

async function withDb(fn){
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    return await fn(db.collection(COLL), db);
  } finally {
    await client.close();
  }
}

(async () => {
  const add = require('./add');
  const read = require('./read');
  const update = require('./update');
  const remove = require('./remove');

  await withDb(async (products, db) => {
    // Drop collection before each run to avoid duplicates (as required)
    const colls = await db.listCollections({ name: COLL }).toArray();
    if (colls.length) await products.drop();

    // 1) Add at least 3
    await add(products);

    // 2) Read all
    console.log('All after add:');
    await read(products);

    // 3) Update one
    await update(products, { id: 2 }, { $set: { price: 1499.99, units: 7 } });
    console.log('All after update:');
    await read(products);

    // 4) Delete one
    await remove(products, { id: 3 });
    console.log('All after delete:');
    await read(products);
    });
})();
