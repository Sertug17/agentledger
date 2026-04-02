markdown# AgentLedger 🔐

> AI agent identity & audit system powered by Open Wallet Standard (OWS)

## What is AgentLedger?

AgentLedger gives every AI agent a cryptographic identity and makes every action it takes fully auditable — without ever exposing private keys.

Built on top of [OWS (Open Wallet Standard)](https://openwallet.sh), AgentLedger answers the question:
**"Which agent did what, when, and was it allowed to?"**

## The Problem

As AI agents become autonomous participants in blockchain ecosystems, accountability becomes critical:
- Who signed this transaction?
- Was this agent authorized to do this?
- Can we prove it happened?

Today there's no standard answer. AgentLedger solves this.

## How It Works
```
AI Agent → requests action
    ↓
OWS Policy Engine → evaluates permissions
    ↓
Approved? → signs & logs to audit trail
Rejected? → policy violation logged, action blocked
```

## Features

- 🤖 **Multi-agent support** — Trading, Monitor, Treasury agents with distinct identities
- 🔒 **OWS-powered signing** — Private keys never exposed, policy engine gates every action
- 📋 **Live audit log** — Every action logged with signature, timestamp, agent identity
- ❌ **Policy enforcement** — Read-only agents can't sign, limits enforced automatically
- 📊 **Real-time dashboard** — See approvals, rejections, and signatures live

## Tech Stack

- **OWS CLI** — Wallet creation, key management, signing
- **Node.js + Express** — Backend API
- **Vanilla HTML/CSS/JS** — Frontend dashboard
- **CAIP-2 addressing** — EVM, Solana, Bitcoin, Cosmos support

## Quick Start
```bash
# Install OWS
npm install -g @open-wallet-standard/core

# Clone repo
git clone https://github.com/Sertug17/agentledger
cd agentledger

# Install dependencies
npm install

# Create agent wallets
ows wallet create --name agent-trader
ows wallet create --name agent-monitor
ows wallet create --name agent-treasury

# Create API keys
ows key create --name trader-key --wallet agent-trader
ows key create --name monitor-key --wallet agent-monitor
ows key create --name treasury-key --wallet agent-treasury

# Add keys to .env
cp .env.example .env
# Fill in your OWS keys

# Start backend
node server.js

# Open index.html in browser
```

## Agent Policies

| Agent | Policy | Can Sign? |
|-------|--------|-----------|
| Trading Agent | Max 0.1 ETH per tx, EVM only | ✅ Yes |
| Monitor Agent | Read-only, no signing | ❌ No |
| Treasury Agent | Multi-sig required, max 1 ETH | ✅ Yes |

## OWS Hackathon

Built for the [OWS Hackathon](https://hackathon.openwallet.sh/) — April 2026.

---

Made with 🔐 by [@Sertug17](https://github.com/Sertug17)
