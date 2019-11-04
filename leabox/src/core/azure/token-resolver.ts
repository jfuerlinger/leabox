// const https = require('https');
// import { Settings } from '../settings';


// export class TokenResolver {

//     private _currentToken: string;
//     private _tokenIssued: Date;

//     getToken(): string {
//         if (!this._currentToken) {
//             this.issueNewToken();
//         }
//         return this._currentToken;
//     }

//     private issueNewToken(): Promise {
//         const options = {
//             hostname: Settings.URL_COGNITIVE_SERVICES_TOKEN,
//             port: 443,
//             path: '/sts/v1.0/issueToken',
//             method: 'POST',
//             headers: {
//                 'Ocp-Apim-Subscription-Key': Settings.SUBSCRIPTIONKEY_COGNITIVE_SERVICES,
//                 'Content-Type': 'application/x-www-form-urlencoded',
//                 'Content-Length': 0,
//                 'User-Agent': 'leabox',
//             }
//         };

//         const req = https.request(options, res => {
//             console.log(`statusCode: ${res.statusCode}`)
          
//             res.on('data', d => {
//               process.stdout.write(d)
//             })
//           })
          
//           req.on('error', error => {
//             console.error(error);
//           })
          
//           req.write('');
//           req.end();
//     }



// }