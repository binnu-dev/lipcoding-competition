import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import logo from './logo.svg';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import MentorList from './MentorList';
import Matching from './Matching';
import Profile from './Profile';
import MenteeList from './MenteeList';
import { Box, Button, Typography, Card, CardContent, Stack, AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, IconButton, Grid, Fade, Paper } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import heroImg from './images/hero.png';

function MenteeListDummy() {
  // 더미 멘티 목록
  return (
    <Card sx={{mb:3}}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} color="primary.main" gutterBottom>멘티 목록 (예시)</Typography>
        <Typography color="text.secondary">곧 지원될 기능입니다.</Typography>
      </CardContent>
    </Card>
  );
}
function RecentMentoring() {
  // 더미 최근 멘토링
  return (
    <Card sx={{mb:3}}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} color="primary.main" gutterBottom>최근 멘토링 (예시)</Typography>
        <Typography color="text.secondary">최근 멘토링 내역이 여기에 표시됩니다.</Typography>
      </CardContent>
    </Card>
  );
}
const drawerWidth = 220;
const menuList = [
  { key: 'dashboard', label: '메인 화면', icon: <DashboardIcon /> },
  { key: 'mentors', label: '멘토 목록', icon: <PeopleIcon /> },
  { key: 'mentees', label: '멘티 목록', icon: <PersonIcon /> },
  { key: 'matching', label: '매칭 관리', icon: <AssignmentIcon /> },
  { key: 'profile', label: '내 프로필', icon: <AccountCircleIcon /> },
];

function App() {
  const [user, setUser] = useState(() => {
    // 예시: localStorage에서 토큰/유저 정보 복원
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  // 상단 뉴스/공지 더미
  const news = [
    'Connect:ON 서비스가 오픈되었습니다!',
    '멘토/멘티 모집 중! 지금 바로 신청하세요.',
    '최신 멘토링 후기와 꿀팁을 확인해보세요.'
  ];

  // 인증 상태 변경 시 localStorage 동기화
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  // 왼쪽 네비게이션 메뉴 (Link로 변경)
  const drawer = (
    <Box>
      <Box display="flex" flexDirection="column" alignItems="center" py={3}>
        <img src={logo} alt="logo" style={{ width: 60, height: 60, marginBottom: 8 }} />
        <Typography variant="h6" fontWeight={900} color="primary.main">Connect:ON</Typography>
      </Box>
      <Divider />
      <List>
        <ListItem button component={Link} to="/" key="dashboard">
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="메인 화면" />
        </ListItem>
        <ListItem button component={Link} to="/mentors" key="mentors">
          <ListItemIcon><PeopleIcon /></ListItemIcon>
          <ListItemText primary="멘토 목록" />
        </ListItem>
        <ListItem button component={Link} to="/mentees" key="mentees">
          <ListItemIcon><PersonIcon /></ListItemIcon>
          <ListItemText primary="멘티 목록" />
        </ListItem>
        <ListItem button component={Link} to="/matching" key="matching">
          <ListItemIcon><AssignmentIcon /></ListItemIcon>
          <ListItemText primary="매칭 관리" />
        </ListItem>
        <ListItem button component={Link} to="/profile" key="profile">
          <ListItemIcon><AccountCircleIcon /></ListItemIcon>
          <ListItemText primary="내 프로필" />
        </ListItem>
      </List>
      <Divider sx={{mt:2}} />
      {!user ? (
        <Box px={2} py={1}>
          <Button fullWidth variant="outlined" sx={{mb:1}} component={Link} to="/login">로그인</Button>
          <Button fullWidth variant="contained" component={Link} to="/register">회원가입</Button>
        </Box>
      ) : (
        <Box px={2} py={1}>
          <Button fullWidth variant="outlined" color="secondary" onClick={()=>setUser(null)}>로그아웃</Button>
        </Box>
      )}
    </Box>
  );

  // 인증 상태에 따른 라우팅 보호 컴포넌트
  function RequireAuth({ children }) {
    const location = useLocation();
    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
  }
  function RedirectIfAuth({ children }) {
    if (user) return <Navigate to="/profile" replace />;
    return children;
  }

  // 메인 콘텐츠 라우팅
  return (
    <Router>
      <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 40%, #f0abfc 100%)' }}>
        {/* 왼쪽 Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', bgcolor: 'white', borderRight: '1px solid #eee' },
          }}
          open
        >
          {drawer}
        </Drawer>
        {/* 메인 영역 */}
        <Box component="main" sx={{ flexGrow: 1, p: 0, ml: `${drawerWidth}px` }}>
          {/* 상단 AppBar */}
          <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #eee', bgcolor: 'rgba(255,255,255,0.95)' }}>
            <Toolbar variant="dense" sx={{ minHeight: 48 }}>
              <Grid container alignItems="center">
                <Grid item xs={12} md={8}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="subtitle1" color="primary" fontWeight={700}>뉴스</Typography>
                    <Stack direction="row" spacing={2}>
                      {news.map((n,i)=>(<Typography key={i} color="text.secondary" fontSize={15}>{n}</Typography>))}
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={4} textAlign="right">
                  {user && user.user && (
                    <Typography color="text.secondary">{user.user.name} ({user.user.role})</Typography>
                  )}
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
          {/* 메인 콘텐츠 라우터 */}
          <Box sx={{ p: {xs:1, sm:3, md:5}, maxWidth: 1200, mx: 'auto', mt: 2 }}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/login" element={<RedirectIfAuth><LoginForm onLogin={setUser} /></RedirectIfAuth>} />
              <Route path="/register" element={<RedirectIfAuth><RegisterForm onRegister={setUser} /></RedirectIfAuth>} />
              <Route path="/profile" element={<RequireAuth><Profile user={user ? {...user.user, token: user.token} : undefined} /></RequireAuth>} />
              <Route path="/mentors" element={<RequireAuth><MentorList user={user ? {...user.user, token: user.token} : undefined} /></RequireAuth>} />
              <Route path="/mentees" element={<MenteeList user={user} />} />
              <Route path="/matching" element={<RequireAuth><Matching user={user ? {...user.user, token: user.token} : undefined} /></RequireAuth>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </Router>
  );
}

// 대시보드/메인 화면 컴포넌트
function DashboardPage() {
  return (
    <Box>
      {/* 히어로 섹션 */}
      <Paper elevation={4} sx={{
        p: {xs:2, md:5},
        mb: 5,
        borderRadius: 4,
        background: 'linear-gradient(120deg, #f0abfc 0%, #e0e7ff 100%)',
        display: 'flex',
        alignItems: 'center',
        gap: {xs:2, md:6},
        flexDirection: {xs:'column', md:'row'}
      }}>
        <Box flex={1}>
          <Typography variant="h3" fontWeight={900} color="primary.main" mb={2}>
            Connect:ON
          </Typography>
          <Typography variant="h5" color="text.secondary" mb={2}>
            멘토와 멘티를 쉽고 빠르게 연결하는 멘토링 플랫폼
          </Typography>
          <Box mb={2}>
            {['Connect:ON 서비스가 오픈되었습니다!','멘토/멘티 모집 중! 지금 바로 신청하세요.','최신 멘토링 후기와 꿀팁을 확인해보세요.'].map((n,i)=>(<Typography key={i} color="secondary" fontWeight={600} fontSize={18} mb={0.5}>• {n}</Typography>))}
          </Box>
          <Button variant="contained" size="large" sx={{mt:1, fontWeight:700}} component={Link} to="/register">지금 시작하기</Button>
        </Box>
        <Box flex={1} display="flex" justifyContent="center" alignItems="center">
          <img src={heroImg} alt="hero" style={{maxWidth:'100%', maxHeight:260, borderRadius:16, boxShadow:'0 4px 24px #e0e7ff'}} />
        </Box>
      </Paper>
      {/* 섹션별 카드 */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{p:3, borderRadius:4, minHeight:320, display:'flex', flexDirection:'column'}}>
            <Typography variant="h6" fontWeight={700} color="primary.main" mb={2}>멘티 목록</Typography>
            <MenteeListDummy />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{p:3, borderRadius:4, minHeight:320, display:'flex', flexDirection:'column'}}>
            <Typography variant="h6" fontWeight={700} color="primary.main" mb={2}>멘토 목록</Typography>
            <MentorList />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{p:3, borderRadius:4, minHeight:320, display:'flex', flexDirection:'column'}}>
            <Typography variant="h6" fontWeight={700} color="primary.main" mb={2}>최근 멘토링 세션</Typography>
            <RecentMentoring />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

// 내 프로필 페이지 예시
function ProfilePage({ user }) {
  const [name, setName] = React.useState(user?.user?.name || '');
  const [bio, setBio] = React.useState(user?.user?.bio || '');
  const [skillsets, setSkillsets] = React.useState(user?.user?.skillsets || '');
  const [image, setImage] = React.useState(user?.user?.image || '');
  const [imageFile, setImageFile] = React.useState(null);
  const isMentor = user?.user?.role === 'mentor';

  // 기본 이미지 URL
  const defaultImg = isMentor
    ? 'https://placehold.co/500x500.jpg?text=MENTOR'
    : 'https://placehold.co/500x500.jpg?text=MENTEE';

  // 이미지 업로드 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      alert('PNG 또는 JPG 이미지만 업로드 가능합니다.');
      return;
    }
    if (file.size > 1024 * 1024) {
      alert('이미지 크기는 1MB 이하여야 합니다.');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  // 저장 핸들러 (실제 서버 연동은 추후 구현)
  const handleSave = (e) => {
    e.preventDefault();
    // TODO: 서버에 PATCH/PUT 요청
    alert('프로필이 저장되었습니다! (실제 저장은 추후 구현)');
    // 콘솔로 확인
    console.log({ name, bio, skillsets, image });
  };

  return (
    <Card sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
      <CardContent>
        <Typography variant="h5" fontWeight={700} mb={2}>내 프로필</Typography>
        <Box component="form" onSubmit={handleSave}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <img
              id="profile-photo"
              src={image || defaultImg}
              alt="프로필"
              style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', marginBottom: 8, border: '1px solid #eee' }}
            />
            <Button variant="outlined" component="label" size="small" sx={{mt:1}}>
              이미지 업로드
              <input
                id="profile"
                type="file"
                accept=".png,.jpg,.jpeg"
                hidden
                onChange={handleImageChange}
              />
            </Button>
            <Typography variant="caption" color="text.secondary">PNG/JPG, 1MB 이하</Typography>
          </Box>
          <Box mb={2}>
            <Typography fontWeight={600} mb={0.5}>이름</Typography>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </Box>
          <Box mb={2}>
            <Typography fontWeight={600} mb={0.5}>자기소개</Typography>
            <textarea
              id="bio"
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc', resize: 'vertical' }}
            />
          </Box>
          {isMentor && (
            <Box mb={2}>
              <Typography fontWeight={600} mb={0.5}>기술스택</Typography>
              <input
                id="skillsets"
                type="text"
                value={skillsets}
                onChange={e => setSkillsets(e.target.value)}
                placeholder="예: React, Node.js, Python"
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              />
            </Box>
          )}
          <Button id="save" type="submit" variant="contained" color="primary" fullWidth sx={{mt:2, fontWeight:700}}>
            저장
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default App;
