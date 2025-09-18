import {
  // Common UI Icons
  X,
  Plus,
  Minus,
  Check,
  Search,
  Menu,
  MoreHorizontal,
  MoreVertical,
  Settings,
  Home,
  User,
  Bell,
  Mail,
  Phone,
  Globe,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Edit,
  Edit3,
  Trash2,
  Save,
  Download,
  Upload,
  Share,
  Copy,
  ExternalLink,
  RefreshCw,
  Loader,
  Loader2,

  // Navigation Icons
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
  ChevronsDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  ArrowLeftRight,

  // Status & Feedback Icons
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  XCircle,
  HelpCircle,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Star,
  Flag,

  // Recipe & Cooking Icons
  ChefHat,
  CookingPot,
  UtensilsCrossed,
  Utensils,
  Timer,
  Clock,
  Thermometer,
  Flame,
  Droplets,
  Scale,
  Wheat,
  Apple,
  Beef,
  Fish,
  Egg,
  Milk,
  Coffee,
  Wine,

  // Content & Media Icons
  Image,
  Video,
  Music,
  File,
  FileText,
  Folder,
  FolderOpen,
  Calendar,
  BookOpen,
  Book,
  Bookmark,
  Tag,
  Tags,

  // Social & Sharing Icons
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Github,
  Share2,
  MessageSquare,
  Send,
  Forward,

  // System & Settings Icons
  Cog,
  Sliders,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  LayoutGrid,
  LayoutList,
  Maximize,
  Minimize,
  Expand,
  Shrink,

  // User & Profile Icons
  Users,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  Crown,
  Shield,
  Award,
  Badge,
  Target,

  // E-commerce & Shopping Icons
  ShoppingCart,
  ShoppingBag,
  CreditCard,
  DollarSign,
  Receipt,
  Package,
  Truck,
  MapPin,
  Map,

  // Time & Date Icons
  Clock1,
  Clock2,
  Clock3,
  Clock4,
  Clock5,
  Clock6,
  Clock7,
  Clock8,
  Clock9,
  Clock10,
  Clock11,
  Clock12,
  Hourglass,
  CalendarDays,
  CalendarCheck,

  // Development & Technical Icons
  Code,
  Code2,
  Terminal,
  Database,
  Server,
  Wifi,
  WifiOff,
  Bluetooth,
  Cpu,
  HardDrive,
  Monitor,
  Smartphone,
  Tablet,

  // Weather & Environment Icons
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Sunrise,
  Sunset,

  // Shapes & Graphics Icons
  Circle,
  Square,
  Triangle,
  Diamond,
  Hexagon,
  Pentagon,
  Octagon,

  // Accessibility Icons
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  CameraOff,
} from 'lucide-react';

/**
 * Comprehensive icon registry organized by categories
 */
export const iconRegistry = {
  // Common UI Icons
  common: {
    close: X,
    add: Plus,
    remove: Minus,
    check: Check,
    search: Search,
    menu: Menu,
    'more-horizontal': MoreHorizontal,
    'more-vertical': MoreVertical,
    settings: Settings,
    home: Home,
    user: User,
    bell: Bell,
    mail: Mail,
    phone: Phone,
    globe: Globe,
    lock: Lock,
    unlock: Unlock,
    eye: Eye,
    'eye-off': EyeOff,
    edit: Edit,
    'edit-alt': Edit3,
    delete: Trash2,
    save: Save,
    download: Download,
    upload: Upload,
    share: Share,
    copy: Copy,
    'external-link': ExternalLink,
    refresh: RefreshCw,
    loading: Loader,
    'loading-alt': Loader2,
  },

  // Navigation Icons
  navigation: {
    'chevron-left': ChevronLeft,
    'chevron-right': ChevronRight,
    'chevron-up': ChevronUp,
    'chevron-down': ChevronDown,
    'chevrons-left': ChevronsLeft,
    'chevrons-right': ChevronsRight,
    'chevrons-up': ChevronsUp,
    'chevrons-down': ChevronsDown,
    'arrow-left': ArrowLeft,
    'arrow-right': ArrowRight,
    'arrow-up': ArrowUp,
    'arrow-down': ArrowDown,
    'arrow-up-down': ArrowUpDown,
    'arrow-left-right': ArrowLeftRight,
  },

  // Status & Feedback Icons
  status: {
    info: Info,
    warning: AlertTriangle,
    'alert-circle': AlertCircle,
    success: CheckCircle,
    error: XCircle,
    help: HelpCircle,
    message: MessageCircle,
    'thumbs-up': ThumbsUp,
    'thumbs-down': ThumbsDown,
    heart: Heart,
    star: Star,
    flag: Flag,
  },

  // Recipe & Cooking Icons
  recipe: {
    'chef-hat': ChefHat,
    'cooking-pot': CookingPot,
    'utensils-crossed': UtensilsCrossed,
    utensils: Utensils,
    timer: Timer,
    clock: Clock,
    thermometer: Thermometer,
    flame: Flame,
    droplets: Droplets,
    scale: Scale,
    wheat: Wheat,
    apple: Apple,
    beef: Beef,
    fish: Fish,
    egg: Egg,
    milk: Milk,
    coffee: Coffee,
    wine: Wine,
  },

  // Content & Media Icons
  content: {
    image: Image,
    video: Video,
    music: Music,
    file: File,
    'file-text': FileText,
    folder: Folder,
    'folder-open': FolderOpen,
    calendar: Calendar,
    'book-open': BookOpen,
    book: Book,
    bookmark: Bookmark,
    tag: Tag,
    tags: Tags,
  },

  // Social & Sharing Icons
  social: {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    youtube: Youtube,
    linkedin: Linkedin,
    github: Github,
    'share-alt': Share2,
    'message-square': MessageSquare,
    send: Send,
    forward: Forward,
  },

  // System & Settings Icons
  system: {
    cog: Cog,
    sliders: Sliders,
    filter: Filter,
    'sort-asc': SortAsc,
    'sort-desc': SortDesc,
    grid: Grid,
    list: List,
    'layout-grid': LayoutGrid,
    'layout-list': LayoutList,
    maximize: Maximize,
    minimize: Minimize,
    expand: Expand,
    shrink: Shrink,
  },

  // User & Profile Icons
  users: {
    users: Users,
    'user-plus': UserPlus,
    'user-minus': UserMinus,
    'user-check': UserCheck,
    'user-x': UserX,
    crown: Crown,
    shield: Shield,
    award: Award,
    badge: Badge,
    target: Target,
  },

  // E-commerce & Shopping Icons
  commerce: {
    'shopping-cart': ShoppingCart,
    'shopping-bag': ShoppingBag,
    'credit-card': CreditCard,
    'dollar-sign': DollarSign,
    receipt: Receipt,
    package: Package,
    truck: Truck,
    'map-pin': MapPin,
    map: Map,
  },

  // Time & Date Icons
  time: {
    'clock-1': Clock1,
    'clock-2': Clock2,
    'clock-3': Clock3,
    'clock-4': Clock4,
    'clock-5': Clock5,
    'clock-6': Clock6,
    'clock-7': Clock7,
    'clock-8': Clock8,
    'clock-9': Clock9,
    'clock-10': Clock10,
    'clock-11': Clock11,
    'clock-12': Clock12,
    hourglass: Hourglass,
    'calendar-days': CalendarDays,
    'calendar-check': CalendarCheck,
  },

  // Development & Technical Icons
  tech: {
    code: Code,
    'code-alt': Code2,
    terminal: Terminal,
    database: Database,
    server: Server,
    wifi: Wifi,
    'wifi-off': WifiOff,
    bluetooth: Bluetooth,
    cpu: Cpu,
    'hard-drive': HardDrive,
    monitor: Monitor,
    smartphone: Smartphone,
    tablet: Tablet,
  },

  // Weather & Environment Icons
  weather: {
    sun: Sun,
    moon: Moon,
    cloud: Cloud,
    'cloud-rain': CloudRain,
    'cloud-snow': CloudSnow,
    'cloud-lightning': CloudLightning,
    wind: Wind,
    sunrise: Sunrise,
    sunset: Sunset,
  },

  // Shapes & Graphics Icons
  shapes: {
    circle: Circle,
    square: Square,
    triangle: Triangle,
    diamond: Diamond,
    hexagon: Hexagon,
    pentagon: Pentagon,
    octagon: Octagon,
  },

  // Accessibility Icons
  accessibility: {
    volume: Volume,
    'volume-1': Volume1,
    'volume-2': Volume2,
    'volume-x': VolumeX,
    mic: Mic,
    'mic-off': MicOff,
    camera: Camera,
    'camera-off': CameraOff,
  },
} as const;

/**
 * Flattened registry for direct icon lookup
 */
export const flatIconRegistry: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {};

// Build flat registry safely
Object.entries(iconRegistry).forEach(([_category, icons]) => {
  Object.entries(icons).forEach(([name, icon]) => {
    if (typeof name === 'string' && name.length > 0 && icon) {
      Object.defineProperty(flatIconRegistry, name, {
        value: icon,
        enumerable: true,
        configurable: false,
        writable: false,
      });
    }
  });
});

/**
 * Get all icon names from the registry
 */
export const getIconNames = (): string[] => {
  return Object.keys(flatIconRegistry);
};

/**
 * Get icons by category
 */
export const getIconsByCategory = (category: keyof typeof iconRegistry) => {
  switch (category) {
    case 'common':
      return iconRegistry.common;
    case 'navigation':
      return iconRegistry.navigation;
    case 'status':
      return iconRegistry.status;
    case 'recipe':
      return iconRegistry.recipe;
    case 'content':
      return iconRegistry.content;
    case 'social':
      return iconRegistry.social;
    case 'system':
      return iconRegistry.system;
    case 'users':
      return iconRegistry.users;
    case 'commerce':
      return iconRegistry.commerce;
    case 'time':
      return iconRegistry.time;
    case 'tech':
      return iconRegistry.tech;
    case 'weather':
      return iconRegistry.weather;
    case 'shapes':
      return iconRegistry.shapes;
    case 'accessibility':
      return iconRegistry.accessibility;
    default:
      return {};
  }
};

/**
 * Get all categories
 */
export const getIconCategories = (): Array<keyof typeof iconRegistry> => {
  return Object.keys(iconRegistry) as Array<keyof typeof iconRegistry>;
};

/**
 * Check if an icon exists in the registry
 */
export const hasIcon = (iconName: string): boolean => {
  return iconName in flatIconRegistry;
};

/**
 * Get icon component by name
 */
export const getIcon = (
  iconName: string
): React.ComponentType<React.SVGProps<SVGSVGElement>> | undefined => {
  if (
    typeof iconName === 'string' &&
    Object.prototype.hasOwnProperty.call(flatIconRegistry, iconName)
  ) {
    const descriptor = Object.getOwnPropertyDescriptor(
      flatIconRegistry,
      iconName
    );
    return descriptor?.value as
      | React.ComponentType<React.SVGProps<SVGSVGElement>>
      | undefined;
  }
  return undefined;
};
