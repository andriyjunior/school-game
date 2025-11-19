import { Animal, Category, CategoryType } from '../types';

// SVG Animal Icons
export const animalSVGs: Record<string, string> = {
  'Собака': '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#D2691E"/><circle cx="35" cy="40" r="8" fill="#000"/><circle cx="65" cy="40" r="8" fill="#000"/><ellipse cx="35" cy="25" rx="15" ry="20" fill="#D2691E"/><ellipse cx="65" cy="25" rx="15" ry="20" fill="#D2691E"/><circle cx="50" cy="60" r="5" fill="#000"/><path d="M 50 60 Q 40 70 35 75" stroke="#000" fill="none" stroke-width="2"/><path d="M 50 60 Q 60 70 65 75" stroke="#000" fill="none" stroke-width="2"/></svg>',
  'Кіт': '<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="35" fill="#FF8C00"/><path d="M 30 30 L 20 10 L 35 35 Z" fill="#FF8C00"/><path d="M 70 30 L 80 10 L 65 35 Z" fill="#FF8C00"/><circle cx="40" cy="50" r="6" fill="#32CD32"/><circle cx="60" cy="50" r="6" fill="#32CD32"/><circle cx="40" cy="50" r="3" fill="#000"/><circle cx="60" cy="50" r="3" fill="#000"/><circle cx="50" cy="60" r="3" fill="#FFB6C1"/><path d="M 30 70 L 20 75 M 40 72 L 30 78 M 60 72 L 70 78 M 70 70 L 80 75" stroke="#000" stroke-width="2"/></svg>',
  'Корова': '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="55" rx="35" ry="30" fill="#FFF"/><ellipse cx="30" cy="45" rx="12" ry="15" fill="#000"/><ellipse cx="70" cy="45" rx="12" ry="15" fill="#000"/><ellipse cx="25" cy="30" rx="8" ry="12" fill="#FFF"/><ellipse cx="75" cy="30" rx="8" ry="12" fill="#FFF"/><circle cx="40" cy="50" r="5" fill="#000"/><circle cx="60" cy="50" r="5" fill="#000"/><rect x="35" y="65" width="30" height="15" rx="5" fill="#FFB6C1"/><circle cx="45" cy="72" r="2" fill="#000"/><circle cx="55" cy="72" r="2" fill="#000"/></svg>',
  'Свиня': '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="55" rx="38" ry="32" fill="#FFB6C1"/><circle cx="50" cy="65" r="12" fill="#FFC0CB"/><circle cx="45" cy="63" r="3" fill="#000"/><circle cx="55" cy="63" r="3" fill="#000"/><circle cx="38" cy="48" r="6" fill="#000"/><circle cx="62" cy="48" r="6" fill="#000"/><ellipse cx="30" cy="35" rx="10" ry="15" fill="#FFB6C1"/><ellipse cx="70" cy="35" rx="10" ry="15" fill="#FFB6C1"/></svg>',
  'Курка': '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="30" ry="25" fill="#FF6347"/><circle cx="50" cy="40" r="18" fill="#FF6347"/><path d="M 50 30 L 45 20 L 50 25 L 55 20 Z" fill="#FF0000"/><circle cx="45" cy="38" r="3" fill="#000"/><circle cx="55" cy="38" r="3" fill="#000"/><path d="M 50 42 L 55 47 L 50 45 Z" fill="#FFA500"/><path d="M 35 50 L 25 45 L 30 52 L 25 55 Z" fill="#FF6347"/><path d="M 65 50 L 75 45 L 70 52 L 75 55 Z" fill="#FF6347"/></svg>',
  'Кінь': '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="32" ry="28" fill="#8B4513"/><ellipse cx="50" cy="35" rx="20" ry="25" fill="#8B4513"/><path d="M 45 20 L 40 10 L 48 22 L 52 22 L 60 10 L 55 20 Z" fill="#654321"/><circle cx="43" cy="35" r="4" fill="#000"/><circle cx="57" cy="35" r="4" fill="#000"/><ellipse cx="50" cy="45" rx="8" ry="6" fill="#654321"/></svg>',
  'Вівця': '<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="35" fill="#F5F5F5"/><circle cx="30" cy="45" r="15" fill="#F5F5F5"/><circle cx="70" cy="45" r="15" fill="#F5F5F5"/><circle cx="35" cy="65" r="15" fill="#F5F5F5"/><circle cx="65" cy="65" r="15" fill="#F5F5F5"/><ellipse cx="50" cy="40" rx="18" ry="20" fill="#000"/><circle cx="45" cy="38" r="3" fill="#FFF"/><circle cx="55" cy="38" r="3" fill="#FFF"/></svg>',
  'Жаба': '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="35" ry="25" fill="#32CD32"/><circle cx="35" cy="45" r="15" fill="#32CD32"/><circle cx="65" cy="45" r="15" fill="#32CD32"/><circle cx="35" cy="42" r="8" fill="#FFD700"/><circle cx="65" cy="42" r="8" fill="#FFD700"/><circle cx="35" cy="42" r="4" fill="#000"/><circle cx="65" cy="42" r="4" fill="#000"/><path d="M 40 70 Q 50 75 60 70" stroke="#000" fill="none" stroke-width="2"/></svg>',
  'Качка': '<svg viewBox="0 0 100 100"><ellipse cx="55" cy="60" rx="30" ry="25" fill="#FFD700"/><circle cx="40" cy="45" r="20" fill="#FFD700"/><circle cx="38" cy="42" r="4" fill="#000"/><path d="M 30 48 L 20 50 L 30 52 Z" fill="#FF8C00"/><ellipse cx="70" cy="65" rx="12" ry="8" fill="#FFD700"/><path d="M 25 70 L 20 80 M 30 70 L 28 80" stroke="#FF8C00" stroke-width="3"/></svg>',
  'Бджола': '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="55" rx="25" ry="30" fill="#FFD700"/><rect x="30" y="45" width="40" height="6" fill="#000"/><rect x="30" y="58" width="40" height="6" fill="#000"/><circle cx="50" cy="35" r="15" fill="#000"/><circle cx="43" cy="32" r="3" fill="#FFF"/><circle cx="57" cy="32" r="3" fill="#FFF"/><ellipse cx="25" cy="50" rx="15" ry="8" fill="#87CEEB" opacity="0.6"/><ellipse cx="75" cy="50" rx="15" ry="8" fill="#87CEEB" opacity="0.6"/></svg>',
  'Кролик': '<svg viewBox="0 0 100 100"><circle cx="50" cy="60" r="28" fill="#DDD"/><ellipse cx="35" cy="25" rx="10" ry="30" fill="#DDD"/><ellipse cx="65" cy="25" rx="10" ry="30" fill="#DDD"/><ellipse cx="35" cy="28" rx="6" ry="20" fill="#FFB6C1"/><ellipse cx="65" cy="28" rx="6" ry="20" fill="#FFB6C1"/><circle cx="43" cy="55" r="4" fill="#000"/><circle cx="57" cy="55" r="4" fill="#000"/><circle cx="50" cy="65" r="3" fill="#FFB6C1"/><path d="M 50 65 L 45 70 M 50 65 L 55 70" stroke="#000" stroke-width="2"/></svg>',
  'Ведмідь': '<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="35" fill="#8B4513"/><circle cx="30" cy="30" r="15" fill="#8B4513"/><circle cx="70" cy="30" r="15" fill="#8B4513"/><circle cx="43" cy="50" r="5" fill="#000"/><circle cx="57" cy="50" r="5" fill="#000"/><ellipse cx="50" cy="65" rx="8" ry="6" fill="#654321"/><circle cx="50" cy="70" r="4" fill="#000"/></svg>',
  'Лисиця': '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="28" ry="25" fill="#FF4500"/><path d="M 35 35 L 25 15 L 40 45 Z" fill="#FF4500"/><path d="M 65 35 L 75 15 L 60 45 Z" fill="#FF4500"/><path d="M 28 18 L 25 15 L 30 20 Z" fill="#FFF"/><path d="M 72 18 L 75 15 L 70 20 Z" fill="#FFF"/><circle cx="43" cy="52" r="5" fill="#000"/><circle cx="57" cy="52" r="5" fill="#000"/><path d="M 50 60 L 45 65 L 50 63 L 55 65 Z" fill="#000"/></svg>',
  'Вовк': '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="30" ry="26" fill="#696969"/><path d="M 35 38 L 28 20 L 40 45 Z" fill="#696969"/><path d="M 65 38 L 72 20 L 60 45 Z" fill="#696969"/><circle cx="42" cy="52" r="5" fill="#FFD700"/><circle cx="58" cy="52" r="5" fill="#FFD700"/><circle cx="42" cy="52" r="3" fill="#000"/><circle cx="58" cy="52" r="3" fill="#000"/><path d="M 50 58 L 45 62 L 50 60 L 55 62 Z" fill="#000"/><path d="M 45 65 L 40 68 M 50 66 L 50 70 M 55 65 L 60 68" stroke="#FFF" stroke-width="2"/></svg>',
  'Миша': '<svg viewBox="0 0 100 100"><ellipse cx="55" cy="60" rx="25" ry="22" fill="#A9A9A9"/><circle cx="40" cy="45" r="18" fill="#A9A9A9"/><ellipse cx="25" cy="35" rx="15" ry="20" fill="#A9A9A9" opacity="0.7"/><ellipse cx="28" cy="38" rx="10" ry="15" fill="#FFB6C1"/><circle cx="38" cy="42" r="4" fill="#000"/><circle cx="42" cy="48" r="2" fill="#FFB6C1"/><path d="M 45 50 L 70 48 M 45 52 L 70 55 M 45 54 L 68 60" stroke="#000" stroke-width="1"/></svg>',
  'Папуга': '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="28" ry="30" fill="#FF1493"/><circle cx="50" cy="40" r="22" fill="#FF1493"/><path d="M 45 28 L 40 18 L 42 30 L 48 25 L 52 25 L 58 30 L 60 18 L 55 28 Z" fill="#FFD700"/><circle cx="44" cy="38" r="6" fill="#FFF"/><circle cx="56" cy="38" r="6" fill="#FFF"/><circle cx="44" cy="38" r="3" fill="#000"/><circle cx="56" cy="38" r="3" fill="#000"/><path d="M 50 45 L 52 50 L 50 48 Z" fill="#FF8C00"/><ellipse cx="72" cy="65" rx="18" ry="10" fill="#00CED1"/></svg>',
  'Їжак': '<svg viewBox="0 0 100 100"><ellipse cx="55" cy="60" rx="30" ry="22" fill="#8B4513"/><path d="M 30 50 L 25 40 M 35 48 L 28 35 M 40 46 L 35 32 M 45 45 L 42 30 M 50 44 L 50 28 M 55 45 L 58 30 M 60 46 L 65 32 M 65 48 L 72 35 M 70 50 L 75 40 M 75 55 L 82 48" stroke="#654321" stroke-width="3"/><ellipse cx="40" cy="58" rx="15" ry="12" fill="#D2B48C"/><circle cx="35" cy="56" r="3" fill="#000"/><circle cx="32" cy="60" r="2" fill="#000"/></svg>',
  'Сова': '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="55" rx="32" ry="38" fill="#8B7355"/><circle cx="40" cy="45" r="14" fill="#F5F5DC"/><circle cx="60" cy="45" r="14" fill="#F5F5DC"/><circle cx="40" cy="45" r="8" fill="#FFD700"/><circle cx="60" cy="45" r="8" fill="#FFD700"/><circle cx="40" cy="45" r="4" fill="#000"/><circle cx="60" cy="45" r="4" fill="#000"/><path d="M 50 52 L 48 58 L 52 58 Z" fill="#FF8C00"/><path d="M 22 40 L 18 35 L 25 42 L 22 48 Z" fill="#8B7355"/><path d="M 78 40 L 82 35 L 75 42 L 78 48 Z" fill="#8B7355"/></svg>',
  'Пінгвін': '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="30" ry="35" fill="#000"/><ellipse cx="50" cy="62" rx="22" ry="28" fill="#FFF"/><circle cx="50" cy="35" r="18" fill="#000"/><circle cx="50" cy="38" r="14" fill="#FFF"/><circle cx="45" cy="35" r="4" fill="#000"/><circle cx="55" cy="35" r="4" fill="#000"/><path d="M 50 42 L 52 47 L 50 45 Z" fill="#FF8C00"/><ellipse cx="28" cy="65" rx="8" ry="22" fill="#000"/><ellipse cx="72" cy="65" rx="8" ry="22" fill="#000"/></svg>',
  'Зебра': '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="32" ry="28" fill="#FFF"/><ellipse cx="45" cy="35" rx="18" ry="22" fill="#FFF"/><rect x="25" y="45" width="50" height="5" fill="#000"/><rect x="25" y="55" width="50" height="5" fill="#000"/><rect x="25" y="65" width="50" height="5" fill="#000"/><rect x="35" y="25" width="20" height="4" fill="#000"/><rect x="35" y="35" width="20" height="4" fill="#000"/><circle cx="40" cy="32" r="4" fill="#000"/><circle cx="50" cy="32" r="4" fill="#000"/></svg>'
};

interface AnimalData extends Animal {
  color: string;
  category: CategoryType;
}

// Animal Data with Categories
export const animals: AnimalData[] = [
  { name: 'Собака', icon: 'SVG', sound: 'Гав-гав', home: 'Будка', hint: 'Найкращий друг людини', color: '#D2691E', category: 'farm' },
  { name: 'Кіт', icon: 'SVG', sound: 'Мяу-мяу', home: 'Будинок', hint: 'Любить молоко і м\'ячик', color: '#FF8C00', category: 'farm' },
  { name: 'Корова', icon: 'SVG', sound: 'Му-му', home: 'Хлів', hint: 'Дає молоко', color: '#000', category: 'farm' },
  { name: 'Свиня', icon: 'SVG', sound: 'Хрю-хрю', home: 'Свинарник', hint: 'Любить калюжі', color: '#FFB6C1', category: 'farm' },
  { name: 'Курка', icon: 'SVG', sound: 'Ко-ко-ко', home: 'Курник', hint: 'Несе яйця', color: '#FF6347', category: 'birds' },
  { name: 'Кінь', icon: 'SVG', sound: 'Іго-го', home: 'Стайня', hint: 'Швидко бігає', color: '#8B4513', category: 'farm' },
  { name: 'Вівця', icon: 'SVG', sound: 'Бе-е-е', home: 'Кошара', hint: 'Дає вовну', color: '#F5F5F5', category: 'farm' },
  { name: 'Жаба', icon: 'SVG', sound: 'Ква-ква', home: 'Болото', hint: 'Стрибає і плаває', color: '#32CD32', category: 'wild' },
  { name: 'Качка', icon: 'SVG', sound: 'Кря-кря', home: 'Ставок', hint: 'Плаває у воді', color: '#FFD700', category: 'birds' },
  { name: 'Бджола', icon: 'SVG', sound: 'Дзижчить', home: 'Вулик', hint: 'Робить мед', color: '#FFD700', category: 'insects' },
  { name: 'Кролик', icon: 'SVG', sound: 'Тихо', home: 'Нора', hint: 'Любить моркву', color: '#DDD', category: 'farm' },
  { name: 'Ведмідь', icon: 'SVG', sound: 'Гарр', home: 'Барліг', hint: 'Спить взимку', color: '#8B4513', category: 'wild' },
  { name: 'Лисиця', icon: 'SVG', sound: 'Тяв-тяв', home: 'Нора', hint: 'Руда і хитра', color: '#FF4500', category: 'wild' },
  { name: 'Вовк', icon: 'SVG', sound: 'Ау-ау', home: 'Ліс', hint: 'Виє на місяць', color: '#696969', category: 'wild' },
  { name: 'Миша', icon: 'SVG', sound: 'Пі-пі', home: 'Нірка', hint: 'Боїться кота', color: '#A9A9A9', category: 'wild' },
  { name: 'Папуга', icon: 'SVG', sound: 'Повторює слова', home: 'Клітка', hint: 'Яскравий пташка', color: '#FF1493', category: 'birds' },
  { name: 'Їжак', icon: 'SVG', sound: 'Пихтить', home: 'Нора', hint: 'Має колючки', color: '#8B4513', category: 'wild' },
  { name: 'Сова', icon: 'SVG', sound: 'Угу-угу', home: 'Дупло', hint: 'Літає вночі', color: '#8B7355', category: 'birds' },
  { name: 'Пінгвін', icon: 'SVG', sound: 'Кря', home: 'Антарктида', hint: 'Не літає, плаває', color: '#000', category: 'birds' },
  { name: 'Зебра', icon: 'SVG', sound: 'Іга', home: 'Савана', hint: 'У смужку', color: '#000', category: 'wild' }
];

interface CategoryWithGradient extends Category {
  gradient: string;
}

// Category definitions
export const categories: Record<string, CategoryWithGradient> = {
  farm: { name: 'Свійські тварини', icon: '🏠', description: '', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  wild: { name: 'Дикі тварини', icon: '🌲', description: '', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  birds: { name: 'Птахи', icon: '🦅', description: '', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  insects: { name: 'Комахи', icon: '🐝', description: '', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }
};

// Get animals by category
export function getAnimalsByCategory(category: CategoryType | 'all'): AnimalData[] {
  if (category === 'all') return animals;
  return animals.filter(animal => animal.category === category);
}

// Get available categories (that have animals)
export function getAvailableCategories(): Array<CategoryWithGradient & { id: string }> {
  const usedCategories = new Set(animals.map(a => a.category));
  return Object.entries(categories)
    .filter(([key]) => usedCategories.has(key as CategoryType))
    .map(([key, value]) => ({ id: key, ...value }));
}

// Helper functions
export function getAnimalIcon(animalName: string): string {
  return animalSVGs[animalName] || '';
}

export function getMiniIcon(animalName: string): string {
  return '<span class="animal-mini-icon">' + (animalSVGs[animalName] || '') + '</span>';
}
