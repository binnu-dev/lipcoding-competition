import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Alert, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

function RegisterForm({ onRegister }) {
  const [form, setForm] = useState({ username: '', password: '', name: '', role: 'mentee', email: '' });
  const [error, setError] = useState('');
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        onRegister(data);
      } else {
        setError(data.message || '회원가입 실패');
      }
    } catch (err) {
      setError('서버 오류');
    }
  };
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Card sx={{ minWidth: 350, p: 2, borderRadius: 4, boxShadow: 6 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} align="center" color="primary.main" gutterBottom>회원가입</Typography>
          <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
            <TextField name="username" label="아이디" value={form.username} onChange={handleChange} fullWidth autoFocus />
            <TextField name="password" type="password" label="비밀번호" value={form.password} onChange={handleChange} fullWidth />
            <TextField name="name" label="이름" value={form.name} onChange={handleChange} fullWidth />
            <TextField name="email" label="이메일" value={form.email} onChange={handleChange} fullWidth />
            <FormControl fullWidth>
              <InputLabel>역할</InputLabel>
              <Select name="role" value={form.role} label="역할" onChange={handleChange}>
                <MenuItem value="mentee">멘티</MenuItem>
                <MenuItem value="mentor">멘토</MenuItem>
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 1 }}>회원가입</Button>
            {error && <Alert severity="error">{error}</Alert>}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default RegisterForm;
