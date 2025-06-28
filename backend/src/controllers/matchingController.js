const MatchingRequest = require('../models/matchingRequest');

exports.createRequest = async (req, res) => {
  try {
    const menteeId = req.user.id;
    const { mentorId, message } = req.body;
    if (!mentorId) return res.status(400).json({ error: 'mentorId is required' });
    // 한 멘토에게 한 번만 요청 가능
    // (추가 검증 필요시 여기에 구현)
    const requestId = await MatchingRequest.createMatchingRequest(menteeId, mentorId, message);
    res.status(201).json({ requestId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create matching request' });
  }
};

exports.getMyRequest = async (req, res) => {
  try {
    const menteeId = req.user.id;
    const request = await MatchingRequest.getMyMatchingRequest(menteeId);
    if (!request) return res.status(404).json({ error: 'No matching request found' });
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get matching request' });
  }
};
