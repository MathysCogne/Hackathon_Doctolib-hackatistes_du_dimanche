# FirstHelp Agent - AI Assistant for Emergency Services 🚑

![Hackathon](https://img.shields.io/badge/Powered%20by-AI-Action-Summit-Hackathon)
![Status](https://img.shields.io/badge/Status-Prototype-orange)

## About the Project

FirstHelp is an innovative solution developed during the Doctolib AI Action Summit Hackathon. Our system deploys an intelligent AI agent on emergency lines to assist call center operators, optimize waiting times, and provide immediate responses to urgent situations.

### 🎯 Problem Statement
- Long waiting times in emergency call centers
- High pressure on medical dispatchers
- Critical need for immediate medical guidance

### 💡 Our Solution
An AI-powered medical dispatcher that provides:
- Immediate response to emergency calls
- Initial medical assessment
- Real-time guidance for first aid
- Seamless handover to human operators

## 🤖 AI Agent Persona

Our AI agent embodies an emergency medical assistant, designed to act as an emergency medical dispatcher to assess the situation before human intervention.

### Core Capabilities
- **Medical Protocol Adherence**: Follows standardized emergency protocols
- **Multilingual Support**: Handles calls in French and English
- **Real-time Assessment**: Quick evaluation of medical emergencies
- **Empathetic Communication**: Professional yet reassuring interaction

## 🔧 Key Features

- **Intelligent Triage**
  - Rapid assessment of situation severity
  - Priority-based call routing
  - Automated risk evaluation

- **Real-Time Transcription**
  - Near-instantaneous voice-to-text conversion
  - Multi-language support
  - Automatic call logging

- **Contextual Analysis**
  - Deep understanding of emergency situations
  - Pattern recognition in symptoms
  - Medical context awareness

- **Operator Assistance**
  - Real-time suggestions
  - Decision support system
  - Seamless handover protocol

## 🔌 Architecture

### ElisaOS HomeMade Plugins

1. **Twilio Integration Plugin**
   - Voice call handling
   - Real-time audio processing
   - Call recording and logging

2. **Dashboard Plugin**
   - Real-time operator interface
   - Call status monitoring
   - Emergency case tracking
   - LLM integration

3. **FirstHelp Core**
   - AI agent persona configuration
   - Medical protocol implementation
   - Emergency response guidelines

### Tech Stack
- **Frontend**: React + Vite
- **Backend**: Node.js
- **AI Engine**: ElisaOS
- **Voice Integration**: Twilio
- **Database**: MongoDB

## 🚀 Getting Started

### Prerequisites
- Python 3+
- Node.js 23.3+
- pnpm package manager
- Twilio account
- MongoDB instance

### Environment Setup

1. **Clone the repository**
```bash
git clone https://github.com/MathysCogne/Hackathon_Doctolib-hackatistes_du_dimanche
cd Hackathon_Doctolib-hackatistes_du_dimanche
```

2. **AI Agent Setup (ElisaOS)**
```bash
cd ElisaOS
cp .env.example .env

pnpm install --no-frozen-lockfile
pnpm run build

pnpm start --character="characters/first_help.json"
pnpm start:client

# Start Twilio Webhooks
cd packages/_plugin-twilio
cp .env.example .env #Configure your environment

pnpm build
pnpm dev:server
```

3. **Frontend Setup (React + Vite)**
```bash
cd front
pnpm install
pnpm run start
```

4. **Backend Setup (Node.js)**
```bash
cd back
cp .env.example .env #Configure your environment
pnpm install
pnpm run start
```

4. Make a call to your Twilio number, we'll handle the rest ;)

## 📚 Documentation

For more details about using and deploying ElisaOS, check out our [complete documentation](https://elizaos.github.io/eliza/).

## 👥 Team - Les Hackatistes du Dimanche

///////////////////////////////

---
<div align="center">
Developed with ❤️ by Les Hackatistes du Dimanche for the AI Action Summit Hackathon

![Hackathon](https://img.shields.io/badge/Powered%20by-AI-Action-Summit-Hackathon)
</div>
