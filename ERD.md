# ERD (Entity Relationship Diagram) - 간단 메모

```
[User]
  | id (PK)
  | ... (기타 프로필 필드)
   |\
   | \
   |  \ (1:N)
   |   \
   |    +-------------------+
   |                        |
[MatchingRequest]           |
  | id (PK)                 |
  | mentee_id (FK:User.id)  |
  | mentor_id (FK:User.id)  |
  | status                  |
  | ...                     |
   |\                       |
   | \ (1:1, accepted)      |
   |  +---------------------+
   |                        |
[MentoringSession]          |
  | id (PK)                 |
  | matching_request_id (FK:MatchingRequest.id)
  | mentor_id (FK:User.id)
  | mentee_id (FK:User.id)
  | schedule, type, ...
```

- User (1) — (N) MatchingRequest (멘티/멘토 모두 User.id 참조)
- MatchingRequest (1) — (0..1) MentoringSession (accepted 상태에서만 생성)
- MentoringSession은 mentor_id, mentee_id도 User.id 참조

---

| User                | MatchingRequest         | MentoringSession         |
|---------------------|------------------------|-------------------------|
| id (PK)             | id (PK)                | id (PK)                 |
| ...                 | mentee_id (FK:User)    | matching_request_id (FK) |
|                     | mentor_id (FK:User)    | mentor_id (FK:User)     |
|                     | status                 | mentee_id (FK:User)     |
|                     | ...                    | schedule, type, ...     |

- 관계: User 1:N MatchingRequest, MatchingRequest 1:1 MentoringSession
- 실제 ERD 다이어그램은 dbdiagram.io 등에서 시각화 가능
