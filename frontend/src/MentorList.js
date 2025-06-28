import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Select, MenuItem, Card, CardContent, CircularProgress, Alert, InputLabel, FormControl, Avatar, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

function MentorList({ user }) {
  const [mentors, setMentors] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState('ASC');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [techStackFilter, setTechStackFilter] = useState('');
  const [techStacks, setTechStacks] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [reqLoading, setReqLoading] = useState(false);
  const [reqError, setReqError] = useState('');
  const [reqSuccess, setReqSuccess] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [modalMsg, setModalMsg] = useState('');

  useEffect(() => {
    fetchMentors();
    // eslint-disable-next-line
  }, [search, sort, order, techStackFilter]);

  useEffect(() => {
    // 멘토 목록에서 기술스택 종류 추출 (최초 1회)
    fetch('http://localhost:8080/api/mentors')
      .then(res => res.json())
      .then(data => {
        const allMentors = data.mentors || data;
        const stacks = new Set();
        allMentors.forEach(m => {
          if (m.tech_stack) {
            m.tech_stack.split(',').forEach(s => stacks.add(s.trim()));
          }
        });
        setTechStacks(Array.from(stacks).filter(Boolean));
      });
  }, []);

  useEffect(() => {
    if (user) fetchMyRequests();
    // eslint-disable-next-line
  }, [user]);

  const fetchMentors = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ search, sort, order });
      if (techStackFilter) params.append('tech_stack', techStackFilter);
      const res = await fetch(`http://localhost:8080/api/mentors?${params}`);
      const data = await res.json();
      if (res.ok) setMentors(data.mentors || data);
      else setError(data.error || '불러오기 실패');
    } catch (e) {
      setError('서버 오류');
    }
    setLoading(false);
  };

  // 여러 신청 내역을 모두 가져옴
  const fetchMyRequests = async () => {
    setReqLoading(true);
    setReqError('');
    try {
      const res = await fetch('http://localhost:8080/api/matching', {
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) setMyRequests(data);
      else setReqError(data.error || '신청 현황 불러오기 실패');
    } catch {
      setReqError('서버 오류');
    }
    setReqLoading(false);
  };

  const handleApply = (mentorId) => {
    const mentor = mentors.find(m => m.id === mentorId);
    setSelectedMentor(mentor);
    setModalMsg('');
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedMentor(null);
    setModalMsg('');
    setReqError('');
    setReqSuccess('');
  };

  const handleModalSubmit = async () => {
    if (!selectedMentor) return;
    setReqLoading(true); setReqError(''); setReqSuccess('');
    try {
      const res = await fetch('http://localhost:8080/api/matching', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ mentor_id: selectedMentor.id, message: modalMsg })
      });
      const data = await res.json();
      if (res.ok) {
        setReqSuccess('신청 완료!');
        fetchMyRequests();
        setModalOpen(false);
      } else setReqError(data.error || '신청 실패');
    } catch {
      setReqError('서버 오류');
    }
    setReqLoading(false);
  };

  // 신청 취소
  const handleCancelRequest = async (requestId) => {
    setReqLoading(true);
    setReqError('');
    try {
      const res = await fetch(`http://localhost:8080/api/matching/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      });
      const data = await res.json();
      if (res.ok) {
        setReqSuccess('신청이 취소되었습니다.');
        fetchMyRequests();
      } else setReqError(data.error || '취소 실패');
    } catch {
      setReqError('서버 오류');
    }
    setReqLoading(false);
  };

  // 보여줄 신청만 필터 (취소된 신청은 숨김)
  const visibleRequests = myRequests.filter(r => r.status !== 'cancelled');
  const hasAnyRequest = visibleRequests.length > 0;

  return (
    <Box maxWidth={900} mx="auto" mt={4}>
      <Typography variant="h4" fontWeight={700} mb={3} align="center" color="primary.main">멘토 목록</Typography>
      {/* 내 멘토 신청 현황 표시 */}
      {user && (
        <Card sx={{p:2, mb:3, bgcolor:'#f8fafc', border:'1px solid #e0e7ef'}}>
          <Typography fontWeight={700} mb={1}>내 멘토 신청 현황</Typography>
          {reqLoading ? <CircularProgress size={20} /> :
            hasAnyRequest ? (
              <Box>
                {visibleRequests.map(req => (
                  <Box key={req.id} mb={1} display="flex" alignItems="center" gap={1}>
                    <Chip label={`멘토: ${req.mentor_name || req.mentor_id}`} color="primary" />
                    <Chip label={`상태: ${req.status}`} color={req.status==='수락'?'success':req.status==='거절'?'error':'warning'} />
                    <Typography variant="body2" ml={1}>메시지: {req.message}</Typography>
                    {req.status === 'pending' && (
                      <Button size="small" color="error" variant="outlined" sx={{ml:1}} onClick={()=>handleCancelRequest(req.id)} disabled={reqLoading}>취소</Button>
                    )}
                  </Box>
                ))}
              </Box>
            ) : <Typography color="text.secondary">아직 신청한 멘토가 없습니다.</Typography>
          }
          {reqError && <Alert severity="error" sx={{mt:1}}>{reqError}</Alert>}
          {reqSuccess && <Alert severity="success" sx={{mt:1}}>{reqSuccess}</Alert>}
        </Card>
      )}
      {/* 멘토 신청 불가 안내 */}
      {user && hasAnyRequest && (
        <Alert severity="info" sx={{mb:2}}>
          이미 멘토 신청이 진행 중입니다. 한 번에 한 명의 멘토에게만 신청할 수 있습니다.
        </Alert>
      )}
      <Card sx={{ p: 3, mb: 3, borderRadius: 4, boxShadow: 3, bgcolor: 'background.paper' }}>
        <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
          <TextField
            label="검색(이름, 기술스택, 태그)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ minWidth: 220 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>기술스택</InputLabel>
            <Select value={techStackFilter} label="기술스택" onChange={e => setTechStackFilter(e.target.value)}>
              <MenuItem value="">전체</MenuItem>
              {techStacks.map(stack => (
                <MenuItem key={stack} value={stack}>{stack}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>정렬</InputLabel>
            <Select value={sort} label="정렬" onChange={e => setSort(e.target.value)}>
              <MenuItem value="name">이름</MenuItem>
              <MenuItem value="tech_stack">기술스택</MenuItem>
              <MenuItem value="company">회사</MenuItem>
              <MenuItem value="location">지역</MenuItem>
              <MenuItem value="available_time">가능시간</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>순서</InputLabel>
            <Select value={order} label="순서" onChange={e => setOrder(e.target.value)}>
              <MenuItem value="ASC">오름차순</MenuItem>
              <MenuItem value="DESC">내림차순</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Card>
      {loading && <Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>}
      {error && <Alert severity="error" sx={{mb:2}}>{error}</Alert>}
      <Box display="grid" gridTemplateColumns={{xs:'1fr',sm:'1fr 1fr',md:'1fr 1fr 1fr'}} gap={3}>
        {mentors.map(m => {
          const alreadyRequested = visibleRequests.some(r => r.mentor_id === m.id);
          return (
            <Card key={m.id} variant="outlined" sx={{borderRadius:4, boxShadow:3, transition:'0.2s', '&:hover':{boxShadow:8, borderColor:'primary.main', transform:'translateY(-4px)'}}}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                  <Avatar src={m.profile_image || 'https://placehold.co/500x500.jpg?text=MENTOR'} alt={m.name} sx={{ width: 48, height: 48 }} />
                  <Typography variant="h6" fontWeight={700} color="primary.main" gutterBottom>{m.name} <Typography component="span" color="text.secondary">({m.username})</Typography></Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" mb={1}>기술스택: {m.tech_stack}</Typography>
                <Typography variant="body2">회사: {m.company} / 지역: {m.location}</Typography>
                <Typography variant="body2">가능시간: {m.available_time}</Typography>
                <Typography variant="body2">MBTI: {m.mbti} / 태그: {m.tags}</Typography>
                {user && (
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{mt:2}}
                    disabled={hasAnyRequest && !alreadyRequested}
                    onClick={alreadyRequested ? undefined : ()=>handleApply(m.id)}
                  >
                    {alreadyRequested ? '신청 완료' : '멘토 신청'}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Box>
      {/* 멘토 신청 모달 */}
      <Dialog open={modalOpen} onClose={handleModalClose}>
        <DialogTitle>멘토 신청</DialogTitle>
        <DialogContent>
          <Typography mb={1}><b>멘토:</b> {selectedMentor?.name} ({selectedMentor?.username})</Typography>
          <TextField
            label="멘토에게 보낼 메시지 (선택)"
            value={modalMsg}
            onChange={e => setModalMsg(e.target.value)}
            fullWidth
            multiline
            rows={3}
            autoFocus
          />
          {reqError && <Alert severity="error" sx={{mt:1}}>{reqError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>취소</Button>
          <Button onClick={handleModalSubmit} variant="contained" disabled={reqLoading}>저장</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MentorList;
