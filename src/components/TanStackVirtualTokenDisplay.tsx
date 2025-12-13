import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import styles from './TanStackVirtualTokenDisplay.module.css'

interface TokenItem {
  id: number
  tokenId: number
  color: string
  text: string
}

interface TanStackVirtualTokenDisplayProps {
  items: TokenItem[]
  containerHeight: number
  estimatedItemHeight: number
}

export function TanStackVirtualTokenDisplay({
  items,
  containerHeight,
  estimatedItemHeight
}: TanStackVirtualTokenDisplayProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimatedItemHeight,
    overscan: 5,
  })

  return (
    <div className={styles.virtualContainer}>
      <div
        ref={parentRef}
        className={styles.scrollContainer}
        style={{ height: containerHeight }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const item = items[virtualItem.index]
            return (
              <div
                key={virtualItem.key}
                className={styles.tokenItem}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <span
                  className={styles.token}
                  style={{
                    backgroundColor: item.color + '20',
                    borderColor: item.color
                  }}
                >
                  <span className={styles.tokenId}>{item.tokenId}</span>
                  <span className={styles.tokenText}>{item.text}</span>
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {items.length > 0 && (
        <div className={styles.scrollIndicator}>
          {rowVirtualizer.getVirtualItems()[0]?.index + 1 || 0}-
          {Math.min(
            rowVirtualizer.getVirtualItems()[rowVirtualizer.getVirtualItems().length - 1]?.index + 1 || 0,
            items.length
          )} of {items.length} tokens
        </div>
      )}
    </div>
  )
}