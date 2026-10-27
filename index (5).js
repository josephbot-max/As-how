#!/usr/bin/env node
const { execSync, execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const config = {"BOT_NAME":"JOSEPH BOT","PREFIX":".","OWNER_NUMBER":"2348155270449","PAIR_NUMBER":"2348155270449","WORK_MODE":"private","MENU_DESIGN":"pasqua","SESSION_ID":"Pasqua~BJ5Lg5vxP4x0m0yy","PAIR_SITE_URL":"https://pair-site-91ob.onrender.com"};
const REPO = 'https://github.com/pasquawisdom2007-beep/SUKUNA_MD.git';
const ARCHIVE = 'https://codeload.github.com/pasquawisdom2007-beep/SUKUNA_MD/tar.gz/refs/heads/main';
const rootDir = path.join(process.cwd(), '.sukuna-md-runtime');

try {
  console.log('[SUKUNA] Downloading SUKUNA MD...');
  const runtimePackage = path.join(rootDir, 'package.json');
  if (!fs.existsSync(runtimePackage)) {
    if (fs.existsSync(rootDir)) fs.rmSync(rootDir, { recursive: true, force: true });
    console.log('[SUKUNA] First run: cloning SUKUNA MD...');
    try {
      execFileSync('git', ['-c', 'http.version=HTTP/1.1', '-c', 'http.lowSpeedLimit=1000', '-c', 'http.lowSpeedTime=30', 'clone', '--depth', '1', '--single-branch', '--no-tags', '--progress', REPO, rootDir], { stdio: 'inherit', timeout: 180000, env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } });
    } catch (cloneError) {
      console.error('[SUKUNA] Git clone failed; using source archive:', cloneError.message);
      if (fs.existsSync(rootDir)) fs.rmSync(rootDir, { recursive: true, force: true });
      const archive = path.join(process.cwd(), '.sukuna-md-runtime.tar.gz');
      execFileSync('curl', ['-L', '--fail', '--silent', '--show-error', '--retry', '3', '--connect-timeout', '15', '--max-time', '120', ARCHIVE, '-o', archive], { stdio: 'inherit', timeout: 150000 });
      fs.mkdirSync(rootDir, { recursive: true });
      execFileSync('tar', ['-xzf', archive, '--strip-components=1', '-C', rootDir], { stdio: 'inherit', timeout: 60000 });
      fs.rmSync(archive, { force: true });
    }
  } else {
    console.log('[SUKUNA] Reusing existing SUKUNA MD runtime.');
  }
  const envText = Object.entries(config).map(([key, value]) => key + '=' + value).join('\n') + '\n';
  fs.writeFileSync(path.join(rootDir, '.env'), envText, { mode: '600' });
  const nodeModules = path.join(rootDir, 'node_modules');
  if (!fs.existsSync(nodeModules)) {
    console.log('[SUKUNA] First run: installing dependencies...');
    execSync('npm install --omit=dev', { cwd: rootDir, stdio: 'inherit' });
  } else {
    console.log('[SUKUNA] Dependencies already installed.');
  }
  console.log('[SUKUNA] Starting bot...');
  execSync('npm start', { cwd: rootDir, stdio: 'inherit', env: { ...process.env, ...config } });
} catch (error) { console.error('[SUKUNA] Setup failed:', error.message); process.exit(1); }
