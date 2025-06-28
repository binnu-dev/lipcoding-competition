import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Button, TextField, Avatar, Stack, Alert, CircularProgress } from '@mui/material';

function Profile({ user }) {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', next: '', next2: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/profile/me', {
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data);
        setForm(data);
        setImagePreview(data.profile_image_url || getDefaultImage(data.role));
      } else setError(data.error || '불러오기 실패');
    } catch {
      setError('서버 오류');
    }
    setLoading(false);
  };

  const getDefaultImage = (role) => {
    return role === 'mentor'
      ? 'https://placehold.co/500x500.jpg?text=MENTOR'
      : 'https://placehold.co/500x500.jpg?text=MENTEE';
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('jpg, png 파일만 업로드 가능합니다.');
      return;
    }
    if (file.size > 1024 * 1024) {
      setError('이미지 크기는 1MB 이하만 가능합니다.');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      let imageUrl = form.profile_image_url;
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const res = await fetch('http://localhost:8080/api/profile/me/image', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${user?.token}` },
          body: formData
        });
        const data = await res.json();
        if (res.ok) {
          imageUrl = data.url;
        } else {
          setError(data.error || '이미지 업로드 실패');
          return;
        }
      }
      const res = await fetch('http://localhost:8080/api/profile/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ ...form, profile_image_url: imageUrl })
      });
      if (res.ok) {
        setSuccess('수정 완료!');
        setEdit(false);
        setImageFile(null);
        fetchProfile();
      } else {
        const data = await res.json();
        setError(data.error || '수정 실패');
      }
    } catch {
      setError('서버 오류');
    }
  };

  const handlePwChange = e => {
    setPwForm({ ...pwForm, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwError(''); setPwSuccess('');
    if (!pwForm.current || !pwForm.next || !pwForm.next2) {
      setPwError('모든 항목을 입력하세요.');
      return;
    }
    if (pwForm.next !== pwForm.next2) {
      setPwError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      const res = await fetch('http://localhost:8080/api/profile/me/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ current_password: pwForm.current, new_password: pwForm.next })
      });
      const data = await res.json();
      if (res.ok) {
        setPwSuccess('비밀번호 변경 완료!');
        setShowPasswordForm(false);
        setPwForm({ current: '', next: '', next2: '' });
      } else {
        setPwError(data.error || '비밀번호 변경 실패');
      }
    } catch {
      setPwError('서버 오류');
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!profile) return null;

  return (
    <Card sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
      <CardContent>
        <Typography variant="h5" fontWeight={700} mb={2}>내 프로필</Typography>
        {success && <Alert severity="success" sx={{mb:2}}>{success}</Alert>}
        {pwSuccess && <Alert severity="success" sx={{mb:2}}>{pwSuccess}</Alert>}
        {pwError && <Alert severity="error" sx={{mb:2}}>{pwError}</Alert>}
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Avatar src={imagePreview || getDefaultImage(profile.role)} sx={{ width: 120, height: 120, mb: 1 }} />
          <Button variant="outlined" component="label" size="small" sx={{mt:1}}>
            이미지 업로드
            <input type="file" accept="image/png,image/jpeg" hidden onChange={handleImageChange} />
          </Button>
          <Typography variant="caption" color="text.secondary">PNG/JPG, 1MB 이하</Typography>
        </Box>
        {!edit ? (
          <Box>
            <Stack spacing={1} mb={2}>
              <Typography><b>이름:</b> {profile.name}</Typography>
              <Typography><b>아이디:</b> {profile.username}</Typography>
              <Typography><b>이메일:</b> {profile.email}</Typography>
              <Typography><b>기술스택:</b> {profile.tech_stack}</Typography>
              <Typography><b>MBTI:</b> {profile.mbti}</Typography>
              <Typography><b>회사:</b> {profile.company}</Typography>
              <Typography><b>지역:</b> {profile.location}</Typography>
              <Typography><b>가능시간:</b> {profile.available_time}</Typography>
              <Typography><b>태그:</b> {profile.tags}</Typography>
            </Stack>
            <Button variant="contained" onClick={() => setEdit(true)} sx={{mr:1}}>수정</Button>
            <Button variant="outlined" onClick={()=>{setShowPasswordForm(v=>!v); setPwError(''); setPwSuccess('')}}>비밀번호 변경</Button>
            {showPasswordForm && (
              <Box component="form" onSubmit={handlePasswordSubmit} mt={2}>
                <TextField type="password" name="current" value={pwForm.current} onChange={handlePwChange} label="현재 비밀번호" fullWidth margin="dense" />
                <TextField type="password" name="next" value={pwForm.next} onChange={handlePwChange} label="새 비밀번호" fullWidth margin="dense" />
                <TextField type="password" name="next2" value={pwForm.next2} onChange={handlePwChange} label="새 비밀번호 확인" fullWidth margin="dense" />
                <Stack direction="row" spacing={1} mt={1}>
                  <Button type="submit" variant="contained">변경</Button>
                  <Button type="button" variant="outlined" onClick={()=>{setShowPasswordForm(false); setPwForm({ current: '', next: '', next2: '' }); setPwError('');}}>취소</Button>
                </Stack>
              </Box>
            )}
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} mt={2}>
            <TextField name="name" value={form.name||''} onChange={handleChange} label="이름" fullWidth margin="dense" />
            <TextField name="email" value={form.email||''} onChange={handleChange} label="이메일" fullWidth margin="dense" />
            <TextField name="tech_stack" value={form.tech_stack||''} onChange={handleChange} label="기술스택" fullWidth margin="dense" />
            <TextField name="mbti" value={form.mbti||''} onChange={handleChange} label="MBTI" fullWidth margin="dense" />
            <TextField name="company" value={form.company||''} onChange={handleChange} label="회사" fullWidth margin="dense" />
            <TextField name="location" value={form.location||''} onChange={handleChange} label="지역" fullWidth margin="dense" />
            <TextField name="available_time" value={form.available_time||''} onChange={handleChange} label="가능시간" fullWidth margin="dense" />
            <TextField name="tags" value={form.tags||''} onChange={handleChange} label="태그(쉼표구분)" fullWidth margin="dense" />
            <Stack direction="row" spacing={1} mt={2}>
              <Button type="submit" variant="contained">저장</Button>
              <Button type="button" variant="outlined" onClick={()=>{setEdit(false);setForm(profile);setImageFile(null);setImagePreview(profile.profile_image_url||getDefaultImage(profile.role));}}>취소</Button>
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default Profile;
