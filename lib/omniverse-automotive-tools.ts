// Automotive-Specific Omniverse Toolset
// Vehicle design, physics simulation, and virtual production tools

export interface AutomotiveTool {
  id: string;
  name: string;
  category: 'design' | 'physics' | 'materials' | 'collaboration' | 'virtual-production';
  description: string;
  version: string;
  dependencies: string[];
  features: ToolFeature[];
  integration: ToolIntegration;
}

export interface ToolFeature {
  name: string;
  description: string;
  parameters: FeatureParameter[];
  outputs: FeatureOutput[];
}

export interface FeatureParameter {
  name: string;
  type: 'number' | 'string' | 'boolean' | 'enum' | 'vector3' | 'color' | 'material';
  defaultValue: any;
  range?: [number, number];
  options?: string[];
  validation?: ValidationRule[];
}

export interface FeatureOutput {
  name: string;
  type: 'geometry' | 'material' | 'animation' | 'data' | 'render' | 'simulation';
  format: string;
  destination: string;
}

export interface ValidationRule {
  type: 'range' | 'regex' | 'required' | 'custom';
  rule: string;
  message: string;
}

export interface ToolIntegration {
  omniverse: OmniverseIntegration;
  external: ExternalIntegration[];
  api: APIIntegration;
}

export interface OmniverseIntegration {
  usdSchemas: string[];
  extensions: string[];
  workflows: string[];
  connectors: string[];
}

export interface ExternalIntegration {
  software: string;
  version: string;
  connector: string;
  dataFormat: string;
  syncMode: 'real-time' | 'batch' | 'manual';
}

export interface APIParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface APIResponse {
  code: number;
  description: string;
  schema: any;
}

export interface AuthMethod {
  type: 'oauth2' | 'api-key' | 'basic';
  provider?: string;
}

export interface RateLimit {
  requests: number;
  window: string;
}

export interface APIIntegration {
  endpoints: APIEndpoint[];
  authentication: AuthMethod;
  rateLimit: RateLimit;
}

export interface APIEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  parameters: APIParameter[];
  responses: APIResponse[];
}

// Core Automotive Tools
export const AUTOMOTIVE_TOOLS: AutomotiveTool[] = [
  {
    id: 'vehicle-dynamics-simulator',
    name: 'Vehicle Dynamics Simulator',
    category: 'physics',
    description: 'Real-time vehicle physics simulation including suspension, tires, and drivetrain',
    version: '1.0.0',
    dependencies: ['omniverse-physics', 'vehicle-dynamics-library'],
    features: [
      {
        name: 'Suspension Simulation',
        description: 'Advanced multi-link suspension physics with real-time feedback',
        parameters: [
          { name: 'suspensionType', type: 'enum', defaultValue: 'double-wishbone', options: ['double-wishbone', 'macpherson', 'multi-link', 'air-spring'] },
          { name: 'springRate', type: 'number', defaultValue: 25000, range: [10000, 100000] },
          { name: 'dampingRatio', type: 'number', defaultValue: 0.7, range: [0.1, 2.0] },
          { name: 'antiRollBar', type: 'boolean', defaultValue: true }
        ],
        outputs: [
          { name: 'suspensionGeometry', type: 'geometry', format: 'USD', destination: 'viewport' },
          { name: 'physicsData', type: 'simulation', format: 'JSON', destination: 'data-panel' }
        ]
      },
      {
        name: 'Tire Model',
        description: 'Advanced tire physics with temperature, wear, and grip modeling',
        parameters: [
          { name: 'tireCompound', type: 'enum', defaultValue: 'performance', options: ['eco', 'standard', 'performance', 'racing'] },
          { name: 'tirePressure', type: 'number', defaultValue: 32, range: [20, 45] },
          { name: 'temperature', type: 'number', defaultValue: 20, range: [-20, 120] },
          { name: 'wearFactor', type: 'number', defaultValue: 0.0, range: [0.0, 1.0] }
        ],
        outputs: [
          { name: 'tireGeometry', type: 'geometry', format: 'USD', destination: 'viewport' },
          { name: 'gripData', type: 'data', format: 'CSV', destination: 'data-panel' }
        ]
      }
    ],
    integration: {
      omniverse: {
        usdSchemas: ['VehiclePhysicsSchema', 'TireModelSchema'],
        extensions: ['VehiclePhysicsExtension', 'RealTimeSimulation'],
        workflows: ['VehicleSetupWorkflow', 'PhysicsValidationWorkflow'],
        connectors: ['ChassisConnector', 'DrivetrainConnector']
      },
      external: [
        { software: 'ANSYS', version: '2024', connector: 'ANSYS-Physics-Bridge', dataFormat: 'CFD', syncMode: 'batch' },
        { software: 'CarSim', version: '2023', connector: 'CarSim-Data-Exchange', dataFormat: 'SIM', syncMode: 'real-time' }
      ],
      api: {
        endpoints: [
          { path: '/api/vehicle/setup', method: 'POST', description: 'Configure vehicle physics parameters', parameters: [], responses: [] },
          { path: '/api/vehicle/simulate', method: 'POST', description: 'Run physics simulation', parameters: [], responses: [] }
        ],
        authentication: { type: 'oauth2', provider: 'nvidia' },
        rateLimit: { requests: 100, window: '1m' }
      }
    }
  },
  {
    id: 'aerodynamics-wind-tunnel',
    name: 'Aerodynamics Wind Tunnel',
    category: 'physics',
    description: 'Real-time CFD simulation for vehicle aerodynamics analysis',
    version: '1.0.0',
    dependencies: ['omniverse-cfd', 'fluid-dynamics-library'],
    features: [
      {
        name: 'Wind Tunnel Simulation',
        description: 'Real-time computational fluid dynamics for aerodynamic analysis',
        parameters: [
          { name: 'windSpeed', type: 'number', defaultValue: 60, range: [0, 300] },
          { name: 'airDensity', type: 'number', defaultValue: 1.225, range: [0.5, 2.0] },
          { name: 'turbulenceIntensity', type: 'number', defaultValue: 0.05, range: [0.0, 0.2] },
          { name: 'yawAngle', type: 'number', defaultValue: 0, range: [-45, 45] }
        ],
        outputs: [
          { name: 'flowVisualization', type: 'render', format: 'USD', destination: 'viewport' },
          { name: 'dragCoefficient', type: 'data', format: 'JSON', destination: 'data-panel' },
          { name: 'liftCoefficient', type: 'data', format: 'JSON', destination: 'data-panel' }
        ]
      }
    ],
    integration: {
      omniverse: {
        usdSchemas: ['AeroSchema', 'FlowFieldSchema'],
        extensions: ['CFDExtension', 'FlowVisualization'],
        workflows: ['AeroAnalysisWorkflow', 'WindTunnelSetupWorkflow'],
        connectors: ['WindTunnelConnector', 'DataExportConnector']
      },
      external: [
        { software: 'ANSYS Fluent', version: '2024', connector: 'Fluent-Bridge', dataFormat: 'CAS', syncMode: 'batch' },
        { software: 'OpenFOAM', version: '11', connector: 'OpenFOAM-Connector', dataFormat: 'FOAM', syncMode: 'batch' }
      ],
      api: {
        endpoints: [
          { path: '/api/aero/setup', method: 'POST', description: 'Configure wind tunnel parameters', parameters: [], responses: [] },
          { path: '/api/aero/simulate', method: 'POST', description: 'Run CFD simulation', parameters: [], responses: [] }
        ],
        authentication: { type: 'oauth2', provider: 'nvidia' },
        rateLimit: { requests: 50, window: '1m' }
      }
    }
  },
  {
    id: 'parametric-vehicle-designer',
    name: 'Parametric Vehicle Designer',
    category: 'design',
    description: 'Advanced parametric modeling for vehicle design with real-time updates',
    version: '1.0.0',
    dependencies: ['omniverse-maya', 'parametric-modeling-library'],
    features: [
      {
        name: 'Vehicle Body Generator',
        description: 'Generate vehicle bodies using parametric controls',
        parameters: [
          { name: 'vehicleType', type: 'enum', defaultValue: 'sedan', options: ['sedan', 'suv', 'coupe', 'hatchback', 'truck'] },
          { name: 'wheelbase', type: 'number', defaultValue: 2800, range: [2000, 4000] },
          { name: 'overallLength', type: 'number', defaultValue: 4700, range: [3000, 6000] },
          { name: 'overallWidth', type: 'number', defaultValue: 1800, range: [1500, 2500] },
          { name: 'overallHeight', type: 'number', defaultValue: 1450, range: [1200, 2000] },
          { name: 'dragCoefficient', type: 'number', defaultValue: 0.28, range: [0.2, 0.5] }
        ],
        outputs: [
          { name: 'vehicleGeometry', type: 'geometry', format: 'USD', destination: 'viewport' },
          { name: 'designParameters', type: 'data', format: 'JSON', destination: 'property-panel' }
        ]
      },
      {
        name: 'Surface Sculpting',
        description: 'Advanced surface manipulation for vehicle styling',
        parameters: [
          { name: 'sculptMode', type: 'enum', defaultValue: 'push', options: ['push', 'pull', 'smooth', 'pinch'] },
          { name: 'brushSize', type: 'number', defaultValue: 100, range: [10, 500] },
          { name: 'strength', type: 'number', defaultValue: 0.5, range: [0.0, 1.0] },
          { name: 'falloff', type: 'enum', defaultValue: 'linear', options: ['linear', 'smooth', 'step'] }
        ],
        outputs: [
          { name: 'sculptedGeometry', type: 'geometry', format: 'USD', destination: 'viewport' },
          { name: 'surfaceAnalysis', type: 'data', format: 'JSON', destination: 'analysis-panel' }
        ]
      }
    ],
    integration: {
      omniverse: {
        usdSchemas: ['VehicleSchema', 'ParametricSchema'],
        extensions: ['ParametricModelingExtension', 'SurfaceSculptingExtension'],
        workflows: ['VehicleDesignWorkflow', 'SurfaceAnalysisWorkflow'],
        connectors: ['MayaConnector', 'BlenderConnector']
      },
      external: [
        { software: 'Autodesk Maya', version: '2024', connector: 'Maya-Live-Link', dataFormat: 'MA', syncMode: 'real-time' },
        { software: 'Blender', version: '4.0', connector: 'Blender-Bridge', dataFormat: 'BLEND', syncMode: 'real-time' },
        { software: 'Alias', version: '2024', connector: 'Alias-Connector', dataFormat: 'WIRE', syncMode: 'batch' }
      ],
      api: {
        endpoints: [
          { path: '/api/design/create', method: 'POST', description: 'Create parametric vehicle', parameters: [], responses: [] },
          { path: '/api/design/sculpt', method: 'POST', description: 'Sculpt vehicle surface', parameters: [], responses: [] }
        ],
        authentication: { type: 'oauth2', provider: 'nvidia' },
        rateLimit: { requests: 200, window: '1m' }
      }
    }
  },
  {
    id: 'automotive-material-library',
    name: 'Automotive Material Library',
    category: 'materials',
    description: 'Comprehensive material library for vehicle design with real-time PBR rendering',
    version: '1.0.0',
    dependencies: ['omniverse-materials', 'mdl-library'],
    features: [
      {
        name: 'Paint System',
        description: 'Advanced automotive paint materials with flakes, pearls, and metallic effects',
        parameters: [
          { name: 'paintType', type: 'enum', defaultValue: 'solid', options: ['solid', 'metallic', 'pearlescent', 'matte', 'chrome'] },
          { name: 'baseColor', type: 'color', defaultValue: '#FF0000' },
          { name: 'flakeSize', type: 'number', defaultValue: 0.1, range: [0.01, 1.0] },
          { name: 'flakeDensity', type: 'number', defaultValue: 0.5, range: [0.0, 1.0] },
          { name: 'clearcoatThickness', type: 'number', defaultValue: 0.05, range: [0.01, 0.2] }
        ],
        outputs: [
          { name: 'paintMaterial', type: 'material', format: 'MDL', destination: 'material-editor' },
          { name: 'renderPreview', type: 'render', format: 'USD', destination: 'preview-viewport' }
        ]
      },
      {
        name: 'Interior Materials',
        description: 'Realistic interior materials including leather, fabrics, and trim',
        parameters: [
          { name: 'materialType', type: 'enum', defaultValue: 'leather', options: ['leather', 'fabric', 'alcantara', 'wood', 'carbon-fiber', 'metal'] },
          { name: 'wearLevel', type: 'number', defaultValue: 0.0, range: [0.0, 1.0] },
          { name: 'aging', type: 'boolean', defaultValue: false },
          { name: 'textureScale', type: 'number', defaultValue: 1.0, range: [0.1, 10.0] }
        ],
        outputs: [
          { name: 'interiorMaterial', type: 'material', format: 'MDL', destination: 'material-editor' },
          { name: 'textureSet', type: 'data', format: 'PNG', destination: 'texture-library' }
        ]
      }
    ],
    integration: {
      omniverse: {
        usdSchemas: ['MaterialSchema', 'TextureSchema'],
        extensions: ['MaterialLibraryExtension', 'TextureGenerator'],
        workflows: ['MaterialApplicationWorkflow', 'TextureOptimizationWorkflow'],
        connectors: ['SubstanceConnector', 'QuixelConnector']
      },
      external: [
        { software: 'Substance Designer', version: '2024', connector: 'Substance-Bridge', dataFormat: 'SBSAR', syncMode: 'real-time' },
        { software: 'Quixel Mixer', version: '2024', connector: 'Quixel-Connector', dataFormat: 'QXP', syncMode: 'batch' }
      ],
      api: {
        endpoints: [
          { path: '/api/materials/library', method: 'GET', description: 'Get material library', parameters: [], responses: [] },
          { path: '/api/materials/create', method: 'POST', description: 'Create custom material', parameters: [], responses: [] }
        ],
        authentication: { type: 'oauth2', provider: 'nvidia' },
        rateLimit: { requests: 150, window: '1m' }
      }
    }
  },
  {
    id: 'virtual-production-studio',
    name: 'Virtual Production Studio',
    category: 'virtual-production',
    description: 'Complete virtual production pipeline for automotive marketing and visualization',
    version: '1.0.0',
    dependencies: ['omniverse-rtx', 'camera-tracking', 'compositing-pipeline'],
    features: [
      {
        name: 'Camera Tracking',
        description: 'Real-time camera tracking with motion capture integration',
        parameters: [
          { name: 'trackingSystem', type: 'enum', defaultValue: 'optical', options: ['optical', 'inertial', 'hybrid'] },
          { name: 'cameraType', type: 'enum', defaultValue: 'virtual', options: ['virtual', 'real', 'mixed'] },
          { name: 'lensProfile', type: 'enum', defaultValue: '35mm', options: ['24mm', '35mm', '50mm', '85mm', '135mm'] },
          { name: 'trackingAccuracy', type: 'number', defaultValue: 0.01, range: [0.001, 0.1] }
        ],
        outputs: [
          { name: 'cameraData', type: 'animation', format: 'USD', destination: 'timeline' },
          { name: 'trackingVisual', type: 'render', format: 'USD', destination: 'viewport' }
        ]
      },
      {
        name: 'Environment Lighting',
        description: 'HDRI-based environment lighting with real-time updates',
        parameters: [
          { name: 'environmentType', type: 'enum', defaultValue: 'studio', options: ['studio', 'outdoor', 'urban', 'road', 'custom'] },
          { name: 'hdriIntensity', type: 'number', defaultValue: 1.0, range: [0.1, 3.0] },
          { name: 'sunPosition', type: 'vector3', defaultValue: [45, 45, 100] },
          { name: 'skyColor', type: 'color', defaultValue: '#87CEEB' }
        ],
        outputs: [
          { name: 'environmentSetup', type: 'render', format: 'USD', destination: 'viewport' },
          { name: 'lightingData', type: 'data', format: 'JSON', destination: 'lighting-panel' }
        ]
      }
    ],
    integration: {
      omniverse: {
        usdSchemas: ['CameraSchema', 'LightingSchema', 'EnvironmentSchema'],
        extensions: ['VirtualProductionExtension', 'CameraTracker', 'Compositor'],
        workflows: ['VirtualProductionWorkflow', 'CameraSetupWorkflow'],
        connectors: ['UnrealConnector', 'UnityConnector', 'CameraHardwareConnector']
      },
      external: [
        { software: 'Unreal Engine', version: '5.3', connector: 'Unreal-Live-Link', dataFormat: 'USD', syncMode: 'real-time' },
        { software: 'Unity', version: '2023.3', connector: 'Unity-Bridge', dataFormat: 'USD', syncMode: 'real-time' },
        { software: 'Nuke', version: '14.0', connector: 'Nuke-Connector', dataFormat: 'NK', syncMode: 'batch' }
      ],
      api: {
        endpoints: [
          { path: '/api/vp/setup', method: 'POST', description: 'Setup virtual production', parameters: [], responses: [] },
          { path: '/api/vp/render', method: 'POST', description: 'Render virtual production', parameters: [], responses: [] }
        ],
        authentication: { type: 'oauth2', provider: 'nvidia' },
        rateLimit: { requests: 100, window: '1m' }
      }
    }
  }
];

// Tool Categories and Organization
export const TOOL_CATEGORIES = {
  design: {
    name: 'Design Tools',
    description: 'Vehicle modeling, surfacing, and styling tools',
    icon: 'design-icon',
    priority: 1
  },
  physics: {
    name: 'Physics Simulation',
    description: 'Vehicle dynamics, aerodynamics, and crash simulation',
    icon: 'physics-icon',
    priority: 2
  },
  materials: {
    name: 'Materials & Textures',
    description: 'Automotive materials, paints, and texture libraries',
    icon: 'materials-icon',
    priority: 3
  },
  collaboration: {
    name: 'Collaboration',
    description: 'Real-time collaboration and review tools',
    icon: 'collaboration-icon',
    priority: 4
  },
  'virtual-production': {
    name: 'Virtual Production',
    description: 'Camera tracking, lighting, and compositing tools',
    icon: 'vp-icon',
    priority: 5
  }
};
