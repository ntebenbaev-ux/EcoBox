import { useMemo } from 'react';

interface QrCodeMatrixProps {
  value: string;
  size?: number;
}

function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function isFinderModule(r: number, c: number, gridSize: number): boolean {
  const inTopLeft = r < 7 && c < 7;
  const inTopRight = r < 7 && c >= gridSize - 7;
  const inBottomLeft = r >= gridSize - 7 && c < 7;
  return inTopLeft || inTopRight || inBottomLeft;
}

function getFinderFill(r: number, c: number): boolean {
  if (r === 0 || r === 6 || c === 0 || c === 6) return true;
  if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
  return false;
}

export function QrCodeMatrix({ value, size = 196 }: QrCodeMatrixProps) {
  const gridSize = 21;

  const cells = useMemo(() => {
    const matrix: boolean[][] = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => false)
    );

    let seed = hashString(value || 'ECOBOX-TOMIRIS');

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (r < 7 && c < 7) {
          matrix[r][c] = getFinderFill(r, c);
        } else if (r < 7 && c >= gridSize - 7) {
          matrix[r][c] = getFinderFill(r, c - (gridSize - 7));
        } else if (r >= gridSize - 7 && c < 7) {
          matrix[r][c] = getFinderFill(r - (gridSize - 7), c);
        } else if (
          (r === 7 && c < 8) ||
          (c === 7 && r < 8) ||
          (r === 7 && c >= gridSize - 8) ||
          (c === gridSize - 8 && r < 8) ||
          (r === gridSize - 8 && c < 8) ||
          (c === 7 && r >= gridSize - 8)
        ) {
          matrix[r][c] = false;
        } else if (r === 6 || c === 6) {
          matrix[r][c] = (r + c) % 2 === 0;
        } else if (!isFinderModule(r, c, gridSize)) {
          seed = (seed * 1664525 + 1013904223) >>> 0;
          matrix[r][c] = ((seed >>> 24) & 1) === 1;
        }
      }
    }

    return matrix;
  }, [value]);

  return (
    <div className="inline-flex p-3.5 bg-white rounded-[16px] shadow-sm border border-[#E5EFE9]">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${gridSize} ${gridSize}`}
        role="img"
        aria-label={`QR-код ${value}`}
        className="block"
      >
        <rect width={gridSize} height={gridSize} fill="#FFFFFF" />
        {cells.map((row, r) =>
          row.map((filled, c) =>
            filled ? (
              <rect
                key={`${r}-${c}`}
                x={c + 0.06}
                y={r + 0.06}
                width={0.88}
                height={0.88}
                rx={0.18}
                fill="#1D2D3A"
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
}
