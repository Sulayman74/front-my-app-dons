import { animate, query, style, transition, trigger } from '@angular/animations';

export const slideInAnimation = 
  trigger('routeAnimations', [
    transition('* <=> *', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({ left: '-100%' }),
        animate('300ms ease', style({ left: '0%' }))
      ])
    ])
  ]);
