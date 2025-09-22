'use client';

import React, { useState } from 'react';
import { ImageGallery } from '@/components/ui/image-gallery';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type {
  ImageItem,
  ImageGalleryVariant,
  ImageGalleryAspectRatio,
  ImageGallerySize,
  ImageGallerySpacing,
} from '@/types/ui/image-gallery';

// Sample images for demonstrations
const recipeImages: ImageItem[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
    alt: 'Delicious pizza with fresh toppings',
    caption: 'Wood-fired pizza with fresh basil and mozzarella',
    width: 800,
    height: 600,
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    alt: 'Creamy pasta dish',
    caption: 'Homemade pasta with creamy sauce',
    width: 800,
    height: 600,
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop',
    alt: 'Fresh salad bowl',
    caption: 'Mixed greens with seasonal vegetables',
    width: 800,
    height: 600,
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop',
    alt: 'Breakfast plate',
    caption: 'Healthy breakfast with eggs and toast',
    width: 800,
    height: 600,
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
    alt: 'Soup bowl',
    caption: 'Hearty vegetable soup',
    width: 800,
    height: 600,
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1563379091339-03246963d7d3?w=800&h=600&fit=crop',
    alt: 'Dessert plate',
    caption: 'Chocolate cake with berries',
    width: 800,
    height: 600,
  },
];

const cookingStepsImages: ImageItem[] = [
  {
    id: 'step1',
    src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    alt: 'Prep ingredients',
    caption: 'Step 1: Prepare all ingredients and tools',
    width: 400,
    height: 300,
  },
  {
    id: 'step2',
    src: 'https://images.unsplash.com/photo-1556909045-ac8fcde2f5f4?w=400&h=300&fit=crop',
    alt: 'Mix ingredients',
    caption: 'Step 2: Mix dry ingredients in a large bowl',
    width: 400,
    height: 300,
  },
  {
    id: 'step3',
    src: 'https://images.unsplash.com/photo-1556909048-ac8fcde2f5f4?w=400&h=300&fit=crop',
    alt: 'Cook mixture',
    caption: 'Step 3: Cook on medium heat for 10-15 minutes',
    width: 400,
    height: 300,
  },
  {
    id: 'step4',
    src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    alt: 'Final dish',
    caption: 'Step 4: Serve hot and enjoy your delicious meal!',
    width: 400,
    height: 300,
  },
];

const masonryImages: ImageItem[] = [
  {
    id: 'm1',
    src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=500&fit=crop',
    alt: 'Tall pizza image',
    caption: 'Classic Margherita Pizza',
    width: 400,
    height: 500,
  },
  {
    id: 'm2',
    src: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    alt: 'Wide pasta image',
    caption: 'Creamy Alfredo Pasta',
    width: 400,
    height: 300,
  },
  {
    id: 'm3',
    src: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=600&fit=crop',
    alt: 'Very tall salad image',
    caption: 'Fresh Garden Salad',
    width: 400,
    height: 600,
  },
  {
    id: 'm4',
    src: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=350&fit=crop',
    alt: 'Medium breakfast image',
    caption: 'Healthy Breakfast Bowl',
    width: 400,
    height: 350,
  },
  {
    id: 'm5',
    src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=450&fit=crop',
    alt: 'Soup image',
    caption: 'Hearty Vegetable Soup',
    width: 400,
    height: 450,
  },
  {
    id: 'm6',
    src: 'https://images.unsplash.com/photo-1563379091339-03246963d7d3?w=400&h=280&fit=crop',
    alt: 'Short dessert image',
    caption: 'Chocolate Berry Cake',
    width: 400,
    height: 280,
  },
];

export default function ImageGalleryDemo() {
  const [activeConfig, setActiveConfig] = useState<{
    variant: ImageGalleryVariant;
    aspectRatio: ImageGalleryAspectRatio;
    size: ImageGallerySize;
    spacing: ImageGallerySpacing;
    showLightbox: boolean;
    showCaptions: boolean;
    lazyLoad: boolean;
  }>({
    variant: 'grid-3',
    aspectRatio: 'auto',
    size: 'md',
    spacing: 'normal',
    showLightbox: true,
    showCaptions: true,
    lazyLoad: true,
  });

  const [clickCount, setClickCount] = useState(0);

  const handleImageClick = (image: ImageItem, index: number) => {
    setClickCount(prev => prev + 1);
    console.log('Image clicked:', image.alt, 'at index:', index);
  };

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">ImageGallery Component</h1>
          <Badge variant="secondary">Recipe UI</Badge>
        </div>
        <p className="text-muted-foreground text-lg">
          A responsive image gallery with grid layouts and lightbox
          functionality. Perfect for displaying recipe photos, cooking steps, or
          any collection of images.
        </p>
      </div>

      {/* Interactive Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Configuration</CardTitle>
          <CardDescription>
            Try different settings to see how the gallery adapts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Variant Controls */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Grid Variant</label>
            <div className="flex flex-wrap gap-2">
              {['grid-2', 'grid-3', 'grid-4', 'masonry'].map(variant => (
                <Button
                  key={variant}
                  variant={
                    activeConfig.variant === variant ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() =>
                    setActiveConfig(prev => ({
                      ...prev,
                      variant: variant as ImageGalleryVariant,
                    }))
                  }
                >
                  {variant}
                </Button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio Controls */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Aspect Ratio</label>
            <div className="flex flex-wrap gap-2">
              {['auto', 'square', 'landscape', 'portrait'].map(ratio => (
                <Button
                  key={ratio}
                  variant={
                    activeConfig.aspectRatio === ratio ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() =>
                    setActiveConfig(prev => ({
                      ...prev,
                      aspectRatio: ratio as ImageGalleryAspectRatio,
                    }))
                  }
                >
                  {ratio}
                </Button>
              ))}
            </div>
          </div>

          {/* Size and Spacing */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Size</label>
              <div className="flex gap-2">
                {['sm', 'md', 'lg', 'xl'].map(size => (
                  <Button
                    key={size}
                    variant={activeConfig.size === size ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      setActiveConfig(prev => ({
                        ...prev,
                        size: size as ImageGallerySize,
                      }))
                    }
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Spacing</label>
              <div className="flex gap-2">
                {['tight', 'normal', 'loose'].map(spacing => (
                  <Button
                    key={spacing}
                    variant={
                      activeConfig.spacing === spacing ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() =>
                      setActiveConfig(prev => ({
                        ...prev,
                        spacing: spacing as ImageGallerySpacing,
                      }))
                    }
                  >
                    {spacing}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Toggle Options */}
          <div className="grid gap-4 md:grid-cols-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={activeConfig.showLightbox}
                onChange={e =>
                  setActiveConfig(prev => ({
                    ...prev,
                    showLightbox: e.target.checked,
                  }))
                }
                className="rounded"
              />
              <span className="text-sm">Show Lightbox</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={activeConfig.showCaptions}
                onChange={e =>
                  setActiveConfig(prev => ({
                    ...prev,
                    showCaptions: e.target.checked,
                  }))
                }
                className="rounded"
              />
              <span className="text-sm">Show Captions</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={activeConfig.lazyLoad}
                onChange={e =>
                  setActiveConfig(prev => ({
                    ...prev,
                    lazyLoad: e.target.checked,
                  }))
                }
                className="rounded"
              />
              <span className="text-sm">Lazy Load</span>
            </label>
          </div>

          {/* Interactive Gallery */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Interactive Gallery</h3>
              {!activeConfig.showLightbox && (
                <p className="text-muted-foreground text-sm">
                  Images clicked: {clickCount}
                </p>
              )}
            </div>
            <ImageGallery
              images={recipeImages}
              {...activeConfig}
              onImageClick={
                !activeConfig.showLightbox ? handleImageClick : undefined
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Recipe Steps Example */}
      <Card>
        <CardHeader>
          <CardTitle>Recipe Steps Gallery</CardTitle>
          <CardDescription>
            Perfect for displaying cooking instructions with visual guides
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageGallery
            images={cookingStepsImages}
            variant="grid-2"
            aspectRatio="landscape"
            size="md"
            spacing="normal"
            showLightbox={true}
            showCaptions={true}
          />
        </CardContent>
      </Card>

      {/* Masonry Layout Example */}
      <Card>
        <CardHeader>
          <CardTitle>Masonry Layout</CardTitle>
          <CardDescription>
            Dynamic layout that adapts to different image heights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageGallery
            images={masonryImages}
            variant="masonry"
            aspectRatio="auto"
            size="lg"
            spacing="normal"
            showLightbox={true}
            showCaptions={true}
          />
        </CardContent>
      </Card>

      {/* Square Grid Example */}
      <Card>
        <CardHeader>
          <CardTitle>Square Grid</CardTitle>
          <CardDescription>
            Uniform square layout perfect for consistent visual presentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageGallery
            images={recipeImages.slice(0, 4)}
            variant="grid-2"
            aspectRatio="square"
            size="lg"
            spacing="loose"
            showLightbox={true}
            showCaptions={false}
          />
        </CardContent>
      </Card>

      {/* Compact Grid Example */}
      <Card>
        <CardHeader>
          <CardTitle>Compact 4-Column Grid</CardTitle>
          <CardDescription>
            Space-efficient layout for displaying many images
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageGallery
            images={recipeImages}
            variant="grid-4"
            aspectRatio="square"
            size="sm"
            spacing="tight"
            showLightbox={true}
            showCaptions={false}
          />
        </CardContent>
      </Card>

      {/* No Lightbox Example */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Click Handling</CardTitle>
          <CardDescription>
            Gallery without lightbox for custom interaction handling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Click any image to see custom handling (check console)
            </p>
            <ImageGallery
              images={recipeImages.slice(0, 4)}
              variant="grid-2"
              aspectRatio="landscape"
              size="md"
              spacing="normal"
              showLightbox={false}
              showCaptions={true}
              onImageClick={(image, index) => {
                alert(`Custom action: ${image.alt} (Image ${index + 1})`);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Empty State Example */}
      <Card>
        <CardHeader>
          <CardTitle>Empty State</CardTitle>
          <CardDescription>
            How the gallery appears when no images are provided
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageGallery
            images={[]}
            variant="grid-3"
            aspectRatio="auto"
            showLightbox={true}
          />
        </CardContent>
      </Card>

      {/* Feature Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-semibold">Grid Layouts</h4>
              <p className="text-muted-foreground text-sm">
                2, 3, 4 column grids or dynamic masonry layout
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Lightbox Viewing</h4>
              <p className="text-muted-foreground text-sm">
                Full-screen viewing with keyboard navigation
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Lazy Loading</h4>
              <p className="text-muted-foreground text-sm">
                Performance optimization with intersection observer
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Responsive Design</h4>
              <p className="text-muted-foreground text-sm">
                Adapts to all screen sizes automatically
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Accessibility</h4>
              <p className="text-muted-foreground text-sm">
                Full ARIA support and keyboard navigation
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Error Handling</h4>
              <p className="text-muted-foreground text-sm">
                Graceful fallbacks for failed image loads
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
          <CardDescription>Common implementation patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Basic Recipe Gallery</h4>
              <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">
                <code>{`<ImageGallery
  images={recipeImages}
  variant="grid-3"
  aspectRatio="auto"
  showLightbox={true}
  showCaptions={true}
/>`}</code>
              </pre>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Cooking Steps</h4>
              <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">
                <code>{`<ImageGallery
  images={stepImages}
  variant="grid-2"
  aspectRatio="landscape"
  showCaptions={true}
/>`}</code>
              </pre>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Custom Click Handling</h4>
              <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">
                <code>{`<ImageGallery
  images={images}
  showLightbox={false}
  onImageClick={(image, index) => {
    // Custom handling
    navigateToRecipe(image.id);
  }}
/>`}</code>
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
