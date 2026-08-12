export const ROUTES = {
  // ─── Public ───────────────────────────────────────────
  HOME: '/',
  NOTICES: '/notices',
  NOTICE_DETAIL: '/notices/:noticeId',
  MAP: '/map',
  MAP_DETAIL: '/map/:shopId',
  POSTS: '/posts',
  ARTISTS: '/artists',
  PAYMENT: '/payment',
  SIGNUP: '/signup',

  // ─── Auth ─────────────────────────────────────────────
  OAUTH_CALLBACK: '/oauth/callback',

  // ─── Customer (/my) ───────────────────────────────────
  MY: '/my',

  // ─── Shop (/shop) ─────────────────────────────────────
  SHOP_DASHBOARD: '/shop/dashboard',
  SHOP_MANAGE: '/shop/manage',
  SHOP_MANAGE_RESERVATIONS: '/shop/manage/reservations',
  SHOP_ARTISTS: '/shop/artists',
  SHOP_INVENTORY: '/shop/inventory',
  SHOP_CONTRACTS: '/shop/contracts',
  SHOP_SETTLEMENT_CALCULATION: '/shop/settlement-calculation',
  SHOP_SETTLEMENT_HISTORY: '/shop/settlement/history',
  SHOP_MESSAGES: '/shop/messages',
  SHOP_PROFILE: '/shop/profile',
  SHOP_NOTICES: '/shop/notices',
  SHOP_NOTICE_DETAIL: '/shop/notices/:noticeId',
  SHOP_SETTINGS: '/shop/settings',

  // ─── Artist (/artist) ─────────────────────────────────
  ARTIST_DASHBOARD: '/artist/dashboard',
  ARTIST_INVENTORY: '/artist/inventory',
  ARTIST_CONTRACTS: '/artist/contracts',
  ARTIST_SHOPS: '/artist/shops',
  ARTIST_SHIPMENTS: '/artist/shipments',
  ARTIST_SETTLEMENT_MANAGEMENT: '/artist/settlement-management',
  ARTIST_SETTLEMENTS_HISTORY: '/artist/settlements/history',
  ARTIST_MESSAGES: '/artist/messages',
  ARTIST_PROFILE: '/artist/profile',
  ARTIST_NOTICES: '/artist/notices',
  ARTIST_NOTICE_DETAIL: '/artist/notices/:noticeId',
  ARTIST_SETTINGS: '/artist/settings',

  // ─── Admin (/admin) ───────────────────────────────────
  ADMIN: '/admin',
  ADMIN_MEMBERS: '/admin/members',
  ADMIN_MAP: '/admin/map',
  ADMIN_POSTS: '/admin/posts',
  ADMIN_STORIES: '/admin/stories',
  ADMIN_CLASSES: '/admin/classes',
  ADMIN_ARTISTS: '/admin/artists',
  ADMIN_NOTICES: '/admin/notices',
  ADMIN_SETTINGS_MAIN: '/admin/settings/main',
  ADMIN_SETTINGS_DESIGN: '/admin/settings/design',
  ADMIN_MESSAGES: '/admin/messages',

  // ─── Footer ───────────────────────────────────────────
  ABOUT: '/about',
  CAREERS: '/careers',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  PARTNERSHIP: '/partnership',
  FEEDBACK: '/feedback',
  PARTNER_PRIVACY: '/partner-privacy',
} as const;
