// Omniverse Design Mode UI/UX Implementation
// Interactive panels and context-aware transitions

export interface DesignModePanel {
  id: string;
  title: string;
  type: 'primary' | 'secondary' | 'contextual';
  position: 'left' | 'right' | 'bottom' | 'floating';
  size: { width: number; height: number };
  padding: number;
  margin: number;
  components: PanelComponent[];
  transitions: PanelTransition[];
}

export interface PanelComponent {
  id: string;
  type: 'tool' | 'property' | 'timeline' | 'viewport' | 'collaboration';
  props: Record<string, any>;
  interactions: ComponentInteraction[];
}

export interface ComponentInteraction {
  type: 'click' | 'drag' | 'hover' | 'gesture' | 'voice' | 'shortcut';
  action: string;
  parameters?: Record<string, any>;
}

export interface PanelTransition {
  trigger: 'mode-change' | 'tool-select' | 'user-action';
  from: string;
  to: string;
  animation: TransitionAnimation;
}

export interface TransitionAnimation {
  type: 'slide' | 'fade' | 'scale' | 'rotate';
  duration: number; // ms
  easing: 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  delay: number; // ms
}

// Design Mode States
export enum DesignModeState {
  CONCEPT_IDEATION = 'concept_ideation',
  MODELING = 'modeling',
  ANIMATION = 'animation',
  PHYSICS_SIMULATION = 'physics_simulation',
  VIRTUAL_PRODUCTION = 'virtual_production',
  RENDERING = 'rendering',
  COLLABORATION = 'collaboration',
  REVIEW = 'review'
}

// Panel Layouts for Each State
export const DESIGN_MODE_LAYOUTS = {
  [DesignModeState.CONCEPT_IDEATION]: {
    primaryPanels: [
      { id: 'viewport', position: 'center', size: { width: 70, height: 80 } },
      { id: 'sketch-tools', position: 'left', size: { width: 15, height: 100 } },
      { id: 'inspiration-gallery', position: 'right', size: { width: 15, height: 50 } },
      { id: 'collaboration', position: 'right', size: { width: 15, height: 50 } }
    ],
    contextualPanels: [
      { id: 'color-palette', position: 'bottom', size: { width: 30, height: 20 } },
      { id: 'layer-manager', position: 'bottom', size: { width: 40, height: 20 } },
      { id: 'notes', position: 'bottom', size: { width: 30, height: 20 } }
    ]
  },
  [DesignModeState.MODELING]: {
    primaryPanels: [
      { id: 'viewport', position: 'center', size: { width: 60, height: 80 } },
      { id: 'modeling-tools', position: 'left', size: { width: 20, height: 100 } },
      { id: 'property-editor', position: 'right', size: { width: 20, height: 60 } },
      { id: 'scene-hierarchy', position: 'right', size: { width: 20, height: 40 } }
    ],
    contextualPanels: [
      { id: 'timeline', position: 'bottom', size: { width: 60, height: 20 } },
      { id: 'material-editor', position: 'bottom', size: { width: 40, height: 20 } }
    ]
  },
  [DesignModeState.ANIMATION]: {
    primaryPanels: [
      { id: 'viewport', position: 'center', size: { width: 50, height: 60 } },
      { id: 'animation-tools', position: 'left', size: { width: 20, height: 100 } },
      { id: 'timeline', position: 'bottom', size: { width: 80, height: 40 } },
      { id: 'graph-editor', position: 'right', size: { width: 30, height: 60 } }
    ],
    contextualPanels: [
      { id: 'property-editor', position: 'right', size: { width: 30, height: 40 } },
      { id: 'camera-controls', position: 'floating', size: { width: 15, height: 15 } }
    ]
  },
  [DesignModeState.PHYSICS_SIMULATION]: {
    primaryPanels: [
      { id: 'viewport', position: 'center', size: { width: 60, height: 70 } },
      { id: 'physics-tools', position: 'left', size: { width: 20, height: 100 } },
      { id: 'simulation-properties', position: 'right', size: { width: 20, height: 50 } },
      { id: 'results-panel', position: 'right', size: { width: 20, height: 50 } }
    ],
    contextualPanels: [
      { id: 'simulation-controls', position: 'bottom', size: { width: 40, height: 30 } },
      { id: 'data-visualization', position: 'bottom', size: { width: 60, height: 30 } }
    ]
  },
  [DesignModeState.VIRTUAL_PRODUCTION]: {
    primaryPanels: [
      { id: 'viewport', position: 'center', size: { width: 70, height: 80 } },
      { id: 'camera-controls', position: 'left', size: { width: 15, height: 100 } },
      { id: 'lighting-rig', position: 'right', size: { width: 15, height: 50 } },
      { id: 'environment-controls', position: 'right', size: { width: 15, height: 50 } }
    ],
    contextualPanels: [
      { id: 'recording-controls', position: 'bottom', size: { width: 30, height: 20 } },
      { id: 'compositing', position: 'bottom', size: { width: 40, height: 20 } },
      { id: 'live-preview', position: 'bottom', size: { width: 30, height: 20 } }
    ]
  },
  [DesignModeState.RENDERING]: {
    primaryPanels: [
      { id: 'viewport', position: 'center', size: { width: 65, height: 75 } },
      { id: 'render-settings', position: 'left', size: { width: 20, height: 100 } },
      { id: 'material-editor', position: 'right', size: { width: 15, height: 50 } },
      { id: 'lighting-editor', position: 'right', size: { width: 15, height: 50 } }
    ],
    contextualPanels: [
      { id: 'render-queue', position: 'bottom', size: { width: 35, height: 25 } },
      { id: 'output-preview', position: 'bottom', size: { width: 65, height: 25 } }
    ]
  },
  [DesignModeState.COLLABORATION]: {
    primaryPanels: [
      { id: 'viewport', position: 'center', size: { width: 55, height: 70 } },
      { id: 'collaboration-panel', position: 'right', size: { width: 25, height: 100 } },
      { id: 'annotation-tools', position: 'left', size: { width: 20, height: 100 } }
    ],
    contextualPanels: [
      { id: 'chat', position: 'bottom', size: { width: 30, height: 30 } },
      { id: 'version-history', position: 'bottom', size: { width: 40, height: 30 } },
      { id: 'presentation-controls', position: 'bottom', size: { width: 30, height: 30 } }
    ]
  },
  [DesignModeState.REVIEW]: {
    primaryPanels: [
      { id: 'viewport', position: 'center', size: { width: 75, height: 85 } },
      { id: 'review-tools', position: 'left', size: { width: 12, height: 100 } },
      { id: 'presentation-notes', position: 'right', size: { width: 13, height: 100 } }
    ],
    contextualPanels: [
      { id: 'comparison-view', position: 'bottom', size: { width: 50, height: 15 } },
      { id: 'feedback-panel', position: 'bottom', size: { width: 50, height: 15 } }
    ]
  }
};

// Context-Aware Transitions
export const STATE_TRANSITIONS = {
  [DesignModeState.CONCEPT_IDEATION]: {
    to: {
      [DesignModeState.MODELING]: {
        animation: { type: 'slide', duration: 800, easing: 'ease-in-out', delay: 0 },
        sequence: ['fade-out-sketch-tools', 'slide-in-modeling-tools', 'resize-viewport']
      },
      [DesignModeState.COLLABORATION]: {
        animation: { type: 'fade', duration: 500, easing: 'ease-out', delay: 0 },
        sequence: ['fade-in-collaboration-panel', 'enable-annotation-tools']
      }
    }
  },
  [DesignModeState.MODELING]: {
    to: {
      [DesignModeState.ANIMATION]: {
        animation: { type: 'slide', duration: 1000, easing: 'ease-in-out', delay: 100 },
        sequence: ['slide-in-timeline', 'show-graph-editor', 'resize-viewport']
      },
      [DesignModeState.PHYSICS_SIMULATION]: {
        animation: { type: 'scale', duration: 800, easing: 'ease-out', delay: 0 },
        sequence: ['enable-physics-tools', 'show-simulation-properties']
      }
    }
  },
  [DesignModeState.ANIMATION]: {
    to: {
      [DesignModeState.VIRTUAL_PRODUCTION]: {
        animation: { type: 'rotate', duration: 1200, easing: 'ease-in-out', delay: 200 },
        sequence: ['enable-camera-controls', 'show-lighting-rig', 'activate-recording']
      }
    }
  },
  [DesignModeState.PHYSICS_SIMULATION]: {
    to: {
      [DesignModeState.RENDERING]: {
        animation: { type: 'fade', duration: 600, easing: 'ease-in', delay: 0 },
        sequence: ['enable-render-settings', 'show-material-editor']
      }
    }
  }
};

// Panel Component Specifications
export const PANEL_COMPONENTS = {
  viewport: {
    type: 'viewport',
    props: {
      resolution: { width: 3840, height: 2160 },
      renderMode: 'path-traced',
      collaboration: true,
      annotations: true
    },
    interactions: ['camera-controls', 'object-selection', 'markups']
  },
  sketchTools: {
    type: 'tool',
    props: {
      tools: ['pen', 'brush', 'eraser', 'shapes', 'text'],
      pressureSensitivity: true,
      layers: true
    },
    interactions: ['gesture-input', 'pressure-input', 'tool-shortcuts']
  },
  modelingTools: {
    type: 'tool',
    props: {
      tools: ['extrude', 'revolve', 'loft', 'subdivide', 'bevel'],
      snapToGrid: true,
      parametric: true
    },
    interactions: ['hotkeys', 'gesture-input', 'voice-commands']
  },
  animationTools: {
    type: 'tool',
    props: {
      tools: ['keyframe', 'timeline', 'graph', 'constraints'],
      interpolation: 'bezier',
      playbackSpeed: 24
    },
    interactions: ['timeline-scrubbing', 'keyframe-editing', 'curve-manipulation']
  },
  physicsTools: {
    type: 'tool',
    props: {
      simulators: ['rigid-body', 'fluid', 'aerodynamics', 'collision'],
      accuracy: 'high',
      realTime: true
    },
    interactions: ['parameter-adjustment', 'simulation-control', 'result-visualization']
  },
  collaborationPanel: {
    type: 'collaboration',
    props: {
      users: [],
      chat: true,
      screenShare: true,
      annotations: true
    },
    interactions: ['real-time-sync', 'voice-chat', 'cursor-sharing']
  }
};
