import { useMemo, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import styles from './VirtualizedCompactTokenDisplay.module.css'

interface TokenItem {
  id: number
  tokenId: number
  color: string
  text: string
}

interface VirtualizedCompactTokenDisplayProps {
  items: TokenItem[]
  containerHeight: number
  tokensPerRow: number
  itemWidth: number
  itemHeight: number
  gap: number
}

export function VirtualizedCompactTokenDisplay({
  items,
  containerHeight,
  tokensPerRow,
  itemWidth,
  itemHeight,
  gap
}: VirtualizedCompactTokenDisplayProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const rowCount = Math.ceil(items.length / tokensPerRow)

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight + gap,
    overscan: 3,
  })

  const virtualRows = rowVirtualizer.getVirtualItems()

  const visibleItems = useMemo(() => {
    const result: Array<{
      token: TokenItem
      virtualRow: any
      colIndex: number
    }> = []

    virtualRows.forEach(virtualRow => {
      const startIndex = virtualRow.index * tokensPerRow
      const endIndex = Math.min(startIndex + tokensPerRow, items.length)

      for (let i = startIndex; i < endIndex; i++) {
        result.push({
          token: items[i],
          virtualRow,
          colIndex: i - startIndex
        })
      }
    })

    return result
  }, [virtualRows, items, tokensPerRow])

  return (
    <div className={styles.virtualCompactContainer}>
      <div
        className={styles.scrollContainer}
        style={{ height: containerHeight }}
        ref={parentRef}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {visibleItems.map(({ token, virtualRow, colIndex }) => (
            <div
              key={token.id}
              className={styles.compactToken}
              style={{
                position: 'absolute',
                top: virtualRow.start,
                left: colIndex * (itemWidth + gap),
                width: itemWidth,
                height: itemHeight,
                backgroundColor: token.color + '20',
                borderColor: token.color
              }}
              title={`Token ${token.id + 1}: ${token.tokenId}`}
            >
              {token.tokenId}
            </div>
          ))}
        </div>
      </div>

      {items.length > 0 && (
        <div className={styles.scrollIndicator}>
          {virtualRows[0]?.index * tokensPerRow + 1 || 0}-
          {Math.min(
            (virtualRows[virtualRows.length - 1]?.index + 1) * tokensPerRow,
            items.length
          )} of {items.length} tokens
        </div>
      )}
    </div>
  )
}