const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
	const params = {
		TableName: process.env.TABLE_NAME,
		Key: {
			id: "1",
		},
	};

	const result = await dynamoDB.get(params).promise();

	return result.Item;
};
