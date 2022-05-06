 const AWS = require('aws-sdk');
 const dbb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });


 exports.handler = async (event, context, callback) => {
  let city, group, user;
  let data = null;
  let roles = { cities: [] };

  city = event.queryStringParameters.city
  group = event['requestContext']['authorizer']['claims']['cognito:groups']
  user=  event['requestContext']['authorizer']['claims']['username']

if(group!=='Admin'){
  var roleParams = {
   ExpressionAttributeValues: {
    ':g': group
   },
   KeyConditionExpression: 'roleid= :g',

   TableName: 'roleTable'
  };
  await dbb.query(roleParams).promise()
   .then(res => {
    roles = res.Items[0];
   })

  if (!roles.cities.some(x => x == city)) {
   return callback(null, {
    statusCode: 400,
    body: JSON.stringify({ error: "You dont have permission to fetch the weather" }),
    headers: {
     "Access-Control-Allow-Origin": "*",
    },
    });
  }
}
 
   var params = {
    ExpressionAttributeValues: {
     ':c': city
    },
    KeyConditionExpression: 'city= :c',

    TableName: 'weather'
   };

   await dbb.query(params).promise()
    .then(res => {
     if (res.Items.length >= 1)
      data = res.Items[0];
     else {
      callback(null, {
       statusCode: 400,
       body: JSON.stringify({ error: "No Data Found" }),
       headers: {
        "Access-Control-Allow-Origin": "*",
       },
      });
     }

    })

   if (data != null) {
    callback(null, {
     statusCode: 200,
     body: JSON.stringify(data),
     headers: {
      "Access-Control-Allow-Origin": "*",
     },

    });
   }

  
 }
 