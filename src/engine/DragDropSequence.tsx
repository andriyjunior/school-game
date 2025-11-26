import { useState, useRef, DragEvent, TouchEvent, CSSProperties } from 'react';
import './DragDropSequence.css';

interface DragDropSequenceProps {
  availableItems: string[];
  orderedItems: string[];
  onItemMove: (fromIndex: number, toIndex: number, fromZone: 'available' | 'ordered') => void;
  onItemRemove?: (index: number) => void;
  disabled?: boolean;
  maxItems?: number;
  gradient?: string;
  showFeedback?: boolean;
  isCorrect?: boolean | null;
  emptyMessage?: string;
  promptMessage?: string;
  enableSwap?: boolean; // Enable swap on drag over
}

export function DragDropSequence({
  availableItems,
  orderedItems,
  onItemMove,
  onItemRemove,
  disabled = false,
  maxItems,
  gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  showFeedback = false,
  isCorrect = null,
  emptyMessage = 'Перетягни кроки сюди ⬇️',
  promptMessage = '🎯 Доступні кроки (перетягни їх вверх):',
  enableSwap = true
}: DragDropSequenceProps) {
  const [draggedItem, setDraggedItem] = useState<{
    item: string;
    index: number;
    zone: 'available' | 'ordered';
  } | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragOverZone, setDragOverZone] = useState<'available' | 'ordered' | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [animatingItems, setAnimatingItems] = useState<Set<number>>(new Set());
  const [swapDirection, setSwapDirection] = useState<Map<number, 'up' | 'down'>>(new Map());

  // Touch support
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const dragPreview = useRef<HTMLDivElement | null>(null);
  const swapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDragStart = (
    e: DragEvent<HTMLDivElement>,
    item: string,
    index: number,
    zone: 'available' | 'ordered'
  ) => {
    if (disabled) return;

    setDraggedItem({ item, index, zone });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);

    // Add ghost image
    if (e.currentTarget) {
      e.dataTransfer.setDragImage(e.currentTarget, 20, 20);
    }
  };

  const handleDragOver = (
    e: DragEvent<HTMLDivElement>,
    index: number,
    zone: 'available' | 'ordered'
  ) => {
    if (disabled || !draggedItem) return;

    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
    setDragOverZone(zone);

    // Handle instant swap for ordered items when dragging over
    if (enableSwap && zone === 'ordered' && draggedItem.zone === 'ordered' && draggedItem.index !== index) {
      // Clear existing timeout to debounce
      if (swapTimeoutRef.current) {
        clearTimeout(swapTimeoutRef.current);
      }

      // Instant swap - no debounce for immediate visual feedback
      swapTimeoutRef.current = setTimeout(() => {
        // Determine swap direction for animations
        const newSwapDirection = new Map<number, 'up' | 'down'>();
        if (draggedItem.index < index) {
          // Dragged item moving down, target moving up
          newSwapDirection.set(draggedItem.index, 'down');
          newSwapDirection.set(index, 'up');
        } else {
          // Dragged item moving up, target moving down
          newSwapDirection.set(draggedItem.index, 'up');
          newSwapDirection.set(index, 'down');
        }
        setSwapDirection(newSwapDirection);

        // Trigger animation
        setAnimatingItems(new Set([draggedItem.index, index]));

        // Perform swap immediately
        onItemMove(draggedItem.index, index, 'ordered');

        // Update dragged item index after swap
        setDraggedItem({
          ...draggedItem,
          index: index
        });

        // Clear animation after it completes (shorter for snappier feel)
        setTimeout(() => {
          setAnimatingItems(new Set());
          setSwapDirection(new Map());
        }, 300);
      }, 10); // Minimal 10ms delay only to prevent duplicate triggers on same item
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
    setDragOverZone(null);

    // Clear swap timeout
    if (swapTimeoutRef.current) {
      clearTimeout(swapTimeoutRef.current);
      swapTimeoutRef.current = null;
    }
  };

  const handleDrop = (
    e: DragEvent<HTMLDivElement>,
    targetIndex: number,
    targetZone: 'available' | 'ordered'
  ) => {
    e.preventDefault();
    if (disabled || !draggedItem) return;

    // Don't allow dropping if max items reached
    if (targetZone === 'ordered' && maxItems && orderedItems.length >= maxItems && draggedItem.zone === 'available') {
      setDraggedItem(null);
      setDragOverIndex(null);
      setDragOverZone(null);
      return;
    }

    onItemMove(draggedItem.index, targetIndex, draggedItem.zone);

    setDraggedItem(null);
    setDragOverIndex(null);
    setDragOverZone(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
    setDragOverZone(null);

    // Clear swap timeout
    if (swapTimeoutRef.current) {
      clearTimeout(swapTimeoutRef.current);
      swapTimeoutRef.current = null;
    }
  };

  // Touch handlers for mobile
  const handleTouchStart = (
    e: TouchEvent<HTMLDivElement>,
    item: string,
    index: number,
    zone: 'available' | 'ordered'
  ) => {
    if (disabled) return;

    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    setDraggedItem({ item, index, zone });

    // Create drag preview
    const preview = e.currentTarget.cloneNode(true) as HTMLDivElement;
    preview.style.position = 'fixed';
    preview.style.top = `${touch.clientY - 30}px`;
    preview.style.left = `${touch.clientX - 100}px`;
    preview.style.width = '200px';
    preview.style.opacity = '0.8';
    preview.style.pointerEvents = 'none';
    preview.style.zIndex = '9999';
    preview.style.transform = 'scale(1.05)';
    document.body.appendChild(preview);
    dragPreview.current = preview;
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!draggedItem || !dragPreview.current) return;

    const touch = e.touches[0];
    dragPreview.current.style.top = `${touch.clientY - 30}px`;
    dragPreview.current.style.left = `${touch.clientX - 100}px`;

    // Find element under touch
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropZone = elementBelow?.closest('[data-drop-zone]') as HTMLElement;

    if (dropZone) {
      const zone = dropZone.getAttribute('data-drop-zone') as 'available' | 'ordered';
      const index = parseInt(dropZone.getAttribute('data-index') || '0');
      setDragOverZone(zone);
      setDragOverIndex(index);

      // Handle instant swap for ordered items when touching over
      if (enableSwap && zone === 'ordered' && draggedItem.zone === 'ordered' && draggedItem.index !== index) {
        // Clear existing timeout to debounce
        if (swapTimeoutRef.current) {
          clearTimeout(swapTimeoutRef.current);
        }

        // Instant swap - no debounce for immediate visual feedback
        swapTimeoutRef.current = setTimeout(() => {
          // Determine swap direction for animations
          const newSwapDirection = new Map<number, 'up' | 'down'>();
          if (draggedItem.index < index) {
            // Dragged item moving down, target moving up
            newSwapDirection.set(draggedItem.index, 'down');
            newSwapDirection.set(index, 'up');
          } else {
            // Dragged item moving up, target moving down
            newSwapDirection.set(draggedItem.index, 'up');
            newSwapDirection.set(index, 'down');
          }
          setSwapDirection(newSwapDirection);

          // Trigger animation
          setAnimatingItems(new Set([draggedItem.index, index]));

          // Perform swap immediately
          onItemMove(draggedItem.index, index, 'ordered');

          // Update dragged item index after swap
          setDraggedItem({
            ...draggedItem,
            index: index
          });

          // Clear animation after it completes (shorter for snappier feel)
          setTimeout(() => {
            setAnimatingItems(new Set());
            setSwapDirection(new Map());
          }, 300);
        }, 10); // Minimal 10ms delay only to prevent duplicate triggers on same item
      }
    } else {
      setDragOverZone(null);
      setDragOverIndex(null);

      // Clear swap timeout when not over any zone
      if (swapTimeoutRef.current) {
        clearTimeout(swapTimeoutRef.current);
        swapTimeoutRef.current = null;
      }
    }
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (!draggedItem) return;

    // Remove preview
    if (dragPreview.current) {
      document.body.removeChild(dragPreview.current);
      dragPreview.current = null;
    }

    // Find drop target
    const touch = e.changedTouches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropZone = elementBelow?.closest('[data-drop-zone]') as HTMLElement;

    if (dropZone && dragOverZone && dragOverIndex !== null) {
      const zone = dropZone.getAttribute('data-drop-zone') as 'available' | 'ordered';
      const index = parseInt(dropZone.getAttribute('data-index') || '0');

      // Don't allow dropping if max items reached
      if (zone === 'ordered' && maxItems && orderedItems.length >= maxItems && draggedItem.zone === 'available') {
        setDraggedItem(null);
        setDragOverIndex(null);
        setDragOverZone(null);
        return;
      }

      onItemMove(draggedItem.index, index, draggedItem.zone);
    }

    setDraggedItem(null);
    setDragOverIndex(null);
    setDragOverZone(null);
    touchStartPos.current = null;
  };

  const renderItem = (
    item: string,
    index: number,
    zone: 'available' | 'ordered',
    isDragging: boolean
  ) => {
    const isBeingDraggedOver = dragOverZone === zone && dragOverIndex === index && draggedItem?.zone !== zone;
    const isHovered = hoveredIndex === index && zone === 'ordered';
    const isAnimating = animatingItems.has(index);
    const canRemove = zone === 'ordered' && !disabled && !showFeedback && onItemRemove;

    // Dynamic styles for animations
    const getDynamicStyles = (): CSSProperties => {
      const baseStyles: CSSProperties = {
        background: zone === 'ordered'
          ? (showFeedback
            ? (isCorrect ? '#d4edda' : '#f8d7da')
            : 'white')
          : gradient,
        color: zone === 'ordered'
          ? (showFeedback
            ? (isCorrect ? '#155724' : '#721c24')
            : '#333')
          : 'white',
        padding: zone === 'ordered' ? '15px 20px' : '20px',
        borderRadius: '12px',
        fontSize: zone === 'ordered' ? '1.2em' : '1.1em',
        fontWeight: 'bold',
        cursor: disabled || showFeedback ? 'default' : (isDragging ? 'grabbing' : canRemove ? 'pointer' : 'grab'),
        border: zone === 'ordered'
          ? `3px solid ${showFeedback
            ? (isCorrect ? '#28a745' : '#dc3545')
            : '#667eea'}`
          : 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        minHeight: zone === 'ordered' ? '60px' : '70px',
        textAlign: zone === 'ordered' ? 'left' : 'center',
        justifyContent: zone === 'ordered' ? 'flex-start' : 'center',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none',
        position: 'relative',
        overflow: 'hidden'
      };

      // Transition and transform
      if (isDragging) {
        return {
          ...baseStyles,
          opacity: 0.5,
          transform: 'scale(1.05) rotate(3deg)',
          transition: 'all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: '0 15px 40px rgba(102, 126, 234, 0.4)',
          border: zone === 'ordered' ? `3px dashed #667eea` : baseStyles.border,
          zIndex: 1000
        };
      }

      if (isBeingDraggedOver) {
        return {
          ...baseStyles,
          transform: 'scale(1.08) translateY(-2px)',
          transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4), inset 0 0 0 3px rgba(102, 126, 234, 0.5)',
          animation: 'pulse 0.6s infinite alternate'
        };
      }

      if (isAnimating) {
        const direction = swapDirection.get(index);
        const animationName = direction === 'up' ? 'swapUp' : direction === 'down' ? 'swapDown' : 'swap';
        return {
          ...baseStyles,
          animation: `${animationName} 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)`,
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: '0 15px 35px rgba(102, 126, 234, 0.6)',
          zIndex: 999
        };
      }

      if (isHovered && !isDragging) {
        return {
          ...baseStyles,
          transform: 'scale(1.03) translateY(-1px)',
          transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: zone === 'ordered'
            ? '0 5px 15px rgba(0,0,0,0.15)'
            : '0 5px 20px rgba(0,0,0,0.25)'
        };
      }

      // Default state with smooth transition
      return {
        ...baseStyles,
        transform: 'scale(1) translateY(0) rotate(0deg)',
        transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        boxShadow: zone === 'ordered'
          ? '0 3px 10px rgba(0,0,0,0.1)'
          : '0 3px 10px rgba(0,0,0,0.15)',
        willChange: 'transform, box-shadow, opacity'
      };
    };

    return (
      <div
        key={`${zone}-${index}`}
        draggable={!disabled && !showFeedback}
        onDragStart={(e) => handleDragStart(e, item, index, zone)}
        onDragOver={(e) => handleDragOver(e, index, zone)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, index, zone)}
        onDragEnd={handleDragEnd}
        onTouchStart={(e) => handleTouchStart(e, item, index, zone)}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => !isDragging && setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        data-drop-zone={zone}
        data-index={index}
        onClick={() => canRemove && onItemRemove(index)}
        style={getDynamicStyles()}
      >
        {/* Shimmer effect when dragging over */}
        {isBeingDraggedOver && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            animation: 'shimmer 1s infinite'
          }} />
        )}

        {/* Sparkle effects during swap animation */}
        {isAnimating && (
          <>
            <div style={{
              position: 'absolute',
              top: '10%',
              right: '10%',
              fontSize: '1.5em',
              animation: 'sparkle 0.3s ease-in-out',
              pointerEvents: 'none'
            }}>✨</div>
            <div style={{
              position: 'absolute',
              bottom: '10%',
              left: '10%',
              fontSize: '1.2em',
              animation: 'sparkle 0.3s ease-in-out 0.05s',
              pointerEvents: 'none'
            }}>⭐</div>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '5%',
              fontSize: '1em',
              animation: 'sparkle 0.3s ease-in-out 0.1s',
              pointerEvents: 'none'
            }}>💫</div>
          </>
        )}

        {zone === 'ordered' && (
          <div style={{
            width: '35px',
            height: '35px',
            background: '#667eea',
            color: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1em',
            flexShrink: 0,
            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: isDragging ? 'scale(0.9)' : isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1)'
          }}>
            {index + 1}
          </div>
        )}
        <div style={{
          flex: 1,
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: isDragging ? 'scale(0.95)' : 'scale(1)'
        }}>
          {item}
        </div>
        {canRemove && (
          <div style={{
            fontSize: '1.3em',
            color: '#dc3545',
            transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: isHovered ? 'scale(1.2) rotate(90deg)' : 'scale(1)',
            opacity: isHovered ? 1 : 0.7
          }}>
            ✖️
          </div>
        )}

        {/* Drag handle indicator */}
        {zone === 'ordered' && !showFeedback && !disabled && (
          <div style={{
            position: 'absolute',
            left: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            opacity: isHovered ? 0.5 : 0.2,
            fontSize: '1.2em',
            transition: 'opacity 0.2s',
            pointerEvents: 'none'
          }}>
            ⋮⋮
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Ordered Items Zone */}
      <div style={{
        background: '#f8f9fa',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '20px',
        minHeight: '120px',
        width: '100%'
      }}>
        <h3 style={{ color: '#667eea', marginBottom: '15px', fontSize: '1.2em' }}>
          📋 Твоя послідовність:
        </h3>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            minHeight: '80px'
          }}
          data-drop-zone="ordered"
          data-index={orderedItems.length}
          onDragOver={(e) => handleDragOver(e, orderedItems.length, 'ordered')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, orderedItems.length, 'ordered')}
        >
          {orderedItems.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: '#999',
              fontSize: '1.1em',
              padding: '20px',
              border: '2px dashed #ddd',
              borderRadius: '12px',
              background: dragOverZone === 'ordered' ? 'rgba(102, 126, 234, 0.05)' : 'transparent'
            }}>
              {emptyMessage}
            </div>
          ) : (
            orderedItems.map((item, index) => {
              const isDragging = draggedItem?.zone === 'ordered' && draggedItem?.index === index;
              return renderItem(item, index, 'ordered', isDragging);
            })
          )}
        </div>
      </div>

      {/* Available Items Zone */}
      {!showFeedback && availableItems.length > 0 && (
        <div>
          <h3 style={{ color: '#667eea', marginBottom: '15px', fontSize: '1.2em', textAlign: 'center' }}>
            {promptMessage}
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px'
          }}>
            {availableItems.map((item, index) => {
              const isDragging = draggedItem?.zone === 'available' && draggedItem?.index === index;
              return renderItem(item, index, 'available', isDragging);
            })}
          </div>
        </div>
      )}
    </div>
  );
}
