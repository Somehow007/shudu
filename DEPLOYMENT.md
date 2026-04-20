# 项目部署指南

本指南将帮助你在云服务器上自动更新项目版本。

## 1. 准备工作

### 1.1 服务器要求
- Ubuntu 系统
- Node.js 20.0.0 或更高版本
- pnpm 包管理器
- Git
- Nginx

### 1.2 安装依赖

```bash
# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 pnpm
npm install -g pnpm

# 安装 Git
sudo apt-get install -y git

# 安装 Nginx
sudo apt-get install -y nginx
```

## 2. 部署脚本使用

### 2.1 配置脚本

1. 复制 `deploy.sh` 文件到你的服务器上
2. 修改脚本中的配置变量：

```bash
PROJECT_DIR="/path/to/your/project"  # 替换为你的项目目录
GITHUB_REPO="your-github-repo-url"  # 替换为你的 GitHub 仓库 URL
BRANCH="main"  # 替换为你要部署的分支
```

### 2.2 设置执行权限

```bash
chmod +x deploy.sh
```

### 2.3 手动运行脚本

```bash
./deploy.sh
```

## 3. 自动化部署方案

### 3.1 使用 Cron 定时执行

编辑 crontab 文件：

```bash
crontab -e
```

添加以下内容（每小时执行一次）：

```bash
0 * * * * /path/to/deploy.sh >> /path/to/deploy.log 2>&1
```

### 3.2 使用 GitHub Webhook

1. 在 GitHub 仓库中设置 Webhook：
   - 进入仓库 → Settings → Webhooks → Add webhook
   - Payload URL: `http://your-server-ip:3000/webhook`
   - Content type: `application/json`
   - Secret: 设置一个密钥
   - 选择触发事件：Push

2. 创建一个简单的 Node.js 服务器来接收 webhook：

```javascript
// webhook-server.js
const http = require('http');
const { exec } = require('child_process');
const crypto = require('crypto');

const SECRET = 'your-secret-key';
const DEPLOY_SCRIPT = '/path/to/deploy.sh';

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/webhook') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      const signature = req.headers['x-hub-signature-256'];
      const hmac = crypto.createHmac('sha256', SECRET);
      const digest = 'sha256=' + hmac.update(body).digest('hex');
      
      if (signature === digest) {
        console.log('Received valid webhook, starting deployment...');
        
        exec(DEPLOY_SCRIPT, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error: ${error.message}`);
            res.statusCode = 500;
            res.end('Deployment failed');
            return;
          }
          if (stderr) {
            console.error(`Stderr: ${stderr}`);
          }
          console.log(`Stdout: ${stdout}`);
          res.statusCode = 200;
          res.end('Deployment started');
        });
      } else {
        console.log('Invalid webhook signature');
        res.statusCode = 401;
        res.end('Unauthorized');
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Webhook server listening on port ${PORT}`);
});
```

3. 启动 webhook 服务器：

```bash
# 安装 pm2 来管理进程
npm install -g pm2

# 启动服务器
pm2 start webhook-server.js

# 设置开机自启
pm2 startup
pm2 save
```

## 4. Nginx 配置

创建 Nginx 配置文件：

```bash
sudo nano /etc/nginx/sites-available/your-project
```

添加以下内容：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/your/project/apps/web/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 如果使用 webhook，添加以下配置
    location /webhook {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置并重启 Nginx：

```bash
sudo ln -s /etc/nginx/sites-available/your-project /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 5. 故障排除

### 5.1 脚本执行失败
- 检查脚本权限：`chmod +x deploy.sh`
- 检查依赖是否安装：`pnpm --version`
- 检查 Git 仓库是否正确：`git remote -v`

### 5.2 Nginx 错误
- 检查 Nginx 配置：`sudo nginx -t`
- 查看 Nginx 日志：`sudo tail -f /var/log/nginx/error.log`

### 5.3 Webhook 问题
- 查看 webhook 服务器日志：`pm2 logs webhook-server`
- 检查 GitHub webhook 交付状态

## 6. 总结

通过本指南，你可以：
1. 使用 `deploy.sh` 脚本手动更新项目
2. 通过 Cron 定时自动更新
3. 通过 GitHub Webhook 实现代码推送时自动更新

选择最适合你的方案来保持项目的最新版本。
