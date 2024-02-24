export const routes = {
  root: "/",
  favorites: {
    root: "/favorites",
  },
  settings: {
    root: "/settings",
  },
  barbershops: {
    root: "/barbershops",
  },
  reservations: {
    root: "/reservations",
  },
  barber: {
    root: "/barber",
    barbershop: {
      root: "/barber/barbershop",
    },
    invitations: {
      root: "/barber/invitations",
    },
    settings: {
      root: "/barber/settings",
    },
  },
  owner: {
    root: "/owner",
    openingHours: {
      root: "/owner/opening-hours",
      edit: {
        root: "/owner/opening-hours/edit",
      },
    },
    preferences: {
      root: "/owner/preferences",
    },
    priceList: {
      root: "/owner/price-list",
    },
    reservations: {
      root: "/owner/reservations",
    },
    barbers: {
      root: "/owner/barbers",
    },
    settings: {
      root: "/owner/settings",
    },
  },
};
