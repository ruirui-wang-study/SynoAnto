# SynoAnto Backend Service

基于 Go (Golang) + Gin + GORM + PostgreSQL 构建的后端服务。

## 1. 环境准备

由于检测到您的环境中尚未安装 Go，请先安装：

1.  **下载 Go**: 访问 [Go 官网](https://go.dev/dl/) 下载适用于 Windows 的安装包 (`.msi`) 并安装。
2.  **安装 PostgreSQL**: 推荐下载 [PostgreSQL Windows版](https://www.postgresql.org/download/windows/) 或者使用 Docker 运行 Postgres。
3.  **验证安装**: 打开新的终端窗口，运行 `go version` 确保安装成功。

## 2. 项目初始化

安装完 Go 后，请在 `SynoAnto-back` 目录下执行以下命令来下载依赖：

```powershell
cd SynoAnto-back
go mod tidy
```

## 3. 数据库配置

默认配置连接本地 PostgreSQL:
- Host: `localhost`
- Port: `5432`
- User: `postgres`
- Password: `postgres`
- DB Name: `synoanto` (你需要先创建这个数据库: `CREATE DATABASE synoanto;`)

你可以在 `internal/database/database.go` 中修改连接字符串 (DSN)。

## 4. 运行服务

```powershell
go run cmd/main.go
```

服务默认运行在 `http://localhost:8080`.

## 5. 接口预览

- **健康检查**: `GET /api/ping` -> `{"message": "pong"}`
- **查询单词**: `GET /api/word/:word` (会自动记录搜索日志)
- **热门趋势**: `GET /api/stats/trending` (返回搜索次数最多的单词)

## 6. 技术选型说明

- **Web 框架**: **Gin**
    - 理由: 高性能，轻量级，生态丰富，适合快速构建 RESTful API。
- **ORM 框架**: **GORM**
    - 理由: Go 语言社区事实标准的 ORM，对 PostgreSQL 支持极好，支持 `hooks`, `preload` 等高级功能。
    - **Key-Value 支持**: 我们使用了 PostgreSQL 的 **JSONB** 类型 (`DefinitionData` 字段) 来存储复杂的词典结构。这结合了关系型数据库的查询能力和 KV 数据库的灵活性，完全符合您的需求。
- **数据库**: **PostgreSQL**
    - 理由: 强大的关系型数据库，同时具备无与伦比的 JSON 处理能力。

## 7. 目录结构

```
SynoAnto-back/
├── cmd/
│   └── main.go           # 程序入口
├── internal/
│   ├── database/         # 数据库连接与迁移
│   ├── models/           # 数据模型 (User, DictionaryEntry)
│   └── routes/           # 路由定义与业务逻辑
└── go.mod                # 依赖定义
```
