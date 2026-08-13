import { CARD_TAG, CARD_VERSION } from './constants.js';
import { HassOmnibusCard }        from './card.js';

window.customCards = window.customCards || [];
window.customCards.push({
  type:        CARD_TAG,
  name:        'Hass Omnibus Card',
  description: 'Compact, area-based room summary with automatic entity discovery.',
  preview:     true,
});

console.info(
  `%c HASS-OMNIBUS-CARD %c v${CARD_VERSION} `,
  'color:#fff;background:#2196f3;font-weight:bold;padding:2px 4px;border-radius:3px 0 0 3px',
  'color:#2196f3;background:#e3f2fd;font-weight:bold;padding:2px 4px;border-radius:0 3px 3px 0',
);

customElements.define(CARD_TAG, HassOmnibusCard);
