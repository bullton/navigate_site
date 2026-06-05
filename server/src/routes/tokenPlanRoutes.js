import express from 'express';
import axios from 'axios';

const router = express.Router();

const API_BASE = process.env.MINIMAX_API_BASE || 'https://api.minimaxi.com';

router.get('/token_plan', async (req, res) => {
  try {
    const apiKey = process.env.MINIMAX_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'MINIMAX_API_KEY not configured'
      });
    }

    const response = await axios.get(
      `${API_BASE}/v1/token_plan/remains`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = response.data?.model_remains?.find(m => m.model_name === 'general') || response.data?.model_remains?.[0] || {};
    const intervalRemainingPercent = data.current_interval_remaining_percent || 0;
    const weeklyRemainingPercent = data.current_weekly_remaining_percent || 0;
    const remainsTime = data.remains_time || 0;
    const weekRemainsTime = data.weekly_remains_time || 0;

    const fiveHourTotal = remainsTime / (intervalRemainingPercent / 100);
    const fiveHourUsed = fiveHourTotal - remainsTime;
    const weekTotal = weekRemainsTime / (weeklyRemainingPercent / 100);
    const weeklyUsed = weekTotal - weekRemainsTime;

    const fiveHourPct = 100 - intervalRemainingPercent;
    const weekPct = 100 - weeklyRemainingPercent;

    res.json({
      success: true,
      fiveHour: {
        used: Math.round(fiveHourUsed),
        total: Math.round(fiveHourTotal),
        percent: Math.round(fiveHourPct),
        resetTime: data.end_time
      },
      weekly: {
        used: Math.round(weeklyUsed),
        total: Math.round(weekTotal),
        percent: Math.round(weekPct),
        resetTime: data.weekly_end_time
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to fetch token plan:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/token_plan_detail', async (req, res) => {
  try {
    const apiKey = process.env.MINIMAX_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'MINIMAX_API_KEY not configured'
      });
    }

    const allRecords = [];
    const pageSize = 500;
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await axios.get(
        'https://www.minimaxi.com/account/amount',
        {
          params: { page: page, limit: pageSize, aggregate: false },
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const records = response.data?.charge_records || [];
      allRecords.push(...records);

      if (records.length < pageSize || allRecords.length >= response.data?.total_cnt) {
        hasMore = false;
      } else {
        page++;
      }
    }

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    let monthM3 = 0;
    let monthAll = 0;
    const modelBreakdown = {};

    allRecords.forEach(record => {
      const time = record.created_at * 1000;
      const token = parseInt(record.consume_token) || 0;
      const isM3 = record.model && record.model.includes('M3');
      const modelName = record.model || 'unknown';

      if (time >= monthStart) {
        monthAll += token;
        if (isM3) monthM3 += token;
        modelBreakdown[modelName] = (modelBreakdown[modelName] || 0) + token;
      }
    });

    res.json({
      success: true,
      m3: { monthly: monthM3 },
      all: { monthly: monthAll },
      modelBreakdown,
      monthStart: new Date(monthStart).toLocaleDateString('zh-CN'),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to fetch token plan detail:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;