import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Bell, Shield } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application preferences
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="mb-4 flex items-center">
            <User className="text-primary mr-3 h-8 w-8" />
            <h3 className="font-semibold">Account</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Manage your account settings and personal information
          </p>
          <Button variant="outline" size="sm" className="w-full">
            Account Settings
          </Button>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center">
            <Bell className="text-primary mr-3 h-8 w-8" />
            <h3 className="font-semibold">Notifications</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Control how and when you receive notifications
          </p>
          <Button variant="outline" size="sm" className="w-full">
            Notification Settings
          </Button>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center">
            <Shield className="text-primary mr-3 h-8 w-8" />
            <h3 className="font-semibold">Privacy & Security</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Manage your privacy settings and security preferences
          </p>
          <Button variant="outline" size="sm" className="w-full">
            Privacy Settings
          </Button>
        </Card>
      </div>
    </div>
  );
}
