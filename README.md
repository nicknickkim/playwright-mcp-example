# Playwright MCP 예제 프로젝트

이 프로젝트는 Playwright MCP 서버를 사용하여 결제 화면을 테스트 하기위한 예제입니다.

React + TypeScript + Vite로 구축되었으며, 웹 브라우저 자동화 기능을 MCP를 통해 제공합니다.

## 🛠️ 기술 스택

- **Frontend**: React 19 + TypeScript + Vite
- **Browser Automation**: Playwright
- **Protocol**: Model Context Protocol (MCP)
- **Build Tool**: Vite
- **Package Manager**: npm

## 📦 설치

1. 의존성 설치:

```bash
npm install
```

2. Playwright 브라우저 설치:

```bash
npx playwright install chromium
```

## 🚀 실행

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속하세요.

## 🔌 MCP 서버 설정

MCP 클라이언트에서 이 서버를 사용하려면 다음과 같이 설정하세요:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx @playwright/mcp"
    }
  }
}
```
