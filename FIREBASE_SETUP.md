# Firebase 연동 설정 가이드

## 1. 연동 상태 확인

- **npm**: `firebase` 패키지 설치됨 ✅
- **환경 변수**: `.env`에 Firebase 키 설정됨 ✅
- **"Missing or insufficient permissions"** = Firestore까지 요청은 도달했지만, **보안 규칙** 때문에 막힌 상태입니다.

## 2. Firestore 보안 규칙 적용 (필수)

Firebase 콘솔에서 규칙을 한 번 설정해야 읽기/쓰기가 됩니다.

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 **yongsangu-user** 선택
3. 왼쪽 메뉴 **Build** → **Firestore Database** 클릭
4. 상단 **규칙(Rules)** 탭 클릭
5. 아래 규칙으로 **전체 교체** 후 **게시** 버튼 클릭

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /instructors/{instructorId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /timetableUrls/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

- **instructors**: 비로그인 사용자도 강사 목록 조회 가능, 로그인한 관리자만 등록/수정/삭제
- **timetableUrls**: 시간표 URL 조회는 모두 가능, 등록/수정/삭제는 로그인한 관리자만

## 3. (선택) Firebase CLI로 규칙 배포

로컬에 `firestore.rules` 파일을 두고 CLI로 배포할 수도 있습니다.

```bash
npm install -g firebase-tools
firebase login
firebase init firestore   # 기존 프로젝트 연결 시 덮어쓰기 주의
firebase deploy --only firestore:rules
```

프로젝트 루트에 `firestore.rules` 파일이 있으므로, `firebase init` 시 해당 파일 경로를 지정하면 됩니다.
