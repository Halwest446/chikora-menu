import { DEFAULT_ITEMS, DEFAULT_CATEGORIES, RESTAURANT_INFO } from '../src/data/defaultMenu.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.status(200).json({
    success: true,
    items: DEFAULT_ITEMS,
    categories: DEFAULT_CATEGORIES,
    restaurantInfo: RESTAURANT_INFO,
  });
}
