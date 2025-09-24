'use client';

import React, { useState } from 'react';
import {
  AvatarGroup,
  AvatarGroupWithContext,
} from '@/components/ui/avatar-group';
import type { AvatarGroupUser } from '@/types/ui/avatar-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Sample user data
const sampleUsers: AvatarGroupUser[] = [
  {
    id: '1',
    name: 'Gordon Ramsay',
    avatar: 'https://i.pravatar.cc/150?img=1',
    role: 'chef',
    verified: true,
    status: 'online',
  },
  {
    id: '2',
    name: 'Julia Child',
    avatar: 'https://i.pravatar.cc/150?img=2',
    role: 'chef',
    status: 'online',
  },
  {
    id: '3',
    name: 'Jamie Oliver',
    avatar: 'https://i.pravatar.cc/150?img=3',
    role: 'chef',
    verified: true,
    status: 'away',
  },
  {
    id: '4',
    name: 'Alice Waters',
    avatar: 'https://i.pravatar.cc/150?img=4',
    role: 'admin',
    status: 'busy',
  },
  {
    id: '5',
    name: 'Bobby Flay',
    avatar: 'https://i.pravatar.cc/150?img=5',
    status: 'online',
  },
  {
    id: '6',
    name: 'Ina Garten',
    avatar: 'https://i.pravatar.cc/150?img=6',
    verified: true,
    status: 'offline',
  },
  {
    id: '7',
    name: 'Wolfgang Puck',
    avatar: 'https://i.pravatar.cc/150?img=7',
    role: 'chef',
  },
  {
    id: '8',
    name: 'Emeril Lagasse',
    role: 'chef',
    verified: true,
  },
  {
    id: '9',
    name: 'Rachael Ray',
    avatar: 'https://i.pravatar.cc/150?img=9',
  },
  {
    id: '10',
    name: 'Guy Fieri',
    avatar: 'https://i.pravatar.cc/150?img=10',
    status: 'online',
  },
  {
    id: '11',
    name: 'Alton Brown',
    avatar: 'https://i.pravatar.cc/150?img=11',
  },
  {
    id: '12',
    name: 'Giada De Laurentiis',
    avatar: 'https://i.pravatar.cc/150?img=12',
    role: 'chef',
  },
];

// Users without avatars to show initials
const usersWithInitials: AvatarGroupUser[] = [
  { id: 'init-1', name: 'John Doe' },
  { id: 'init-2', name: 'Jane Smith', role: 'chef' },
  { id: 'init-3', name: 'Robert Johnson Jr', verified: true },
  { id: 'init-4', name: 'A B', role: 'admin' },
  { id: 'init-5', name: 'Charlie' },
];

export default function AvatarGroupDemo() {
  const [clickedUser, setClickedUser] = useState<string | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">AvatarGroup Component</h1>
        <p className="text-muted-foreground text-lg">
          Display multiple user avatars for shared recipes and meal plans
        </p>
      </div>

      {/* Size Variants */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Size Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Extra Small
            </label>
            <AvatarGroup users={sampleUsers} size="xs" max={6} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Small</label>
            <AvatarGroup users={sampleUsers} size="sm" max={6} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Medium (Default)
            </label>
            <AvatarGroup users={sampleUsers} size="md" max={6} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Large</label>
            <AvatarGroup users={sampleUsers} size="lg" max={6} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Extra Large
            </label>
            <AvatarGroup users={sampleUsers} size="xl" max={6} />
          </div>
        </CardContent>
      </Card>

      {/* Layout Variants */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Layout Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Stacked Layout (Default - Overlapping)
            </label>
            <AvatarGroup users={sampleUsers} layout="stacked" max={8} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Grid Layout
            </label>
            <AvatarGroup users={sampleUsers} layout="grid" max={8} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Inline Layout
            </label>
            <AvatarGroup users={sampleUsers} layout="inline" max={8} />
          </div>
        </CardContent>
      </Card>

      {/* Overflow Handling */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Overflow Handling</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Max 3 Avatars (9 more hidden)
            </label>
            <AvatarGroup users={sampleUsers} max={3} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Max 5 Avatars (7 more hidden)
            </label>
            <AvatarGroup users={sampleUsers} max={5} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Max 8 Avatars (4 more hidden)
            </label>
            <AvatarGroup users={sampleUsers} max={8} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              All Avatars Visible
            </label>
            <AvatarGroup users={sampleUsers} max={20} />
          </div>
        </CardContent>
      </Card>

      {/* Interactive Features */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Interactive Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              With Tooltips (Hover over avatars)
            </label>
            <AvatarGroup users={sampleUsers} max={6} showTooltip animated />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              With Status Indicators
            </label>
            <AvatarGroup users={sampleUsers} max={6} showStatus animated />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Clickable Avatars (Click to select)
            </label>
            <AvatarGroup
              users={sampleUsers}
              max={6}
              animated
              onUserClick={user => setClickedUser(user.name)}
              onOverflowClick={() => setClickedUser('View all users')}
            />
            {clickedUser && (
              <p className="mt-2 text-sm text-gray-600">
                Clicked: {clickedUser}
              </p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              All Features Combined
            </label>
            <AvatarGroup
              users={sampleUsers}
              max={5}
              showTooltip
              showStatus
              animated
              onUserClick={user => setClickedUser(user.name)}
            />
          </div>
        </CardContent>
      </Card>

      {/* With Initials */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Initials Fallback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Users Without Avatar Images
            </label>
            <AvatarGroup
              users={usersWithInitials}
              size="lg"
              showTooltip
              animated
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Mixed: With and Without Avatars
            </label>
            <AvatarGroup
              users={[
                ...sampleUsers.slice(0, 3),
                ...usersWithInitials.slice(0, 2),
              ]}
              size="lg"
              showTooltip
            />
          </div>
        </CardContent>
      </Card>

      {/* With Context */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>With Context Labels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Recipe Collaborators
            </label>
            <AvatarGroupWithContext
              users={sampleUsers.slice(0, 4)}
              context={{
                type: 'recipe',
                title: "Grandma's Apple Pie",
                isPublic: false,
              }}
              showTooltip
              animated
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Meal Plan Participants
            </label>
            <AvatarGroupWithContext
              users={sampleUsers.slice(3, 8)}
              context={{
                type: 'meal-plan',
                title: 'Weekly Family Meals',
                isPublic: true,
              }}
              max={4}
              showTooltip
              animated
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Collection Contributors
            </label>
            <AvatarGroupWithContext
              users={sampleUsers.slice(2, 7)}
              context={{
                type: 'collection',
                isPublic: true,
              }}
              showTooltip
            />
          </div>
        </CardContent>
      </Card>

      {/* Recipe-Specific Examples */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recipe App Use Cases</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border bg-orange-50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold">Featured Chef Collection</h3>
              <AvatarGroup
                users={sampleUsers.filter(u => u.role === 'chef').slice(0, 4)}
                size="sm"
                showTooltip
                animated
              />
            </div>
            <p className="text-sm text-gray-600">
              Recipes curated by our verified chefs
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold">Community Contributors</h3>
              <span className="text-sm text-gray-500">12 total</span>
            </div>
            <AvatarGroup
              users={sampleUsers}
              max={8}
              layout="grid"
              size="sm"
              showStatus
              animated
              onOverflowClick={() => alert('Show all contributors')}
            />
          </div>

          <div className="rounded-lg border bg-purple-50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold">Premium Members</h3>
              <AvatarGroup
                users={sampleUsers.filter(u => u.verified).slice(0, 5)}
                size="md"
                layout="inline"
                showTooltip
                showStatus
                animated
              />
            </div>
            <p className="text-sm text-gray-600">
              Exclusive recipes from verified members
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Custom Overflow */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Custom Overflow Rendering</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Custom Overflow Button
            </label>
            <AvatarGroup
              users={sampleUsers}
              max={4}
              renderOverflow={count => (
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-sm font-bold text-white shadow-lg transition-transform hover:scale-110"
                  onClick={() => alert(`Show ${count} more users`)}
                >
                  +{count}
                </button>
              )}
              animated
            />
          </div>
        </CardContent>
      </Card>

      {/* Code Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Code Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="mb-2 font-semibold">Basic Usage</h3>
            <pre className="rounded-lg bg-gray-100 p-4 text-sm">
              <code>{`<AvatarGroup users={users} />`}</code>
            </pre>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">With Options</h3>
            <pre className="rounded-lg bg-gray-100 p-4 text-sm">
              <code>{`<AvatarGroup
  users={users}
  max={5}
  size="lg"
  layout="stacked"
  showTooltip
  showStatus
  animated
  onUserClick={(user) => console.log(user)}
  onOverflowClick={() => console.log('Show all')}
/>`}</code>
            </pre>
          </div>

          <div>
            <h3 className="mb-2 font-semibold">With Context</h3>
            <pre className="rounded-lg bg-gray-100 p-4 text-sm">
              <code>{`<AvatarGroupWithContext
  users={users}
  context={{
    type: 'recipe',
    title: 'My Recipe',
    isPublic: false,
  }}
/>`}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
