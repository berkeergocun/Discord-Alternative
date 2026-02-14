export const useMockData = () => {
  const mockServers = [
    {
      id: 'server1',
      name: 'Minespear',
      icon: '',
      hasNotification: true,
      unreadCount: 5,
      banner: '/images/minecraft-banner.png',
      bannerColor: '#2B7A3D',
      description: 'Minecraft Türkiye\'nin en iyi survival sunucusu! 🎮',
      boostLevel: 2,
      boostCount: 21,
      boostGoal: 31
    },
    {
      id: 'server2',
      name: 'Oyun Sunucusu',
      icon: '',
      hasNotification: false,
      unreadCount: 0,
      banner: '',
      bannerColor: '#E74C3C',
      description: 'Her türlü oyun için topluluk sunucusu',
      boostLevel: 1,
      boostCount: 8,
      boostGoal: 15
    },
    {
      id: 'server3',
      name: 'Yazılım',
      icon: '',
      hasNotification: true,
      unreadCount: 2,
      banner: '',
      bannerColor: '#3498DB',
      description: 'Yazılım geliştiricileri için bilgi paylaşım platformu 💻',
      boostLevel: 3,
      boostCount: 45,
      boostGoal: 60
    },
    {
      id: 'server4',
      name: 'Müzik',
      icon: '',
      hasNotification: false,
      unreadCount: 0,
      banner: '',
      bannerColor: '#9B59B6',
      description: 'Müzik severler burada! 🎵',
      boostLevel: 0,
      boostCount: 3,
      boostGoal: 7
    }
  ]

  const mockFriends = [
    {
      id: 'user1',
      username: 'Archie',
      displayName: 'Archie',
      avatar: '',
      banner: '',
      bannerColor: '#5865F2',
      status: 'online' as const,
      activity: 'Visual Studio Code',
      activityType: 'playing' as const,
      activityDetails: 'Discord Alternative projesi',
      timestamp: new Date(Date.now() - 15 * 60000),
      customStatus: 'Coding is life 💻',
      createdAt: new Date('2020-05-15'),
      badges: ['early_supporter', 'verified'],
      roles: ['admin']
    },
    {
      id: 'user2',
      username: 'NatNevada',
      displayName: 'Nat Nevada',
      avatar: '',
      banner: '',
      bannerColor: '#ED4245',
      status: 'idle' as const,
      activity: 'Spotify',
      activityType: 'listening' as const,
      activityDetails: 'Lo-fi beats to relax/study to',
      timestamp: new Date(Date.now() - 45 * 60000),
      customStatus: 'Boşta 🎵',
      createdAt: new Date('2019-03-22'),
      badges: ['premium'],
      roles: ['admin']
    },
    {
      id: 'user3',
      username: 'PlakoBot',
      displayName: 'Plako Bot',
      avatar: '',
      status: 'online' as const,
      bot: true,
      customStatus: 'Bot hizmette ⚙️',
      createdAt: new Date('2021-01-10'),
      roles: ['bot']
    },
    {
      id: 'user4',
      username: 'Cryzalia',
      displayName: 'Cryzalia',
      avatar: '',
      banner: '',
      bannerColor: '#57F287',
      status: 'dnd' as const,
      activity: 'Minecraft',
      activityType: 'playing' as const,
      activityDetails: 'Survival Mode',
      timestamp: new Date(Date.now() - 5 * 60000),
      customStatus: 'Rahatsız Etmeyin! 🎮',
      createdAt: new Date('2018-11-30'),
      badges: ['hypesquad'],
      roles: ['member']
    },
    {
      id: 'user5',
      username: 'SiraBakim',
      displayName: 'Sıra Bakım',
      avatar: '',
      status: 'offline' as const,
      createdAt: new Date('2022-07-05'),
      roles: ['member']
    },
    {
      id: 'user6',
      username: 'PixkoBot',
      displayName: 'Pixko Bot',
      avatar: '',
      status: 'online' as const,
      bot: true,
      customStatus: 'Moderasyon botu 🤖',
      createdAt: new Date('2021-06-18'),
      roles: ['bot']
    }
  ]

  const mockDMs = [
    {
      id: 'dm1',
      type: 'dm' as const,
      userId: 'user1',
      name: 'Archie',
      avatar: '',
      status: 'online' as const,
      lastMessage: 'Hey! Projeyi gördün mü?',
      timestamp: new Date(Date.now() - 300000),
      unreadCount: 2
    },
    {
      id: 'dm2',
      type: 'dm' as const,
      userId: 'user2',
      name: 'NatNevada',
      avatar: '',
      status: 'idle' as const,
      lastMessage: 'Yarın görüşürüz',
      timestamp: new Date(Date.now() - 3600000),
      unreadCount: 0
    },
    {
      id: 'dm3',
      type: 'group' as const,
      name: 'Proje Ekibi',
      owner: 'user1',
      members: ['user1', 'user2', 'user4'],
      lastMessage: 'Cryzalia: Toplantı saat kaçta?',
      timestamp: new Date(Date.now() - 7200000),
      unreadCount: 5
    },
    {
      id: 'dm4',
      type: 'dm' as const,
      userId: 'user4',
      name: 'Cryzalia',
      avatar: '',
      status: 'dnd' as const,
      lastMessage: 'Oyuna gelsene',
      timestamp: new Date(Date.now() - 86400000),
      unreadCount: 0
    }
  ]

  const mockChannels = {
    server1: [
      {
        id: 'cat1',
        name: 'METİN KANALLARI',
        channels: [
          { id: 'ch1', name: 'genel', type: 'text' as const, hasUnread: true },
          { id: 'ch2', name: 'duyurular', type: 'announcement' as const },
          { id: 'ch3', name: 'chat', type: 'text' as const, unreadCount: 3 },
          { id: 'ch4', name: 'memes', type: 'text' as const },
        ]
      },
      {
        id: 'cat2',
        name: 'SES KANALLARI',
        channels: [
          { id: 'vc1', name: 'Genel', type: 'voice' as const, activeUsers: 5, maxUsers: 10 },
          { id: 'vc2', name: 'Oyun', type: 'voice' as const, activeUsers: 2, maxUsers: 5 },
          { id: 'vc3', name: 'Müzik', type: 'voice' as const, activeUsers: 0, maxUsers: 8 },
        ]
      }
    ],
    server2: [
      {
        id: 'cat3',
        name: 'OYUN',
        channels: [
          { id: 'ch5', name: 'minecraft', type: 'text' as const },
          { id: 'ch6', name: 'valorant', type: 'text' as const },
          { id: 'ch7', name: 'lol', type: 'text' as const },
        ]
      },
      {
        id: 'cat4',
        name: 'SES',
        channels: [
          { id: 'vc4', name: 'Oyun Odası', type: 'voice' as const, activeUsers: 3, maxUsers: 8 },
        ]
      }
    ],
    server3: [
      {
        id: 'cat5',
        name: 'GENEL',
        channels: [
          { id: 'ch8', name: 'genel', type: 'text' as const, unreadCount: 2 },
          { id: 'ch9', name: 'projeler', type: 'text' as const },
          { id: 'ch10', name: 'yardım', type: 'text' as const },
        ]
      }
    ],
    server4: [
      {
        id: 'cat6',
        name: 'MÜZİK',
        channels: [
          { id: 'ch11', name: 'müzik-paylaşım', type: 'text' as const },
          { id: 'vc5', name: 'Dinleme Odası', type: 'voice' as const, activeUsers: 0, maxUsers: 12 },
        ]
      }
    ]
  }

  const mockMessages = {
    ch1: [
      {
        id: 'msg1',
        author: mockFriends[0],
        content: 'Merhaba herkese! Sunucuya hoş geldiniz 👋',
        timestamp: new Date(Date.now() - 7200000)
      },
      {
        id: 'msg2',
        author: mockFriends[1],
        content: 'Teşekkürler! Burası çok güzel olmuş',
        timestamp: new Date(Date.now() - 7000000),
        reactions: [
          { emoji: '👍', count: 3, reacted: true },
          { emoji: '❤️', count: 2, reacted: false }
        ]
      },
      {
        id: 'msg3',
        author: mockFriends[3],
        content: 'Bu akşam oyuna gelin',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: 'msg4',
        author: { id: 'me', username: 'kullanici', displayName: 'Kullanıcı', avatar: '' },
        content: 'Tamam, akşam online olacağım',
        timestamp: new Date(Date.now() - 3500000),
        replyTo: {
          id: 'msg3',
          author: 'Cryzalia',
          content: 'Bu akşam oyuna gelin'
        }
      },
      {
        id: 'msg5',
        author: mockFriends[2],
        content: 'Sunucuda 156 kişi online!',
        timestamp: new Date(Date.now() - 1800000)
      }
    ],
    ch3: [
      {
        id: 'msg6',
        author: mockFriends[0],
        content: 'Minespear serveri açıldı! Hadi gelin',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: 'msg7',
        author: mockFriends[1],
        content: 'IP nedir?',
        timestamp: new Date(Date.now() - 3500000)
      },
      {
        id: 'msg8',
        author: mockFriends[0],
        content: 'mc.minespear.com',
        timestamp: new Date(Date.now() - 3400000)
      }
    ],
    dm1: [
      {
        id: 'dm1-msg1',
        author: mockFriends[0],
        content: 'Hey! Projeyi gördün mü?',
        timestamp: new Date(Date.now() - 600000)
      },
      {
        id: 'dm1-msg2',
        author: { id: 'me', username: 'kullanici', displayName: 'Kullanıcı', avatar: '' },
        content: 'Evet, çok güzel olmuş! Tebrikler',
        timestamp: new Date(Date.now() - 540000)
      },
      {
        id: 'dm1-msg3',
        author: mockFriends[0],
        content: 'Teşekkürler! Senin yardımın olmasaydı yapamazdım.',
        timestamp: new Date(Date.now() - 480000)
      },
      {
        id: 'dm1-msg4',
        author: mockFriends[0],
        content: 'Bu akşam online olacak mısın?',
        timestamp: new Date(Date.now() - 300000)
      }
    ],
    dm2: [
      {
        id: 'dm2-msg1',
        author: mockFriends[1],
        content: 'Toplantı notlarını gönderdim',
        timestamp: new Date(Date.now() - 7200000)
      },
      {
        id: 'dm2-msg2',
        author: { id: 'me', username: 'kullanici', displayName: 'Kullanıcı', avatar: '' },
        content: 'Teşekkürler, kontrol ediyorum',
        timestamp: new Date(Date.now() - 7000000)
      },
      {
        id: 'dm2-msg3',
        author: mockFriends[1],
        content: 'Yarın görüşürüz',
        timestamp: new Date(Date.now() - 3600000)
      }
    ],
    dm3: [
      {
        id: 'dm3-msg1',
        author: mockFriends[0],
        content: 'Proje için toplantı yapalım mı?',
        timestamp: new Date(Date.now() - 10800000)
      },
      {
        id: 'dm3-msg2',
        author: { id: 'me', username: 'kullanici', displayName: 'Kullanıcı', avatar: '' },
        content: 'Olur, saat 15:00 uygun mu?',
        timestamp: new Date(Date.now() - 10000000)
      },
      {
        id: 'dm3-msg3',
        author: mockFriends[1],
        content: 'Bana uyar 👍',
        timestamp: new Date(Date.now() - 9800000)
      },
      {
        id: 'dm3-msg4',
        author: mockFriends[3],
        content: 'Toplantı saat kaçta?',
        timestamp: new Date(Date.now() - 7200000)
      }
    ],
    dm4: [
      {
        id: 'dm4-msg1',
        author: mockFriends[3],
        content: 'Oyuna gelsene',
        timestamp: new Date(Date.now() - 86400000)
      }
    ]
  }

  const mockMembers = mockFriends

  const mockRoles = [
    { id: 'admin', name: 'Yöneticiler', color: '#E74C3C' },
    { id: 'bot', name: 'Botlar', color: '#5865F2' },
    { id: 'member', name: 'Çevrimiçi', color: '#B5BAC1' }
  ]

  return {
    mockServers,
    mockChannels,
    mockDMs,
    mockFriends,
    mockMessages,
    mockMembers,
    mockRoles
  }
}
