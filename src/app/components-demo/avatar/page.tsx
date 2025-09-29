'use client';

import React, { useState } from 'react';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarStatus,
  AvatarGroup,
  UserAvatar,
  RecipeAuthor,
} from '@/components/ui/avatar';

// Sample data for demo
const sampleUsers = [
  {
    id: '1',
    name: 'Gordon Ramsay',
    avatar:
      'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=150&h=150&fit=crop&crop=face',
    role: 'chef' as const,
    verified: true,
    rating: 4.9,
    recipeCount: 127,
    status: 'chef' as const,
  },
  {
    id: '2',
    name: 'Julia Child',
    avatar:
      'https://images.unsplash.com/photo-1594736797933-d0d39c155d96?w=150&h=150&fit=crop&crop=face',
    role: 'chef' as const,
    verified: true,
    rating: 4.8,
    recipeCount: 89,
    status: 'chef' as const,
  },
  {
    id: '3',
    name: 'Maria Rodriguez',
    role: 'user' as const,
    verified: true,
    rating: 4.6,
    recipeCount: 23,
    status: 'verified' as const,
  },
  {
    id: '4',
    name: 'David Kim',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'user' as const,
    verified: false,
    rating: 4.2,
    recipeCount: 8,
    status: 'online' as const,
  },
  {
    id: '5',
    name: 'Admin User',
    role: 'admin' as const,
    verified: true,
    rating: 4.9,
    recipeCount: 156,
    status: 'verified' as const,
  },
];

const recipes = [
  {
    id: '1',
    title: 'Classic Beef Wellington',
    author: sampleUsers[0],
    collaborators: [sampleUsers[1], sampleUsers[2], sampleUsers[3]],
  },
  {
    id: '2',
    title: 'Homemade Pasta with Marinara',
    author: sampleUsers[2],
    collaborators: [sampleUsers[0], sampleUsers[4]],
  },
  {
    id: '3',
    title: 'Korean BBQ Tacos',
    author: sampleUsers[3],
    collaborators: [
      sampleUsers[1],
      sampleUsers[2],
      sampleUsers[4],
      sampleUsers[0],
    ],
  },
];

export default function AvatarDemo() {
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<
    'sm' | 'default' | 'lg' | 'xl'
  >('default');

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="space-y-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Avatar Component Demo</h1>
          <p className="text-text-secondary">
            Interactive examples of the Avatar component for user profiles, chef
            attribution, and recipe collaboration in the Recipe App.
          </p>
        </div>

        {/* Basic Avatars */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Basic Avatars</h2>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            <div className="space-y-3">
              <h3 className="font-medium">With Image</h3>
              <Avatar>
                <AvatarImage
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                  alt="John Doe"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Fallback Only</h3>
              <Avatar>
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">With Status</h3>
              <Avatar>
                <AvatarFallback variant="user">ON</AvatarFallback>
                <AvatarStatus status="online" aria-label="Online" />
              </Avatar>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Chef Badge</h3>
              <Avatar variant="chef">
                <AvatarFallback variant="chef">CH</AvatarFallback>
                <AvatarStatus status="chef" aria-label="Verified Chef" />
              </Avatar>
            </div>
          </div>
        </section>

        {/* Size Examples */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Avatar Sizes</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <label className="font-medium">Size:</label>
              <select
                value={selectedSize}
                onChange={e =>
                  setSelectedSize(
                    e.target.value as 'sm' | 'default' | 'lg' | 'xl'
                  )
                }
                className="rounded border px-3 py-1"
              >
                <option value="sm">Small</option>
                <option value="default">Default</option>
                <option value="lg">Large</option>
                <option value="xl">Extra Large</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <UserAvatar
                name="Size Example"
                role="chef"
                size={selectedSize}
                status="chef"
                showStatus={true}
                src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=150&h=150&fit=crop&crop=face"
              />
              <UserAvatar
                name="Fallback Example"
                role="user"
                size={selectedSize}
                status="online"
                showStatus={true}
              />
            </div>
          </div>
        </section>

        {/* User Types */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">User Types & Roles</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sampleUsers.map(user => (
              <div key={user.id} className="rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    name={user.name}
                    src={user.avatar}
                    role={user.role}
                    status={user.status}
                    showStatus={true}
                    size="lg"
                  />
                  <div>
                    <h4 className="font-medium">{user.name}</h4>
                    <p className="text-text-secondary text-sm capitalize">
                      {user.role === 'chef'
                        ? '👨‍🍳 Chef'
                        : user.role === 'admin'
                          ? '👑 Admin'
                          : 'Home Cook'}
                    </p>
                    <div className="text-text-tertiary mt-1 flex items-center gap-2 text-xs">
                      {user.verified && (
                        <span className="text-info flex items-center gap-1">
                          <svg
                            className="h-3 w-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Verified
                        </span>
                      )}
                      <span>★ {user.rating}</span>
                      <span>{user.recipeCount} recipes</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recipe Authors */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Recipe Author Cards</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {sampleUsers.slice(0, 4).map(user => (
              <RecipeAuthor
                key={user.id}
                author={user}
                variant={
                  user.role === 'chef'
                    ? 'chef'
                    : user.role === 'admin'
                      ? 'premium'
                      : 'outlined'
                }
                showStats={true}
                showRole={true}
                interactive={true}
                onClick={() => setSelectedAuthor(user.id)}
                className={
                  selectedAuthor === user.id ? 'ring-2 ring-blue-500' : ''
                }
              />
            ))}
          </div>
          {selectedAuthor && (
            <div className="mt-4 rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                Selected author:{' '}
                {sampleUsers.find(u => u.id === selectedAuthor)?.name}
              </p>
            </div>
          )}
        </section>

        {/* Avatar Groups */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Avatar Groups</h2>
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 font-medium">Recipe Collaborators</h3>
              <div className="space-y-4">
                {recipes.map(recipe => (
                  <div key={recipe.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{recipe.title}</h4>
                        <p className="text-text-secondary text-sm">
                          by {recipe.author.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-text-tertiary text-xs">
                            Collaborators
                          </p>
                          <AvatarGroup
                            max={3}
                            totalCount={recipe.collaborators.length}
                          >
                            {recipe.collaborators.map(collaborator => (
                              <UserAvatar
                                key={collaborator.id}
                                name={collaborator.name}
                                src={collaborator.avatar}
                                role={collaborator.role}
                                size="sm"
                              />
                            ))}
                          </AvatarGroup>
                        </div>
                        <UserAvatar
                          name={recipe.author.name}
                          src={recipe.author.avatar}
                          role={recipe.author.role}
                          status={recipe.author.status}
                          showStatus={true}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-medium">Different Group Sizes</h3>
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-text-secondary mb-2 text-sm">
                    Small (max 2)
                  </p>
                  <AvatarGroup size="sm" max={2}>
                    <UserAvatar name="User One" role="user" size="sm" />
                    <UserAvatar name="User Two" role="chef" size="sm" />
                    <UserAvatar name="User Three" role="user" size="sm" />
                  </AvatarGroup>
                </div>

                <div>
                  <p className="text-text-secondary mb-2 text-sm">
                    Medium (max 4)
                  </p>
                  <AvatarGroup max={4}>
                    <UserAvatar name="User One" role="user" />
                    <UserAvatar name="User Two" role="chef" />
                    <UserAvatar name="User Three" role="user" />
                    <UserAvatar name="User Four" role="admin" />
                    <UserAvatar name="User Five" role="user" />
                    <UserAvatar name="User Six" role="chef" />
                  </AvatarGroup>
                </div>

                <div>
                  <p className="text-text-secondary mb-2 text-sm">
                    Large (max 6)
                  </p>
                  <AvatarGroup size="lg" max={6} totalCount={12}>
                    <UserAvatar name="User One" role="user" size="lg" />
                    <UserAvatar name="User Two" role="chef" size="lg" />
                    <UserAvatar name="User Three" role="user" size="lg" />
                    <UserAvatar name="User Four" role="admin" size="lg" />
                    <UserAvatar name="User Five" role="user" size="lg" />
                    <UserAvatar name="User Six" role="chef" size="lg" />
                  </AvatarGroup>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recipe Reviews Section */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            Recipe Reviews & Comments
          </h2>
          <div className="max-w-2xl space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex gap-3">
                <UserAvatar
                  name="Food Critic Pro"
                  role="admin"
                  status="verified"
                  showStatus={true}
                  size="sm"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Food Critic Pro</span>
                    <div className="flex text-sm text-yellow-400">
                      {'★'.repeat(5)}
                    </div>
                    <span className="text-text-tertiary text-xs">
                      2 hours ago
                    </span>
                  </div>
                  <p className="text-text-secondary mt-1 text-sm">
                    &quot;Absolutely fantastic recipe! The flavors were
                    perfectly balanced and the instructions were crystal clear.
                    This will definitely become a regular in our dinner
                    rotation.&quot;
                  </p>
                  <div className="text-text-tertiary mt-2 flex items-center gap-4 text-xs">
                    <button className="hover:text-blue-600">👍 12</button>
                    <button className="hover:text-blue-600">Reply</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex gap-3">
                <UserAvatar name="Home Baker Sarah" role="user" size="sm" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      Home Baker Sarah
                    </span>
                    <div className="flex text-sm text-yellow-400">
                      {'★'.repeat(4)}
                    </div>
                    <span className="text-text-tertiary text-xs">
                      1 day ago
                    </span>
                  </div>
                  <p className="text-text-secondary mt-1 text-sm">
                    &quot;Great recipe! I substituted almond flour for regular
                    flour and it turned out wonderful. Perfect for my
                    gluten-free family members.&quot;
                  </p>
                  <div className="text-text-tertiary mt-2 flex items-center gap-4 text-xs">
                    <button className="hover:text-blue-600">👍 8</button>
                    <button className="hover:text-blue-600">Reply</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex gap-3">
                <UserAvatar
                  name="Chef Marco"
                  role="chef"
                  status="chef"
                  showStatus={true}
                  size="sm"
                  src="https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?w=150&h=150&fit=crop&crop=face"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Chef Marco</span>
                    <div className="flex text-sm text-yellow-400">
                      {'★'.repeat(5)}
                    </div>
                    <span className="text-text-tertiary text-xs">
                      3 days ago
                    </span>
                  </div>
                  <p className="text-text-secondary mt-1 text-sm">
                    &quot;As a professional chef, I can say this recipe is spot
                    on. The technique for the sauce is exactly what we use in
                    our restaurant. Well done!&quot;
                  </p>
                  <div className="text-text-tertiary mt-2 flex items-center gap-4 text-xs">
                    <button className="hover:text-blue-600">👍 24</button>
                    <button className="hover:text-blue-600">Reply</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Usage Guidelines</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-green-50 p-4">
              <h3 className="mb-2 font-medium text-green-800">
                ✅ Best Practices
              </h3>
              <ul className="space-y-1 text-sm text-green-700">
                <li>
                  • Use appropriate sizes for context (sm for lists, lg for
                  profiles)
                </li>
                <li>• Always provide meaningful alt text for avatar images</li>
                <li>• Use status indicators sparingly and meaningfully</li>
                <li>• Show chef badges for verified professional chefs</li>
                <li>• Group avatars for recipe collaborations</li>
                <li>• Ensure proper color contrast for accessibility</li>
                <li>• Provide fallback initials for users without photos</li>
              </ul>
            </div>

            <div className="rounded-lg bg-red-50 p-4">
              <h3 className="mb-2 font-medium text-red-800">❌ Avoid</h3>
              <ul className="space-y-1 text-sm text-red-700">
                <li>• Using avatars without alt text or fallbacks</li>
                <li>• Overusing status indicators or badges</li>
                <li>• Making avatars too small to be recognizable</li>
                <li>• Using low-quality or inappropriate images</li>
                <li>• Inconsistent sizing within the same context</li>
                <li>• Cluttering the interface with too many avatar groups</li>
                <li>• Missing verification for professional chef accounts</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
