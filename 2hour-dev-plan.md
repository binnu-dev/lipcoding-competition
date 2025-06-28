# 2시간 완성 멘토-멘티 매칭 앱 Step-by-Step 체크리스트 (제출 양식 연동)

## 진행 현황 (2025-06-28)
- [x] 0-1. 사용할 기술스택(Node.js+Express+SQLite) 결정
- [x] 0-2. 리포지토리/프로젝트명/참가자 정보(app-submit-template.md) 미리 작성
- [x] 0-3. 폴더/파일 구조(backend, frontend 등) 생성 및 주요 디렉토리/진입점 파일 생성
- [x] 1-1. User(멘토/멘티, 프로필, 이미지) 모델 설계
- [x] 1-2. 매칭 요청(멘티→멘토, 상태: 대기/수락/거절/취소) 모델 설계
- [x] 1-2-1. 멘토링 세션(MentoringSession) 모델 설계
- [x] 1-3. ERD 간단히 메모(README나 별도 파일)
- [x] DB 테이블 생성(schema.sql 작성)
- [x] 2-1. 회원가입/로그인(JWT 인증, role 구분) API 구현 (진행 중)

## STEP 0. 준비 (5분)
- [ ] 0-1. 사용할 기술스택(Node.js+Express+SQLite 또는 Python FastAPI+SQLite) 결정
- [ ] 0-2. 리포지토리/프로젝트명/참가자 정보(app-submit-template.md) 미리 작성
- [ ] 0-3. 폴더/파일 구조(backend, frontend 등) 생성

## STEP 1. DB 및 모델 설계 (10분)
- [ ] 1-1. User(멘토/멘티, 프로필, 이미지) 모델 설계
  - id: INTEGER, PK, 자동 증가
  - username: TEXT, 고유값
  - password: TEXT, 해시 저장
  - name: TEXT
  - role: TEXT ('mentor'/'mentee')
  - profile_image: TEXT
  - bio: TEXT
  - tech_stack: TEXT
  - mentoring_type: TEXT ('online'/'offline'/'both')
  - company: TEXT
  - gender: TEXT ('male'/'female'/'other')
  - mbti: TEXT (MBTI, 입력 안 하면 'unknown')
  - email: TEXT (이메일, 인증/알림용)
  - phone: TEXT (연락처, 선택 입력)
  - location: TEXT (지역/도시)
  - available_time: TEXT (멘토링 가능 시간대)
  - social_links: TEXT (SNS, 블로그 등, JSON 문자열)
  - is_active: BOOLEAN (활성/비활성)
  - last_login: DATETIME (마지막 로그인 시각)
  - tags: TEXT (관심사, 쉼표 구분)
  - created_at: DATETIME
  - updated_at: DATETIME
- [ ] 1-2. 매칭 요청(멘티→멘토, 상태: 대기/수락/거절/취소) 모델 설계
  - id: INTEGER, PK, 자동 증가
  - mentee_id: INTEGER, FK (User.id)
  - mentor_id: INTEGER, FK (User.id)
  - status: TEXT ('pending', 'accepted', 'rejected', 'cancelled')
  - message: TEXT (요청 메시지, 선택)
  - created_at: DATETIME
  - updated_at: DATETIME
- [ ] 1-2-1. 멘토링 세션(MentoringSession) 모델 설계
  - id: INTEGER, PK, 자동 증가
  - matching_request_id: INTEGER, FK (MatchingRequest.id)
  - mentor_id: INTEGER, FK (User.id)
  - mentee_id: INTEGER, FK (User.id)
  - schedule: DATETIME (멘토링 일정)
  - type: TEXT ('online'/'offline')
  - location: TEXT (오프라인 장소, 선택)
  - feedback: TEXT (후기/평가, 선택)
  - status: TEXT ('scheduled', 'in_progress', 'completed', 'cancelled')
  - created_at: DATETIME
  - updated_at: DATETIME
- [ ] 1-3. ERD 간단히 메모(README나 별도 파일)

## STEP 2. 백엔드 API 개발 (40분)
- [ ] 2-1. 회원가입/로그인(JWT 인증, role 구분) API 구현
- [ ] 2-2. 프로필 등록/수정(이미지 업로드 단순화) API 구현
- [ ] 2-3. 멘토 리스트 조회/검색/정렬 API 구현
- [ ] 2-4. 매칭 요청 생성/조회/수락/거절/취소 API 구현
- [ ] 2-5. Swagger/OpenAPI 문서 자동 생성 및 http://localhost:8080/swagger-ui, http://localhost:8080/v3/api-docs 경로 확인
- [ ] 2-6. 실행 명령어 및 경로(예: ./backend, npm install && npm start &) app-submit-template.md에 기록

## STEP 3. 프론트엔드 최소 UI 개발 (30분)
- [ ] 3-1. 로그인/회원가입 폼 구현
- [ ] 3-2. 멘토 리스트/검색/정렬 화면 구현
- [ ] 3-3. 프로필 등록/수정 화면 구현
- [ ] 3-4. 매칭 요청/수락/거절 버튼 구현
- [ ] 3-5. 역할별 화면 분기(멘토/멘티) 구현
- [ ] 3-6. 실행 명령어 및 경로(예: ./frontend, npm install && npm start &) app-submit-template.md에 기록
- [ ] 3-7. 앱 스크린샷 준비

## STEP 4. 제출 준비 및 문서화 (15분)
- [ ] 4-1. README에 실행법, 주요 기능, 테스트 계정 등 정리
- [ ] 4-2. app-submit-template.md에 제출 정보(참가자, 리포지토리, 스크린샷, 동영상, 실행 명령어, Swagger/OpenAPI URL 등) 모두 입력
- [ ] 4-3. 동영상/스크린샷 업로드 및 링크 확인

## STEP 5. 버퍼 및 최종 점검 (10분)
- [ ] 5-1. API/기능 빠르게 점검(테스트 계정, 주요 시나리오)
- [ ] 5-2. 제출 마감 시간 체크, 최종 제출

---

### 시간별 체크리스트

| 시간대         | 할 일                                 |
|----------------|--------------------------------------|
| 0:00~0:05      | STEP 0. 준비                         |
| 0:05~0:15      | STEP 1. DB 및 모델 설계              |
| 0:15~0:55      | STEP 2. 백엔드 API 개발              |
| 0:55~1:25      | STEP 3. 프론트엔드 UI 개발           |
| 1:25~1:40      | STEP 4. 제출 준비 및 문서화          |
| 1:40~2:00      | STEP 5. 버퍼 및 최종 점검            |

---

**팁:**
- 각 STEP별 체크박스를 하나씩 체크하며 진행
- app-submit-template.md 항목을 개발 중간마다 확인
- Swagger/OpenAPI 문서 자동 생성 기능 활용
- 실행 명령어/경로는 실제 동작 확인 후 복사
- 스크린샷/동영상은 제출 직전 최신 상태로 준비
- 요구사항 문서 체크리스트로 기능 빠짐없이 구현

---

### 특이사항/노트
- 회원가입/로그인(JWT 인증, role 구분) API 구현 단계로 진입
- DB 테이블 생성용 schema.sql 작성 및 저장 완료(backend/src/schema.sql)
- 매칭 요청(MatchingRequest)와 멘토링 세션(MentoringSession) 모델을 분리 설계함
- Node.js 기반 폴더 구조 및 진입점 파일(backend/src/app.js, db.js, frontend/src/App.js, index.js)까지 완료
- 요구사항 및 제출 양식(app-submit-template.md)에 맞춰 구조 설계함
- MBTI도 선택 입력 필드로 추가, 입력하지 않으면 'unknown'으로 저장
- User 모델 확장 필드(email, phone, location, available_time, social_links, is_active, last_login, tags 등) 모두 반영
- 다음 단계: DB 및 모델 설계 진행 예정
