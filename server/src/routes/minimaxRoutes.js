import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const API_KEY = process.env.MINIMAX_API_KEY;
const API_BASE = process.env.MINIMAX_API_BASE || 'https://api.minimaxi.com';

router.get('/usage', async (req, res) => {
  if (!API_KEY) {
    return res.status(503).json({
      success: false,
      error: 'MINIMAX_API_KEY not configured'
    });
  }

  try {
    const response = await axios.get(
      `${API_BASE}/v1/token_plan/remains`,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = response.data?.model_remains?.find(m => m.model_name === 'general')
      || response.data?.model_remains?.[0] 
      || {};

    const intervalRemainingPercent = data.current_interval_remaining_percent || 0;
    const weeklyRemainingPercent = data.current_weekly_remaining_percent || 0;
    const remainsTime = data.remains_time || 0;
    const weekRemainsTime = data.weekly_remains_time || 0;

    const fiveHourTotal = Math.round(remainsTime / (intervalRemainingPercent / 100)) || 0;
    const fiveHourUsed = fiveHourTotal - remainsTime;
    const weekTotal = Math.round(weekRemainsTime / (weeklyRemainingPercent / 100)) || 0;
    const weeklyUsed = weekTotal - weekRemainsTime;

    return res.json({
      success: true,
      current: {
        fiveHour: fiveHourUsed,
        weekly: weeklyUsed
      },
      totals: {
        fiveHour: fiveHourTotal,
        weekly: weekTotal
      },
      percentages: {
        fiveHour: intervalRemainingPercent,
        weekly: weeklyRemainingPercent
      },
      resets: {
        fiveHour: data.end_time ? new Date(data.end_time).toISOString() : null,
        week: data.weekly_end_time ? new Date(data.weekly_end_time).toISOString() : null
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Minimax API error:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;