import axios from 'axios';

async function getTranscribeCredentials() {
    const getCredentialsUrl = '<GET CREDENTIALS API GATEWAY ENDPOINT>';
    const config = {
      method: 'post',
      url: getCredentialsUrl
    };

    const resp = await axios(config)
    console.log(resp);

    return resp.data;
}

export default function getCredentials() {
  return {
    'accessKeyId': 'AKIA5ZVGWSRJZ5UTHKFL',
    'secretAccessKey': '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',
    'region': 'us-east-1'
  }
}