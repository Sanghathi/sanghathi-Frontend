import { alpha } from "@mui/material/styles";

// ----------------------------------------------------------------------

function createGradient(color1, color2) {
  return `linear-gradient(to bottom, ${color1}, ${color2})`;
}

// SETUP COLORS
const GREY = {
  0: "#FFFFFF",
  100: "#F9FAFB",
  200: "#F4F6F8",
  300: "#DFE3E8",
  400: "#C4CDD5",
  500: "#919EAB",
  600: "#637381",
  700: "#454F5B",
  800: "#212B36",
  900: "#161C24",
  500_8: alpha("#919EAB", 0.08),
  500_12: alpha("#919EAB", 0.12),
  500_16: alpha("#919EAB", 0.16),
  500_24: alpha("#919EAB", 0.24),
  500_32: alpha("#919EAB", 0.32),
  500_48: alpha("#919EAB", 0.48),
  500_56: alpha("#919EAB", 0.56),
  500_80: alpha("#919EAB", 0.8),
};

const PRIMARY = {
  lighter: "#C8FACD",
  light: "#5BE584",
  main: "#00AB55",
  dark: "#007B55",
  darker: "#005249",
  contrastText: "#FFFFFF",
};

const SECONDARY = {
  lighter: "#D6E4FF",
  light: "#84A9FF",
  main: "#3366FF",
  dark: "#1939B7",
  darker: "#091A7A",
  contrastText: "#FFFFFF",
};

const INFO = {
  lighter: "#D0F2FF",
  light: "#74CAFF",
  main: "#1890FF",
  dark: "#0C53B7",
  darker: "#04297A",
  contrastText: "#FFFFFF",
};

const SUCCESS = {
  lighter: "#E9FCD4",
  light: "#AAF27F",
  main: "#54D62C",
  dark: "#229A16",
  darker: "#08660D",
  contrastText: "#FFFFFF",
};

const WARNING = {
  lighter: "#FFF7CD",
  light: "#FFE16A",
  main: "#FFC107",
  dark: "#B78103",
  darker: "#7A4F01",
  contrastText: GREY[800],
};

const ERROR = {
  lighter: "#FFE7D9",
  light: "#FFA48D",
  main: "#FF4842",
  dark: "#B72136",
  darker: "#7A0C2E",
  contrastText: "#FFFFFF",
};

// Custom Colors for Light Theme
const CUSTOM_LIGHT = {
  primary: '#3f51b5', // rich indigo blue
  secondary: '#f50057', // vibrant pink
  accent: '#4dabf5', // light blue
  background: '#f5f7fa', // subtle light gray
  card: '#ffffff', // white
  header: '#f0f2f5', // light gray
  divider: '#e0e0e0', // subtle gray
  text: {
    primary: '#1c2536', // deep blue-gray
    secondary: '#637381', // medium gray
    disabled: '#919eab', // light gray
  },
  shadow: {
    card: '0 2px 20px 0 rgba(0,0,0,0.05)',
    dropdown: '0 4px 12px 0 rgba(0,0,0,0.1)',
  }
};

// Enhanced Dark Theme Colors
const CUSTOM_DARK = {
  primary: '#3f51b5', // maintain consistency with light theme
  secondary: '#f50057', // maintain consistency with light theme
  accent: '#4dabf5', // light blue accent
  background: '#1a1e2b', // rich dark background
  card: '#282e3e', // slightly lighter card background
  header: '#1e2435', // dark header
  divider: '#323c52', // subtle divider
  text: {
    primary: '#ffffff', // bright white for primary text
    secondary: '#a5b0c9', // light blue-gray for secondary text
    disabled: '#636e84', // muted blue-gray for disabled text
  },
  shadow: {
    card: '0 2px 16px 0 rgba(0,0,0,0.3)',
    dropdown: '0 4px 12px 0 rgba(0,0,0,0.4)',
  }
};

const GRADIENTS = {
  primary: createGradient(PRIMARY.light, PRIMARY.main),
  info: createGradient(INFO.light, INFO.main),
  success: createGradient(SUCCESS.light, SUCCESS.main),
  warning: createGradient(WARNING.light, WARNING.main),
  error: createGradient(ERROR.light, ERROR.main),
};

const COMMON = {
  common: { black: "#000", white: "#fff" },
  primary: { ...PRIMARY, contrastText: "#fff" },
  secondary: { ...SECONDARY, contrastText: "#fff" },
  info: { ...INFO, contrastText: "#fff" },
  success: { ...SUCCESS, contrastText: GREY[800] },
  warning: { ...WARNING, contrastText: GREY[800] },
  error: { ...ERROR, contrastText: "#fff" },
  grey: GREY,
  gradients: GRADIENTS,
  divider: GREY[500_24],
  action: {
    hover: GREY[500_8],
    selected: GREY[500_16],
    disabled: GREY[500_80],
    disabledBackground: GREY[500_24],
    focus: GREY[500_24],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

const palette = {
  light: {
    ...COMMON,
    mode: "light",
    text: {
      primary: CUSTOM_LIGHT.text.primary,
      secondary: CUSTOM_LIGHT.text.secondary,
      disabled: CUSTOM_LIGHT.text.disabled,
    },
    background: {
      paper: CUSTOM_LIGHT.card,
      default: CUSTOM_LIGHT.background,
      neutral: GREY[200],
    },
    action: {
      ...COMMON.action,
      active: GREY[600],
    },
  },
  dark: {
    ...COMMON,
    mode: "dark",
    custom: CUSTOM_DARK,
    text: { 
      primary: CUSTOM_DARK.text.primary, 
      secondary: CUSTOM_DARK.text.secondary, 
      disabled: CUSTOM_DARK.text.disabled 
    },
    background: { 
      paper: CUSTOM_DARK.card, 
      default: CUSTOM_DARK.background, 
      neutral: alpha(GREY[500], 0.16) 
    },
    action: { 
      active: GREY[400], 
      ...COMMON.action,
      hover: alpha(GREY[400], 0.08),
      selected: alpha(GREY[500], 0.24),
    },
  },
};

export default palette;
