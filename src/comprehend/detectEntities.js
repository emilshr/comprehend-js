import AWS from 'aws-sdk';

export default async function detectEntities(text, clientCredentials) {
    const comprehend = new AWS.Comprehend(clientCredentials);

    if(text === undefined || text.replace(/\s/g,"") === "") return [];
    const resp = await comprehend.detectEntities({ Text: text, LanguageCode: 'en' }).promise();
    return resp.Entities;
}
