const menuData = [
  {
    title: "Tüm İlanlar",
    path: "/ilanlar",
    submenu: [
      { title: "Tüm İlanlar", path: "/tum-ilanlar" },
      { title: "İlan Ekle", path: "/Admin/ilanlar/yeni" },
      { title: "İlanlarım", path: "/hesabim/ilanlarim" },
    ]
  },
  {
    title: "Satılık",
    submenu: [
      {
        title: "Konut",
        submenu: [
          { title: "Tüm Konut İlanları", path: "/satilik/konut/tum" },
          { title: "Apartman Dairesi", path: "/satilik/konut/apartman-dairesi" },
          { title: "Daire", path: "/satilik/konut/daire" },
          { title: "Rezidans", path: "/satilik/konut/rezidans" },
          { title: "Müstakil Ev", path: "/satilik/konut/mustakil-ev" },
          { title: "Villa", path: "/satilik/konut/villa" },
          { title: "Çiftlik Evi", path: "/satilik/konut/ciftlik-evi" },
          { title: "Yazlık", path: "/satilik/konut/yazlik" },
          { title: "Prefabrik Ev", path: "/satilik/konut/prefabrik-ev" },
        ],
      },
      {
        title: "İş Yeri",
        submenu: [
          { title: "Tüm İş Yeri İlanları", path: "/satilik/is-yeri/tum" },
          { title: "Dükkan / Mağaza", path: "/satilik/is-yeri/dukkan-magaza" },
          { title: "Ofis", path: "/satilik/is-yeri/ofis" },
          { title: "Akaryakıt İstasyonu", path: "/satilik/is-yeri/akaryakit-istasyonu" },
          { title: "Apartman Dairesi", path: "/satilik/is-yeri/apartman-dairesi" },
          { title: "Atölye", path: "/satilik/is-yeri/atolye" },
          { title: "Büfe", path: "/satilik/is-yeri/bufe" },
          { title: "Çiftlik", path: "/satilik/is-yeri/ciftlik" },
          { title: "Depo & Antrepo", path: "/satilik/is-yeri/depo-antrepo" },
        ],
      },
      {
        title: "Arsa",
        submenu: [
          { title: "Tüm Arsa İlanları", path: "/satilik/arsa/tum" },
          { title: "Arsa", path: "/satilik/arsa/arsa" },
          { title: "Tarla", path: "/satilik/arsa/tarla" },
          { title: "Bağ", path: "/satilik/arsa/bag" },
          { title: "Bahçe", path: "/satilik/arsa/bahce" },
          { title: "Çiftlik", path: "/satilik/arsa/ciftlik" },
          { title: "Depo", path: "/satilik/arsa/depo" },
          { title: "Zeytinlik", path: "/satilik/arsa/zeytinlik" },
        ],
      },
      {
        title: "Turizm",
        submenu: [
          { title: "Tüm Turizm Tesisleri", path: "/satilik/turizm/tum" },
          { title: "Otel", path: "/satilik/turizm/otel" },
          { title: "Apart Otel", path: "/satilik/turizm/apart-otel" },
          { title: "Butik Otel", path: "/satilik/turizm/butik-otel" },
          { title: "Motel", path: "/satilik/turizm/motel" },
          { title: "Pansiyon", path: "/satilik/turizm/pansiyon" },
          { title: "Kamp Yeri (Mocamp)", path: "/satilik/turizm/kamp-yeri" },
          { title: "Tatil Köyü", path: "/satilik/turizm/tatil-koyu" },
        ],
      },
    ],
  },
  {
    title: "Kiralık",
    submenu: [
      {
        title: "Konut",
        submenu: [
          { title: "Tüm Konut İlanları", path: "/kiralik/konut/tum" },
          { title: "Apartman Dairesi", path: "/kiralik/konut/apartman-dairesi" },
          { title: "Daire", path: "/kiralik/konut/daire" },
          { title: "Rezidans", path: "/kiralik/konut/rezidans" },
          { title: "Müstakil Ev", path: "/kiralik/konut/mustakil-ev" },
          { title: "Villa", path: "/kiralik/konut/villa" },
          { title: "Çiftlik Evi", path: "/kiralik/konut/ciftlik-evi" },
          { title: "Yazlık", path: "/kiralik/konut/yazlik" },
          { title: "Prefabrik Ev", path: "/kiralik/konut/prefabrik-ev" },
        ],
      },
      {
        title: "İş Yeri",
        submenu: [
          { title: "Tüm İş Yeri İlanları", path: "/kiralik/is-yeri/tum" },
          { title: "Dükkan / Mağaza", path: "/kiralik/is-yeri/dukkan-magaza" },
          { title: "Ofis", path: "/kiralik/is-yeri/ofis" },
          { title: "Akaryakıt İstasyonu", path: "/kiralik/is-yeri/akaryakit-istasyonu" },
          { title: "Apartman Dairesi", path: "/kiralik/is-yeri/apartman-dairesi" },
          { title: "Atölye", path: "/kiralik/is-yeri/atolye" },
          { title: "Büfe", path: "/kiralik/is-yeri/bufe" },
          { title: "Çiftlik", path: "/kiralik/is-yeri/ciftlik" },
          { title: "Depo & Antrepo", path: "/kiralik/is-yeri/depo-antrepo" },
        ],
      },
      {
        title: "Arsa",
        submenu: [
          { title: "Tüm Arsa İlanları", path: "/kiralik/arsa/tum" },
          { title: "Arsa", path: "/kiralik/arsa/arsa" },
          { title: "Tarla", path: "/kiralik/arsa/tarla" },
          { title: "Bağ", path: "/kiralik/arsa/bag" },
          { title: "Bahçe", path: "/kiralik/arsa/bahce" },
          { title: "Çiftlik", path: "/kiralik/arsa/ciftlik" },
          { title: "Depo", path: "/kiralik/arsa/depo" },
          { title: "Zeytinlik", path: "/kiralik/arsa/zeytinlik" },
        ],
      },
      {
        title: "Turizm",
        submenu: [
          { title: "Tüm Turizm Tesisleri", path: "/kiralik/turizm/tum" },
          { title: "Otel", path: "/kiralik/turizm/otel" },
          { title: "Apart Otel", path: "/kiralik/turizm/apart-otel" },
          { title: "Butik Otel", path: "/kiralik/turizm/butik-otel" },
          { title: "Motel", path: "/kiralik/turizm/motel" },
          { title: "Pansiyon", path: "/kiralik/turizm/pansiyon" },
          { title: "Kamp Yeri (Mocamp)", path: "/kiralik/turizm/kamp-yeri" },
          { title: "Tatil Köyü", path: "/kiralik/turizm/tatil-koyu" },
        ],
      },
    ],
  },
  {
    title: "Projeler",
    submenu: [
      { title: "Konut Projeleri", path: "/projeler/konutprojeleri" },
    ],
  },
  {
    title: "Danışmanlar",
    path: "/danismanlar",
  },
  {
    title: "Ofisler",
    path: "/ofisler",
  },
  {
    title: "Linkler",
    submenu: [
      { title: "Parsel Sorgulama", path: "https://parselsorgu.tkgm.gov.tr/", isExternal: true },
      { title: "E-Devlet Kapısı", path: "https://giris.turkiye.gov.tr/Giris/gir", isExternal: true },
      { title: "Web Tapu", path: "https://webtapu.tkgm.gov.tr/", isExternal: true },
      { title: "E-Tahsilat", path: "https://www.tkgm.gov.tr/tr/icerik/e-tahsilat", isExternal: true },
      { title: "Başvuru Sorgulama", path: "https://www.tkgm.gov.tr/basvuru-sorgulama", isExternal: true },
      { title: "E-Randevu", path: "https://randevu.tkgm.gov.tr/tr/Appointment/eAppointmentStart", isExternal: true },
      { title: "Cimer", path: "https://www.cimer.gov.tr/", isExternal: true },
    ],
  },
];

export default menuData;
