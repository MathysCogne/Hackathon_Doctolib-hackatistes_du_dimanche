/**
 * @file server.ts
 * @description Configuration du serveur pour Twilio avec Express et WebSocket
 */

import express, { Application } from 'express';
import { Server as HttpServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { TwilioService } from './services/twilioService';
import { createTwilioRouter } from './routes/twilioWebhooks';
import { createMediaWebSocket } from './routes/mediaWebSocket';
import { elizaLogger } from '@elizaos/core';

interface ServerConfig {
    authToken: string;
}

interface TwilioServerInstance {
    app: Application;
    server: HttpServer;
    wss: WebSocketServer;
    startServer: (port: number) => void;
}

export function createTwilioServer(twilioService: TwilioService, config: ServerConfig): TwilioServerInstance {
    // Créer l'application Express
    const app = express();
    
    // Configuration CORS très permissive pour le développement
    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['*'],
        credentials: true
    }));

    // Important: configurer le parsing des form-urlencoded AVANT les routes
    app.use(express.urlencoded({ 
        extended: true,
        limit: '10mb'
    }));
    app.use(express.json());

    // Log toutes les requêtes
    app.use((req, res, next) => {
        elizaLogger.info(`${req.method} ${req.url}`);
        elizaLogger.info('Headers:', req.headers);
        elizaLogger.info('Body:', req.body);
        elizaLogger.info('Query:', req.query);
        next();
    });

    // Middleware pour gérer les requêtes préliminaires OPTIONS
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.header('Access-Control-Allow-Headers', '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        
        // Répondre immédiatement aux requêtes OPTIONS
        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        }
        next();
    });

    // Route de test
    app.get('/api/twilio/test', (req, res) => {
        res.json({ status: 'ok', message: 'Twilio server is running' });
    });

    // Créer le serveur HTTP
    const server = new HttpServer(app);

    // Créer le serveur WebSocket avec configuration pour Gitpod
    const wss = new WebSocketServer({ 
        server,
        path: '/twilio/media',
        clientTracking: true,
        perMessageDeflate: {
            zlibDeflateOptions: {
                chunkSize: 1024,
                memLevel: 7,
                level: 3
            },
            zlibInflateOptions: {
                chunkSize: 10 * 1024
            }
        }
    });

    // Configurer les routes Twilio
    const twilioRouter = createTwilioRouter(twilioService, config);
    app.use('/api/twilio', twilioRouter);

    // Configurer le WebSocket pour le streaming média
    createMediaWebSocket(wss, twilioService);

    // Démarrer le serveur
    const startServer = (port: number) => {
        server.listen(port, '0.0.0.0', () => {
            const baseUrl = `https://${process.env.WEBHOOK_BASE_URL}`;
            elizaLogger.info(`Serveur Twilio démarré sur le port ${port}`);
            elizaLogger.info(`Test endpoint: ${baseUrl}/api/twilio/test`);
            elizaLogger.info(`Webhook endpoint: ${baseUrl}/api/twilio/call`);
            elizaLogger.info(`WebSocket endpoint: wss://${process.env.WEBHOOK_BASE_URL}/twilio/media`);
        });
    };

    return {
        app,
        server,
        wss,
        startServer
    };
} 