import { ReactNode, HTMLAttributes, ComponentProps, DetailedHTMLProps } from 'react'
import { ColorToken, SpacingToken, BorderRadiusToken, ShadowToken } from './design-tokens'

export interface BaseComponentProps extends Omit<HTMLAttributes<HTMLElement>, 'color' | 'aria-disabled' | 'aria-expanded' | 'aria-pressed' | 'aria-selected' | 'aria-labelledby' | 'aria-describedby' | 'aria-required' | 'aria-invalid' | 'role' | 'tabIndex'> {
  className?: string
  children?: ReactNode
}

export interface SizeVariants {
  sm: string
  md: string
  lg: string
  xl: string
}

export interface VariantProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon'
}

export interface AccessibilityProps {
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  'aria-expanded'?: boolean
  'aria-pressed'?: boolean
  'aria-selected'?: boolean
  'aria-disabled'?: boolean
  'aria-required'?: boolean
  'aria-invalid'?: boolean
  role?: string
  tabIndex?: number
}

export interface ResponsiveProps {
  responsive?: {
    sm?: string
    md?: string
    lg?: string
    xl?: string
  }
}

export interface ThemeProps {
  theme?: 'light' | 'dark' | 'system'
  color?: keyof ColorToken
  backgroundColor?: keyof ColorToken
}

export interface LayoutProps {
  fullWidth?: boolean
  centered?: boolean
  padding?: keyof SpacingToken
  margin?: keyof SpacingToken
  borderRadius?: keyof BorderRadiusToken
  shadow?: keyof ShadowToken
}

export interface AnimationProps {
  animated?: boolean
  animation?: 'fade' | 'slide' | 'scale' | 'bounce' | 'spin'
  duration?: 'fast' | 'normal' | 'slow'
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'
  delay?: number
}

export interface StateProps {
  loading?: boolean
  disabled?: boolean
  error?: boolean
  success?: boolean
  warning?: boolean
}

export type PolymorphicComponentProps<T extends React.ElementType> = {
  as?: T
} & ComponentProps<T>

export type ForwardRefComponent<T, P> = React.ForwardRefExoticComponent<P & React.RefAttributes<T>>

export interface ComponentVariants {
  base: string
  variants: {
    [key: string]: {
      [key: string]: string
    }
  }
  defaultVariants?: {
    [key: string]: string
  }
}

export interface BreakpointValues {
  xs?: string | number
  sm?: string | number
  md?: string | number
  lg?: string | number
  xl?: string | number
  '2xl'?: string | number
}

export interface GridProps {
  cols?: number | BreakpointValues
  gap?: keyof SpacingToken
  autoFit?: boolean
  autoFill?: boolean
  minItemWidth?: string
}

export interface FlexProps {
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse'
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  gap?: keyof SpacingToken
}

export interface PositionProps {
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'
  top?: keyof SpacingToken | 'auto'
  right?: keyof SpacingToken | 'auto'
  bottom?: keyof SpacingToken | 'auto'
  left?: keyof SpacingToken | 'auto'
  zIndex?: number
}

export interface OverflowProps {
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto'
  overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto'
  overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto'
  truncate?: boolean
  ellipsis?: boolean
}

export interface BorderProps {
  border?: boolean
  borderWidth?: keyof SpacingToken
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double'
  borderColor?: keyof ColorToken
  borderRadius?: keyof BorderRadiusToken
  borderTop?: boolean
  borderBottom?: boolean
  borderLeft?: boolean
  borderRight?: boolean
}

export interface BackgroundProps {
  background?: keyof ColorToken | 'transparent'
  backgroundImage?: string
  backgroundSize?: 'cover' | 'contain' | 'auto'
  backgroundPosition?: string
  backgroundRepeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y'
  backgroundAttachment?: 'scroll' | 'fixed' | 'local'
  backgroundBlend?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten'
}

export interface OpacityProps {
  opacity?: number
  opacityHover?: number
  opacityFocus?: number
  opacityDisabled?: number
}

export interface TransformProps {
  scale?: number | string
  scaleX?: number | string
  scaleY?: number | string
  rotate?: number | string
  rotateX?: number | string
  rotateY?: number | string
  rotateZ?: number | string
  skewX?: number | string
  skewY?: number | string
  translateX?: number | string
  translateY?: number | string
  translateZ?: number | string
}

export interface TransitionProps {
  transition?: boolean
  transitionDuration?: 'fast' | 'normal' | 'slow' | string
  transitionTiming?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | string
  transitionDelay?: string
  transitionProperty?: string | 'all' | 'none' | 'common'
}

export interface InteractivityProps {
  cursor?: 'auto' | 'default' | 'pointer' | 'wait' | 'text' | 'move' | 'help' | 'not-allowed'
  userSelect?: 'auto' | 'none' | 'text' | 'all'
  pointerEvents?: 'auto' | 'none'
  touchAction?: 'auto' | 'none' | 'pan-x' | 'pan-y' | 'manipulation'
  willChange?: string
}

export interface VisibilityProps {
  visible?: boolean
  hidden?: boolean
  invisible?: boolean
  srOnly?: boolean
  notSrOnly?: boolean
}

export interface TypographyProps {
  fontFamily?: 'sans' | 'mono' | 'display'
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl'
  fontWeight?: 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'
  lineHeight?: 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose'
  letterSpacing?: 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest'
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  textDecor?: 'none' | 'underline' | 'overline' | 'line-through'
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  textColor?: keyof ColorToken
}

export interface SpacingProps {
  p?: keyof SpacingToken
  px?: keyof SpacingToken
  py?: keyof SpacingToken
  pt?: keyof SpacingToken
  pr?: keyof SpacingToken
  pb?: keyof SpacingToken
  pl?: keyof SpacingToken
  m?: keyof SpacingToken
  mx?: keyof SpacingToken
  my?: keyof SpacingToken
  mt?: keyof SpacingToken
  mr?: keyof SpacingToken
  mb?: keyof SpacingToken
  ml?: keyof SpacingToken
  space?: {
    x?: keyof SpacingToken
    y?: keyof SpacingToken
  }
}

export interface DimensionProps {
  w?: string | number
  h?: string | number
  minW?: string | number
  minH?: string | number
  maxW?: string | number
  maxH?: string | number
  aspectRatio?: string | number
}

export interface DisplayProps {
  display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid' | 'hidden'
  visibility?: 'visible' | 'hidden'
  float?: 'left' | 'right' | 'none' | 'start' | 'end'
  clear?: 'left' | 'right' | 'both' | 'none' | 'start' | 'end'
  isolation?: 'auto' | 'isolate'
}

export interface OrderProps {
  order?: number
  orderFirst?: boolean
  orderLast?: boolean
  orderNone?: boolean
}

export interface FlexItemProps {
  flex?: string | number
  flexShrink?: number
  flexGrow?: number
  flexBasis?: string | number
  alignSelf?: 'auto' | 'start' | 'end' | 'center' | 'baseline' | 'stretch'
}

export interface GridItemProps {
  colSpan?: number | string
  colStart?: number | string
  colEnd?: number | string
  rowSpan?: number | string
  rowStart?: number | string
  rowEnd?: number | string
  gridArea?: string
}

export interface ComposedProps extends
  BaseComponentProps,
  AccessibilityProps,
  ResponsiveProps,
  ThemeProps,
  LayoutProps,
  AnimationProps,
  StateProps,
  GridProps,
  FlexProps,
  PositionProps,
  OverflowProps,
  BorderProps,
  BackgroundProps,
  OpacityProps,
  TransformProps,
  TransitionProps,
  InteractivityProps,
  VisibilityProps,
  TypographyProps,
  SpacingProps,
  DimensionProps,
  DisplayProps,
  OrderProps,
  FlexItemProps,
  GridItemProps {}

export type ForSureComponentProps<T = HTMLElement> = ComposedProps & {
  as?: string
  ref?: React.Ref<T>
}

export interface ComponentConfig {
  displayName?: string
  defaultProps?: Partial<ComposedProps>
  classMap?: Record<string, string>
  variants?: ComponentVariants
}
