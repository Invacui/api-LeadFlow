import { CampaignStatus } from '@prisma/client';

export interface CampaignResponse {
  id: string;
  name: string;
  status: CampaignStatus;
  sentCount: number;
  repliedCount: number;
  hotLeadCount: number;
  tokenCost: number;
  templateId: string;
  createdAt: Date;
  updatedAt: Date;
}
