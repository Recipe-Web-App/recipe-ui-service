'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
  ModalDescription,
} from '@/components/ui/modal';
import * as DialogPrimitive from '@radix-ui/react-dialog';

export default function ModalDemo() {
  const [modalVariant, setModalVariant] = useState<
    'default' | 'fullscreen' | 'drawer' | 'sheet'
  >('default');
  const [modalSize, setModalSize] = useState<
    'sm' | 'default' | 'lg' | 'xl' | '2xl' | 'full'
  >('default');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          Modal Component
        </h1>
        <p className="text-muted-foreground text-lg">
          Accessible modal dialogs with multiple variants and compound pattern.
          Perfect for confirmations, detailed views, and settings.
        </p>
      </div>

      <div className="space-y-8">
        {/* Interactive Controls */}
        <Card size="lg">
          <CardHeader>
            <CardTitle>Interactive Modal Demo</CardTitle>
            <CardDescription>
              Try different modal variants and sizes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Variant
                  </label>
                  <select
                    value={modalVariant}
                    onChange={e =>
                      setModalVariant(
                        e.target.value as
                          | 'default'
                          | 'fullscreen'
                          | 'drawer'
                          | 'sheet'
                      )
                    }
                    className="border-border bg-background w-full rounded-md border px-3 py-2 text-sm"
                  >
                    <option value="default">Default</option>
                    <option value="fullscreen">Fullscreen</option>
                    <option value="drawer">Drawer</option>
                    <option value="sheet">Sheet</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Size</label>
                  <select
                    value={modalSize}
                    onChange={e =>
                      setModalSize(
                        e.target.value as
                          | 'sm'
                          | 'default'
                          | 'lg'
                          | 'xl'
                          | '2xl'
                          | 'full'
                      )
                    }
                    className="border-border bg-background w-full rounded-md border px-3 py-2 text-sm"
                  >
                    <option value="sm">Small</option>
                    <option value="default">Default</option>
                    <option value="lg">Large</option>
                    <option value="xl">Extra Large</option>
                    <option value="2xl">2X Large</option>
                    <option value="full">Full</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="mb-3 font-medium">Live Demo</h4>
                <Modal>
                  <ModalTrigger asChild>
                    <Button>{`Open ${modalVariant} Modal (${modalSize})`}</Button>
                  </ModalTrigger>
                  <ModalContent
                    variant={modalVariant}
                    size={modalSize}
                    showClose
                  >
                    <ModalHeader>
                      <ModalTitle>Sample Recipe Modal</ModalTitle>
                      <ModalDescription>
                        This is a {modalVariant} modal with {modalSize} size.
                      </ModalDescription>
                    </ModalHeader>
                    <ModalBody scrollable>
                      <div className="space-y-4">
                        <p>
                          This modal demonstrates the {modalVariant} variant
                          with scrollable content.
                        </p>
                        <div className="space-y-2">
                          <h5 className="font-medium">Ingredients:</h5>
                          <ul className="list-inside list-disc space-y-1 text-sm">
                            <li>2 cups all-purpose flour</li>
                            <li>1 cup sugar</li>
                            <li>1/2 cup butter</li>
                            <li>2 eggs</li>
                            <li>1 tsp vanilla extract</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h5 className="font-medium">Instructions:</h5>
                          <ol className="list-inside list-decimal space-y-1 text-sm">
                            <li>Preheat oven to 350°F</li>
                            <li>Mix dry ingredients in a bowl</li>
                            <li>Add wet ingredients and mix well</li>
                            <li>Bake for 25-30 minutes</li>
                          </ol>
                        </div>
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <DialogPrimitive.Close asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogPrimitive.Close>
                      <DialogPrimitive.Close asChild>
                        <Button>Save Recipe</Button>
                      </DialogPrimitive.Close>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </div>

              <div>
                <h4 className="mb-3 font-medium">Modal Examples</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  {/* Confirmation Modal */}
                  <Modal>
                    <ModalTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Delete Recipe
                      </Button>
                    </ModalTrigger>
                    <ModalContent size="sm">
                      <ModalHeader>
                        <ModalTitle>Delete Recipe</ModalTitle>
                        <ModalDescription>
                          Are you sure you want to delete this recipe? This
                          action cannot be undone.
                        </ModalDescription>
                      </ModalHeader>
                      <ModalFooter>
                        <DialogPrimitive.Close asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogPrimitive.Close>
                        <DialogPrimitive.Close asChild>
                          <Button variant="destructive">Delete</Button>
                        </DialogPrimitive.Close>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>

                  {/* Recipe Details Modal */}
                  <Modal>
                    <ModalTrigger asChild>
                      <Button variant="outline" size="sm">
                        Recipe Details
                      </Button>
                    </ModalTrigger>
                    <ModalContent size="lg">
                      <ModalHeader>
                        <ModalTitle>Chocolate Chip Cookies</ModalTitle>
                        <ModalDescription>
                          Classic homemade cookies - 30 mins • Easy • 24 cookies
                        </ModalDescription>
                      </ModalHeader>
                      <ModalBody scrollable>
                        <div className="space-y-6">
                          <div className="flex h-32 items-center justify-center rounded-lg bg-gradient-to-br from-orange-100 to-red-100">
                            <span className="text-muted-foreground text-sm">
                              Recipe Image
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-2xl font-bold">30</div>
                              <div className="text-muted-foreground text-xs">
                                Minutes
                              </div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold">24</div>
                              <div className="text-muted-foreground text-xs">
                                Cookies
                              </div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold">
                                ⭐⭐⭐⭐⭐
                              </div>
                              <div className="text-muted-foreground text-xs">
                                Rating
                              </div>
                            </div>
                          </div>
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <DialogPrimitive.Close asChild>
                          <Button variant="outline">❤️ Save</Button>
                        </DialogPrimitive.Close>
                        <DialogPrimitive.Close asChild>
                          <Button>Start Cooking</Button>
                        </DialogPrimitive.Close>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>

                  {/* Settings Modal */}
                  <Modal>
                    <ModalTrigger asChild>
                      <Button variant="outline" size="sm">
                        User Settings
                      </Button>
                    </ModalTrigger>
                    <ModalContent size="xl">
                      <ModalHeader>
                        <ModalTitle>Account Settings</ModalTitle>
                        <ModalDescription>
                          Manage your account preferences and settings
                        </ModalDescription>
                      </ModalHeader>
                      <ModalBody scrollable>
                        <div className="space-y-6">
                          <div>
                            <h5 className="mb-3 font-medium">
                              Profile Information
                            </h5>
                            <div className="grid gap-4 md:grid-cols-2">
                              <Input
                                label="Display Name"
                                defaultValue="Chef Sarah"
                              />
                              <Input
                                label="Email"
                                type="email"
                                defaultValue="sarah@example.com"
                              />
                            </div>
                          </div>
                          <div>
                            <h5 className="mb-3 font-medium">Preferences</h5>
                            <div className="space-y-3">
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  defaultChecked
                                  className="rounded"
                                />
                                <span className="text-sm">
                                  Email notifications for new recipes
                                </span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">
                                  Weekly meal plan suggestions
                                </span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  defaultChecked
                                  className="rounded"
                                />
                                <span className="text-sm">
                                  Share recipes publicly
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <DialogPrimitive.Close asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogPrimitive.Close>
                        <DialogPrimitive.Close asChild>
                          <Button>Save Changes</Button>
                        </DialogPrimitive.Close>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Examples */}
        <Card size="lg">
          <CardHeader>
            <CardTitle>Code Examples</CardTitle>
            <CardDescription>
              Implementation examples for different modal patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                <div className="text-muted-foreground mb-2">{`// Basic modal`}</div>
                <div>{`<Modal>`}</div>
                <div>{`  <ModalTrigger>Open</ModalTrigger>`}</div>
                <div>{`  <ModalContent>`}</div>
                <div>{`    <ModalHeader>`}</div>
                <div>{`      <ModalTitle>Title</ModalTitle>`}</div>
                <div>{`    </ModalHeader>`}</div>
                <div>{`    <ModalBody>Content</ModalBody>`}</div>
                <div>{`  </ModalContent>`}</div>
                <div>{`</Modal>`}</div>
              </div>
              <div className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-sm">
                <div className="text-muted-foreground mb-2">{`// Confirmation modal`}</div>
                <div>{`<Modal>`}</div>
                <div>{`  <ModalTrigger asChild>`}</div>
                <div>{`    <Button variant="destructive">Delete</Button>`}</div>
                <div>{`  </ModalTrigger>`}</div>
                <div>{`  <ModalContent size="sm">`}</div>
                <div>{`    <ModalHeader>`}</div>
                <div>{`      <ModalTitle>Confirm Deletion</ModalTitle>`}</div>
                <div>{`      <ModalDescription>`}</div>
                <div>{`        This action cannot be undone.`}</div>
                <div>{`      </ModalDescription>`}</div>
                <div>{`    </ModalHeader>`}</div>
                <div>{`    <ModalFooter>`}</div>
                <div>{`      <ModalClose>Cancel</ModalClose>`}</div>
                <div>{`      <ModalClose>Delete</ModalClose>`}</div>
                <div>{`    </ModalFooter>`}</div>
                <div>{`  </ModalContent>`}</div>
                <div>{`</Modal>`}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
