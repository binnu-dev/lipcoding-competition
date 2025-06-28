import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Avatar, Button, Chip, CircularProgress, Alert } from '@mui/material';

function MenteeList({ user }) {
  const [mentees, setMentees] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    if (user?.role === 'mentor') {
      fetchMentees();
      fetchMyRequests();
    }
    // eslint-disable-next-line
  }, [user]);

  // 전체 멘티 목록
  const fetchMentees = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/mentees', {
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      const data = await res.json();
      if (res.ok) setMentees(data.mentees || data);
      else setError(data.error || '멘티 목록 불러오기 실패');
    } catch {
      setError('서버 오류');
    }
    setLoading(false);
  };

  // 나에게 온 매칭 요청(멘토 기준)
  const fetchMyRequests = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/matching', {
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) setMyRequests(data.filter(r => r.mentor_id === user.id && r.status === 'pending'));
      else setMyRequests([]);
    } catch {
      setMyRequests([]);
    }
  };

  // 요청 수락/거절
  const handleAction = async (requestId, status) => {
    setActionLoading(true);
    setActionError(''); setActionSuccess('');
    try {
      const res = await fetch(`http://localhost:8080/api/matching/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (res.ok) {
        setActionSuccess(status === 'accepted' ? '수락 완료!' : '거절 완료!');
        fetchMyRequests();
      } else setActionError(data.error || '처리 실패');
    } catch {
      setActionError('서버 오류');
    }
    setActionLoading(false);
  };

  // 나에게 온 요청 mentee id만 추출
  const requestedMenteeIds = myRequests.map(r => r.mentee_id);

  // 가장 상단에 나에게 신청한 멘티, 그 외 전체 멘티
  const menteesSorted = [
    ...mentees.filter(m => requestedMenteeIds.includes(m.id)),
    ...mentees.filter(m => !requestedMenteeIds.includes(m.id))
  ];

  return (
    <Box maxWidth={900} mx="auto" mt={4}>
      <Typography variant="h4" fontWeight={700} mb={3} align="center" color="primary.main">멘티 목록</Typography>
      {/* 나에게 온 매칭 요청 */}
      {myRequests.length > 0 && (
        <Card sx={{p:2, mb:3, bgcolor:'#f8fafc', border:'1px solid #e0e7ef'}}>
          <Typography fontWeight={700} mb={1}>나에게 온 매칭 요청</Typography>
          {myRequests.map(req => (
            <Box key={req.id} mb={1} display="flex" alignItems="center" gap={1}>
              <Chip label={`멘티: ${req.mentee_name || req.mentee_id}`} color="primary" />
              <Typography variant="body2" ml={1}>메시지: {req.message}</Typography>
              <Button size="small" color="success" variant="contained" sx={{ml:1}} onClick={()=>handleAction(req.id, 'accepted')} disabled={actionLoading}>수락</Button>
              <Button size="small" color="error" variant="outlined" sx={{ml:1}} onClick={()=>handleAction(req.id, 'rejected')} disabled={actionLoading}>거절</Button>
            </Box>
          ))}
          {actionError && <Alert severity="error" sx={{mt:1}}>{actionError}</Alert>}
          {actionSuccess && <Alert severity="success" sx={{mt:1}}>{actionSuccess}</Alert>}
        </Card>
      )}
      {loading && <Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>}
      {error && <Alert severity="error" sx={{mb:2}}>{error}</Alert>}
      <Box display="grid" gridTemplateColumns={{xs:'1fr',sm:'1fr 1fr',md:'1fr 1fr 1fr'}} gap={3}>
        {menteesSorted.map(m => (
          <Card key={m.id} variant="outlined" sx={{borderRadius:4, boxShadow:3, transition:'0.2s', '&:hover':{boxShadow:8, borderColor:'primary.main', transform:'translateY(-4px)'}}}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Avatar src={m.profile_image || 'https://placehold.co/500x500.jpg?text=MENTEE'} alt={m.name} sx={{ width: 48, height: 48 }} />
                <Typography variant="h6" fontWeight={700} color="primary.main" gutterBottom>{m.name} <Typography component="span" color="text.secondary">({m.username})</Typography></Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" mb={1}>소개: {m.bio}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default MenteeList;
