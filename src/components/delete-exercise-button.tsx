'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { createClient } from '@/lib/supabase';

interface DeleteExerciseButtonProps {
  exerciseId: string;
  exerciseName: string;
}

export default function DeleteExerciseButton({
  exerciseId,
  exerciseName,
}: DeleteExerciseButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', exerciseId);

      if (error) {
        console.error('Error deleting exercise:', error);
        alert('Error deleting exercise. Please try again.');
      } else {
        router.push('/exercises');
        router.refresh();
      }
    } catch (error) {
      console.error('Error deleting exercise:', error);
      alert('Error deleting exercise. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirmation(true)}
        className="p-2 bg-red-400 border-4 border-black shadow-[4px_4px_0px_0px_#000] active:shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-75 hover:bg-red-300"
      >
        <TrashIcon className="h-4 w-4 text-black" />
      </button>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="bg-white max-w-sm w-full">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-black text-black uppercase">
                  DELETE EXERCISE?
                </h3>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="p-1 bg-gray-400 border-2 border-black hover:bg-gray-300"
                >
                  <XMarkIcon className="h-4 w-4 text-black" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-black font-bold mb-2">
                  ARE YOU SURE YOU WANT TO DELETE:
                </p>
                <div className="bg-red-400 border-4 border-black p-3">
                  <p className="text-white font-black uppercase">
                    {exerciseName}
                  </p>
                </div>
                <p className="text-black font-bold mt-3 text-sm">
                  THIS ACTION CANNOT BE UNDONE!
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  variant="danger"
                  size="lg"
                  className="w-full font-bold"
                >
                  {isDeleting ? 'DELETING...' : 'YES, DELETE'}
                </Button>
                <Button
                  onClick={() => setShowConfirmation(false)}
                  variant="secondary"
                  size="lg"
                  className="w-full font-bold"
                >
                  CANCEL
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
