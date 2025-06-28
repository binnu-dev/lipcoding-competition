import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Alert } from '@mui/material';

function Matching({ user }) {
  const [requests, setRequests] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [mentorId, setMentorId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [open, setOpen] = useState(false);

  // 내 매칭 요청 목록 불러오기
  useEffect(() => {
    fetchRequests();
    if (user?.role === 'mentee') fetchMentors();
    // eslint-disable-next-line
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/matching', {
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      const data = await res.json();
      if (res.ok) setRequests(data);
      else setError(data.error || '불러오기 실패');
    } catch (e) {
      setError('서버 오류');
    }
    setLoading(false);
  };

  // 멘티: 멘토 리스트 불러오기(매칭 요청용)
  const fetchMentors = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/mentors');
      const data = await res.json();
      if (res.ok) setMentors(data);
    } catch {}
  };

  // 모달 열기
  const handleOpen = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); setMentorId(''); setMessage(''); setError(''); setSuccess(''); };

  // 매칭 요청 생성(멘티)
  const handleRequest = async (e) => {
    e && e.preventDefault();
    setError(''); setSuccess('');
    if (!mentorId) { setError('멘토를 선택하세요.'); return; }
    try {
      const res = await fetch('http://localhost:8080/api/matching', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ mentor_id: mentorId, message })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('요청 완료!');
        setMentorId(''); setMessage('');
        setOpen(false);
        fetchRequests();
      } else setError(data.error || '요청 실패');
    } catch {
      setError('서버 오류');
    }
  };

  // 요청 상태 변경(멘토: 수락/거절, 멘티: 취소)
  const handleStatus = async (id, status) => {
    setError(''); setSuccess('');
    try {
      const res = await fetch(`http://localhost:8080/api/matching/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('상태 변경 완료!');
        fetchRequests();
      } else setError(data.error || '상태 변경 실패');
    } catch {
      setError('서버 오류');
    }
  };

  return (
    <div>
      <h2>매칭 요청/관리</h2>
      {user?.role === 'mentee' && (
        <>
          <Button variant="contained" onClick={handleOpen} sx={{mb:2}}>멘토에게 매칭 요청</Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>멘토 매칭 요청</DialogTitle>
            <DialogContent>
              {error && <Alert severity="error" sx={{mb:1}}>{error}</Alert>}
              <TextField
                select
                label="멘토 선택"
                value={mentorId}
                onChange={e => setMentorId(e.target.value)}
                fullWidth
                margin="normal"
                required
              >
                <MenuItem value="">멘토 선택</MenuItem>
                {mentors.map(m => (
                  <MenuItem key={m.id} value={m.id}>{m.name} ({m.username})</MenuItem>
                ))}
              </TextField>
              <TextField
                label="요청 메시지 (선택)"
                value={message}
                onChange={e => setMessage(e.target.value)}
                fullWidth
                margin="normal"
                multiline
                rows={3}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>취소</Button>
              <Button onClick={handleRequest} variant="contained">저장</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      {loading && <div>로딩 중...</div>}
      {error && !open && <div style={{color:'red'}}>{error}</div>}
      {success && <div style={{color:'green'}}>{success}</div>}
      <ul>
        {requests.map(r => (
          <li key={r.id} style={{marginBottom:12, border:'1px solid #ccc', padding:8, borderRadius:6}}>
            <b>멘토:</b> {r.mentor_id} | <b>멘티:</b> {r.mentee_id}<br/>
            <span>상태: {r.status}</span> | <span>메시지: {r.message}</span><br/>
            <span>요청일: {r.created_at}</span>
            {user?.role === 'mentee' && r.status === 'pending' && (
              <Button onClick={() => handleStatus(r.id, 'cancelled')} sx={{ml:1}} size="small" variant="outlined">요청 취소</Button>
            )}
            {user?.role === 'mentor' && r.status === 'pending' && (
              <>
                <Button onClick={() => handleStatus(r.id, 'accepted')} sx={{ml:1}} size="small" variant="contained">수락</Button>
                <Button onClick={() => handleStatus(r.id, 'rejected')} sx={{ml:1}} size="small" variant="outlined" color="error">거절</Button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Matching;
