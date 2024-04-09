export default [
  //main routes
    {
        display_name: {
          ru: 'Главная',
          tk: 'Baş sahypa'
        },
        icon: "home",
        route: '/',
        
        sub: []
      },
      {
        display_name: {
          ru: 'Все песни',
          tk: 'Aýdymlar'
        },
        icon: "music",
        route: '/song',
        sub: []
      },
      // {
      //   display_name: {
      //     ru: 'TOP песни',
      //     tk: 'TOP Aýdymlar'
      //   },
      //   icon: "music",
      //   route: '/top-song',
      //   sub: []
      // },
      {
        display_name: {
          ru: 'Видеоклипы',
          tk: 'Şekilli aýdymlar'
        },
        icon: "video",
        route: '/videoplay',
        sub: []
      },
      {
        display_name: {
          ru: 'Исполнители',
          tk: 'Bagşylar'
        },
        icon: "microphone",
        route: '/artist',
        sub: []
      },
      {
        display_name: {
          ru: 'Альбомы',
          tk: 'Albomlar'
        },
        icon: "video",
        route: '/album',
        sub: []
      },
      {
        display_name: {
          ru: 'Сборники',
          tk: 'Playlistler'
        },
        icon: "video",
        route: '/playlist',
        sub: []
      },
      {
        display_name: {
          ru: 'Жанры',
          tk: 'Žanrlar'
        },
        icon: "genre",
        route: '/genre',
        sub: []
      },

      //optianal routes 
      {
        display_name: {
          ru: 'Избранные',
          tk: 'Halananlar'
        },
        icon: "liked",
        route: '/likedSongs',
        sub: []
      },
      {
        display_name: {
          ru: 'Избранное видео',
          tk: 'Halan videolarym'
        },
        icon: "video",
        route: '/favoriteVideo',
        sub: []
      },
      {
        display_name: {
          ru: 'Списки воспроизведения',
          tk: 'Meniň Playlistlerim'
        },
        icon: "tag",
        route: '/userPlaylist',
        sub: []
      }
]