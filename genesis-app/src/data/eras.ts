// Era types and configuration

export interface Era {
  id: string;
  name: string;
  yearRange: string;
  description: string;
  colorTheme: {
    bg: string;
    text: string;
    accent: string;
  };
  hasCRT?: boolean;
  phosphorColor?: 'green' | 'amber' | 'white';
}

export const ERAS: Era[] = [
  {
    id: 'boot',
    name: 'System Boot',
    yearRange: '',
    description: 'Initializing Genesis...',
    colorTheme: {
      bg: '#000000',
      text: '#33FF00',
      accent: '#33FF00',
    },
    hasCRT: true,
    phosphorColor: 'green',
  },
  {
    id: 'genesis',
    name: 'The Genesis',
    yearRange: '1936-1945',
    description: 'Turing Machines, Transistors, and the birth of binary',
    colorTheme: {
      bg: '#050505',
      text: '#33FF00',
      accent: '#33FF00',
    },
    hasCRT: true,
    phosphorColor: 'green',
  },
  {
    id: 'assembly',
    name: 'Assembly Age',
    yearRange: '1949-1958',
    description: 'Low-level programming and machine code',
    colorTheme: {
      bg: '#0C0C0C',
      text: '#FFB000',
      accent: '#FFB000',
    },
    hasCRT: true,
    phosphorColor: 'amber',
  },
  {
    id: 'c-revolution',
    name: 'C Revolution',
    yearRange: '1969-1985',
    description: 'Unix, systems programming, and the rise of C',
    colorTheme: {
      bg: '#000000',
      text: '#FFFFFF',
      accent: '#CCCCCC',
    },
    hasCRT: true,
    phosphorColor: 'white',
  },
  {
    id: 'algorithms',
    name: 'Algorithms',
    yearRange: 'Theory',
    description: 'The art and science of computation',
    colorTheme: {
      bg: '#FFFFFF',
      text: '#000000',
      accent: '#333333',
    },
  },
  {
    id: 'early-gui',
    name: 'Early GUI',
    yearRange: '1985-1995',
    description: 'From BIOS to Windows 95',
    colorTheme: {
      bg: '#C0C0C0',
      text: '#000000',
      accent: '#000080',
    },
  },
  {
    id: 'web1',
    name: 'Web 1.0',
    yearRange: '1995-2004',
    description: 'The early web: HTML, tables, and marquees',
    colorTheme: {
      bg: '#CCCCCC',
      text: '#000000',
      accent: '#0000FF',
    },
  },
  {
    id: 'web2',
    name: 'Web 2.0',
    yearRange: '2004-2010',
    description: 'AJAX, gradients, and the social web',
    colorTheme: {
      bg: '#FFFFFF',
      text: '#333333',
      accent: '#4A90E2',
    },
  },
  {
    id: 'modern',
    name: 'Modern Web',
    yearRange: '2010-2022',
    description: 'React, 3D, and glassmorphism',
    colorTheme: {
      bg: '#0D0D0D',
      text: '#FFFFFF',
      accent: '#00FFFF',
    },
  },
  {
    id: 'agi',
    name: 'Intelligence Age',
    yearRange: '2022-Future',
    description: 'LLMs, neural networks, and beyond',
    colorTheme: {
      bg: '#000000',
      text: '#00FFFF',
      accent: '#9D4EDD',
    },
  },
  {
    id: 'portfolio',
    name: 'This Is Me',
    yearRange: 'Present',
    description: 'Kreeza - Software Developer',
    colorTheme: {
      bg: '#0D0D0D',
      text: '#FFFFFF',
      accent: '#FFFFFF',
    },
  },
];
