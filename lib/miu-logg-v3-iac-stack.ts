import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
export class MiuLoggV3IacStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		// DynamoDB
		const table = new dynamodb.Table(this, "Table", {
			partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
		});

		// s3
		const bucket = new s3.Bucket(this, "MyFirstBucket");

		// lambda
		const helloLambda = new lambda.Function(this, "HelloHandler", {
			runtime: lambda.Runtime.NODEJS_16_X, // execution environment
			code: lambda.Code.fromAsset("lambda"), // code loaded from "lambda" directory
			handler: "hello.handler", // file is "hello", function is "handler"
		}).addEnvironment("TABLE_NAME", table.tableName);

		helloLambda.addToRolePolicy(
			new iam.PolicyStatement({
				effect: iam.Effect.ALLOW,
				actions: ["dynamodb:GetItem"],
				resources: [table.tableArn],
			})
		);

		// CICD
		new s3deploy.BucketDeployment(this, "LambdaDeployment", {
			sources: [s3deploy.Source.asset("lambda")],
			destinationBucket: bucket,
			destinationKeyPrefix: "lambda/",
		});
	}
}
