import { Tone } from '@prisma/client';

export interface CreateTemplateRequest {
  productName: string;
  description: string;
  targetAudience?: string;
  tone?: Tone;
  cta?: string;
}

export interface UpdateTemplateRequest {
  productName?: string;
  description?: string;
  targetAudience?: string;
  tone?: Tone;
  cta?: string;
}

export interface LaunchCampaignRequest {
  name: string;
  leadListIds: string[];
}
