// const AWS = require('aws-sdk');

// AWS.config.update({ region: 'us-east-1' });

// const dynamodb = new AWS.DynamoDB({
//   region: 'us-east-1',
// //   endpoint: 'http://localhost:8000'
// });

// const params = {
//   TableName: 'Users',
//   KeySchema: [
//     { AttributeName: 'userId', KeyType: 'HASH' } // Partition key
//   ],
//   AttributeDefinitions: [
//     { AttributeName: 'userId', AttributeType: 'S' }
//   ],
//   ProvisionedThroughput: {
//     ReadCapacityUnits: 5,
//     WriteCapacityUnits: 5
//   }
// };

// dynamodb.createTable(params, (err, data) => {
//   if (err) console.error("Unable to create table:", err);
//   else console.log("Created table:", data.TableDescription.TableName);
// });
const AWS = require('aws-sdk');

// 1️⃣ Configure AWS region (credentials come from aws configure)
AWS.config.update({ region: 'us-east-1' });

// 2️⃣ Create DynamoDB client (NO endpoint = AWS cloud)
const dynamodb = new AWS.DynamoDB();

// 3️⃣ Table definition
const params = {
  TableName: 'Users',
  KeySchema: [
    { AttributeName: 'userId', KeyType: 'HASH' }
  ],
  AttributeDefinitions: [
    { AttributeName: 'userId', AttributeType: 'S' }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
};

// 4️⃣ Create table in AWS
dynamodb.createTable(params, (err, data) => {
  if (err) {
    if (err.code === 'ResourceInUseException') {
      console.log('Table "Users" already exists in AWS');
    } else {
      console.error('Unable to create table:', err);
    }
  } else {
    console.log('Created table:', data.TableDescription.TableName);
  }
});
