import { Release, Episode, Genre } from '../types/api';

// Мок-данные для демонстрации компонентов
export const mockAnimeData: Release[] = [
  {
    id: 1,
    alias: 'attack-on-titan',
    name: {
      main: 'Атака титанов',
      russian: 'Атака титанов',
      english: 'Attack on Titan',
      japanese: '進撃の巨人',
    },
    title: {
      main: 'Атака титанов',
      russian: 'Атака титанов',
      english: 'Attack on Titan',
      japanese: '進撃の巨人',
    },
    type: {
      value: 'TV',
      description: 'ТВ'
    },
    year: 2013,
    season: {
      value: 'spring',
      description: 'Весна'
    },
    poster: {
      src: '/storage/releases/posters/1/attack-on-titan-poster.jpg',
      preview: '/storage/releases/posters/1/attack-on-titan-poster.jpg',
      thumbnail: '/storage/releases/posters/1/attack-on-titan-thumb.jpg',
      optimized: {
        src: '/storage/releases/posters/1/attack-on-titan-poster.webp',
        preview: '/storage/releases/posters/1/attack-on-titan-poster.webp',
        thumbnail: '/storage/releases/posters/1/attack-on-titan-thumb.webp',
      },
    },
    rating: 9.2,
    is_ongoing: false,
    is_in_production: false,
    age_rating: {
      value: 'R16_PLUS',
      label: '16+',
      is_adult: false,
      description: 'Для людей, достигших возраста шестнадцати лет (16+)'
    },
    publish_day: {
      value: 1,
      description: 'Понедельник'
    },
    description: 'Человечество находится на грани вымирания. Стены, защищающие людей от титанов, пали, и теперь человечеству предстоит сражаться за выживание. Эрен Йегер, Микаса Аккерман и Армин Арлерт присоединяются к Разведкорпусу, чтобы отомстить за гибель своих близких и защитить человечество.',
    genres: [
      { id: 1, name: 'Драма', total_releases: 343 },
      { id: 2, name: 'Фэнтези', total_releases: 234 },
      { id: 3, name: 'Экшен', total_releases: 456 },
      { id: 4, name: 'Триллер', total_releases: 123 }
    ],
    episodes_total: 25,
    average_duration_of_episode: 24,
    episodes: Array.from({ length: 25 }, (_, i) => ({
      id: `episode-${i + 1}`,
      name: `Эпизод ${i + 1}`,
      ordinal: i + 1,
      duration: 1440, // 24 минуты в секундах
      hls_480: `https://example.com/video/480/episode-${i + 1}.m3u8`,
      hls_720: `https://example.com/video/720/episode-${i + 1}.m3u8`,
      hls_1080: `https://example.com/video/1080/episode-${i + 1}.m3u8`,
      updated_at: new Date().toISOString(),
      sort_order: i + 1,
      release_id: 1
    })),
    fresh_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    added_in_users_favorites: 15420,
    added_in_planned_collection: 2340,
    added_in_watched_collection: 8900,
    added_in_watching_collection: 1200,
    added_in_postponed_collection: 450,
    added_in_abandoned_collection: 230,
  },
  {
    id: 2,
    alias: 'demon-slayer',
    name: {
      main: 'Клинок, рассекающий демонов',
      russian: 'Клинок, рассекающий демонов',
      english: 'Demon Slayer',
      japanese: '鬼滅の刃',
    },
    title: {
      main: 'Клинок, рассекающий демонов',
      russian: 'Клинок, рассекающий демонов',
      english: 'Demon Slayer',
      japanese: '鬼滅の刃',
    },
    type: {
      value: 'TV',
      description: 'ТВ'
    },
    year: 2019,
    season: {
      value: 'spring',
      description: 'Весна'
    },
    poster: {
      src: '/storage/releases/posters/2/demon-slayer-poster.jpg',
      preview: '/storage/releases/posters/2/demon-slayer-poster.jpg',
      thumbnail: '/storage/releases/posters/2/demon-slayer-thumb.jpg',
      optimized: {
        src: '/storage/releases/posters/2/demon-slayer-poster.webp',
        preview: '/storage/releases/posters/2/demon-slayer-poster.webp',
        thumbnail: '/storage/releases/posters/2/demon-slayer-thumb.webp',
      },
    },
    rating: 8.9,
    is_ongoing: true,
    is_in_production: true,
    age_rating: {
      value: 'R16_PLUS',
      label: '16+',
      is_adult: false,
      description: 'Для людей, достигших возраста шестнадцати лет (16+)'
    },
    publish_day: {
      value: 7,
      description: 'Воскресенье'
    },
    description: 'История о юноше Танджиро Камадо, который стал охотником на демонов после того, как его семья была убита демоном, а его сестра Незуко превращена в демона. Теперь он путешествует по Японии, чтобы найти способ превратить сестру обратно в человека и отомстить за свою семью.',
    genres: [
      { id: 5, name: 'Экшен', total_releases: 456 },
      { id: 6, name: 'Фэнтези', total_releases: 234 },
      { id: 7, name: 'Школа', total_releases: 345 },
      { id: 8, name: 'Драма', total_releases: 343 }
    ],
    episodes_total: 26,
    average_duration_of_episode: 24,
    episodes: Array.from({ length: 26 }, (_, i) => ({
      id: `episode-${i + 1}`,
      name: `Эпизод ${i + 1}`,
      ordinal: i + 1,
      duration: 1440, // 24 минуты в секундах
      hls_480: `https://example.com/video/480/episode-${i + 1}.m3u8`,
      hls_720: `https://example.com/video/720/episode-${i + 1}.m3u8`,
      hls_1080: `https://example.com/video/1080/episode-${i + 1}.m3u8`,
      updated_at: new Date().toISOString(),
      sort_order: i + 1,
      release_id: 2
    })),
    fresh_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    added_in_users_favorites: 12890,
    added_in_planned_collection: 1890,
    added_in_watched_collection: 7600,
    added_in_watching_collection: 2100,
    added_in_postponed_collection: 320,
    added_in_abandoned_collection: 180,
  },
  {
    id: 3,
    alias: 'one-piece',
    name: {
      main: 'Ван-Пис',
      russian: 'Ван-Пис',
      english: 'One Piece',
      japanese: 'ワンピース',
    },
    title: {
      main: 'Ван-Пис',
      russian: 'Ван-Пис',
      english: 'One Piece',
      japanese: 'ワンピース',
    },
    type: {
      value: 'TV',
      description: 'ТВ'
    },
    year: 1999,
    season: {
      value: 'autumn',
      description: 'Осень'
    },
    poster: {
      src: '/storage/releases/posters/3/one-piece-poster.jpg',
      preview: '/storage/releases/posters/3/one-piece-poster.jpg',
      thumbnail: '/storage/releases/posters/3/one-piece-thumb.jpg',
      optimized: {
        src: '/storage/releases/posters/3/one-piece-poster.webp',
        preview: '/storage/releases/posters/3/one-piece-poster.webp',
        thumbnail: '/storage/releases/posters/3/one-piece-thumb.webp',
      },
    },
    rating: 9.5,
    is_ongoing: true,
    is_in_production: true,
    age_rating: {
      value: 'R12_PLUS',
      label: '12+',
      is_adult: false,
      description: 'Для людей, достигших возраста двенадцати лет (12+)'
    },
    publish_day: {
      value: 7,
      description: 'Воскресенье'
    },
    description: 'Приключения Монки Д. Луффи и его команды пиратов, известных как Пираты Соломенной Шляпы. Луффи мечтает стать Королем Пиратов и найти легендарное сокровище Ван-Пис. Вместе со своей командой он путешествует по Гранд Лайн, сражаясь с другими пиратами, морскими пехотинцами и различными врагами.',
    genres: [
      { id: 9, name: 'Приключения', total_releases: 234 },
      { id: 10, name: 'Комедия', total_releases: 345 },
      { id: 11, name: 'Романтика', total_releases: 434 },
      { id: 12, name: 'Фэнтези', total_releases: 234 }
    ],
    episodes_total: 1000,
    average_duration_of_episode: 24,
    episodes: Array.from({ length: 20 }, (_, i) => ({
      id: `episode-${i + 1}`,
      name: `Эпизод ${i + 1}`,
      ordinal: i + 1,
      duration: 1440, // 24 минуты в секундах
      hls_480: `https://example.com/video/480/episode-${i + 1}.m3u8`,
      hls_720: `https://example.com/video/720/episode-${i + 1}.m3u8`,
      hls_1080: `https://example.com/video/1080/episode-${i + 1}.m3u8`,
      updated_at: new Date().toISOString(),
      sort_order: i + 1,
      release_id: 3
    })),
    fresh_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    added_in_users_favorites: 23450,
    added_in_planned_collection: 4560,
    added_in_watched_collection: 15600,
    added_in_watching_collection: 8900,
    added_in_postponed_collection: 1200,
    added_in_abandoned_collection: 800,
  },
  {
    id: 4,
    alias: 'my-hero-academia',
    name: {
      main: 'Моя геройская академия',
      russian: 'Моя геройская академия',
      english: 'My Hero Academia',
      japanese: '僕のヒーローアカデミア',
    },
    title: {
      main: 'Моя геройская академия',
      russian: 'Моя геройская академия',
      english: 'My Hero Academia',
      japanese: '僕のヒーローアカデミア',
    },
    type: {
      value: 'TV',
      description: 'ТВ'
    },
    year: 2016,
    season: {
      value: 'spring',
      description: 'Весна'
    },
    poster: {
      src: '/storage/releases/posters/4/my-hero-academia-poster.jpg',
      preview: '/storage/releases/posters/4/my-hero-academia-poster.jpg',
      thumbnail: '/storage/releases/posters/4/my-hero-academia-thumb.jpg',
      optimized: {
        src: '/storage/releases/posters/4/my-hero-academia-poster.webp',
        preview: '/storage/releases/posters/4/my-hero-academia-poster.webp',
        thumbnail: '/storage/releases/posters/4/my-hero-academia-thumb.webp',
      },
    },
    rating: 8.7,
    is_ongoing: false,
    is_in_production: false,
    age_rating: {
      value: 'R12_PLUS',
      label: '12+',
      is_adult: false,
      description: 'Для людей, достигших возраста двенадцати лет (12+)'
    },
    publish_day: {
      value: 6,
      description: 'Суббота'
    },
    description: 'В мире, где 80% населения обладает сверхспособностями, называемыми "причудами", Изуку Мидория мечтает стать величайшим героем, несмотря на то, что родился без причуд. После встречи с Всемогущим, величайшим героем в мире, Мидория получает шанс поступить в академию героев и начать свой путь к становлению настоящим героем.',
    genres: [
      { id: 13, name: 'Экшен', total_releases: 456 },
      { id: 14, name: 'Школа', total_releases: 345 },
      { id: 15, name: 'Фэнтези', total_releases: 234 },
      { id: 16, name: 'Драма', total_releases: 343 }
    ],
    episodes_total: 25,
    average_duration_of_episode: 24,
    episodes: Array.from({ length: 25 }, (_, i) => ({
      id: `episode-${i + 1}`,
      name: `Эпизод ${i + 1}`,
      ordinal: i + 1,
      duration: 1440, // 24 минуты в секундах
      hls_480: `https://example.com/video/480/episode-${i + 1}.m3u8`,
      hls_720: `https://example.com/video/720/episode-${i + 1}.m3u8`,
      hls_1080: `https://example.com/video/1080/episode-${i + 1}.m3u8`,
      updated_at: new Date().toISOString(),
      sort_order: i + 1,
      release_id: 4
    })),
    fresh_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    added_in_users_favorites: 9870,
    added_in_planned_collection: 1450,
    added_in_watched_collection: 6700,
    added_in_watching_collection: 1200,
    added_in_postponed_collection: 280,
    added_in_abandoned_collection: 150,
  },
  {
    id: 5,
    alias: 'naruto',
    name: {
      main: 'Наруто',
      russian: 'Наруто',
      english: 'Naruto',
      japanese: 'ナルト',
    },
    title: {
      main: 'Наруто',
      russian: 'Наруто',
      english: 'Naruto',
      japanese: 'ナルト',
    },
    type: {
      value: 'TV',
      description: 'ТВ'
    },
    year: 2002,
    season: {
      value: 'autumn',
      description: 'Осень'
    },
    poster: {
      src: '/storage/releases/posters/5/naruto-poster.jpg',
      preview: '/storage/releases/posters/5/naruto-poster.jpg',
      thumbnail: '/storage/releases/posters/5/naruto-thumb.jpg',
      optimized: {
        src: '/storage/releases/posters/5/naruto-poster.webp',
        preview: '/storage/releases/posters/5/naruto-poster.webp',
        thumbnail: '/storage/releases/posters/5/naruto-thumb.webp',
      },
    },
    rating: 8.4,
    is_ongoing: false,
    is_in_production: false,
    age_rating: {
      value: 'R12_PLUS',
      label: '12+',
      is_adult: false,
      description: 'Для людей, достигших возраста двенадцати лет (12+)'
    },
    publish_day: {
      value: 4,
      description: 'Четверг'
    },
    description: 'История молодого ниндзя Узумаки Наруто, который мечтает стать Хокаге, лидером своей деревни. Родившись с демоном-лисом внутри себя, Наруто сталкивается с предрассудками и одиночеством, но благодаря своей настойчивости и дружбе с товарищами по команде, он преодолевает все препятствия на пути к своей цели.',
    genres: [
      { id: 17, name: 'Экшен', total_releases: 456 },
      { id: 18, name: 'Приключения', total_releases: 234 },
      { id: 19, name: 'Фэнтези', total_releases: 234 },
      { id: 20, name: 'Драма', total_releases: 343 }
    ],
    episodes_total: 220,
    average_duration_of_episode: 24,
    episodes: Array.from({ length: 20 }, (_, i) => ({
      id: `episode-${i + 1}`,
      name: `Эпизод ${i + 1}`,
      ordinal: i + 1,
      duration: 1440, // 24 минуты в секундах
      hls_480: `https://example.com/video/480/episode-${i + 1}.m3u8`,
      hls_720: `https://example.com/video/720/episode-${i + 1}.m3u8`,
      hls_1080: `https://example.com/video/1080/episode-${i + 1}.m3u8`,
      updated_at: new Date().toISOString(),
      sort_order: i + 1,
      release_id: 5
    })),
    fresh_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    added_in_users_favorites: 18760,
    added_in_planned_collection: 2890,
    added_in_watched_collection: 12300,
    added_in_watching_collection: 2100,
    added_in_postponed_collection: 890,
    added_in_abandoned_collection: 670,
  },
];

// Функция для получения случайных аниме
export const getRandomAnime = (count: number = 5): Release[] => {
  const shuffled = [...mockAnimeData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Функция для получения популярных аниме
export const getPopularAnime = (): Release[] => {
  return [...mockAnimeData].sort((a, b) => (b.rating || 0) - (a.rating || 0));
};

// Функция для получения последних обновлений
export const getLatestAnime = (): Release[] => {
  return [...mockAnimeData].sort((a, b) => 
    new Date(b.fresh_at || 0).getTime() - new Date(a.fresh_at || 0).getTime()
  );
};
