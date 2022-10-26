import type { AWS } from '@serverless/typescript';


const serverlessConfiguration: AWS = {
  service: 'exportfinances',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dynamodb-local', 'serverless-offline' ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'sa-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["dynamodb:*"],
        Resource: ["*"]
      },
      {
        Effect: "Allow",
        Action: ["s3:*"],
        Resource: ["*"]
      }
    ]
  },
  
  // import the function via paths
  functions: { 
    exportTransactions: {
      handler: "src/functions/exportTransactions.handler",
      events: [
        {
          http: {
            path: 'export',
            method: 'post',
            cors: true
          }
        }
      ]
    }
   },
  package: { individually: false },
  useDotenv: true,
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      stages: ["dev", "local"],
      start: {
        port: 8000,
        inMemory: true,
        migrate: true
      }
    }
  },
  resources:{
    Resources: {
      dbUsersFile: {
        Type: "AWS::DynamoDB::Table",
        Properties:{
          TableName: "user_files_export",
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          },
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S"
            }
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: "HASH"
            }
          ]
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
