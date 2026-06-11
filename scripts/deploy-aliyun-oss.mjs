import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const cwd = process.cwd();
const distDir = path.join(cwd, 'dist');
const ossutilBin = process.env.ALIYUN_OSSUTIL_BIN || process.env.OSSUTIL_BIN || 'ossutil';
const bucket = process.env.ALIYUN_OSS_BUCKET;
const prefix = (process.env.ALIYUN_OSS_PREFIX || '').replace(/^\/+|\/+$/g, '');
const endpoint = process.env.ALIYUN_OSS_ENDPOINT;

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!existsSync(distDir)) {
  fail('dist directory not found. Run npm run build:aliyun first.');
}

if (!bucket) {
  fail('Missing ALIYUN_OSS_BUCKET.');
}

const target = prefix ? `oss://${bucket}/${prefix}/` : `oss://${bucket}/`;
const args = ['sync', `${distDir}/`, target, '--delete'];

if (endpoint) {
  args.push('-e', endpoint);
}

console.log(`Syncing ${distDir} to ${target}`);
const result = spawnSync(ossutilBin, args, {
  cwd,
  stdio: 'inherit',
});

if (result.error) {
  fail(`Failed to run ${ossutilBin}: ${result.error.message}`);
}

if (result.status !== 0) {
  process.exit(result.status || 1);
}

console.log('OSS sync complete.');
