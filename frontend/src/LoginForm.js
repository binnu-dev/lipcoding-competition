import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Alert, Box } from '@mui/material';

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data);
      } else {
        setError(data.message || '로그인 실패');
      }
    } catch (err) {
      setError('서버 오류');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Card sx={{ minWidth: 350, p: 2, borderRadius: 4, boxShadow: 6 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} align="center" color="primary.main" gutterBottom>로그인</Typography>
          <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
            <TextField label="아이디" value={username} onChange={e => setUsername(e.target.value)} fullWidth autoFocus />
            <TextField label="비밀번호" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth />
            <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 1 }}>로그인</Button>
            {error && <Alert severity="error">{error}</Alert>}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginForm;
