/**
 * @file twilio.ts
 * @description Types pour le service Twilio
 */

import type { Character } from '@elizaos/core';

export interface TwilioConfig {
    accountSid: string;
    authToken: string;
    fromNumber: string;
    webhookBaseUrl: string;
}

export interface SMSMessage {
    to: string;
    body: string;
    mediaUrl?: string[];
}

export interface CallOptions {
    to: string;
    twiml?: string;
    url?: string;
}

export interface TwilioResponse {
    success: boolean;
    messageId?: string;
    error?: string;
}

export interface TwilioSettings {
    voice: string;
    language: string;
    responseTimeout: number;
}

export interface CharacterWithTwilio extends Character {
    settings?: {
        twilio?: TwilioSettings;
    } & NonNullable<Character['settings']>;
} 