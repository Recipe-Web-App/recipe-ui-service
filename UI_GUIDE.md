# 🎨 UI/UX Design Guide

This document outlines the user interface design system, component library, and user experience patterns for the
Recipe UI Service.

## 📋 Table of Contents

- [Design System Overview](#-design-system-overview)
- [Component Library](#-component-library)
- [Page Structure](#-page-structure)
- [User Experience Patterns](#-user-experience-patterns)
- [Accessibility Guidelines](#-accessibility-guidelines)
- [Responsive Design](#-responsive-design)
- [Theming and Customization](#-theming-and-customization)

## 🎯 Design System Overview

### Design Principles

1. **Simplicity First**: Clean, uncluttered interfaces
2. **Accessibility**: WCAG 2.1 AA compliant
3. **Mobile-First**: Responsive design from small to large screens
4. **Performance**: Fast loading with smooth interactions
5. **Consistency**: Unified patterns across all pages

### Brand Identity

#### Color Palette

```css
/* Primary Colors */
--primary-50: #eff6ff;
--primary-500: #3b82f6;
--primary-900: #1e3a8a;

/* Secondary Colors */
--secondary-50: #fafaf9;
--secondary-500: #78716c;
--secondary-900: #1c1917;

/* Semantic Colors */
--success-500: #10b981;
--warning-500: #f59e0b;
--error-500: #ef4444;
--info-500: #06b6d4;
```

#### Typography

```css
/* Font Families */
font-family-sans:
  'Geist',
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  sans-serif;
font-family-mono: 'Geist Mono', 'JetBrains Mono', Consolas, monospace;

/* Font Scales */
text-xs: 0.75rem; /* 12px */
text-sm: 0.875rem; /* 14px */
text-base: 1rem; /* 16px */
text-lg: 1.125rem; /* 18px */
text-xl: 1.25rem; /* 20px */
text-2xl: 1.5rem; /* 24px */
text-3xl: 1.875rem; /* 30px */
text-4xl: 2.25rem; /* 36px */
```

#### Spacing Scale

```css
/* Consistent spacing system */
space-1: 0.25rem; /* 4px */
space-2: 0.5rem; /* 8px */
space-3: 0.75rem; /* 12px */
space-4: 1rem; /* 16px */
space-6: 1.5rem; /* 24px */
space-8: 2rem; /* 32px */
space-12: 3rem; /* 48px */
space-16: 4rem; /* 64px */
```

## 🧩 Component Library

### Base Components

#### Button Component

```tsx
// Primary button for main actions
<Button variant="primary" size="lg" icon={<PlusIcon />}>
  Add Recipe
</Button>

// Secondary button for supporting actions
<Button variant="secondary" size="md">
  Cancel
</Button>

// Icon-only button for compact spaces
<Button variant="ghost" size="sm" iconOnly>
  <HeartIcon />
</Button>
```

**Button Variants:**

- `primary`: Main call-to-action buttons
- `secondary`: Supporting actions
- `outline`: Less prominent actions
- `ghost`: Minimal styling for icon buttons
- `destructive`: Delete or remove actions

#### Badge Component

```tsx
// Basic badge for labels and categories
<Badge>New Recipe</Badge>

// Recipe category badges
<Badge variant="info">Breakfast</Badge>
<Badge variant="info">Vegetarian</Badge>
<Badge variant="info">Quick</Badge>

// Difficulty level indicators
<Badge variant="success">Easy</Badge>
<Badge variant="warning">Medium</Badge>
<Badge variant="destructive">Hard</Badge>

// Status indicators
<Badge variant="success">Published</Badge>
<Badge variant="warning">Draft</Badge>
<Badge variant="secondary">Private</Badge>

// Cooking time badges
<Badge variant="outline" size="sm">30 min</Badge>
<Badge variant="outline" size="sm">1 hour</Badge>

// Dietary restriction tags
<Badge variant="outline">Gluten-Free</Badge>
<Badge variant="outline">Vegan</Badge>
<Badge variant="outline">Keto</Badge>

// Interactive badges (polymorphic usage)
<Badge asChild>
  <Link href="/category/dessert">Dessert</Link>
</Badge>
```

**Badge Variants:**

- `default`: Primary brand badges for featured content
- `secondary`: Less prominent tags and secondary categories
- `destructive`: Error states, warnings, expired content
- `outline`: Subtle emphasis, filter states, dietary restrictions
- `success`: Published recipes, positive indicators, easy difficulty
- `warning`: Draft content, pending states, medium difficulty
- `info`: New content, informational badges, recipe categories

**Badge Sizes:**

- `sm`: Compact badges for dense layouts (cooking times, small tags)
- `default`: Standard size for most use cases
- `lg`: Prominent badges for emphasis and featured content

**Recipe App Use Cases:**

- **Recipe Categories**: Breakfast, Lunch, Dinner, Dessert, Snack
- **Difficulty Levels**: Easy (success), Medium (warning), Hard (destructive)
- **Dietary Restrictions**: Vegetarian, Vegan, Gluten-Free, Dairy-Free, Keto
- **Recipe Status**: Published (success), Draft (warning), Private (secondary)
- **Cooking Times**: "15 min", "30 min", "1 hour" (outline, small size)
- **Tags and Labels**: Any custom user-generated or system tags

#### Dropdown Component

```tsx
// Basic action menu
<DropdownMenu>
  <DropdownMenuTrigger>Recipe Actions</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>View Recipe</DropdownMenuItem>
    <DropdownMenuItem>Edit Recipe</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">Delete Recipe</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

// Recipe filter menu with checkbox items
<DropdownMenu>
  <DropdownMenuTrigger variant="outline">Filter Options</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Display Options</DropdownMenuLabel>
    <DropdownMenuCheckboxItem checked={showBookmarked} onCheckedChange={setShowBookmarked}>
      Show Only Bookmarked
    </DropdownMenuCheckboxItem>
    <DropdownMenuCheckboxItem checked={showNutrition} onCheckedChange={setShowNutrition}>
      Show Nutrition Panel
    </DropdownMenuCheckboxItem>
  </DropdownMenuContent>
</DropdownMenu>

// Dietary preference selector with radio items
<DropdownMenu>
  <DropdownMenuTrigger variant="outline">Diet: {selectedDiet || 'All'}</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Dietary Restrictions</DropdownMenuLabel>
    <DropdownMenuRadioGroup value={selectedDiet} onValueChange={setSelectedDiet}>
      <DropdownMenuRadioItem value="">All Recipes</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="vegetarian">Vegetarian</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="vegan">Vegan</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="gluten-free">Gluten-Free</DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  </DropdownMenuContent>
</DropdownMenu>

// User profile menu with keyboard shortcuts
<DropdownMenu>
  <DropdownMenuTrigger variant="ghost">Chef John</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuItem>
      Profile Settings
      <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>My Recipes</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>Export Recipe</DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem>PDF Document</DropdownMenuItem>
        <DropdownMenuItem>Text File</DropdownMenuItem>
        <DropdownMenuItem>Recipe Card (PNG)</DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  </DropdownMenuContent>
</DropdownMenu>
```

**Dropdown Variants:**

**Trigger Variants:**

- `default`: Primary brand styling for main action menus
- `secondary`: Less prominent styling for secondary actions
- `outline`: Subtle border styling for filter and option menus
- `ghost`: Minimal styling for user menus and inline actions

**Content Variants:**

- `default`: Standard dropdown content styling
- `secondary`: Alternative styling for specialized contexts

**Sizes:**

- `sm`: Compact size for dense layouts and toolbar actions
- `default`: Standard size for most use cases
- `lg`: Larger size for prominent menus and touch interfaces

**Recipe App Use Cases:**

- **Recipe Actions**: View, edit, duplicate, share, delete recipes
- **Filter Menus**: Category filters, difficulty selectors, dietary restrictions
- **User Menus**: Profile settings, account actions, preferences
- **Bulk Actions**: Multi-select recipe operations
- **Sort Options**: Recipe ordering and view preferences
- **Export Options**: Multiple format downloads with sub-menus
- **Collection Management**: Add to collections, organize recipes
- **Quick Settings**: View options, display preferences

**Interactive Elements:**

- **DropdownMenuCheckboxItem**: For toggleable options like "Show only favorites"
- **DropdownMenuRadioItem**: For exclusive selections like dietary preferences
- **DropdownMenuSeparator**: To group related actions logically
- **DropdownMenuLabel**: For section headers and organization
- **DropdownMenuShortcut**: Keyboard shortcuts for power users
- **Sub-menus**: For complex hierarchical actions like export options

#### Tabs Component

```tsx
// Basic recipe content tabs
<Tabs defaultValue="ingredients">
  <TabsList>
    <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
    <TabsTrigger value="instructions">Instructions</TabsTrigger>
    <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
  </TabsList>
  <TabsContent value="ingredients">
    <IngredientsList ingredients={recipe.ingredients} />
  </TabsContent>
  <TabsContent value="instructions">
    <InstructionsList steps={recipe.steps} />
  </TabsContent>
  <TabsContent value="nutrition">
    <NutritionPanel nutrition={recipe.nutrition} />
  </TabsContent>
</Tabs>

// User profile sections with line variant
<Tabs defaultValue="account" variant="line">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="recipes">My Recipes</TabsTrigger>
    <TabsTrigger value="favorites">Favorites</TabsTrigger>
    <TabsTrigger value="collections">Collections</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    <AccountSettings />
  </TabsContent>
  <TabsContent value="recipes">
    <UserRecipesList />
  </TabsContent>
  <TabsContent value="favorites">
    <FavoriteRecipesList />
  </TabsContent>
  <TabsContent value="collections">
    <RecipeCollections />
  </TabsContent>
</Tabs>

// Recipe management dashboard with pills variant
<Tabs defaultValue="published" variant="pills" size="lg">
  <TabsList>
    <TabsTrigger value="published">Published (12)</TabsTrigger>
    <TabsTrigger value="drafts">Drafts (3)</TabsTrigger>
    <TabsTrigger value="pending">Pending Review (1)</TabsTrigger>
  </TabsList>
  <TabsContent value="published" variant="card">
    <PublishedRecipesList />
  </TabsContent>
  <TabsContent value="drafts" variant="card">
    <DraftRecipesList />
  </TabsContent>
  <TabsContent value="pending" variant="card">
    <PendingRecipesList />
  </TabsContent>
</Tabs>

// Compact recipe details view
<Tabs defaultValue="overview" size="sm">
  <TabsList variant="line">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="reviews">Reviews (24)</TabsTrigger>
    <TabsTrigger value="related">Similar</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    <RecipeOverview recipe={recipe} />
  </TabsContent>
  <TabsContent value="reviews">
    <RecipeReviews recipeId={recipe.id} />
  </TabsContent>
  <TabsContent value="related">
    <RelatedRecipes tags={recipe.tags} />
  </TabsContent>
</Tabs>
```

**Tabs Variants:**

**List Variants:**

- `default`: Standard contained tabs with background and shadow styling
- `line`: Minimal underlined tabs for clean layouts and secondary content
- `pills`: Rounded pill-style tabs for modern card-based interfaces

**Trigger Variants:**

- `default`: Standard trigger styling matching the list variant
- `line`: Underlined triggers for minimal interfaces
- `pills`: Rounded pill triggers with accent colors

**Content Variants:**

- `default`: Standard content with subtle border and padding
- `line`: Minimal content styling with just top padding
- `pills`: Soft background content matching pill aesthetic
- `card`: Elevated card-style content with shadow and background

**Sizes:**

- `sm`: Compact tabs for dense layouts (height: 24px, text: xs)
- `default`: Standard size for most use cases (height: 28px, text: sm)
- `lg`: Larger tabs for prominent sections (height: 32px, text: base)

**Recipe App Use Cases:**

- **Recipe Content Organization**: Ingredients, instructions, nutrition, reviews sections
- **User Profile Management**: Account settings, recipes, favorites, collections
- **Recipe Management Dashboard**: Published/drafts/pending recipe states
- **Content Categorization**: Browse by meal type, difficulty, dietary restrictions
- **Recipe Details**: Overview, reviews, similar recipes, cooking tips
- **Admin Interfaces**: User management, content moderation, analytics
- **Search Results**: Filter views by relevance, date, popularity
- **Recipe Creation**: Basic info, ingredients, steps, settings tabs

**Accessibility Features:**

- Full keyboard navigation with arrow keys and tab/shift+tab
- ARIA attributes for screen reader support
- Automatic focus management when switching tabs
- Clear focus indicators and active state styling
- Semantic HTML structure with proper heading hierarchy

#### Tooltip Component

```tsx
// Basic tooltip with simple content
<SimpleTooltip content="This is a helpful tooltip">
  <Button>Hover me</Button>
</SimpleTooltip>

// Cooking term tooltip with pronunciation and category
<CookingTermTooltip
  term="Julienne"
  definition="A knife cut in which the food item is cut into long thin strips resembling matchsticks"
  pronunciation="zhoo-lee-EHN"
  category="technique"
>
  <span>Cut vegetables into julienne</span>
</CookingTermTooltip>

// Help icon tooltip for UI assistance
<HelpTooltip
  helpText="This setting controls how recipes are displayed in your feed"
  iconVariant="default"
  iconSize="default"
/>

// Info icon tooltip with additional context
<InfoTooltip
  infoText="Premium feature: Get personalized recipe recommendations based on your cooking history"
  iconVariant="accent"
  iconSize="lg"
/>

// Keyboard shortcut tooltip for power users
<KeyboardTooltip
  shortcut={["Ctrl", "S"]}
  description="Save recipe"
  side="bottom"
>
  <Button>Save Recipe</Button>
</KeyboardTooltip>

// Metric tooltip with unit conversions
<MetricTooltip
  metric="Temperature"
  value={180}
  unit="°C"
  conversion={{ value: 356, unit: "°F", system: "imperial" }}
>
  <span>Preheat oven to 180°C</span>
</MetricTooltip>

// Advanced tooltip with custom positioning
<SimpleTooltip
  content="Recipe saved to your favorites"
  variant="success"
  size="lg"
  side="top"
  align="center"
  delayDuration={200}
  showArrow={true}
>
  <FavoriteButton />
</SimpleTooltip>

// Tooltip with rich content
<SimpleTooltip
  content={
    <div className="space-y-2">
      <h4 className="font-semibold">Recipe Rating</h4>
      <p className="text-sm">Based on 24 reviews</p>
      <div className="flex items-center gap-1">
        <StarIcon className="h-4 w-4 fill-yellow-400" />
        <span className="text-sm">4.5 out of 5 stars</span>
      </div>
    </div>
  }
  variant="light"
  size="xl"
>
  <RatingDisplay rating={4.5} reviews={24} />
</SimpleTooltip>
```

**Tooltip Variants:**

**Content Variants:**

- `default`: Dark gray background with white text for standard tooltips
- `light`: White background with dark text for complex content and forms
- `accent`: Blue background for informational tooltips and feature highlights
- `success`: Green background for positive feedback and confirmations
- `warning`: Yellow background for cautions and important notices
- `error`: Red background for error messages and destructive actions
- `info`: Blue background for neutral information and help content

**Content Sizes:**

- `sm`: Compact tooltips for simple text (max-width: 200px, text: xs)
- `default`: Standard size for most use cases (max-width: 300px, text: sm)
- `lg`: Larger tooltips for detailed explanations (max-width: 400px, text: base)
- `xl`: Extra large for rich content and complex information (max-width: 500px, text: base)

**Specialized Tooltip Components:**

**SimpleTooltip**: General-purpose tooltip wrapper for any content

- Supports all content variants and sizes
- Configurable positioning (side, align)
- Customizable delay and animation settings
- Optional arrow display
- Controlled and uncontrolled modes

**CookingTermTooltip**: Enhanced tooltips for culinary terminology

- Category icons: 👨‍🍳 technique, 🥗 ingredient, 🔪 equipment, ⚖️ measurement, 📖 general
- Pronunciation guides with phonetic notation
- Color-coded category badges
- Optimized for recipe content and cooking instructions
- Default large size for comprehensive information display

**HelpTooltip**: Question mark icon tooltips for UI guidance

- Clickable help icon with consistent styling
- Customizable icon variants (default, subtle, accent, success, warning, error)
- Configurable icon sizes (sm, default, lg)
- Custom aria-label support for accessibility
- Integrated with help documentation systems

**InfoTooltip**: Information icon tooltips for additional context

- Info icon with accent styling by default
- Uses info variant for consistent information display
- Perfect for feature explanations and contextual help
- Supports all icon customization options

**KeyboardTooltip**: Keyboard shortcut display tooltips

- Single shortcut: `shortcut="Ctrl+S"`
- Multiple keys: `shortcut={["Ctrl", "Shift", "S"]}`
- Styled keyboard key representations
- Optional description text above shortcuts
- Bottom placement by default for better visibility

**MetricTooltip**: Unit conversion and measurement tooltips

- Primary metric display with value and unit
- Optional conversion to different unit systems
- Metric/imperial conversion support
- Perfect for recipe measurements and cooking temperatures
- Accent variant styling for measurement emphasis

**Recipe App Use Cases:**

- **Cooking Terms**: Explain culinary techniques, ingredients, and equipment with CookingTermTooltip
- **Measurements**: Show unit conversions (Celsius/Fahrenheit, metric/imperial) with MetricTooltip
- **UI Help**: Provide contextual assistance for complex features with HelpTooltip
- **Feature Info**: Introduce new features and premium content with InfoTooltip
- **Shortcuts**: Display keyboard shortcuts for recipe management with KeyboardTooltip
- **Recipe Details**: Show additional information about ratings, cook times, difficulty with SimpleTooltip
- **Dietary Information**: Explain dietary restrictions, allergens, and nutritional content
- **Equipment**: Describe cooking tools and equipment requirements
- **Technique Instructions**: Provide detailed explanations for cooking methods

**Positioning Options:**

- `side`: 'top' | 'right' | 'bottom' | 'left' - Position relative to trigger
- `align`: 'start' | 'center' | 'end' - Alignment along the chosen side
- `sideOffset`: Number - Distance from trigger element (default: 4px)

**Timing & Behavior:**

- `delayDuration`: Hover delay before showing (default: 200ms)
- `skipDelayDuration`: Reduced delay for subsequent tooltips (default: 100ms)
- `showArrow`: Boolean - Display pointing arrow (default: true)
- `open`: Boolean - Controlled open state
- `onOpenChange`: Callback for open state changes

**Content Guidelines:**

- Keep tooltip content concise and scannable
- Use hierarchy with headings for complex tooltips
- Include conversion information for measurements
- Provide pronunciation for unfamiliar culinary terms
- Use appropriate icons to reinforce content categories
- Ensure color contrast meets accessibility standards

**Accessibility Features:**

- Full keyboard navigation support with Escape key
- Screen reader announcements with proper ARIA labeling
- Focus management and return focus handling
- High contrast support for visibility
- Semantic markup with role attributes
- Alternative interaction methods for touch interfaces

#### Select Component

```tsx
// Basic category selection
<Select>
  <SelectTrigger className="w-[200px]">
    <SelectValue placeholder="Select category" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="breakfast">Breakfast</SelectItem>
    <SelectItem value="lunch">Lunch</SelectItem>
    <SelectItem value="dinner">Dinner</SelectItem>
    <SelectItem value="dessert">Dessert</SelectItem>
  </SelectContent>
</Select>

// Grouped recipe categories with labels and separators
<Select>
  <SelectTrigger className="w-[250px]">
    <SelectValue placeholder="Choose category" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Meal Types</SelectLabel>
      <SelectItem value="breakfast">🍳 Breakfast</SelectItem>
      <SelectItem value="lunch">🥗 Lunch</SelectItem>
      <SelectItem value="dinner">🍽️ Dinner</SelectItem>
      <SelectSeparator />
      <SelectLabel>Other</SelectLabel>
      <SelectItem value="appetizer">🥙 Appetizer</SelectItem>
      <SelectItem value="dessert">🍰 Dessert</SelectItem>
      <SelectItem value="snack">🥨 Snack</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>

// Dietary restrictions selector
<Select>
  <SelectTrigger className="w-[280px]">
    <SelectValue placeholder="Dietary preferences" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Plant-Based</SelectLabel>
      <SelectItem value="vegetarian">🥬 Vegetarian</SelectItem>
      <SelectItem value="vegan">🌱 Vegan</SelectItem>
      <SelectSeparator />
      <SelectLabel>Dietary Restrictions</SelectLabel>
      <SelectItem value="gluten-free">🌾 Gluten-Free</SelectItem>
      <SelectItem value="dairy-free">🥛 Dairy-Free</SelectItem>
      <SelectItem value="nut-free">🥜 Nut-Free</SelectItem>
      <SelectItem value="keto">🥓 Keto</SelectItem>
      <SelectItem value="paleo">🦴 Paleo</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>

// Complete form field with label and error handling
<SelectField
  label="Recipe Category"
  placeholder="Choose a category"
  required
  error="Please select a category"
>
  <SelectGroup>
    <SelectLabel>Main Meals</SelectLabel>
    <SelectItem value="breakfast">Breakfast</SelectItem>
    <SelectItem value="lunch">Lunch</SelectItem>
    <SelectItem value="dinner">Dinner</SelectItem>
    <SelectSeparator />
    <SelectLabel>Other</SelectLabel>
    <SelectItem value="snack">Snack</SelectItem>
    <SelectItem value="dessert">Dessert</SelectItem>
  </SelectGroup>
</SelectField>

// Filter controls with different variants
<Select>
  <SelectTrigger variant="outline" size="sm" className="w-[150px]">
    <SelectValue placeholder="Sort by" />
  </SelectTrigger>
  <SelectContent size="sm">
    <SelectItem value="newest">📅 Newest</SelectItem>
    <SelectItem value="popular">⭐ Popular</SelectItem>
    <SelectItem value="rating">🏆 Top Rated</SelectItem>
    <SelectItem value="cook-time">⏱️ Quick</SelectItem>
  </SelectContent>
</Select>

// Cooking time filter
<Select>
  <SelectTrigger variant="filled" className="w-[180px]">
    <SelectValue placeholder="Cook time" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="15">⚡ Under 15 min</SelectItem>
    <SelectItem value="30">⏱️ 15-30 min</SelectItem>
    <SelectItem value="60">⏰ 30-60 min</SelectItem>
    <SelectItem value="120">🕰️ 1-2 hours</SelectItem>
    <SelectItem value="240">⏳ Over 2 hours</SelectItem>
  </SelectContent>
</Select>

// Difficulty level with different styling
<Select>
  <SelectTrigger className="w-[160px]">
    <SelectValue placeholder="Difficulty" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="easy">🟢 Easy</SelectItem>
    <SelectItem value="medium">🟡 Medium</SelectItem>
    <SelectItem value="hard">🔴 Hard</SelectItem>
    <SelectItem value="expert">⚫ Expert</SelectItem>
  </SelectContent>
</Select>
```

**Select Variants:**

**Trigger Variants:**

- `default`: Standard border styling with gray borders and white background
- `outline`: Emphasized border styling with hover effects for form controls
- `ghost`: Transparent styling for inline selections and minimal interfaces
- `filled`: Filled background styling for form fields and input areas

**Content Variants:**

- `default`: Clean white background with subtle shadows for dropdowns
- `secondary`: Alternative gray background for secondary selection contexts

**Sizes:**

- `sm`: Compact size for dense layouts and toolbar controls (height: 32px, text: xs)
- `default`: Standard size for most form and filter use cases (height: 36px, text: sm)
- `lg`: Larger size for prominent selections and touch interfaces (height: 40px, text: base)

**Error States:**

- `error={true}`: Red border styling with error state indicators for validation
- Automatic `aria-invalid` and `aria-describedby` attributes for accessibility

**Recipe App Use Cases:**

- **Category Selection**: Meal types, cuisine categories, recipe classifications
- **Filter Controls**: Dietary restrictions, cooking time, difficulty levels, ingredients
- **Sort Options**: Recipe ordering preferences, date sorting, popularity ranking
- **User Preferences**: Default dietary restrictions, favorite cuisines, portion sizes
- **Recipe Creation**: Category assignment, difficulty setting, cuisine selection
- **Search Refinement**: Advanced filtering, multi-criteria selection
- **Bulk Operations**: Apply actions to multiple recipes with category selection
- **Settings**: User preference configuration, display options

**Grouped Selection Examples:**

- **Meal Planning**: Breakfast/Lunch/Dinner with sub-categories like Quick/Elaborate
- **Dietary Needs**: Plant-based options separated from allergy restrictions
- **Recipe Attributes**: Time-based vs. skill-based vs. equipment-based filtering
- **Content Organization**: Published/Draft/Private with sub-status indicators

**Accessibility Features:**

- Full keyboard navigation with arrow keys, Enter, and Escape
- Screen reader support with proper ARIA labeling and announcements
- Focus management and visual focus indicators
- Error state announcements with `role="alert"`
- Proper labeling association with `SelectField` wrapper
- Semantic grouping with `SelectGroup` and `SelectLabel`
- Required field indication and validation feedback

**Form Integration:**

- `SelectField` wrapper component for complete form integration
- Built-in label association and error message handling
- Controlled and uncontrolled component support
- Validation state management with visual and accessible feedback
- Seamless integration with form libraries like React Hook Form

#### Input Components

```tsx
// Text input with label and validation
<Input
  label="Recipe Name"
  placeholder="Enter recipe name"
  error="Recipe name is required"
  required
/>

// Search input with icon
<SearchInput
  placeholder="Search recipes..."
  onSearch={handleSearch}
  icon={<SearchIcon />}
/>
```

#### Card Component

```tsx
// Recipe card with image and metadata
<Card variant="elevated" padding="lg">
  <Card.Image src="/recipe-image.jpg" alt="Recipe" />
  <Card.Content>
    <Card.Title>Delicious Recipe</Card.Title>
    <Card.Description>A wonderful recipe description</Card.Description>
    <Card.Footer>
      <Badge variant="secondary">30 min</Badge>
      <Rating value={4.5} />
    </Card.Footer>
  </Card.Content>
</Card>
```

### Layout Components

#### Navigation

```tsx
// Main navigation header
<Header>
  <Header.Brand>
    <Logo />
  </Header.Brand>
  <Header.Navigation>
    <NavItem href="/" active>Home</NavItem>
    <NavItem href="/recipes">Recipes</NavItem>
    <NavItem href="/categories">Categories</NavItem>
  </Header.Navigation>
  <Header.Actions>
    <SearchButton />
    <UserMenu />
  </Header.Actions>
</Header>

// Mobile navigation drawer
<MobileNav open={isOpen} onClose={closeMobileNav}>
  <MobileNav.Item href="/">Home</MobileNav.Item>
  <MobileNav.Item href="/recipes">Recipes</MobileNav.Item>
</MobileNav>
```

#### Layout Grid

```tsx
// Responsive grid system
<Grid>
  <Grid.Col span={12} md={8}>
    <MainContent />
  </Grid.Col>
  <Grid.Col span={12} md={4}>
    <Sidebar />
  </Grid.Col>
</Grid>

// Recipe grid layout
<RecipeGrid>
  {recipes.map(recipe => (
    <RecipeCard key={recipe.id} recipe={recipe} />
  ))}
</RecipeGrid>
```

### Specialized Components

#### Recipe Components

```tsx
// Recipe card for listings
<RecipeCard
  image="/recipe.jpg"
  title="Chicken Tikka Masala"
  description="Aromatic and flavorful Indian curry"
  cookTime="45 min"
  difficulty="Medium"
  rating={4.8}
  tags={["Indian", "Spicy", "Dinner"]}
/>

// Recipe detail view
<RecipeDetail>
  <RecipeDetail.Hero image="/hero.jpg" title="Recipe Name" />
  <RecipeDetail.Meta cookTime="30m" serves="4" difficulty="Easy" />
  <RecipeDetail.Ingredients ingredients={ingredientsList} />
  <RecipeDetail.Instructions steps={instructionSteps} />
  <RecipeDetail.Nutrition nutrition={nutritionFacts} />
</RecipeDetail>

// Recipe form for editing
<RecipeForm
  initialData={recipe}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  isSubmitting={isLoading}
/>
```

## 📱 Page Structure

### Home Page

```tsx
// Landing page layout
<HomePage>
  <Hero
    title="Discover Amazing Recipes"
    subtitle="Cook something delicious today"
    cta={<Button>Explore Recipes</Button>}
  />

  <FeaturedSection>
    <SectionTitle>Featured Recipes</SectionTitle>
    <RecipeGrid recipes={featuredRecipes} />
  </FeaturedSection>

  <CategoriesSection>
    <SectionTitle>Browse by Category</SectionTitle>
    <CategoryGrid categories={categories} />
  </CategoriesSection>
</HomePage>
```

### Recipe Listing Page

```tsx
// Recipe browsing interface
<RecipesPage>
  <PageHeader>
    <PageTitle>All Recipes</PageTitle>
    <SearchBar placeholder="Search recipes..." />
  </PageHeader>

  <ContentLayout>
    <Sidebar>
      <FilterPanel>
        <CategoryFilter />
        <DifficultyFilter />
        <CookTimeFilter />
        <TagFilter />
      </FilterPanel>
    </Sidebar>

    <MainContent>
      <ResultsHeader>
        <ResultCount count={totalRecipes} />
        <SortSelector options={sortOptions} />
      </ResultsHeader>
      <RecipeGrid recipes={recipes} />
      <Pagination currentPage={page} totalPages={totalPages} />
    </MainContent>
  </ContentLayout>
</RecipesPage>
```

### Recipe Detail Page

```tsx
// Individual recipe view
<RecipePage>
  <RecipeHero
    image="/recipe-hero.jpg"
    title="Chicken Tikka Masala"
    rating={4.8}
    reviewCount={234}
  />

  <RecipeMeta
    cookTime="45 min"
    prepTime="20 min"
    serves="4 people"
    difficulty="Medium"
    calories={420}
  />

  <RecipeContent>
    <IngredientsPanel ingredients={ingredients} />
    <InstructionsPanel steps={instructions} />
    <NutritionPanel nutrition={nutrition} />
  </RecipeContent>

  <RelatedSection>
    <SectionTitle>Similar Recipes</SectionTitle>
    <RecipeCarousel recipes={relatedRecipes} />
  </RelatedSection>
</RecipePage>
```

## 🔄 State Management Integration

### UI Store Architecture

The application uses a comprehensive set of Zustand stores for UI state management:

```tsx
import { useUI } from '@/stores/ui';

// Access all UI stores through one hook
const ui = useUI();
const {
  toast,
  theme,
  navigation,
  modal,
  loading,
  search,
  layout,
  accessibility,
} = ui;
```

### Toast Notifications

```tsx
import { useToastStore } from '@/stores/ui/toast-store';

function RecipeActions() {
  const { addToast } = useToastStore();

  const handleSave = async () => {
    try {
      await saveRecipe();
      addToast({
        message: 'Recipe saved successfully!',
        type: 'success',
        duration: 3000,
      });
    } catch (error) {
      addToast({
        message: 'Failed to save recipe',
        type: 'error',
        action: {
          label: 'Retry',
          onClick: handleSave,
        },
      });
    }
  };
}
```

### Theme Management

```tsx
import { useThemeStore } from '@/stores/ui/theme-store';

function ThemeToggle() {
  const { theme, effectiveTheme, setTheme } = useThemeStore();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(effectiveTheme === 'light' ? 'dark' : 'light')}
    >
      {effectiveTheme === 'light' ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
}
```

### Modal Management

```tsx
import { useModalStore } from '@/stores/ui/modal-store';

function RecipeDetails() {
  const { openModal, closeModal } = useModalStore();

  const handleEdit = () => {
    openModal({
      id: 'edit-recipe',
      component: RecipeEditModal,
      props: { recipeId: recipe.id },
      size: 'lg',
      closeOnOverlayClick: false,
    });
  };
}
```

### Search & Filter State

```tsx
import { useSearchFilterStore } from '@/stores/ui/search-filter-store';

function RecipeFilters() {
  const {
    activeQuery,
    activeFilters,
    setQuery,
    addFilter,
    removeFilter,
    setSortConfig,
  } = useSearchFilterStore();

  return (
    <FilterPanel>
      <SearchInput
        value={activeQuery}
        onChange={setQuery}
        placeholder="Search recipes..."
      />
      <FilterGroup>
        {activeFilters.map(filter => (
          <FilterChip
            key={filter.id}
            label={filter.label}
            onRemove={() => removeFilter(filter.id)}
          />
        ))}
      </FilterGroup>
    </FilterPanel>
  );
}
```

### Layout & View Modes

```tsx
import { useLayoutStore } from '@/stores/ui/layout-store';

function RecipeGrid() {
  const { viewMode, setViewMode, pagination, setPage } = useLayoutStore();

  return (
    <>
      <ViewModeSelector
        mode={viewMode}
        onChange={setViewMode}
        options={['grid', 'list', 'card']}
      />
      <div className={viewMode === 'grid' ? 'grid' : 'flex flex-col'}>
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
      />
    </>
  );
}
```

### Recipe State Management

The Recipe Store provides comprehensive state management for recipe-related UI features, handling recently viewed
recipes, draft management, favorites, and collections with optimistic updates and sync tracking.

```tsx
import { useRecipeStore } from '@/stores/recipe-store';

function RecipeComponent() {
  const {
    // Recently viewed
    recentlyViewedRecipes,
    addRecentlyViewed,

    // Draft management
    draftRecipe,
    setDraftRecipe,
    updateDraftRecipe,
    hasUnsavedDraft,

    // Favorites
    favoriteRecipeIds,
    toggleFavorite,
    isFavorite,

    // Collections
    collections,
    createCollection,
    addToCollection,

    // UI preferences
    activeFilters,
    sortPreference,
    viewPreference,
    setActiveFilters,
  } = useRecipeStore();
}
```

#### Recently Viewed Recipes

Track and display user's recently viewed recipes with automatic deduplication and size limits:

```tsx
import { useRecipeStore } from '@/stores/recipe-store';

function RecentlyViewed() {
  const { recentlyViewedRecipes, clearRecentlyViewed } = useRecipeStore();

  if (recentlyViewedRecipes.length === 0) {
    return (
      <EmptyState
        icon={<ClockIcon />}
        title="No recently viewed recipes"
        description="Recipes you view will appear here"
      />
    );
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recently Viewed</h2>
        <Button variant="ghost" size="sm" onClick={clearRecentlyViewed}>
          Clear All
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recentlyViewedRecipes.map(recipe => (
          <RecipeCard
            key={recipe.recipeId}
            recipe={recipe}
            variant="compact"
            showViewedIndicator
          />
        ))}
      </div>
    </section>
  );
}

// Integration with recipe detail view
function RecipeDetailPage({ recipeId }) {
  const { addRecentlyViewed } = useRecipeStore();
  const { data: recipe } = useRecipe(recipeId);

  useEffect(() => {
    if (recipe) {
      addRecentlyViewed(recipe);
    }
  }, [recipe, addRecentlyViewed]);

  return <RecipeDetail recipe={recipe} />;
}
```

#### Draft Recipe Management

Handle recipe creation and editing with auto-save functionality and unsaved changes tracking:

```tsx
import { useRecipeStore } from '@/stores/recipe-store';
import { useCreateRecipe, useUpdateRecipe } from '@/hooks/recipe-management';

function RecipeForm({ recipeId, onSuccess }) {
  const {
    draftRecipe,
    setDraftRecipe,
    updateDraftRecipe,
    addDraftIngredient,
    removeDraftIngredient,
    addDraftStep,
    removeDraftStep,
    clearDraftRecipe,
    hasUnsavedDraft,
    isDraftSaving,
    setDraftSaving,
  } = useRecipeStore();

  const createRecipe = useCreateRecipe();
  const updateRecipe = useUpdateRecipe();

  // Auto-save draft with debouncing
  const debouncedSave = useMemo(
    () =>
      debounce(draft => {
        setDraftSaving(true);
        // Save to localStorage automatically handled by store
        setTimeout(() => setDraftSaving(false), 500);
      }, 1000),
    [setDraftSaving]
  );

  useEffect(() => {
    if (draftRecipe) {
      debouncedSave(draftRecipe);
    }
  }, [draftRecipe, debouncedSave]);

  // Warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = e => {
      if (hasUnsavedDraft()) {
        e.preventDefault();
        e.returnValue =
          'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedDraft]);

  const handleSubmit = async formData => {
    try {
      if (recipeId) {
        await updateRecipe.mutateAsync({ id: recipeId, ...formData });
      } else {
        await createRecipe.mutateAsync(formData);
      }
      clearDraftRecipe();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save recipe:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {recipeId ? 'Edit Recipe' : 'Create Recipe'}
        </h1>
        {isDraftSaving && (
          <div className="flex items-center text-sm text-gray-500">
            <Spinner size="xs" className="mr-2" />
            Saving draft...
          </div>
        )}
        {hasUnsavedDraft() && !isDraftSaving && (
          <Badge variant="warning">Unsaved changes</Badge>
        )}
      </div>

      <Input
        label="Recipe Title"
        value={draftRecipe?.title || ''}
        onChange={value => updateDraftRecipe({ title: value })}
        placeholder="Enter recipe title"
        required
      />

      <Textarea
        label="Description"
        value={draftRecipe?.description || ''}
        onChange={value => updateDraftRecipe({ description: value })}
        placeholder="Describe your recipe..."
      />

      {/* Ingredients Section */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">Ingredients</h3>
        {draftRecipe?.ingredients?.map((ingredient, index) => (
          <IngredientInput
            key={index}
            ingredient={ingredient}
            onUpdate={updates => updateDraftIngredient(index, updates)}
            onRemove={() => removeDraftIngredient(index)}
          />
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            addDraftIngredient({ name: '', quantity: 0, unit: '' })
          }
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Ingredient
        </Button>
      </div>

      {/* Steps Section */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">Instructions</h3>
        {draftRecipe?.steps?.map((step, index) => (
          <StepInput
            key={index}
            step={step}
            stepNumber={index + 1}
            onUpdate={updates => updateDraftStep(index, updates)}
            onRemove={() => removeDraftStep(index)}
          />
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            addDraftStep({
              stepNumber: (draftRecipe?.steps?.length || 0) + 1,
              instruction: '',
            })
          }
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Step
        </Button>
      </div>

      <div className="flex gap-3 border-t pt-4">
        <Button
          type="submit"
          loading={createRecipe.isPending || updateRecipe.isPending}
        >
          {recipeId ? 'Update Recipe' : 'Create Recipe'}
        </Button>
        <Button type="button" variant="outline" onClick={clearDraftRecipe}>
          Clear Draft
        </Button>
      </div>
    </form>
  );
}
```

#### Favorites Management

Implement favorite recipes with optimistic updates and sync state tracking:

```tsx
import { useRecipeStore } from '@/stores/recipe-store';
import {
  useFavoriteRecipe,
  useUnfavoriteRecipe,
} from '@/hooks/recipe-management';

function FavoriteButton({ recipeId, size = 'md' }) {
  const { isFavorite, toggleFavorite } = useRecipeStore();
  const favoriteRecipe = useFavoriteRecipe();
  const unfavoriteRecipe = useUnfavoriteRecipe();

  const isCurrentlyFavorited = isFavorite(recipeId);

  const handleToggle = async () => {
    // Optimistic update for immediate UI feedback
    toggleFavorite(recipeId);

    try {
      if (isCurrentlyFavorited) {
        await unfavoriteRecipe.mutateAsync(recipeId);
      } else {
        await favoriteRecipe.mutateAsync(recipeId);
      }
    } catch (error) {
      // Revert optimistic update on error
      toggleFavorite(recipeId);
      console.error('Failed to update favorite status:', error);
    }
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleToggle}
      className={cn(
        'transition-colors',
        isCurrentlyFavorited && 'text-red-500 hover:text-red-600'
      )}
      aria-label={
        isCurrentlyFavorited ? 'Remove from favorites' : 'Add to favorites'
      }
    >
      <HeartIcon
        className={cn(
          'h-4 w-4 transition-all duration-200',
          isCurrentlyFavorited && 'scale-110 fill-current'
        )}
      />
    </Button>
  );
}

function FavoritesSection() {
  const { favoriteRecipeIds } = useRecipeStore();
  const { data: favoriteRecipes, isLoading } =
    useRecipesByIds(favoriteRecipeIds);

  if (isLoading) {
    return <RecipeGridSkeleton count={6} />;
  }

  if (favoriteRecipeIds.length === 0) {
    return (
      <EmptyState
        icon={<HeartIcon />}
        title="No favorite recipes yet"
        description="Mark recipes as favorites to see them here"
        action={
          <Button asChild>
            <Link href="/recipes">Browse Recipes</Link>
          </Button>
        }
      />
    );
  }

  return (
    <section>
      <h2 className="mb-6 text-xl font-semibold">
        Your Favorites ({favoriteRecipeIds.length})
      </h2>
      <RecipeGrid>
        {favoriteRecipes?.map(recipe => (
          <RecipeCard
            key={recipe.recipeId}
            recipe={recipe}
            showFavoriteButton
            isFavorited={true}
          />
        ))}
      </RecipeGrid>
    </section>
  );
}
```

#### Recipe Collections

Organize recipes into custom collections with full CRUD operations:

```tsx
import { useRecipeStore } from '@/stores/recipe-store';

function RecipeCollections() {
  const {
    collections,
    createCollection,
    updateCollection,
    deleteCollection,
    addToCollection,
    removeFromCollection,
    getCollectionRecipes,
  } = useRecipeStore();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleCreateCollection = data => {
    const newCollection = createCollection(data.name, data.description);
    setIsCreating(false);
    return newCollection;
  };

  const handleUpdateCollection = (id, updates) => {
    updateCollection(id, updates);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recipe Collections</h2>
        <Button onClick={() => setIsCreating(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          New Collection
        </Button>
      </div>

      {isCreating && (
        <CollectionForm
          onSubmit={handleCreateCollection}
          onCancel={() => setIsCreating(false)}
        />
      )}

      <div className="grid gap-4">
        {collections.map(collection => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            recipeCount={getCollectionRecipes(collection.id).length}
            isEditing={editingId === collection.id}
            onEdit={() => setEditingId(collection.id)}
            onUpdate={updates => handleUpdateCollection(collection.id, updates)}
            onDelete={() => deleteCollection(collection.id)}
            onCancelEdit={() => setEditingId(null)}
          />
        ))}
      </div>

      {collections.length === 0 && !isCreating && (
        <EmptyState
          icon={<FolderIcon />}
          title="No collections yet"
          description="Create collections to organize your favorite recipes"
          action={
            <Button onClick={() => setIsCreating(true)}>
              Create Your First Collection
            </Button>
          }
        />
      )}
    </div>
  );
}

function CollectionCard({
  collection,
  recipeCount,
  isEditing,
  onEdit,
  onUpdate,
  onDelete,
  onCancelEdit,
}) {
  const [formData, setFormData] = useState({
    name: collection.name,
    description: collection.description || '',
  });

  if (isEditing) {
    return (
      <Card>
        <Card.Content className="space-y-4">
          <Input
            value={formData.name}
            onChange={value => setFormData(prev => ({ ...prev, name: value }))}
            placeholder="Collection name"
          />
          <Textarea
            value={formData.description}
            onChange={value =>
              setFormData(prev => ({ ...prev, description: value }))
            }
            placeholder="Description (optional)"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={() => onUpdate(formData)}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={onCancelEdit}>
              Cancel
            </Button>
          </div>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card className="transition-shadow hover:shadow-md">
      <Card.Content>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{collection.name}</h3>
            {collection.description && (
              <p className="mt-1 text-gray-600">{collection.description}</p>
            )}
            <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
              <span>{recipeCount} recipes</span>
              <span>Updated {format(collection.updatedAt, 'MMM d, yyyy')}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <EditIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
```

#### Filter & Sort Integration

Connect recipe store filters with UI components for consistent filtering:

```tsx
import { useRecipeStore } from '@/stores/recipe-store';
import { DifficultyLevel } from '@/types/recipe-management';

function RecipeFilters() {
  const {
    activeFilters,
    setActiveFilters,
    clearFilters,
    sortPreference,
    setSortPreference,
    viewPreference,
    setViewPreference,
  } = useRecipeStore();

  const updateFilter = (key, value) => {
    setActiveFilters({ ...activeFilters, [key]: value });
  };

  const removeFilter = key => {
    const newFilters = { ...activeFilters };
    delete newFilters[key];
    setActiveFilters(newFilters);
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  return (
    <div className="space-y-6">
      {/* Search */}
      <SearchInput
        value={activeFilters.searchQuery || ''}
        onChange={value => updateFilter('searchQuery', value)}
        placeholder="Search recipes..."
        className="w-full"
      />

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([key, value]) => (
            <FilterChip
              key={key}
              label={getFilterLabel(key, value)}
              onRemove={() => removeFilter(key)}
            />
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Filter Controls */}
      <div className="grid gap-4">
        <FilterGroup title="Difficulty">
          <Select
            value={activeFilters.difficulty || ''}
            onValueChange={value =>
              value
                ? updateFilter('difficulty', value)
                : removeFilter('difficulty')
            }
          >
            <SelectItem value="">Any Difficulty</SelectItem>
            {Object.values(DifficultyLevel).map(level => (
              <SelectItem key={level} value={level}>
                {level.toLowerCase().replace('_', ' ')}
              </SelectItem>
            ))}
          </Select>
        </FilterGroup>

        <FilterGroup title="Cook Time">
          <Select
            value={activeFilters.maxCookTime?.toString() || ''}
            onValueChange={value =>
              value
                ? updateFilter('maxCookTime', parseInt(value))
                : removeFilter('maxCookTime')
            }
          >
            <SelectItem value="">Any Time</SelectItem>
            <SelectItem value="15">Under 15 minutes</SelectItem>
            <SelectItem value="30">Under 30 minutes</SelectItem>
            <SelectItem value="60">Under 1 hour</SelectItem>
          </Select>
        </FilterGroup>

        <FilterGroup title="Tags">
          <TagInput
            value={activeFilters.tags || []}
            onChange={tags =>
              tags.length > 0
                ? updateFilter('tags', tags)
                : removeFilter('tags')
            }
            placeholder="Add tags..."
          />
        </FilterGroup>
      </div>

      {/* Sort & View Controls */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between">
          <Select value={sortPreference} onValueChange={setSortPreference}>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="title">Alphabetical</SelectItem>
            <SelectItem value="cookTime">Cook Time</SelectItem>
            <SelectItem value="difficulty">Difficulty</SelectItem>
          </Select>

          <ViewModeToggle
            value={viewPreference}
            onChange={setViewPreference}
            options={[
              { value: 'grid', icon: GridIcon, label: 'Grid' },
              { value: 'list', icon: ListIcon, label: 'List' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <Badge variant="secondary" className="pr-1 pl-3">
      {label}
      <Button
        variant="ghost"
        size="xs"
        onClick={onRemove}
        className="ml-1 h-auto p-0 hover:bg-transparent"
      >
        <XIcon className="h-3 w-3" />
      </Button>
    </Badge>
  );
}
```

#### Integration with Other Stores

Combine recipe store with other UI stores for complete functionality:

```tsx
import { useRecipeStore } from '@/stores/recipe-store';
import { useToastStore } from '@/stores/ui/toast-store';
import { useModalStore } from '@/stores/ui/modal-store';

function IntegratedRecipeCard({ recipe }) {
  const { addRecentlyViewed, toggleFavorite, isFavorite } = useRecipeStore();
  const { addToast } = useToastStore();
  const { openModal } = useModalStore();

  const handleViewRecipe = () => {
    addRecentlyViewed(recipe);
    router.push(`/recipes/${recipe.recipeId}`);
  };

  const handleFavoriteToggle = () => {
    const wasFavorited = isFavorite(recipe.recipeId.toString());
    toggleFavorite(recipe.recipeId.toString());

    addToast({
      message: wasFavorited
        ? 'Recipe removed from favorites'
        : 'Recipe added to favorites',
      type: 'success',
      duration: 2000,
    });
  };

  const handleAddToCollection = () => {
    openModal({
      id: 'add-to-collection',
      component: AddToCollectionModal,
      props: { recipeId: recipe.recipeId },
    });
  };

  return (
    <Card className="recipe-card">
      <Card.Image
        src={recipe.imageUrl}
        alt={recipe.title}
        onClick={handleViewRecipe}
        className="cursor-pointer transition-opacity hover:opacity-90"
      />
      <Card.Content>
        <Card.Title onClick={handleViewRecipe} className="cursor-pointer">
          {recipe.title}
        </Card.Title>
        <Card.Description>{recipe.description}</Card.Description>
        <Card.Footer>
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{recipe.cookingTime}m</Badge>
              <Badge variant="outline">{recipe.difficulty}</Badge>
            </div>
            <div className="flex items-center gap-1">
              <FavoriteButton
                recipeId={recipe.recipeId.toString()}
                size="sm"
                onClick={handleFavoriteToggle}
                isFavorited={isFavorite(recipe.recipeId.toString())}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddToCollection}
                aria-label="Add to collection"
              >
                <FolderPlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card.Footer>
      </Card.Content>
    </Card>
  );
}
```

### Offline Support

```tsx
import { useOfflineStore } from '@/stores/ui/offline-store';

function OfflineIndicator() {
  const { isOnline, syncQueue, processSyncQueue } = useOfflineStore();

  if (isOnline) return null;

  return (
    <Banner variant="warning">
      <p>You're offline. {syncQueue.length} changes pending sync.</p>
      <Button size="sm" onClick={processSyncQueue}>
        Sync Now
      </Button>
    </Banner>
  );
}
```

### Feature Flags

```tsx
import { useFeatureStore } from '@/stores/ui/feature-store';

function RecipeFeatures() {
  const { isFeatureEnabled, getFeatureVariant } = useFeatureStore();

  // Check if feature is enabled
  if (!isFeatureEnabled('ai-suggestions')) {
    return null;
  }

  // Get A/B test variant
  const variant = getFeatureVariant('recipe-layout');

  return (
    <div>
      {variant === 'grid' ? <GridLayout /> : <ListLayout />}
      <AISuggestions />
    </div>
  );
}
```

### Accessibility Management

```tsx
import { useAccessibilityStore } from '@/stores/ui/accessibility-store';

function AccessibleRecipeCard({ recipe }) {
  const { fontSize, highContrast, announce } = useAccessibilityStore();

  const handleFavorite = () => {
    toggleFavorite(recipe.id);
    announce(`${recipe.title} added to favorites`, 'polite');
  };

  return (
    <Card
      className={cn(
        'recipe-card',
        highContrast && 'high-contrast',
        fontSize === 'large' && 'text-lg'
      )}
    >
      {/* Card content */}
    </Card>
  );
}
```

### User Preferences Management

```tsx
import { usePreferencesStore } from '@/stores/preferences-store';
import {
  useUserPreferences,
  useUpdateDisplayPreferences,
} from '@/hooks/user-management';

function UserPreferenceSettings() {
  const {
    preferences,
    isLoading,
    isSync,
    updateDisplayPreferences,
    updateNotificationPreferences,
    getTheme,
    getLanguage,
  } = usePreferencesStore();

  const { data: backendPrefs } = useUserPreferences();
  const updateDisplay = useUpdateDisplayPreferences();

  // Sync backend preferences to store
  useEffect(() => {
    if (backendPrefs && !isLoading) {
      setPreferences(backendPrefs);
    }
  }, [backendPrefs, isLoading]);

  const handleThemeChange = async (theme: 'light' | 'dark' | 'system') => {
    // Optimistic update for immediate UI response
    updateDisplayPreferences({ theme });

    try {
      // Sync to backend
      await updateDisplay.mutateAsync({ theme });
      markSynced();
    } catch (error) {
      console.error('Failed to sync theme preference:', error);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">Theme</label>
        <select
          value={getTheme() || 'system'}
          onChange={e => handleThemeChange(e.target.value)}
          className="w-full rounded border p-2"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">Language</label>
        <input
          value={getLanguage() || ''}
          onChange={e => updateDisplayPreferences({ language: e.target.value })}
          placeholder="e.g., en, es, fr"
          className="w-full rounded border p-2"
        />
      </div>

      {!isSync && (
        <div className="rounded border border-yellow-200 bg-yellow-50 p-3">
          <p className="text-sm text-yellow-800">
            Preferences are out of sync with server
          </p>
        </div>
      )}
    </div>
  );
}
```

**Key Features:**

- **Backend Sync**: Automatically syncs with user-management service
- **Optimistic Updates**: Immediate UI feedback with sync tracking
- **Type Safety**: Uses backend-supported preference types only
- **Persistence**: Automatically saves to localStorage
- **Loading States**: Tracks sync status and loading states

**Supported Preferences:**

- `theme`: 'light' | 'dark' | 'system'
- `language`: string (e.g., 'en', 'es', 'fr')
- `timezone`: string
- `notification_preferences`: email, push, follow notifications, etc.
- `privacy_preferences`: profile visibility, contact settings

**Integration Pattern:**

```tsx
// Use with existing theme store for complete theming
import { useThemeStore } from '@/stores/ui/theme-store';
import { usePreferencesStore } from '@/stores/preferences-store';

function ThemeManager() {
  const themeStore = useThemeStore(); // UI theme state
  const prefStore = usePreferencesStore(); // Backend-synced preferences

  // Sync theme preference to backend when UI theme changes
  useEffect(() => {
    if (themeStore.theme !== prefStore.getTheme()) {
      prefStore.updateDisplayPreferences({ theme: themeStore.theme });
    }
  }, [themeStore.theme]);
}
```

## 💫 User Experience Patterns

### Loading States

```tsx
// Skeleton loading for recipe cards
<RecipeCardSkeleton />

// Progressive loading with suspense
<Suspense fallback={<RecipeListSkeleton />}>
  <RecipeList />
</Suspense>

// Loading indicators
<LoadingSpinner size="sm" />
<LoadingDots />
<ProgressBar progress={uploadProgress} />
```

### Error States

```tsx
// Empty states
<EmptyState
  icon={<EmptyRecipesIcon />}
  title="No recipes found"
  description="Try adjusting your search criteria"
  action={<Button>Clear Filters</Button>}
/>

// Error boundaries
<ErrorBoundary
  fallback={<ErrorState />}
  onRetry={handleRetry}
>
  <RecipeContent />
</ErrorBoundary>

// Form validation errors
<Input
  error="Recipe name must be at least 3 characters"
  status="error"
/>
```

### Interactive Patterns

```tsx
// Hover states and micro-interactions
<RecipeCard className="hover:scale-105 transition-transform" />

// Favorite toggle with animation
<FavoriteButton
  isFavorited={isFavorited}
  onClick={toggleFavorite}
  className="hover:scale-110 active:scale-95"
/>

// Progressive disclosure
<Accordion>
  <Accordion.Item title="Nutritional Information">
    <NutritionFacts />
  </Accordion.Item>
</Accordion>
```

## ♿ Accessibility Guidelines

### ARIA Labels and Roles

```tsx
// Proper labeling
<button aria-label="Add recipe to favorites">
  <HeartIcon />
</button>

// Form accessibility
<Input
  aria-describedby="name-error"
  aria-invalid={hasError}
/>
<div id="name-error" role="alert">
  {errorMessage}
</div>

// Navigation landmarks
<nav role="navigation" aria-label="Main navigation">
<main role="main">
<aside role="complementary">
```

### Keyboard Navigation

```tsx
// Focus management
<Modal onOpen={focusFirstElement}>
<Dialog onClose={returnFocusToTrigger}>

// Skip links
<SkipLink href="#main-content">Skip to main content</SkipLink>

// Tab order optimization
<div tabIndex={0} onKeyDown={handleKeyDown}>
```

### Screen Reader Support

```tsx
// Descriptive text for complex interactions
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// Alternative text for images
<Image
  src="/recipe.jpg"
  alt="Golden brown chicken tikka masala in a cast iron pan with basmati rice and naan bread"
/>
```

## 📱 Responsive Design

### Breakpoint System

```css
/* Mobile First Breakpoints */
sm: '640px',   /* Small tablets */
md: '768px',   /* Tablets */
lg: '1024px',  /* Small desktops */
xl: '1280px',  /* Large desktops */
2xl: '1536px'  /* Extra large screens */
```

### Responsive Patterns

```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

// Responsive text sizing
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// Mobile navigation
<div className="hidden md:flex">Desktop Nav</div>
<div className="md:hidden">Mobile Nav</div>

// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">
```

### Mobile Optimizations

```tsx
// Touch-friendly buttons
<Button className="min-h-[44px] min-w-[44px]">

// Swipe gestures
<RecipeCarousel swipeEnabled touchThreshold={50} />

// Mobile-specific interactions
<PullToRefresh onRefresh={refetchRecipes}>
  <RecipeList />
</PullToRefresh>
```

## 🎨 Theming and Customization

### CSS Custom Properties

```css
/* Theme variables */
:root {
  --color-primary: theme('colors.blue.500');
  --color-background: theme('colors.white');
  --color-foreground: theme('colors.gray.900');
  --border-radius: theme('borderRadius.lg');
  --font-sans: theme('fontFamily.sans');
}

/* Dark theme */
[data-theme='dark'] {
  --color-background: theme('colors.gray.900');
  --color-foreground: theme('colors.gray.100');
}
```

### Theme Provider

```tsx
// Theme context
<ThemeProvider defaultTheme="light">
  <App />
</ThemeProvider>

// Theme toggle
<ThemeToggle
  themes={['light', 'dark', 'system']}
  defaultTheme="system"
/>
```

### Component Variants

```tsx
// Variant system with class-variance-authority
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);
```

## 🎭 Animation and Transitions

### Micro-interactions

```css
/* Smooth transitions */
.recipe-card {
  transition: all 0.2s ease-in-out;
}

.recipe-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

/* Loading animations */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.loading-skeleton {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Page Transitions

```tsx
// Route transitions with Framer Motion
<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.2 }}
  >
    <PageContent />
  </motion.div>
</AnimatePresence>
```

## 🔧 Development Guidelines

### Component Development

```tsx
// Component structure template
export interface ComponentProps {
  // Props definition
}

const Component = forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(componentVariants({ variant }), className)}
        {...props}
      >
        {/* Component content */}
      </div>
    );
  }
);

Component.displayName = 'Component';
export { Component };
```

### Testing UI Components

```tsx
// Component testing approach
describe('RecipeCard', () => {
  it('renders recipe information correctly', () => {
    render(
      <RecipeCard
        title="Test Recipe"
        description="Test Description"
        cookTime="30 min"
      />
    );

    expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    expect(screen.getByText('30 min')).toBeInTheDocument();
  });

  it('handles favorite toggle interaction', async () => {
    const onFavoriteToggle = jest.fn();
    render(
      <RecipeCard title="Test Recipe" onFavoriteToggle={onFavoriteToggle} />
    );

    await user.click(screen.getByLabelText('Add to favorites'));
    expect(onFavoriteToggle).toHaveBeenCalled();
  });
});
```

## 📊 UI Performance Guidelines

### Optimization Checklist

- [ ] Components use React.memo where appropriate
- [ ] Images are optimized with Next.js Image component
- [ ] Lazy loading implemented for below-fold content
- [ ] Virtual scrolling for long lists
- [ ] Bundle size monitored for component additions
- [ ] Animations use CSS transforms for performance
- [ ] Critical CSS inlined for above-fold content

### Accessibility Checklist

- [ ] All interactive elements are keyboard accessible
- [ ] Color contrast meets WCAG AA standards (4.5:1)
- [ ] Focus indicators are clearly visible
- [ ] Screen reader announcements for dynamic content
- [ ] Alternative text provided for all images
- [ ] Form labels properly associated with inputs
- [ ] Semantic HTML structure used throughout

---

This UI guide provides the foundation for creating a consistent, accessible, and delightful user experience across
the Recipe UI Service. All components should follow these patterns and guidelines to ensure a cohesive design system.
