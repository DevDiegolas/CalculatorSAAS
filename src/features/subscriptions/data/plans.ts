import type { Plan } from '../types/Plan';

export const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 'R$ 0',
    tagline: 'Recursos essenciais para uso inicial.',
    features: ['Digitar numeros', 'Somar', 'Resultado limitado'],
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 'R$ 9,90',
    tagline: 'Operacoes basicas com resultado liberado.',
    features: ['Resultado visivel', 'Soma', 'Subtracao', 'Temas essenciais'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'R$ 29,90',
    tagline: 'Recursos avancados para uso recorrente.',
    features: ['Multiplicacao', 'Divisao', 'Historico', 'Temas avancados'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Fale com vendas',
    tagline: 'Funcionalidades completas para equipes.',
    features: ['Porcentagem', 'Raiz quadrada', 'Memoria', 'Temas corporativos'],
  },
];
