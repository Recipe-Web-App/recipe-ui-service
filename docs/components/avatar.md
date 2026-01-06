# Avatar Component

User images and initials display.

**Source**: `src/components/ui/avatar.tsx`
**Demo**: `/components-demo/avatar`

## Usage

```tsx
// With image
<Avatar>
  <AvatarImage src={user.avatar} alt={user.name} />
  <AvatarFallback>{user.initials}</AvatarFallback>
</Avatar>

// Fallback only
<Avatar>
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

// With size
<Avatar size="lg">
  <AvatarImage src={chef.avatar} alt={chef.name} />
  <AvatarFallback>{chef.initials}</AvatarFallback>
</Avatar>

// In a group
<AvatarGroup max={3}>
  {contributors.map(user => (
    <Avatar key={user.id}>
      <AvatarImage src={user.avatar} />
      <AvatarFallback>{user.initials}</AvatarFallback>
    </Avatar>
  ))}
</AvatarGroup>
```

## Sizes

- `xs` - Extra small (24px)
- `sm` - Small (32px)
- `md` - Medium (40px) - default
- `lg` - Large (48px)
- `xl` - Extra large (64px)

## Recipe App Use Cases

- Recipe author display
- Reviewer avatars
- Recipe contributors
- User profile pictures
- Comment author images
