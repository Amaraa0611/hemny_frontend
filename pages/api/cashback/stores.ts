import type { NextApiRequest, NextApiResponse } from 'next';
import { CashbackStore } from '../../../api/types/cashback';

const mockStores: CashbackStore[] = [
  {
    id: '1',
    merchant: 'Nike',
    merchant_color: '#024e31',
    cashback_rate: 8,
    cashback_description: 'Limited Time',
    cashback_image: '/images/merchants/khanbank.webp',
  },
  {
    id: '2',
    merchant: 'Adidas',
    merchant_color: '#000000',
    cashback_rate: 6,
    cashback_description: 'Special Offer',
    cashback_image: '/images/merchants/khanbank_original.webp',
  },
  {
    id: '3',
    merchant: 'Under Armour',
    merchant_color: '#CC0000',
    cashback_rate: 10,
    cashback_description: 'Exclusive',
    cashback_image: '/images/merchants/under-armour.webp',
  },
  // Add more mock data as needed
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<CashbackStore[]>
) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  res.status(200).json(mockStores);
} 