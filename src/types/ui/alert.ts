import { type VariantProps } from 'class-variance-authority';
import {
  alertVariants,
  alertCloseVariants,
  recipeAlertVariants,
  toastAlertVariants,
  bannerAlertVariants,
  inlineAlertVariants,
} from '@/lib/ui/alert-variants';

export interface BaseAlertProps {
  variant?: VariantProps<typeof alertVariants>['variant'];
  size?: VariantProps<typeof alertVariants>['size'];
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  dismissible?: boolean;
  onClose?: () => void;
  className?: string;
  actions?: React.ReactNode;
}

export interface RecipeAlertProps extends Omit<BaseAlertProps, 'variant'> {
  type: VariantProps<typeof recipeAlertVariants>['type'];
  recipeName?: string;
}

export interface ToastAlertProps extends Omit<BaseAlertProps, 'variant'> {
  variant?: VariantProps<typeof toastAlertVariants>['variant'];
  position?: VariantProps<typeof toastAlertVariants>['position'];
  duration?: number;
  autoClose?: boolean;
}

export interface BannerAlertProps extends Omit<
  BaseAlertProps,
  'variant' | 'dismissible'
> {
  variant?: VariantProps<typeof bannerAlertVariants>['variant'];
  position?: VariantProps<typeof bannerAlertVariants>['position'];
  dismissible?: boolean;
}

export interface InlineAlertProps extends Omit<
  BaseAlertProps,
  'size' | 'actions'
> {
  variant?: VariantProps<typeof inlineAlertVariants>['variant'];
}

export interface AlertProviderProps {
  children: React.ReactNode;
  maxAlerts?: number;
}

export interface AlertItem {
  id: string;
  type: 'alert' | 'toast' | 'banner';
  props: BaseAlertProps | ToastAlertProps | BannerAlertProps;
  timestamp: number;
}

export interface AlertContextType {
  alerts: AlertItem[];
  showAlert: (props: BaseAlertProps) => string;
  showToast: (props: ToastAlertProps) => string;
  showBanner: (props: BannerAlertProps) => string;
  hideAlert: (id: string) => void;
  clearAlerts: () => void;
}

export interface AlertCloseProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof alertCloseVariants> {
  onClose?: () => void;
}
