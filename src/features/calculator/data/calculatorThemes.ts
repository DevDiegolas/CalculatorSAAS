import type { FeatureId } from '../../subscriptions/types/Plan';

export type CalculatorThemeId = 'white' | 'rose' | 'blue' | 'gray' | 'green' | 'gold';

export interface CalculatorTheme {
  id: CalculatorThemeId;
  name: string;
  requiredFeature?: FeatureId;
  swatchClassName: string;
  shellClassName: string;
  displayClassName: string;
  titleClassName: string;
  numberButtonClassName: string;
  utilityButtonClassName: string;
  operatorButtonClassName: string;
  equalsButtonClassName: string;
}

export const calculatorThemes: CalculatorTheme[] = [
  {
    id: 'white',
    name: 'Branco',
    swatchClassName: 'bg-white',
    shellClassName: 'border-slate-200 bg-white',
    displayClassName: 'bg-slate-950 text-white',
    titleClassName: 'text-slate-400',
    numberButtonClassName: 'bg-white text-slate-950 hover:bg-slate-50',
    utilityButtonClassName: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    operatorButtonClassName: 'bg-sky-100 text-sky-950 hover:bg-sky-200',
    equalsButtonClassName: 'bg-emerald-600 text-white hover:bg-emerald-500',
  },
  {
    id: 'rose',
    name: 'Rosa',
    requiredFeature: 'theme-basic',
    swatchClassName: 'bg-rose-300',
    shellClassName: 'border-rose-200 bg-rose-50',
    displayClassName: 'bg-rose-950 text-white',
    titleClassName: 'text-rose-200',
    numberButtonClassName: 'bg-white text-rose-950 hover:bg-rose-50',
    utilityButtonClassName: 'bg-rose-100 text-rose-800 hover:bg-rose-200',
    operatorButtonClassName: 'bg-pink-200 text-pink-950 hover:bg-pink-300',
    equalsButtonClassName: 'bg-rose-600 text-white hover:bg-rose-500',
  },
  {
    id: 'blue',
    name: 'Azul',
    requiredFeature: 'theme-basic',
    swatchClassName: 'bg-blue-400',
    shellClassName: 'border-blue-200 bg-blue-50',
    displayClassName: 'bg-blue-950 text-white',
    titleClassName: 'text-blue-200',
    numberButtonClassName: 'bg-white text-blue-950 hover:bg-blue-50',
    utilityButtonClassName: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    operatorButtonClassName: 'bg-cyan-200 text-cyan-950 hover:bg-cyan-300',
    equalsButtonClassName: 'bg-blue-700 text-white hover:bg-blue-600',
  },
  {
    id: 'gray',
    name: 'Cinza',
    requiredFeature: 'theme-pro',
    swatchClassName: 'bg-zinc-400',
    shellClassName: 'border-zinc-300 bg-zinc-100',
    displayClassName: 'bg-zinc-800 text-white',
    titleClassName: 'text-zinc-300',
    numberButtonClassName: 'bg-white text-zinc-950 hover:bg-zinc-50',
    utilityButtonClassName: 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300',
    operatorButtonClassName: 'bg-zinc-700 text-white hover:bg-zinc-600',
    equalsButtonClassName: 'bg-emerald-600 text-white hover:bg-emerald-500',
  },
  {
    id: 'green',
    name: 'Verde',
    requiredFeature: 'theme-pro',
    swatchClassName: 'bg-emerald-500',
    shellClassName: 'border-emerald-200 bg-emerald-50',
    displayClassName: 'bg-emerald-950 text-white',
    titleClassName: 'text-emerald-200',
    numberButtonClassName: 'bg-white text-emerald-950 hover:bg-emerald-50',
    utilityButtonClassName: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
    operatorButtonClassName: 'bg-teal-200 text-teal-950 hover:bg-teal-300',
    equalsButtonClassName: 'bg-emerald-700 text-white hover:bg-emerald-600',
  },
  {
    id: 'gold',
    name: 'Dourado',
    requiredFeature: 'theme-enterprise',
    swatchClassName: 'bg-amber-400',
    shellClassName: 'border-amber-300 bg-amber-50',
    displayClassName: 'bg-zinc-950 text-amber-100',
    titleClassName: 'text-amber-200',
    numberButtonClassName: 'bg-white text-zinc-950 hover:bg-amber-50',
    utilityButtonClassName: 'bg-amber-100 text-amber-900 hover:bg-amber-200',
    operatorButtonClassName: 'bg-yellow-300 text-zinc-950 hover:bg-yellow-200',
    equalsButtonClassName: 'bg-zinc-950 text-amber-200 hover:bg-zinc-800',
  },
];
