export interface GoogleColor {
  name: string;
  color: string;
  contrastColor: string;
}

export const defaultGoogleColor = 'basil';

export const googleColors: { [index: string]: GoogleColor } = {
  amethyst: {
    name: 'Amethyst',
    color: '#9E69AF',
    contrastColor: '#7AAF69',
  },
  avocado: {
    name: 'Avocado',
    color: '#C0CA33',
    contrastColor: '#3D33CA',
  },
  banana: {
    name: 'Banana',
    color: '#F6BF26',
    contrastColor: '#265DF6',
  },
  basil: {
    name: 'Basil',
    color: '#0B8043',
    contrastColor: '#800B48',
  },
  beetroot: {
    name: 'Beetroot',
    color: '#AD1457',
    contrastColor: '#14AD6A',
  },
  birch: {
    name: 'Birch',
    color: '#A79B8E',
    contrastColor: '#8E9AA7',
  },
  blueberry: {
    name: 'Blueberry',
    color: '#3F51B5',
    contrastColor: '#B5A33F',
  },
  'cherry blossom': {
    name: 'Cherry Blossom',
    color: '#D81B60',
    contrastColor: '#1BD893',
  },
  citron: {
    name: 'Citron',
    color: '#E4C441',
    contrastColor: '#4161E4',
  },
  cobalt: {
    name: 'Cobalt',
    color: '#4285F4',
    contrastColor: '#F4B142',
  },
  cocoa: {
    name: 'Cocoa',
    color: '#795548',
    contrastColor: '#486C79',
  },
  eucalyptus: {
    name: 'Eucalyptus',
    color: '#009688',
    contrastColor: '#96000E',
  },
  flamingo: {
    name: 'Flamingo',
    color: '#E67C73',
    contrastColor: '#73DDE6',
  },
  grape: {
    name: 'Grape',
    color: '#8E24AA',
    contrastColor: '#40AA24',
  },
  graphite: {
    name: 'Graphite',
    color: '#616161',
    contrastColor: '#FFFFFF',
  },
  lavender: {
    name: 'Lavender',
    color: '#7986CB',
    contrastColor: '#CBBE79',
  },
  mango: {
    name: 'Mango',
    color: '#F09300',
    contrastColor: '#005DF0',
  },
  peacock: {
    name: 'Peacock',
    color: '#039BE5',
    contrastColor: '#E54D03',
  },
  pistachio: {
    name: 'Pistachio',
    color: '#7CB342',
    contrastColor: '#7942B3',
  },
  pumpkin: {
    name: 'Pumpkin',
    color: '#EF6C00',
    contrastColor: '#0083EF',
  },
  sage: {
    name: 'Sage',
    color: '#33B679',
    contrastColor: '#B63370',
  },
  tangerine: {
    name: 'Tangerine',
    color: '#F4511E',
    contrastColor: '#1EC1F4',
  },
  tomato: {
    name: 'Tomato',
    color: '#D50000',
    contrastColor: '#00D5D5',
  },
  wisteria: {
    name: 'Wisteria',
    color: '#B39DDB',
    contrastColor: '#C5DB9D',
  },
};
