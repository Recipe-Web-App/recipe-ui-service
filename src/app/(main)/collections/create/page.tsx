'use client';

import { useRouter } from 'next/navigation';
import { CreateCollectionForm } from '@/components/collection/create';
import type { CollectionDto } from '@/types/recipe-management';

export default function CreateCollectionPage() {
  const router = useRouter();

  const handleSuccess = (collection: CollectionDto) => {
    // Navigate to the newly created collection
    router.push(`/collections/${collection.collectionId}`);
  };

  const handleCancel = () => {
    // Navigate back to collections list
    router.push('/collections');
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <CreateCollectionForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}
