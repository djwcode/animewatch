import { Release } from '../types/api';

/**
 * Получает локализованное название аниме с приоритетом русского языка
 */
export const getLocalizedTitle = (anime: Release): string => {
  // Приоритет: русское название (main/name.main) > английское > японское
  if (anime.name?.main) return anime.name.main;
  if (anime.title?.main) return anime.title.main;
  if (anime.name?.russian) return anime.name.russian;
  if (anime.title?.russian) return anime.title.russian;
  if (anime.name?.english) return anime.name.english;
  if (anime.title?.english) return anime.title.english;
  if (anime.name?.japanese) return anime.name.japanese;
  if (anime.title?.japanese) return anime.title.japanese;
  return anime.alias || 'Без названия';
};

/**
 * Получает дополнительное название (подзаголовок) для аниме
 */
export const getSubtitle = (anime: Release): string | null => {
  const mainTitle = getLocalizedTitle(anime);
  
  // Показываем английское название как подзаголовок, если основное - русское
  if (mainTitle === (anime.name?.main || anime.title?.main)) {
    return anime.name?.english || anime.title?.english || null;
  }
  
  // Или показываем японское название, если оно отличается от основного
  const japaneseTitle = anime.name?.japanese || anime.title?.japanese;
  if (japaneseTitle && japaneseTitle !== mainTitle) {
    return japaneseTitle;
  }
  
  return null;
};

/**
 * Получает статус аниме на русском языке
 */
export const getLocalizedStatus = (status: string): string => {
  switch (status) {
    case 'IS_ONGOING':
      return 'Онгоинг';
    case 'IS_COMPLETED':
      return 'Завершён';
    case 'IS_ANNOUNCED':
      return 'Анонс';
    default:
      return status;
  }
};
