
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CanvasData, getCanvasList } from '@/services/mongodb';

interface CanvasMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onCanvasSelect: (canvas: CanvasData) => void;
}

const CanvasMenu = ({ isOpen, onClose, onCanvasSelect }: CanvasMenuProps) => {
  const [canvases, setCanvases] = useState<CanvasData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadCanvases();
    }
  }, [isOpen]);

  const loadCanvases = async () => {
    setLoading(true);
    try {
      const canvasList = await getCanvasList();
      setCanvases(canvasList);
    } catch (error) {
      console.error('Failed to load canvases:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Your Saved Canvases</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {loading ? (
            <div className="text-center py-4">Loading canvases...</div>
          ) : canvases.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No saved canvases found</div>
          ) : (
            <ul className="space-y-2">
              {canvases.map((canvas) => (
                <li key={canvas.id} className="border rounded p-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{canvas.name}</div>
                      <div className="text-xs text-gray-500">
                        {canvas.createdAt && new Date(canvas.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        onCanvasSelect(canvas);
                        onClose();
                      }}
                    >
                      Open
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CanvasMenu;
