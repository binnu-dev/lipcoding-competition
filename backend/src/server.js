const express = require('express');
const bodyParser = require('body-parser');
const { router: authRouter } = require('./routes/auth');
const profileRouter = require('./routes/profile');
const mentorsRouter = require('./routes/mentors');
const matchingRouter = require('./routes/matching');
const menteesRouter = require('./routes/mentees');
const db = require('./db');
const fs = require('fs');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// DB 초기화 (테이블 없으면 생성)
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');
db.exec(schema, (err) => {
  if (err) console.error('DB 스키마 생성 오류:', err);
});

// Auth 라우터 연결
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/mentors', mentorsRouter);
app.use('/api/matching', matchingRouter);
app.use('/api/mentees', menteesRouter);

app.get('/', (req, res) => {
  res.send('Mentor-Mentee Matching API');
});

// Swagger 설정
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mentor-Mentee Matching API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.js'],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 업로드된 이미지 정적 제공
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
