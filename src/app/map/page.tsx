"use client";

import React, { useState, useRef } from 'react'
import { Map as ReactMap, Source, Layer, type MapRef } from 'react-map-gl';
import mapboxgl, { type GeoJSONFeature } from 'mapbox-gl';
import type { LayerProps } from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { getAllOrganizations } from '@/utils/organizations';
import { useQuery } from '@tanstack/react-query';
import Card from '@/components/Card';
import type { NGO } from '@/utils/types';

export default function MapPage() {
    const mapRef = useRef<MapRef | null>(null);
    const query = useQuery({ queryKey: ['organizations'], queryFn: getAllOrganizations });
    const organizations = query.data || [];

    const [popupInfo, setPopupInfo] = useState<{
        longitude: number;
        latitude: number;
        name: string;
        organization: string;
    } | null>(null);

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
        const features = e.target.queryRenderedFeatures(e.point, {
            layers: ['point']
        });
        if (!features.length) {
            return;
        }
        if (features.length > 0) {
            const feature = features[0] as GeoJSONFeature & { properties: { name: string; organization: NGO } };

            if (feature.properties?.name && feature.properties.organization) {
                setPopupInfo({
                    longitude: feature.geometry.coordinates[0],
                    latitude: feature.geometry.coordinates[1],
                    name: feature.properties.name,
                    organization: feature.properties.organization as unknown as string
                });
            } else {
                setPopupInfo(null);
            }
        } else {
            setPopupInfo(null);
        }
    };

    const points = {
        type: 'FeatureCollection',
        features: organizations.map((ngo: NGO) => {
            return {
                type: 'Feature',
                properties: {
                    name: ngo.Name,
                    organization: ngo
                },
                geometry: {
                    type: 'Point',
                    coordinates: [ngo.Longitude, ngo.Latitude],
                },
            };
        }),
    };

    const heatmapLayer: LayerProps = {
        id: 'heatmap',
        type: 'heatmap',
        paint: {
            // Make weight more granular based on point density
            'heatmap-weight': [
                'interpolate',
                ['linear'],
                ['get', 'point_count'],
                0, 0.5,
                5, 1
            ],

            // More subtle intensity scaling
            'heatmap-intensity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 0.6,
                9, 1.2
            ],

            'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0, 'rgba(227,95,93,0)',     // Transparent
                0.2, 'rgba(227,95,93,0.2)', // Very light brand color
                0.4, 'rgba(227,95,93,0.4)', // Light brand color
                0.6, 'rgba(227,95,93,0.6)', // Medium brand color
                0.8, 'rgba(227,95,93,0.8)', // Strong brand color
                1, 'rgb(227,95,93)'         // Full brand color
            ],

            // Smoother radius transitions
            'heatmap-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 4,
                9, 30
            ],

            // More gradual opacity
            'heatmap-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                6, 0.7,
                9, 1
            ]
        }
    };

    const pointLayer: LayerProps = {
        id: 'point',
        type: 'circle',
        paint: {
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                7, 0,
                8, 3,
                15, 7
            ],
            'circle-color': '#e35f5d',
            'circle-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                7, 0,
                8, 0.4,
                15, 0.8
            ],
            'circle-stroke-width': 1,
            'circle-stroke-color': '#e35f5d'
        }
    };

    return (
        <div>
            <div className='w-full flex relative'>
                <ReactMap
                    ref={mapRef}
                    initialViewState={{
                        longitude: 19.699024,
                        latitude: 48.669026,
                        zoom: 7
                    }}
                    style={{ width: '100%', height: 600 }}
                    mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_ACCESS_TOKEN}`}
                    onClick={handleMapClick}>

                    <Source id="ngo-data" type="geojson" data={points}>
                        <Layer {...heatmapLayer} />
                        <Layer {...pointLayer} />
                    </Source>
                </ReactMap>

                <div className='absolute bottom-0 right-0 mb-3 mr-3'>
                    {popupInfo && (
                        <Card title={popupInfo.name} organization={popupInfo.organization} />
                    )}
                </div>
            </div>



        </div>
    )
}