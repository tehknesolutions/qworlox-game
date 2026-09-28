export const KING_REACH_PLAYABLE_BOARD_V1 = {
  id: 'king-reach-playable-v1',
  status: 'EXPERIMENTAL_PLAYTEST',
  finalGeometry: false,
  lanes: [
    {
      id: 'royal-spine',
      nodes: [
        { id: 'blue-king', region: 'BLUE_CASTLE', objective: { type: 'KING', team: 'blue' } },
        { id: 'blue-approach', region: 'BLUE_APPROACH' },
        { id: 'center', region: 'CONTESTED_CENTER' },
        { id: 'red-approach', region: 'RED_APPROACH' },
        { id: 'red-king', region: 'RED_CASTLE', objective: { type: 'KING', team: 'red' } }
      ]
    },
    {
      id: 'north-crossing-lane',
      nodes: [
        { id: 'north-crossing', region: 'CONTESTED_CROSSING' }
      ]
    },
    {
      id: 'south-crossing-lane',
      nodes: [
        { id: 'south-crossing', region: 'CONTESTED_CROSSING' }
      ]
    }
  ],
  lateralEdges: [
    { from: 'blue-approach', to: 'north-crossing' },
    { from: 'blue-approach', to: 'south-crossing' },
    { from: 'north-crossing', to: 'center' },
    { from: 'south-crossing', to: 'center' },
    { from: 'red-approach', to: 'north-crossing' },
    { from: 'red-approach', to: 'south-crossing' }
  ]
};
