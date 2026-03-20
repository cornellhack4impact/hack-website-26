import React, { useEffect, useRef, useState, useMemo } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import { getSolidColorTexture, LAND_COLOR, WATER_COLOR, LAND_SIDE_COLOR } from '../utils/colorUtils';

// Hub - assigned White to stand out
const ITHACA = {
  lat: 42.4440,
  lng: -76.5019,
  label: "Cornell University",
  color: "#FFFFFF"
};

// Destinations with specific distinct colors
const DESTINATIONS = [
  { lat: -9.1900, lng: -75.0152, label: "Peru", color: "#FF6B6B" },      // Pastel Red
  { lat: 39.5501, lng: -105.7821, label: "Colorado", color: "#FECA57" }, // Pastel Yellow
  { lat: 7.9465, lng: -1.0232, label: "Ghana", color: "#FF9FF3" },       // Pastel Pink
  { lat: 9.0820, lng: 8.6753, label: "Nigeria", color: "#A55EEA" },      // Purple
  { lat: 46.8625, lng: 103.8467, label: "Mongolia", color: "#00D2D3" }   // Cyan
];

// Combine all points for markers (rings/labels)
const MARKERS = [ITHACA, ...DESTINATIONS];

// Create connections from Ithaca to destinations with gradients
const CONNECTIONS = DESTINATIONS.map(dest => ({
  startLat: ITHACA.lat,
  startLng: ITHACA.lng,
  endLat: dest.lat,
  endLng: dest.lng,
  // Gradient from source color to destination color
  color: [ITHACA.color, dest.color]
}));

interface CustomGlobeProps {
  scrollProgress?: number;
}

const CustomGlobe: React.FC<CustomGlobeProps> = ({ scrollProgress = 0 }) => {
  const START_ALTITUDE = 1.65;
  const END_ALTITUDE = 2.3;
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const [countries, setCountries] = useState<any>({ features: [] });
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1000);
  const [height, setHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);

  // Generate the solid blue water texture
  const waterTexture = useMemo(() => getSolidColorTexture(WATER_COLOR), []);

  // Fetch GeoJSON data for land polygons
  useEffect(() => {
    // Standard reliable GeoJSON source for world countries
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch((err) => console.error('Failed to load globe data', err));

    // Resize handler
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initial Position
  useEffect(() => {
    if (globeEl.current) {
      // Point camera at North America/Ithaca on load
      // Higher altitude prevents arc clipping when the globe is lowered.
      globeEl.current.pointOfView({ lat: 40, lng: -75, altitude: START_ALTITUDE });
    }
  }, []);

  // Update Altitude based on scroll
  useEffect(() => {
    if (globeEl.current) {
      // Start at 1.65, zoom out to 2.3
      const targetAltitude = START_ALTITUDE + scrollProgress * (END_ALTITUDE - START_ALTITUDE);
      globeEl.current.pointOfView({ altitude: targetAltitude }, 0);
    }
  }, [scrollProgress]);

  // Handle auto-rotation, disable zoom, and route wheel events to page scroll
  useEffect(() => {
    if (!globeEl.current) return;

    const controls = globeEl.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    controls.enableZoom = false; // Explicitly disable zoom on the controls object

    // Intercept wheel events on the canvas in the capture phase so they
    // scroll the page instead of being consumed by OrbitControls.
    const renderer = globeEl.current.renderer();
    const canvas = renderer.domElement;

    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation(); // Prevent OrbitControls from seeing the event
      window.scrollBy(0, e.deltaY);
    };

    canvas.addEventListener('wheel', handleWheel, true); // capture = true

    return () => {
      canvas.removeEventListener('wheel', handleWheel, true);
    };
  }, []);

  return (
    <div className="cursor-move">
      <Globe
        ref={globeEl}
        width={width}
        height={height}
        backgroundColor="rgba(0,0,0,0)" // Let the shared hero background show through
        globeImageUrl={waterTexture} // The sphere itself acts as the water
        enableZoom={false} // Disable zoom to allow page scrolling
        
        // Land Configuration
        polygonsData={countries.features}
        polygonCapColor={() => LAND_COLOR}
        polygonSideColor={() => LAND_SIDE_COLOR}
        polygonStrokeColor={() => 'rgba(255, 255, 255, 0.1)'} // Subtle border
        polygonAltitude={0.015} // Slight extrusion for depth
        
        // Atmosphere Configuration.
        showAtmosphere={true}
        atmosphereColor="#dbeafe"
        atmosphereAltitude={0.15}
        
        // Arcs (Connections)
        arcsData={CONNECTIONS}
        arcColor="color" // Use the gradient color array from data
        arcDashLength={0.4}
        arcDashGap={2}
        arcDashInitialGap={1}
        arcDashAnimateTime={2000}
        arcStroke={0.5}

        // Highlights (Markers)
        ringsData={MARKERS}
        ringColor={(d: any) => d.color}
        // Make Ithaca's ring much larger (8) compared to destinations (3)
        ringMaxRadius={(d: any) => d.label === "Cornell University" ? 8 : 3}
        ringPropagationSpeed={4}
        ringRepeatPeriod={800} // Fast blink/pulse
        
        labelsData={MARKERS}
        labelLat={(d: any) => d.lat}
        labelLng={(d: any) => d.lng}
        labelText={(d: any) => d.label}
        labelColor={() => '#FFFFFF'}
        // Make Ithaca's label larger
        labelSize={(d: any) => d.label === "Cornell University" ? 2.5 : 1.5}
        labelDotRadius={0.6}
        labelResolution={2}
        labelAltitude={0.02}
      />
    </div>
  );
};

export default CustomGlobe;
