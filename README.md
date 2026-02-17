# 용산구시설관리공단 강사 관리 시스템

시설별·종목별 강사 명단 조회 및 관리자용 강사 등록/수정/삭제를 지원하는 웹 애플리케이션입니다.

---

## 기술 스택

- **프론트엔드**: React 18, TypeScript, Vite
- **스타일**: Tailwind CSS 4, Radix UI
- **백엔드/인증**: Firebase (Firestore, Authentication)
- **아이콘**: Lucide React

---

## 주요 기능

### 사용자(일반)
- **시설 선택**: 문화체육센터, 용산청소년센터, 꿈나무종합타운, 이태원초등학교수영장, 한강로피트니스센터, 원효로다목적체육관
- **시설별 종목 선택**: 시설에 따라 제공 종목만 표시 (수영, 헬스, 생활체육, 기구필라테스, 문화강좌, 서킷핏 등)
- **종목별 강사 찾기**: 시설 없이 종목만 선택해 전체 강사 조회
- **강사 명단**: 시설·종목 필터, 이름 정렬
- **강사 상세**: 이름, 직책, 센터, 종목, 성별, 주요 자격, 경력 사항

### 관리자(로그인 후)
- **Firebase 이메일/비밀번호 로그인**
- **강사 등록**: 이름, 근무 센터, 종목, 직책, 성별, 자격증, 경력
- **강사 수정/삭제**: Firestore 연동 CRUD

---

## 프로젝트 구조

```
src/
├── app/
│   ├── App.tsx                 # 메인 앱, 라우팅·상태
│   └── components/            # 화면 컴포넌트
│       ├── admin-dashboard.tsx
│       ├── center-selection.tsx
│       ├── category-selection.tsx
│       ├── category-overview.tsx
│       ├── instructor-gallery.tsx
│       ├── instructor-card.tsx
│       ├── instructor-detail-modal.tsx
│       ├── login-dialog.tsx
│       ├── navbar.tsx
│       └── ui/                 # 공통 UI (Radix 기반)
├── lib/
│   ├── firebase.ts            # Firebase 초기화
│   ├── firebase-mock.ts       # 시설·종목 목록 및 시설별 종목 매핑
│   ├── types.ts               # Instructor, Center, Category 타입
│   ├── auth-context.tsx       # 로그인 상태·signIn/signOut
│   └── instructor-service.ts  # Firestore 강사 CRUD
├── main.tsx
└── styles/
```

---

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 만들고 Firebase 설정을 넣습니다.

```bash
cp .env.example .env
```

`.env` 예시 (값은 Firebase 콘솔에서 확인):

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Firebase 설정

- **Authentication**: 이메일/비밀번호 사용 설정 후 관리자 계정 생성
- **Firestore**: 보안 규칙 적용 (강사 목록 읽기/쓰기 허용)

자세한 절차는 [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)를 참고하세요.

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 표시되는 주소(예: `http://localhost:5173`)로 접속합니다.

### 5. 프로덕션 빌드

```bash
npm run build
```

빌드 결과는 `dist/` 폴더에 생성됩니다.

---

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | Vite 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |

---

## 시설·종목 데이터

시설 목록과 시설별 종목 구성은 `src/lib/firebase-mock.ts`에서 관리합니다.  
주소·전화번호 변경, 시설/종목 추가·수정은 해당 파일을 편집하면 됩니다.

---

## 라이선스

Private. 용산구시설관리공단 관련 프로젝트용입니다.
