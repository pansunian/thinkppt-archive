import { createHmac } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import https from 'node:https';
import path from 'node:path';

const accessKeyId = process.env.ALIYUN_ACCESS_KEY_ID;
const accessKeySecret = process.env.ALIYUN_ACCESS_KEY_SECRET;
const bucket = process.env.ALIYUN_OSS_BUCKET || 'thinkppt';
const endpoint = process.env.ALIYUN_OSS_ENDPOINT || 'oss-cn-shanghai.aliyuncs.com';
const objectKey = process.env.ALIYUN_OSS_INDEX_OBJECT || 'index.html';
const sourcePath = process.env.ALIYUN_OSS_INDEX_SOURCE || path.join(process.cwd(), 'dist', 'index.html');

function requireEnv(name, value) {
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
}

function sign(stringToSign) {
  return createHmac('sha1', accessKeySecret).update(stringToSign).digest('base64');
}

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseBody = '';
      res.setEncoding('utf8');
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`OSS index upload failed ${res.statusCode}: ${responseBody.slice(0, 500)}`));
          return;
        }
        resolve(responseBody);
      });
    });

    req.on('error', reject);
    req.end(body);
  });
}

async function main() {
  requireEnv('ALIYUN_ACCESS_KEY_ID', accessKeyId);
  requireEnv('ALIYUN_ACCESS_KEY_SECRET', accessKeySecret);

  const body = await readFile(sourcePath);
  const host = `${bucket}.${endpoint}`;
  const date = new Date().toUTCString();
  const contentType = 'text/html';
  const canonicalizedResource = `/${bucket}/${objectKey}`;
  const stringToSign = [
    'PUT',
    '',
    contentType,
    date,
    canonicalizedResource,
  ].join('\n');
  const authorization = `OSS ${accessKeyId}:${sign(stringToSign)}`;

  await request({
    method: 'PUT',
    hostname: host,
    path: `/${encodeURI(objectKey)}`,
    headers: {
      Authorization: authorization,
      Date: date,
      Host: host,
      'Content-Type': contentType,
      'Content-Length': body.length,
      'Cache-Control': 'no-cache',
      'Content-Disposition': 'inline',
    },
  }, body);

  console.log(`Uploaded OSS index with inline metadata: ${objectKey}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
