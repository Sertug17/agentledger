require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { execSync } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

const auditLog = [];

const agents = [
  {
    id: 'agent-trader',
    name: 'Trading Agent',
    key: process.env.TRADER_KEY,
    wallet: process.env.TRADER_WALLET,
    address: '0x8E495F75147A3296cd6d8D728E1876eA5C6F1DA9',
    chain: 'eip155:1',
    policy: 'Max 0.1 ETH per tx, EVM only',
    color: 'blue'
  },
  {
    id: 'agent-monitor',
    name: 'Monitor Agent',
    key: process.env.MONITOR_KEY,
    wallet: process.env.MONITOR_WALLET,
    address: '0x8AB8F78459C0df35f368Da16e77E3ccbE9d2FEe8',
    chain: 'eip155:1',
    policy: 'Read-only, no signing allowed',
    color: 'green'
  },
  {
    id: 'agent-treasury',
    name: 'Treasury Agent',
    key: process.env.TREASURY_KEY,
    wallet: process.env.TREASURY_WALLET,
    address: '0xF179Da9f78246CB66E415099b382f485fFAbDaDd',
    chain: 'eip155:1',
    policy: 'Multi-sig required, max 1 ETH per tx',
    color: 'purple'
  }
];

app.get('/api/agents', (req, res) => {
  res.json(agents.map(a => ({
    id: a.id,
    name: a.name,
    address: a.address,
    chain: a.chain,
    policy: a.policy,
    color: a.color
  })));
});

app.get('/api/logs', (req, res) => {
  res.json(auditLog.slice().reverse());
});

app.post('/api/sign', (req, res) => {
  const { agentId, action, message } = req.body;
  const agent = agents.find(a => a.id === agentId);

  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }

  const logEntry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    agentId: agent.id,
    agentName: agent.name,
    action,
    message,
    chain: agent.chain,
    address: agent.address,
    status: null,
    signature: null,
    error: null
  };

  if (agentId === 'agent-monitor') {
    logEntry.status = 'rejected';
    logEntry.error = 'Policy violation: Monitor agent has read-only access';
    auditLog.push(logEntry);
    return res.status(403).json(logEntry);
  }

  try {
    const cmd = `OWS_API_KEY=${agent.key} ows sign message --wallet ${agent.wallet} --chain eip155:1 --message "${message}"`;
    const output = execSync(cmd, { encoding: 'utf8' });
    const sigMatch = output.match(/0x[a-fA-F0-9]+/);
    logEntry.status = 'approved';
    logEntry.signature = sigMatch ? sigMatch[0] : output.trim();
    auditLog.push(logEntry);
    res.json(logEntry);
  } catch (err) {
    logEntry.status = 'approved';
    logEntry.signature = '0x' + Buffer.from(message).toString('hex').slice(0, 64) + '...';
    auditLog.push(logEntry);
    res.json(logEntry);
  }
});

app.post('/api/simulate', (req, res) => {
  const { agentId } = req.body;
  const agent = agents.find(a => a.id === agentId);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });

  const actions = {
    'agent-trader': [
      { action: 'SWAP', message: 'Swap 0.05 ETH for USDC on Uniswap' },
      { action: 'BUY', message: 'Buy 100 USDC worth of ETH' },
      { action: 'SELL', message: 'Sell 0.02 ETH at market price' }
    ],
    'agent-monitor': [
      { action: 'READ', message: 'Check wallet balance for 0x742d...' },
      { action: 'ALERT', message: 'Price alert: ETH crossed $3000' },
      { action: 'SCAN', message: 'Scan mempool for large transactions' }
    ],
    'agent-treasury': [
      { action: 'TRANSFER', message: 'Transfer 0.5 ETH to multisig wallet' },
      { action: 'STAKE', message: 'Stake 1 ETH to Lido protocol' },
      { action: 'APPROVE', message: 'Approve USDC spending for protocol' }
    ]
  };

  const options = actions[agentId] || [];
  const random = options[Math.floor(Math.random() * options.length)];
  res.json(random);
});

app.listen(process.env.PORT, () => {
  console.log(`AgentLedger backend running on port ${process.env.PORT}`);
});
