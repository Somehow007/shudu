#!/bin/bash

# 项目部署脚本
# 用于自动更新云服务器上的项目版本

# 配置变量
PROJECT_DIR="~/project/shudu"  # 替换为你的项目目录
GITHUB_REPO="your-github-repo-url"  # 替换为你的 GitHub 仓库 URL
BRANCH="main"  # 替换为你要部署的分支

# 颜色输出
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${YELLOW}开始部署项目...${NC}"

# 进入项目目录
cd "$PROJECT_DIR" || {
  echo -e "${RED}错误：无法进入项目目录${NC}"
  exit 1
}

# 拉取最新代码
echo -e "${GREEN}拉取最新代码...${NC}"
git pull origin "$BRANCH"
if [ $? -ne 0 ]; then
  echo -e "${RED}错误：拉取代码失败${NC}"
  exit 1
fi

# 安装依赖
echo -e "${GREEN}安装依赖...${NC}"
pnpm install
if [ $? -ne 0 ]; then
  echo -e "${RED}错误：安装依赖失败${NC}"
  exit 1
fi

# 构建项目
echo -e "${GREEN}构建项目...${NC}"
pnpm run build
if [ $? -ne 0 ]; then
  echo -e "${RED}错误：构建项目失败${NC}"
  exit 1
fi

# 复制构建结果到部署目录
echo -e "${GREEN}复制构建结果到部署目录...${NC}"
sudo cp -r apps/web/dist/* /var/www/simple-game/
if [ $? -ne 0 ]; then
  echo -e "${RED}错误：复制构建结果失败${NC}"
  exit 1
fi

# 重启 nginx 服务（如果需要）
echo -e "${GREEN}重启 nginx 服务...${NC}"
sudo systemctl restart nginx
if [ $? -ne 0 ]; then
  echo -e "${YELLOW}警告：重启 nginx 服务失败${NC}"
fi

echo -e "${GREEN}部署完成！项目已更新到最新版本${NC}"
