interface StatementOne {
  Action: string;
  Effect: string;
  Resource: any;
}
interface PolicyDocument {
  Version: string;
  Statement: StatementOne[];
}

interface AuthResponse {
  principalId: string;
  policyDocument:PolicyDocument
}

export const generatePolicy = (principalId: any, effect: string, resource) => {
  const authResponse = {} as AuthResponse;
  authResponse.principalId = principalId;
  
  if (effect && resource) {
    const policyDocument = {} as PolicyDocument;
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {} as StatementOne;
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  
  return authResponse
};