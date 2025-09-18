const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017';
const DB_NAME = 'mydb';
const COLL = 'products';

const app = express();
app.use(cors());
app.use(bodyParser.json());

async function getCollection(){
  const client = new MongoClient(uri);
  await client.connect();
    const db = client.db(DB_NAME);
    return { client, products: db.collection(COLL) };
}

// (1) GET all products
app.get('/api/products', async (req, res) => {
  const { client, products } = await getCollection();
  try {
    const all = await products.find({}).toArray();
    res.json(all);
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally { await client.close(); }
});

// (2) POST add product — reject duplicate `id`
app.post('/api/products', async (req, res) => {
  const { id, name, description, price, units } = req.body || {};
  if (id == null || name == null || description == null || price == null || units == null){
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const clean = {
    id: (id != null ? Number(id): undefined),
    name: String(name).slice(0,50),
    description: String(description).slice(0,255),
    price: Math.round(Number(price) * 100)/100,
    units: parseInt(units,10) || 0
  };

const { client, products } = await getCollection();
  try {
    // If id not provided, assign next integer (max(id)+1)
    if (clean.id == null){
      const [maxDoc] = await products.find({}, { projection: { id: 1 } }).sort({ id: -1 }).limit(1).toArray();
      clean.id = ((maxDoc?.id ?? 0) + 1);
    }

    // Prevent duplicates just in case
    const exists = await products.findOne({ id: clean.id });
    if (exists) return res.status(409).json({ error: 'Duplicate id' });

    const result = await products.insertOne(clean);
    res.status(201).json({ _id: result.insertedId, ...clean });
  } catch (e) {
    res.status(500).json({ error: e.message });
  } finally { await client.close(); }
});

// (3) DELETE by Mongo ObjectID
app.delete('/api/products/:id', async (req, res) => {
  const _id = req.params.id;
  const { client, products } = await getCollection();
  try {
    const result = await products.deleteOne({ _id: new ObjectId(_id) });
    if (!result.deletedCount) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: 'Invalid ObjectID' });
  } finally { await client.close(); }
});

// (4) PUT update by Mongo ObjectID
app.put('/api/products/:id', async (req, res) => {
  const _id = req.params.id;
  const patch = {};
  for (const key of ['id','name','description','price','units']){
    if (req.body[key] !== undefined) patch[key] = req.body[key];
  }
  if (patch.name)        patch.name = String(patch.name).slice(0,50);
  if (patch.description) patch.description = String(patch.description).slice(0,255);
  if (patch.price!=null) patch.price = Math.round(Number(patch.price)*100)/100;
  if (patch.units!=null) patch.units = parseInt(patch.units,10) || 0;

  const { client, products } = await getCollection();
  try {
    const result = await products.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      { $set: patch },
      { returnDocument: 'after' }
    );
    if (!result.value) return res.status(404).json({ error: 'Not found' });
    res.json(result.value);
  } catch (e) {
    res.status(400).json({ error: 'Invalid ObjectID' });
  } finally { await client.close(); }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
