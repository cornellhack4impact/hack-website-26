import React, { useEffect, useRef, useState, useCallback, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import * as pdfjsLib from 'pdfjs-dist';
import { ChevronLeft, ChevronRight } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface PageProps {
  pageUrl: string;
  pageNumber: number;
}

const Page = forwardRef<HTMLDivElement, PageProps>(({ pageUrl, pageNumber }, ref) => (
  <div ref={ref} className="page-content" style={{ background: '#fff' }}>
    {pageUrl ? (
      <img
        src={pageUrl}
        alt={`Page ${pageNumber}`}
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
      />
    ) : (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
        Loading...
      </div>
    )}
  </div>
));

Page.displayName = 'Page';

interface FlipBookProps {
  pdfUrl: string;
}

const FlipBook: React.FC<FlipBookProps> = ({ pdfUrl }) => {
  const [pages, setPages] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 400, height: 560 });
  const bookRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateDimensions = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let w: number, h: number;

    if (vw < 640) {
      // Mobile: single page view, use most of the width
      w = Math.min(vw - 48, 360);
      h = w * 1.4;
    } else if (vw < 1024) {
      w = Math.min(vw * 0.35, 380);
      h = Math.min(w * 1.4, vh * 0.65);
      w = h / 1.4;
    } else {
      w = Math.min(vw * 0.28, 440);
      h = Math.min(w * 1.4, vh * 0.68);
      w = h / 1.4;
    }

    setDimensions({ width: Math.round(w), height: Math.round(h) });
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  useEffect(() => {
    let cancelled = false;

    const renderPdf = async () => {
      const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
      const numPages = pdf.numPages;
      if (cancelled) return;
      setTotalPages(numPages);

      const rendered: string[] = new Array(numPages).fill('');
      setPages([...rendered]);

      // Render pages in batches for performance
      for (let i = 1; i <= numPages; i++) {
        if (cancelled) return;
        const page = await pdf.getPage(i);
        const scale = 2;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
        rendered[i - 1] = canvas.toDataURL('image/jpeg', 0.85);
        setPages([...rendered]);
      }
    };

    renderPdf();
    return () => { cancelled = true; };
  }, [pdfUrl]);

  const flipPrev = () => bookRef.current?.pageFlip()?.flipPrev();
  const flipNext = () => bookRef.current?.pageFlip()?.flipNext();

  const onFlip = useCallback((e: any) => {
    setCurrentPage(e.data);
  }, []);

  if (pages.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height: dimensions.height }}>
        <div className="text-slate-400 text-lg">Loading report...</div>
      </div>
    );
  }

  const isMobile = window.innerWidth < 640;
  const displayPage = isMobile ? currentPage + 1 : Math.min(currentPage + 2, totalPages);

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-6">
      <div className="relative flex items-center gap-2 md:gap-4">
        {/* Previous button */}
        <button
          onClick={flipPrev}
          className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border border-slate-300 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-default"
          disabled={currentPage === 0}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Book */}
        <div
          className="book-shadow rounded-sm overflow-hidden"
          style={{ perspective: '2500px' }}
        >
          {/* @ts-ignore - react-pageflip types */}
          <HTMLFlipBook
            ref={bookRef}
            width={dimensions.width}
            height={dimensions.height}
            size="fixed"
            minWidth={200}
            maxWidth={500}
            minHeight={280}
            maxHeight={700}
            showCover={true}
            mobileScrollSupport={false}
            onFlip={onFlip}
            className="flip-book"
            startPage={0}
            drawShadow={true}
            flippingTime={600}
            usePortrait={isMobile}
            startZIndex={0}
            autoSize={false}
            maxShadowOpacity={0.4}
            showPageCorners={true}
            disableFlipByClick={false}
            useMouseEvents={true}
            swipeDistance={30}
            clickEventForward={false}
            style={{}}
          >
            {pages.map((url, i) => (
              <Page key={i} pageUrl={url} pageNumber={i + 1} />
            ))}
          </HTMLFlipBook>
        </div>

        {/* Next button */}
        <button
          onClick={flipNext}
          className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border border-slate-300 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-default"
          disabled={currentPage >= totalPages - 1}
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Page indicator */}
      <div className="text-slate-400 text-sm font-light tracking-wide">
        {currentPage + 1}{!isMobile && currentPage + 1 < totalPages ? `–${displayPage}` : ''} of {totalPages}
      </div>
    </div>
  );
};

export default FlipBook;
