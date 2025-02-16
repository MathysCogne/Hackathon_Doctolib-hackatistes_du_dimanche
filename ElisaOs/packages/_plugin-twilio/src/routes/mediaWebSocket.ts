/**
 * @file mediaWebSocket.ts
 * @description Gestion du streaming média en temps réel avec Twilio
 */

import { Server as WebSocketServer, WebSocket } from 'ws';
import { TwilioService } from '../services/twilioService';
import { elizaLogger } from '@elizaos/core';

interface TwilioMediaMessage {
    event: 'start' | 'media' | 'stop' | 'mark' | 'speech' | 'connected';
    start?: {
        callSid: string;
        streamSid: string;
        mediaFormat: {
            encoding: string;
            sampleRate: number;
            channels: number;
        };
    };
    media?: {
        payload: string;
        track: string;
        chunk: string;
        timestamp: string;
    };
    speech?: {
        type: 'recognition' | 'hypothesis';
        alternatives: Array<{
            transcript: string;
            confidence: number;
        }>;
    };
    stop?: {
        callSid: string;
    };
}

export function createMediaWebSocket(wss: WebSocketServer, twilioService: TwilioService): void {
    wss.on('connection', (ws: WebSocket) => {
        let currentCallSid: string | undefined;
        let audioBuffer: Buffer[] = [];

        ws.on('message', async (data: Buffer | ArrayBuffer | Buffer[]) => {
            try {
                const msg = JSON.parse(data.toString()) as TwilioMediaMessage;
                elizaLogger.info('Message WebSocket reçu:', msg.event, msg);

                switch (msg.event) {
                    case 'start':
                        if (msg.start?.callSid) {
                            currentCallSid = msg.start.callSid;
                            elizaLogger.info(`Nouvelle connexion média pour l'appel: ${currentCallSid}`);
                            elizaLogger.info('Format média:', msg.start.mediaFormat);

                            // Envoyer un message de configuration
                            ws.send(JSON.stringify({
                                event: 'configure',
                                streamSid: msg.start.streamSid,
                                configure: {
                                    type: 'speech',
                                    options: {
                                        language: 'en-GB',
                                        model: 'phone_call'
                                    }
                                }
                            }));
                        }
                        break;

                    case 'media':
                        if (currentCallSid && msg.media?.payload) {
                            const audioChunk = Buffer.from(msg.media.payload, 'base64');
                            audioBuffer.push(audioChunk);

                            // Envoyer l'audio accumulé pour transcription
                            if (audioBuffer.length >= 10) {
                                const completeAudio = Buffer.concat(audioBuffer);
                                ws.send(JSON.stringify({
                                    event: 'media',
                                    streamSid: msg.media.track,
                                    media: {
                                        payload: completeAudio.toString('base64')
                                    }
                                }));
                                audioBuffer = [];
                            }
                        }
                        break;

                    case 'speech':
                        if (currentCallSid && msg.speech?.alternatives?.length > 0) {
                            try {
                                const transcription = msg.speech.alternatives[0];
                                elizaLogger.info(`Transcription reçue via WebSocket:`, {
                                    text: transcription.transcript,
                                    confidence: transcription.confidence,
                                    type: msg.speech.type
                                });
                                
                                // Ne traiter que les transcriptions finales avec un texte non vide
                                if (msg.speech.type === 'recognition' && transcription.transcript.trim()) {
                                    // Envoyer la transcription à l'agent
                                    const response = await twilioService.handleAudioStream(
                                        transcription.transcript,
                                        currentCallSid
                                    );

                                    elizaLogger.info(`Réponse de l'agent:`, response);

                                    // Envoyer la réponse vocale via TwiML
                                    ws.send(JSON.stringify({
                                        event: 'mark',
                                        streamSid: currentCallSid,
                                        mark: {
                                            name: 'response',
                                            value: response
                                        }
                                    }));
                                }
                            } catch (error) {
                                elizaLogger.error('Erreur lors du traitement de la transcription WebSocket:', error);
                            }
                        }
                        break;

                    case 'stop':
                        if (currentCallSid) {
                            elizaLogger.info(`Fin du streaming pour l'appel: ${currentCallSid}`);
                            audioBuffer = [];
                            currentCallSid = undefined;
                        }
                        break;
                }
            } catch (error) {
                elizaLogger.error('Erreur WebSocket:', error);
            }
        });

        ws.on('close', () => {
            if (currentCallSid) {
                elizaLogger.info(`WebSocket fermé pour l'appel: ${currentCallSid}`);
                audioBuffer = [];
                currentCallSid = undefined;
            }
        });
    });
} 