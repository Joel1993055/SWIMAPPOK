"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const zoneMethodologies = {
  "standard": {
    label: "Sistema Estándar",
    description: "Zonas tradicionales de entrenamiento de natación",
    zones: {
      Z1: "Recuperación",
      Z2: "Aeróbico Base",
      Z3: "Aeróbico Umbral",
      Z4: "VO2 Max",
      Z5: "Neuromuscular"
    }
  },
  "british-swimming": {
    label: "British Swimming",
    description: "Metodología oficial de British Swimming",
    zones: {
      Z1: "A1",
      Z2: "A2", 
      Z3: "AT",
      Z4: "VO2",
      Z5: "Speed"
    }
  },
  "urbanchek": {
    label: "Urbanchek",
    description: "Sistema de colores de Urbanchek",
    zones: {
      Z1: "Yellow",
      Z2: "White",
      Z3: "Pink/Red",
      Z4: "Blue",
      Z5: "Platinum"
    }
  },
  "olbrecht": {
    label: "Olbrecht",
    description: "Metodología de Jan Olbrecht",
    zones: {
      Z1: "AEC",
      Z2: "AEP",
      Z3: "ANC", 
      Z4: "ANP",
      Z5: "Speed"
    }
  },
  "research-based": {
    label: "Research-based Zones",
    description: "Zonas basadas en investigación científica",
    zones: {
      Z1: "Up to Lactate Threshold",
      Z2: "Up to Critical Speed",
      Z3: "Up to VO2 Max Pace",
      Z4: "Up to Maximum Speed",
      Z5: "Maximum Speed"
    }
  }
};

type ZoneMethodologyKey = keyof typeof zoneMethodologies;

interface TrainingZonesContextType {
  selectedMethodology: ZoneMethodologyKey;
  currentZones: typeof zoneMethodologies.standard.zones;
  methodologies: typeof zoneMethodologies;
  setMethodology: (methodology: ZoneMethodologyKey) => void;
  updateZones: (zones: typeof zoneMethodologies.standard.zones) => void;
}

const TrainingZonesContext = createContext<TrainingZonesContextType | undefined>(undefined);

export function TrainingZonesProvider({ children }: { children: React.ReactNode }) {
  const [selectedMethodology, setSelectedMethodology] = useState<ZoneMethodologyKey>("standard");
  const [currentZones, setCurrentZones] = useState(zoneMethodologies.standard.zones);

  // Cargar configuración guardada al inicializar
  useEffect(() => {
    const savedMethodology = localStorage.getItem('training-zones-methodology') as ZoneMethodologyKey;
    const savedZones = localStorage.getItem('training-zones-custom');
    
    if (savedMethodology && zoneMethodologies[savedMethodology]) {
      setSelectedMethodology(savedMethodology);
      setCurrentZones(zoneMethodologies[savedMethodology].zones);
    }
    
    if (savedZones) {
      try {
        const customZones = JSON.parse(savedZones);
        setCurrentZones(customZones);
      } catch (error) {
        console.error('Error parsing saved zones:', error);
      }
    }
  }, []);

  const setMethodology = (methodology: ZoneMethodologyKey) => {
    setSelectedMethodology(methodology);
    setCurrentZones(zoneMethodologies[methodology].zones);
    
    // Guardar en localStorage
    localStorage.setItem('training-zones-methodology', methodology);
    localStorage.removeItem('training-zones-custom'); // Limpiar zonas personalizadas
  };

  const updateZones = (zones: typeof zoneMethodologies.standard.zones) => {
    setCurrentZones(zones);
    
    // Guardar como zonas personalizadas
    localStorage.setItem('training-zones-custom', JSON.stringify(zones));
    localStorage.setItem('training-zones-methodology', 'custom');
  };

  return (
    <TrainingZonesContext.Provider 
      value={{
        selectedMethodology,
        currentZones,
        methodologies: zoneMethodologies,
        setMethodology,
        updateZones
      }}
    >
      {children}
    </TrainingZonesContext.Provider>
  );
}

export function useTrainingZones() {
  const context = useContext(TrainingZonesContext);
  if (context === undefined) {
    throw new Error('useTrainingZones must be used within a TrainingZonesProvider');
  }
  return context;
}
