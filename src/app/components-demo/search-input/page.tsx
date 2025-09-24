'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { SearchInput } from '@/components/ui/search-input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Filter,
  MapPin,
  User,
  ChefHat,
  Utensils,
  Heart,
  Star,
} from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  type: string;
  description: string;
}

export default function SearchInputDemo() {
  // Interactive controls state
  const [searchValue, setSearchValue] = useState('');
  const [searchDisabled, setSearchDisabled] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchIcon, setShowSearchIcon] = useState(true);
  const [showClearButton, setShowClearButton] = useState(true);
  const [clearOnEscape, setClearOnEscape] = useState(true);
  const [autoFocus, setAutoFocus] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [debounceDelay, setDebounceDelay] = useState(300);

  // Search demo state
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLog, setSearchLog] = useState<string[]>([]);
  const [recipeSearchValue, setRecipeSearchValue] = useState('');
  const [ingredientSearchValue, setIngredientSearchValue] = useState('');
  const [cuisineSearchValue, setCuisineSearchValue] = useState('');

  // Mock search results
  const mockResults: SearchResult[] = React.useMemo(
    () => [
      {
        id: '1',
        title: 'Chicken Alfredo Pasta',
        type: 'recipe',
        description:
          'Creamy pasta dish with grilled chicken and parmesan cheese',
      },
      {
        id: '2',
        title: 'Chicken Breast',
        type: 'ingredient',
        description: 'Lean protein perfect for various cooking methods',
      },
      {
        id: '3',
        title: 'Chicken Parmesan',
        type: 'recipe',
        description:
          'Breaded chicken breast with marinara sauce and mozzarella',
      },
      {
        id: '4',
        title: 'Italian Cuisine',
        type: 'cuisine',
        description: 'Traditional recipes from Italy',
      },
    ],
    []
  );

  // Log search events
  const addToSearchLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setSearchLog(prev => [`${timestamp}: ${message}`, ...prev.slice(0, 9)]);
  }, []);

  // Handle search with simulated delay
  const handleSearch = useCallback(
    (value: string) => {
      addToSearchLog(`Search triggered: "${value}"`);
      setSearchLoading(true);

      // Simulate API call
      setTimeout(() => {
        if (value.length > 0) {
          const filtered = mockResults.filter(result =>
            result.title.toLowerCase().includes(value.toLowerCase())
          );
          setSearchResults(filtered);
          addToSearchLog(`Found ${filtered.length} results for "${value}"`);
        } else {
          setSearchResults([]);
        }
        setSearchLoading(false);
      }, 800);
    },
    [addToSearchLog, mockResults]
  );

  const handleRecipeSearch = useCallback(
    (value: string) => {
      console.log('Recipe search:', value);
      addToSearchLog(`Recipe search: "${value}"`);
    },
    [addToSearchLog]
  );

  const handleIngredientSearch = useCallback(
    (value: string) => {
      console.log('Ingredient search:', value);
      addToSearchLog(`Ingredient search: "${value}"`);
    },
    [addToSearchLog]
  );

  const handleCuisineSearch = useCallback(
    (value: string) => {
      console.log('Cuisine search:', value);
      addToSearchLog(`Cuisine search: "${value}"`);
    },
    [addToSearchLog]
  );

  // Memoize debounce config to prevent recreating on every render
  const debounceConfigMemo = useMemo(
    () => ({ delay: debounceDelay }),
    [debounceDelay]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          SearchInput Component
        </h1>
        <p className="text-muted-foreground text-lg">
          Specialized search input with debouncing, clear functionality, loading
          states, and comprehensive event handling optimized for search
          experiences.
        </p>
      </div>

      <div className="space-y-8">
        {/* Interactive Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={searchDisabled}
                  onChange={e => setSearchDisabled(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Disabled</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={searchLoading}
                  onChange={e => setSearchLoading(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Loading</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showSearchIcon}
                  onChange={e => setShowSearchIcon(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Search Icon</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showClearButton}
                  onChange={e => setShowClearButton(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Clear Button</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={clearOnEscape}
                  onChange={e => setClearOnEscape(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Clear on Escape</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoFocus}
                  onChange={e => setAutoFocus(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Auto Focus</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={searchError}
                  onChange={e => setSearchError(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Error State</span>
              </label>
              <div className="flex items-center gap-2">
                <label className="text-sm">Debounce:</label>
                <select
                  value={debounceDelay}
                  onChange={e => setDebounceDelay(Number(e.target.value))}
                  className="rounded border px-2 py-1 text-sm"
                >
                  <option value={100}>100ms</option>
                  <option value={300}>300ms</option>
                  <option value={500}>500ms</option>
                  <option value={1000}>1000ms</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              {/* Live Example */}
              <div>
                <h4 className="mb-3 font-medium">Live Example</h4>
                <div className="max-w-md">
                  <SearchInput
                    label="Interactive Search"
                    placeholder="Search recipes, ingredients, or cuisine..."
                    value={searchValue}
                    onChange={useCallback(
                      (e: React.ChangeEvent<HTMLInputElement>) =>
                        setSearchValue(e.target.value),
                      []
                    )}
                    onSearch={useCallback(
                      (value: string) =>
                        addToSearchLog(`Debounced search: "${value}"`),
                      [addToSearchLog]
                    )}
                    onFocus={useCallback(
                      () => addToSearchLog('Input focused'),
                      [addToSearchLog]
                    )}
                    onBlur={useCallback(
                      () => addToSearchLog('Input blurred'),
                      [addToSearchLog]
                    )}
                    onClear={useCallback(() => {
                      setSearchValue('');
                      addToSearchLog('Search cleared');
                    }, [addToSearchLog])}
                    onSubmit={useCallback(
                      (value: string) =>
                        addToSearchLog(`Search submitted: "${value}"`),
                      [addToSearchLog]
                    )}
                    disabled={searchDisabled}
                    loading={searchLoading}
                    showSearchIcon={showSearchIcon}
                    showClearButton={showClearButton}
                    clearOnEscape={clearOnEscape}
                    autoFocus={autoFocus}
                    state={searchError ? 'error' : 'default'}
                    errorText={
                      searchError
                        ? 'Please enter a valid search term'
                        : undefined
                    }
                    helperText={
                      !searchError
                        ? 'Try typing, pressing Enter, or Escape'
                        : undefined
                    }
                    debounceConfig={debounceConfigMemo}
                  />
                </div>
              </div>

              {/* Event Log */}
              <div>
                <h4 className="mb-3 font-medium">Event Log</h4>
                <div className="bg-muted/50 h-32 overflow-y-auto rounded-md p-3">
                  {searchLog.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      Interact with the search input above to see events...
                    </p>
                  ) : (
                    <ul className="space-y-1 font-mono text-sm">
                      {searchLog.map((entry, index) => (
                        <li key={index} className="text-xs">
                          {entry}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Variants Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Variants & Sizes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Default Variant */}
              <div>
                <h4 className="mb-3 font-medium">Default Variant</h4>
                <div className="space-y-3">
                  <SearchInput
                    variant="default"
                    size="sm"
                    placeholder="Small search..."
                    label="Small"
                  />
                  <SearchInput
                    variant="default"
                    size="default"
                    placeholder="Default search..."
                    label="Default"
                  />
                  <SearchInput
                    variant="default"
                    size="lg"
                    placeholder="Large search..."
                    label="Large"
                  />
                </div>
              </div>

              {/* Filled Variant */}
              <div>
                <h4 className="mb-3 font-medium">Filled Variant</h4>
                <div className="space-y-3">
                  <SearchInput
                    variant="filled"
                    size="sm"
                    placeholder="Small filled..."
                    label="Small"
                  />
                  <SearchInput
                    variant="filled"
                    size="default"
                    placeholder="Default filled..."
                    label="Default"
                  />
                  <SearchInput
                    variant="filled"
                    size="lg"
                    placeholder="Large filled..."
                    label="Large"
                  />
                </div>
              </div>

              {/* Outlined Variant */}
              <div>
                <h4 className="mb-3 font-medium">Outlined Variant</h4>
                <div className="space-y-3">
                  <SearchInput
                    variant="outlined"
                    size="sm"
                    placeholder="Small outlined..."
                    label="Small"
                  />
                  <SearchInput
                    variant="outlined"
                    size="default"
                    placeholder="Default outlined..."
                    label="Default"
                  />
                  <SearchInput
                    variant="outlined"
                    size="lg"
                    placeholder="Large outlined..."
                    label="Large"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* States Demo */}
        <Card>
          <CardHeader>
            <CardTitle>States</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <SearchInput
                state="default"
                placeholder="Default state"
                label="Default State"
                helperText="Normal search state"
              />
              <SearchInput
                state="error"
                placeholder="Error state"
                label="Error State"
                errorText="Please enter a valid search term"
                value="invalid input"
              />
              <SearchInput
                state="success"
                placeholder="Success state"
                label="Success State"
                helperText="Search term is valid"
                value="chicken recipe"
              />
              <SearchInput
                state="warning"
                placeholder="Warning state"
                label="Warning State"
                helperText="This might not return many results"
                value="rare ingredient"
              />
            </div>
          </CardContent>
        </Card>

        {/* Custom Icons Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Icons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <SearchInput
                placeholder="Search recipes..."
                label="Recipe Search"
                searchIcon={<ChefHat className="h-4 w-4" />}
                helperText="Find recipes by name"
              />
              <SearchInput
                placeholder="Filter results..."
                label="Filter Search"
                searchIcon={<Filter className="h-4 w-4" />}
                helperText="Filter by criteria"
              />
              <SearchInput
                placeholder="Find locations..."
                label="Location Search"
                searchIcon={<MapPin className="h-4 w-4" />}
                helperText="Search by location"
              />
              <SearchInput
                placeholder="Search users..."
                label="User Search"
                searchIcon={<User className="h-4 w-4" />}
                helperText="Find users and chefs"
              />
              <SearchInput
                placeholder="Search ingredients..."
                label="Ingredient Search"
                searchIcon={<Utensils className="h-4 w-4" />}
                helperText="Find by ingredients"
              />
              <SearchInput
                placeholder="Search favorites..."
                label="Favorites Search"
                searchIcon={<Heart className="h-4 w-4" />}
                helperText="Search saved recipes"
              />
            </div>
          </CardContent>
        </Card>

        {/* Recipe-Specific Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Recipe App Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <SearchInput
                value={recipeSearchValue}
                onChange={e => setRecipeSearchValue(e.target.value)}
                onSearch={handleRecipeSearch}
                placeholder="Search for recipes..."
                label="Recipe Discovery"
                searchIcon={<ChefHat className="h-4 w-4" />}
                helperText="Find recipes by name, description, or cooking method"
                size="lg"
                debounceConfig={{ delay: 300 }}
              />

              <SearchInput
                value={ingredientSearchValue}
                onChange={e => setIngredientSearchValue(e.target.value)}
                onSearch={handleIngredientSearch}
                placeholder="Enter ingredients you have..."
                label="Ingredient-Based Search"
                searchIcon={<Utensils className="h-4 w-4" />}
                helperText="Enter ingredients separated by commas (e.g., chicken, pasta, tomatoes)"
                variant="filled"
                debounceConfig={{ delay: 500 }}
              />

              <SearchInput
                value={cuisineSearchValue}
                onChange={e => setCuisineSearchValue(e.target.value)}
                onSearch={handleCuisineSearch}
                placeholder="Italian, Mexican, Asian..."
                label="Cuisine Type"
                searchIcon={<Star className="h-4 w-4" />}
                helperText="Discover recipes from different cuisines around the world"
                variant="outlined"
                debounceConfig={{ delay: 400 }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Search with Results Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Search with Live Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <SearchInput
                placeholder="Try searching for 'chicken'..."
                label="Live Search Demo"
                onSearch={handleSearch}
                loading={searchLoading}
                helperText="Results update as you type (with simulated delay)"
                debounceConfig={{ delay: 300 }}
              />

              <div className="space-y-2">
                {searchResults.length > 0 && (
                  <>
                    <h4 className="font-medium">Search Results:</h4>
                    <div className="space-y-2">
                      {searchResults.map(result => (
                        <div
                          key={result.id}
                          className="hover:bg-muted/50 rounded-md border p-3 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="font-medium">{result.title}</h5>
                              <p className="text-muted-foreground text-sm">
                                {result.description}
                              </p>
                            </div>
                            <Badge variant="secondary" className="ml-2">
                              {result.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disabled State */}
        <Card>
          <CardHeader>
            <CardTitle>Disabled State</CardTitle>
          </CardHeader>
          <CardContent>
            <SearchInput
              disabled
              value="Cannot edit this search"
              placeholder="Disabled search input"
              label="Disabled Search"
              helperText="This search input is disabled"
            />
          </CardContent>
        </Card>

        {/* Without Icons */}
        <Card>
          <CardHeader>
            <CardTitle>Minimal Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <SearchInput
              showSearchIcon={false}
              showClearButton={false}
              placeholder="Minimal search input without icons"
              label="Minimal Search"
              helperText="No search icon or clear button"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
