import { APIGatewayAuthorizerHandler } from 'aws-lambda';
import * as jwt from 'jsonwebtoken'
import { generatePolicy } from 'src/utils/generatePolicy';

// Procurar melhor tipagem
export const handler: APIGatewayAuthorizerHandler = (event, context, callback) => {
  const token: string = event.authorizationToken;

  const tokenParts = token.split(' ');
  const tokenValue = tokenParts[1];

  if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
    // no auth token!
    return  {
      statusCode: 401,
      body: JSON.stringify({
        message: "Unauthorized",
      })
    }
  }
  
  jwt.verify(tokenValue, process.env.JWT_PRIVATE_SECRET, (err, decoded) => {

   if (err)
     return callback('Unauthorized');

   // if everything is good, save to request for use in other routes
   return callback(null, generatePolicy(decoded.sub, 'Allow', event.methodArn));
 })
}