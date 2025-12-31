const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

const dynamo = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1', 
});

const TABLE_NAME = 'Users';

// CREATE user
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const userId = uuidv4();
  const params = {
    TableName: TABLE_NAME,
    Item: { userId, name, email }
  };

  try {
    await dynamo.put(params).promise();
    res.status(201).json({ userId, name, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ all users
app.get('/users', async (req, res) => {
  const params = { TableName: TABLE_NAME };

  try {
    const data = await dynamo.scan(params).promise();
    res.json(data.Items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ one user
app.get('/users/:id', async (req, res) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { userId: req.params.id }
  };

  try {
    const data = await dynamo.get(params).promise();
    if (!data.Item) return res.status(404).json({ error: 'User not found' });
    res.json(data.Item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE user
app.put('/users/:id', async (req, res) => {
  const { name, email } = req.body;
  const params = {
    TableName: TABLE_NAME,
    Key: { userId: req.params.id },
    UpdateExpression: 'set #n = :n, email = :e',
    ExpressionAttributeNames: { '#n': 'name' },
    ExpressionAttributeValues: { ':n': name, ':e': email },
    ReturnValues: 'ALL_NEW'
  };

  try {
    const data = await dynamo.update(params).promise();
    res.json(data.Attributes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE user
app.delete('/users/:id', async (req, res) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { userId: req.params.id }
  };

  try {
    await dynamo.delete(params).promise();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
