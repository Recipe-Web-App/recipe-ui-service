# Navigation Component

Navigation patterns and menus.

**Source**: `src/components/layout/`
**Demo**: See layout components

## Components

### TopNav

Main top navigation bar.

```tsx
<TopNav>
  <Logo />
  <NavLinks>
    <NavLink href="/recipes">Recipes</NavLink>
    <NavLink href="/meal-plans">Meal Plans</NavLink>
    <NavLink href="/favorites">Favorites</NavLink>
  </NavLinks>
  <UserMenu />
</TopNav>
```

### Sidebar

Side navigation for app sections.

```tsx
<Sidebar>
  <SidebarSection title="Browse">
    <SidebarLink href="/recipes">All Recipes</SidebarLink>
    <SidebarLink href="/categories">Categories</SidebarLink>
  </SidebarSection>
  <SidebarSection title="Collections">
    <SidebarLink href="/favorites">Favorites</SidebarLink>
    <SidebarLink href="/my-recipes">My Recipes</SidebarLink>
  </SidebarSection>
</Sidebar>
```

### Breadcrumb

Breadcrumb navigation for page hierarchy.

```tsx
<Breadcrumb>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/recipes">Recipes</BreadcrumbItem>
  <BreadcrumbItem current>Pasta Carbonara</BreadcrumbItem>
</Breadcrumb>
```

## Navigation Patterns

- **Primary Navigation**: TopNav for main app sections
- **Secondary Navigation**: Sidebar for sub-sections
- **Contextual Navigation**: Breadcrumbs for page hierarchy
- **Mobile Navigation**: Drawer or bottom nav for mobile
