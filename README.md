# Playwright MCP 예제 프로젝트

이 프로젝트는 Model Context Protocol (MCP)을 사용하여 Playwright를 제어하는 예제입니다. React + TypeScript + Vite로 구축되었으며, 웹 브라우저 자동화 기능을 MCP를 통해 제공합니다.

## 🚀 기능

- **브라우저 제어**: Chromium 브라우저 시작/종료
- **페이지 탐색**: URL로 이동 및 페이지 제목 가져오기
- **요소 조작**: CSS 선택자를 사용한 요소 클릭
- **텍스트 입력**: 폼 요소에 텍스트 입력
- **텍스트 추출**: 페이지 요소에서 텍스트 가져오기
- **스크린샷**: 현재 페이지 캡처

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

### MCP 서버 실행

```bash
npm run mcp-server
```

### 프로덕션 빌드

```bash
npm run build
npm run preview
```

## 🔧 MCP 도구

### 1. launch_browser

새 브라우저를 시작합니다.

**매개변수:**

- `headless` (boolean, 선택사항): 헤드리스 모드로 실행할지 여부 (기본값: false)

**예시:**

```json
{
  "name": "launch_browser",
  "arguments": {
    "headless": false
  }
}
```

### 2. navigate_to

지정된 URL로 이동합니다.

**매개변수:**

- `url` (string, 필수): 이동할 URL

**예시:**

```json
{
  "name": "navigate_to",
  "arguments": {
    "url": "https://example.com"
  }
}
```

### 3. click_element

지정된 선택자로 요소를 클릭합니다.

**매개변수:**

- `selector` (string, 필수): 클릭할 요소의 CSS 선택자

**예시:**

```json
{
  "name": "click_element",
  "arguments": {
    "selector": "button.submit-btn"
  }
}
```

### 4. type_text

지정된 요소에 텍스트를 입력합니다.

**매개변수:**

- `selector` (string, 필수): 텍스트를 입력할 요소의 CSS 선택자
- `text` (string, 필수): 입력할 텍스트

**예시:**

```json
{
  "name": "type_text",
  "arguments": {
    "selector": "input[name='username']",
    "text": "testuser"
  }
}
```

### 5. get_text

지정된 요소의 텍스트를 가져옵니다.

**매개변수:**

- `selector` (string, 필수): 텍스트를 가져올 요소의 CSS 선택자

**예시:**

```json
{
  "name": "get_text",
  "arguments": {
    "selector": "h1.title"
  }
}
```

### 6. take_screenshot

현재 페이지의 스크린샷을 찍습니다.

**매개변수:**

- `path` (string, 선택사항): 스크린샷을 저장할 경로 (기본값: screenshot.png)

**예시:**

```json
{
  "name": "take_screenshot",
  "arguments": {
    "path": "my-screenshot.png"
  }
}
```

### 7. close_browser

브라우저를 닫습니다.

**매개변수:** 없음

**예시:**

```json
{
  "name": "close_browser"
}
```

## 📁 프로젝트 구조

```
playwright-mcp-example/
├── src/
│   ├── components/
│   │   ├── PlaywrightMCPDemo.tsx    # 메인 데모 컴포넌트
│   │   └── PlaywrightMCPDemo.css    # 데모 컴포넌트 스타일
│   ├── App.tsx                      # 메인 앱 컴포넌트
│   └── main.tsx                     # 앱 진입점
├── mcp-server.ts                     # MCP 서버 메인 파일
├── playwright-mcp.ts                 # Playwright MCP 구현
├── package.json                      # 프로젝트 설정
└── README.md                         # 프로젝트 문서
```

## 🔌 MCP 서버 설정

MCP 클라이언트에서 이 서버를 사용하려면 다음과 같이 설정하세요:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npm",
      "args": ["run", "mcp-server"],
      "cwd": "/path/to/playwright-mcp-example"
    }
  }
}
```

## 🧪 테스트

1. 개발 서버를 시작합니다: `npm run dev`
2. 브라우저에서 데모 페이지를 엽니다
3. 각 기능을 순서대로 테스트합니다:
   - 브라우저 시작
   - URL로 이동
   - 요소 클릭
   - 텍스트 입력
   - 텍스트 가져오기
   - 스크린샷 찍기
   - 브라우저 닫기

## 🐛 문제 해결

### 브라우저가 시작되지 않는 경우

- Playwright가 올바르게 설치되었는지 확인: `npx playwright install chromium`
- 시스템 권한을 확인하세요

### MCP 서버 연결 오류

- TypeScript 컴파일 오류가 있는지 확인: `npm run mcp-server:build`
- 의존성이 올바르게 설치되었는지 확인: `npm install`

## 📝 라이선스

MIT License

## 🤝 기여

버그 리포트나 기능 제안은 이슈를 통해 제출해 주세요. 풀 리퀘스트도 환영합니다!

## 📚 추가 자료

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Playwright 공식 문서](https://playwright.dev/)
- [React 공식 문서](https://react.dev/)
- [Vite 공식 문서](https://vitejs.dev/)
