'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

export default function InputDemo() {
  const [inputValue, setInputValue] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);
  const [inputLoading, setInputLoading] = useState(false);
  const [inputFloating, setInputFloating] = useState(false);
  const [inputClearable, setInputClearable] = useState(false);
  const [inputShowCount, setInputShowCount] = useState(false);
  const [inputError, setInputError] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          Input Component
        </h1>
        <p className="text-muted-foreground text-lg">
          Comprehensive input component with multiple variants, states, and
          advanced features like floating labels, icons, and validation.
        </p>
      </div>

      <div className="space-y-8">
        {/* Interactive Controls */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Interactive Controls</h3>
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={inputDisabled}
                onChange={e => setInputDisabled(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Disabled</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={inputLoading}
                onChange={e => setInputLoading(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Loading</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={inputFloating}
                onChange={e => setInputFloating(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Floating Label</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={inputClearable}
                onChange={e => setInputClearable(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Clearable</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={inputShowCount}
                onChange={e => setInputShowCount(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Character Count</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={inputError}
                onChange={e => setInputError(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Error State</span>
            </label>
          </div>

          <div className="space-y-8">
            {/* Live Example */}
            <div>
              <h4 className="mb-3 font-medium">Live Example</h4>
              <div className="max-w-md">
                <Input
                  label="Recipe Name"
                  placeholder={inputFloating ? '' : 'Enter recipe name...'}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  disabled={inputDisabled}
                  loading={inputLoading}
                  clearable={inputClearable}
                  floatingLabel={inputFloating}
                  showCharacterCount={inputShowCount}
                  characterLimit={inputShowCount ? 50 : undefined}
                  errorText={inputError ? 'Recipe name is required' : undefined}
                  helperText={
                    !inputError
                      ? 'Give your recipe a descriptive name'
                      : undefined
                  }
                  leftIcon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25A8.966 8.966 0 0118 3.75c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                      />
                    </svg>
                  }
                  onClear={() => setInputValue('')}
                />
              </div>
            </div>

            {/* Variants */}
            <div>
              <h4 className="mb-3 font-medium">Variants</h4>
              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  variant="default"
                  placeholder="Default variant"
                  disabled={inputDisabled}
                  loading={inputLoading}
                />
                <Input
                  variant="filled"
                  placeholder="Filled variant"
                  disabled={inputDisabled}
                  loading={inputLoading}
                />
                <Input
                  variant="outlined"
                  placeholder="Outlined variant"
                  disabled={inputDisabled}
                  loading={inputLoading}
                />
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h4 className="mb-3 font-medium">Sizes</h4>
              <div className="space-y-3">
                <Input
                  size="sm"
                  placeholder="Small input"
                  disabled={inputDisabled}
                  loading={inputLoading}
                />
                <Input
                  size="default"
                  placeholder="Default input"
                  disabled={inputDisabled}
                  loading={inputLoading}
                />
                <Input
                  size="lg"
                  placeholder="Large input"
                  disabled={inputDisabled}
                  loading={inputLoading}
                />
              </div>
            </div>

            {/* States */}
            <div>
              <h4 className="mb-3 font-medium">States</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  placeholder="Default state"
                  helperText="This is a helper message"
                />
                <Input
                  placeholder="Success state"
                  state="success"
                  helperText="Input is valid!"
                />
                <Input
                  placeholder="Warning state"
                  state="warning"
                  helperText="Please check this field"
                />
                <Input
                  placeholder="Error state"
                  errorText="This field is required"
                />
              </div>
            </div>

            {/* Input Types */}
            <div>
              <h4 className="mb-3 font-medium">Input Types</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  type="text"
                  label="Text Input"
                  placeholder="Enter text..."
                />
                <Input
                  type="email"
                  label="Email Input"
                  placeholder="Enter email..."
                />
                <Input
                  type="password"
                  label="Password Input"
                  placeholder="Enter password..."
                />
                <Input
                  type="number"
                  label="Number Input"
                  placeholder="Enter number..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">
            Recipe App Usage Examples
          </h3>

          <div className="space-y-6">
            {/* Recipe Form */}
            <div className="bg-muted/50 rounded-lg border p-4">
              <h4 className="mb-3 font-medium">Recipe Creation Form</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Recipe Name"
                  placeholder="Chocolate Chip Cookies"
                  showCharacterCount
                  characterLimit={50}
                  required
                />
                <Input
                  label="Preparation Time"
                  type="number"
                  placeholder="30"
                  rightIcon={
                    <span className="text-muted-foreground text-sm">min</span>
                  }
                />
                <Input
                  label="Servings"
                  type="number"
                  placeholder="4"
                  rightIcon={
                    <span className="text-muted-foreground text-sm">
                      people
                    </span>
                  }
                />
                <Input
                  label="Difficulty"
                  placeholder="Easy"
                  helperText="Rate from Easy to Hard"
                />
              </div>
            </div>

            {/* Search */}
            <div className="bg-muted/50 rounded-lg border p-4">
              <h4 className="mb-3 font-medium">Recipe Search</h4>
              <Input
                size="lg"
                placeholder="Search for recipes..."
                clearable
                leftIcon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                }
              />
            </div>

            {/* User Profile */}
            <div className="bg-muted/50 rounded-lg border p-4">
              <h4 className="mb-3 font-medium">User Profile Settings</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Display Name"
                  placeholder="Chef Sarah"
                  floatingLabel
                  showCharacterCount
                  characterLimit={30}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="sarah@example.com"
                  floatingLabel
                />
              </div>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="bg-card rounded-lg border p-6">
          <h3 className="mb-4 text-lg font-medium">Code Examples</h3>
          <div className="space-y-4">
            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">{`// Basic usage`}</div>
              <div>{`<Input placeholder="Enter text..." />`}</div>
            </div>
            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">
                {`// With label and validation`}
              </div>
              <div>{`<Input`}</div>
              <div>{`  label="Recipe Name"`}</div>
              <div>{`  required`}</div>
              <div>{`  errorText="Name is required"`}</div>
              <div>{`  showCharacterCount`}</div>
              <div>{`  characterLimit={50}`}</div>
              <div>{`/>`}</div>
            </div>
            <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2">
                {`// Advanced features`}
              </div>
              <div>{`<Input`}</div>
              <div>{`  floatingLabel`}</div>
              <div>{`  label="Search Recipes"`}</div>
              <div>{`  clearable`}</div>
              <div>{`  leftIcon={<SearchIcon />}`}</div>
              <div>{`  loading={isSearching}`}</div>
              <div>{`/>`}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
