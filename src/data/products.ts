
import { Product } from '@/components/ProductCard';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Digital Blood Pressure Monitor',
    company: 'Omron Healthcare',
    packing: '1 Unit',
    mrp: 2500,
    image: 'photo-1581091226825-a6a2a5aee158',
    category: 'Medical Devices'
  },
  {
    id: '2',
    name: 'Disposable Surgical Masks (50 pieces)',
    company: 'MedSafe',
    packing: 'Box of 50',
    mrp: 150,
    image: 'photo-1488590528505-98d2b5aba04b',
    category: 'PPE'
  },
  {
    id: '3',
    name: 'Digital Thermometer',
    company: 'Microlife',
    packing: '1 Unit',
    mrp: 450,
    image: 'photo-1518770660439-4636190af475',
    category: 'Medical Devices'
  },
  {
    id: '4',
    name: 'Hand Sanitizer (500ml)',
    company: 'Dettol',
    packing: '500ml Bottle',
    mrp: 180,
    image: 'photo-1649972904349-6e44c42644a7',
    category: 'Hygiene'
  },
  {
    id: '5',
    name: 'First Aid Kit',
    company: 'Johnson & Johnson',
    packing: '1 Kit',
    mrp: 850,
    image: 'photo-1526374965328-7f61d4dc18c5',
    category: 'First Aid'
  },
  {
    id: '6',
    name: 'Glucometer with Strips',
    company: 'Accu-Chek',
    packing: '1 Device + 25 Strips',
    mrp: 1200,
    image: 'photo-1531297484001-80022131f5a1',
    category: 'Medical Devices'
  },
  {
    id: '7',
    name: 'Pulse Oximeter',
    company: 'Dr. Morepen',
    packing: '1 Unit',
    mrp: 1800,
    image: 'photo-1487058792275-0ad4aaf24ca7',
    category: 'Medical Devices'
  },
  {
    id: '8',
    name: 'Surgical Gloves (100 pieces)',
    company: 'Ansell',
    packing: 'Box of 100',
    mrp: 320,
    image: 'photo-1605810230434-7631ac76ec81',
    category: 'PPE'
  },
  {
    id: '9',
    name: 'Wheelchair Standard',
    company: 'Karma Healthcare',
    packing: '1 Unit',
    mrp: 8500,
    image: 'photo-1519389950473-47ba0277781c',
    category: 'Mobility Aids'
  },
  {
    id: '10',
    name: 'Nebulizer Machine',
    company: 'Philips Respironics',
    packing: '1 Unit',
    mrp: 3200,
    image: 'photo-1498050108023-c5249f4df085',
    category: 'Medical Devices'
  },
  {
    id: '11',
    name: 'Hot Water Bag',
    company: 'Healthgenie',
    packing: '1 Unit',
    mrp: 250,
    image: 'photo-1581092795360-fd1ca04f0952',
    category: 'Therapy'
  },
  {
    id: '12',
    name: 'Stethoscope',
    company: '3M Littmann',
    packing: '1 Unit',
    mrp: 4500,
    image: 'photo-1483058712412-4245e9b90334',
    category: 'Medical Devices'
  }
];

export const categories = [
  'All',
  'Medical Devices',
  'PPE',
  'Hygiene',
  'First Aid',
  'Mobility Aids',
  'Therapy'
];
