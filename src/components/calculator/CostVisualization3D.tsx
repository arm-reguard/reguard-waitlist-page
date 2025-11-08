"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import type { CalculatedModel } from '@/lib/calculator-utils';

interface CostVisualization3DProps {
  data: CalculatedModel[];
}

interface GraphNode {
  id: string;
  name: string;
  provider: string;
  cost: number;
  inputCost: number;
  outputCost: number;
  size: number;
  color: string;
  x: number;
  y: number;
  z: number;
  fx?: number;
  fy?: number;
  fz?: number;
}

const PROVIDER_COLORS: Record<string, string> = {
  'OpenAI': '#10B981',
  'Anthropic': '#EF4444',
  'Google': '#3B82F6',
  'Mistral': '#F97316',
  'Groq': '#EF4444',
  'Together AI': '#8B5CF6',
  'Cohere': '#6B7280',
};

const MAX_NODES = 30;

export function CostVisualization3D({ data }: CostVisualization3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Calculate node size (logarithmic scale)
  const calculateNodeSize = useCallback((cost: number, allCosts: number[]) => {
    const minCost = Math.min(...allCosts);
    const maxCost = Math.max(...allCosts);
    const minSize = 1;
    const maxSize = 5;
    
    const normalized = (Math.log10(cost + 1) - Math.log10(minCost + 1)) /
                       (Math.log10(maxCost + 1) - Math.log10(minCost + 1));
    
    return minSize + normalized * (maxSize - minSize);
  }, []);

  // Calculate node position with natural spread (like GitHub example)
  const calculatePosition = useCallback((
    model: CalculatedModel,
    index: number,
    providerGroups: Record<string, CalculatedModel[]>
  ) => {
    const providers = Object.keys(providerGroups);
    const providerIndex = providers.indexOf(model.provider);
    const modelsInProvider = providerGroups[model.provider].length;
    const indexInProvider = providerGroups[model.provider].indexOf(model);
    
    // Natural, evenly distributed spread
    return {
      x: (Math.log10(model.totalCost + 1) * 30) - 20, // Centered distribution
      y: (providerIndex * 25) - (providers.length * 12.5), // Center Y axis
      z: (indexInProvider - modelsInProvider / 2) * 15 // Moderate Z spread
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;
    let animationId: number | null = null;
    let graph: any = null;

    const init = async () => {
      try {
        // Dynamically import 3d-force-graph only on client side
        const ForceGraph3D = (await import('3d-force-graph')).default;
        
        if (cancelled || !containerRef.current) return;

        // Prepare data
        const sortedData = [...data]
          .sort((a, b) => b.totalCost - a.totalCost)
          .slice(0, MAX_NODES);

        const providerGroups = sortedData.reduce((acc, model) => {
          const provider = model.provider;
          if (!acc[provider]) acc[provider] = [];
          acc[provider].push(model);
          return acc;
        }, {} as Record<string, CalculatedModel[]>);

        const allCosts = sortedData.map(m => m.totalCost);

        const nodes: GraphNode[] = sortedData.map((model, index) => {
          const position = calculatePosition(model, index, providerGroups);
          const size = calculateNodeSize(model.totalCost, allCosts);
          
          return {
            id: model.id,
            name: model.name,
            provider: model.provider,
            cost: model.totalCost,
            inputCost: model.inputCostPerMillion,
            outputCost: model.outputCostPerMillion,
            size,
            color: PROVIDER_COLORS[model.provider] || '#6B7280',
            x: position.x,
            y: position.y,
            z: position.z,
            fx: position.x,
            fy: position.y,
            fz: position.z,
          };
        });

        const graphData = { nodes, links: [] };

        // Initialize graph with explicit dimensions
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        
        // @ts-ignore - ForceGraph3D typing issue with double function call
        graph = ForceGraph3D()(containerRef.current)
          .width(width)
          .height(height)
          .graphData(graphData)
          .backgroundColor('#0a0a0a')
          .nodeId('id')
          .nodeVal('size')
          .nodeColor('color')
          .nodeOpacity(0.9)
          .linkOpacity(0)
          .enableNodeDrag(false)
          .enableNavigationControls(true)
          .showNavInfo(false)
          .nodeThreeObject((node: any) => {
            const typedNode = node as GraphNode;
            
            // High-quality sphere with more segments for smoothness
            const sphere = new THREE.Mesh(
              new THREE.SphereGeometry(typedNode.size, 32, 32), // Increased from 16 to 32
              new THREE.MeshLambertMaterial({
                color: typedNode.color,
                emissive: typedNode.color,
                emissiveIntensity: 0.4, // Slightly more glow
              })
            );
            
            // Enhanced outer glow
            const glow = new THREE.Mesh(
              new THREE.SphereGeometry(typedNode.size * 1.3, 16, 16), // Slightly larger glow
              new THREE.MeshBasicMaterial({
                color: typedNode.color,
                transparent: true,
                opacity: 0.25, // More visible glow
              })
            );
            
            const group = new THREE.Group();
            group.add(sphere);
            group.add(glow);
            
            return group;
          })
          .onNodeHover((node: any) => {
            if (node) {
              setHoveredNode(node as GraphNode);
              if (containerRef.current) {
                containerRef.current.style.cursor = 'pointer';
              }
            } else {
              setHoveredNode(null);
              if (containerRef.current) {
                containerRef.current.style.cursor = 'default';
              }
            }
          })
          .onNodeClick((node: any) => {
            console.log('Clicked node:', node);
          });

        // Stop physics simulation
        graph
          .d3AlphaDecay(1)
          .d3VelocityDecay(1)
          .d3Force('link', null)
          .d3Force('charge', null)
          .d3Force('center', null);

        // Camera setup (wider view to see all spheres)
        const camera = graph.camera();
        camera.position.set(200, 80, 200);
        camera.lookAt(0, 0, 0);
        camera.fov = 60; // Wider field of view

        // Lighting (enhanced for better sphere visibility)
        const scene = graph.scene();
        scene.add(new THREE.AmbientLight(0xffffff, 0.7));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
        dirLight.position.set(100, 100, 100);
        scene.add(dirLight);

        // Add subtle fill light from opposite side
        const fillLight = new THREE.DirectionalLight(0x6366f1, 0.3); // Purple tint
        fillLight.position.set(-100, 50, -100);
        scene.add(fillLight);

        // Auto-rotation (extremely slow, barely noticeable) - only when not interacting
        let angle = Math.atan2(camera.position.x, camera.position.z);
        const rotateSpeed = 0.00005; // Much slower
        let lastCameraPosition = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
        
        const animate = () => {
          if (cancelled) return;
          
          // Check if user has moved the camera
          const cameraMoved = 
            Math.abs(camera.position.x - lastCameraPosition.x) > 0.1 ||
            Math.abs(camera.position.y - lastCameraPosition.y) > 0.1 ||
            Math.abs(camera.position.z - lastCameraPosition.z) > 0.1;
          
          if (cameraMoved) {
            // User is interacting, update angle to current position
            angle = Math.atan2(camera.position.x, camera.position.z);
            lastCameraPosition = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
          } else {
            // No user interaction, apply gentle auto-rotation
            angle += rotateSpeed;
            const distance = Math.sqrt(camera.position.x * camera.position.x + camera.position.z * camera.position.z);
            camera.position.x = distance * Math.sin(angle);
            camera.position.z = distance * Math.cos(angle);
            camera.lookAt(0, 0, 0);
            lastCameraPosition = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
          }
          
          animationId = requestAnimationFrame(animate);
        };
        
        animate();

        graphRef.current = graph;

        // Mouse move handler
        const handleMouseMove = (event: MouseEvent) => {
          setTooltipPos({
            x: event.clientX,
            y: event.clientY
          });
        };

        // Window resize handler
        const handleResize = () => {
          if (containerRef.current && graph) {
            const newWidth = containerRef.current.clientWidth;
            const newHeight = containerRef.current.clientHeight;
            graph.width(newWidth).height(newHeight);
          }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        // Store cleanup reference
        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('resize', handleResize);
        };
      } catch (error) {
        console.error('Error initializing 3D graph:', error);
      }
    };

    init();

    // Cleanup
    return () => {
      cancelled = true;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (graphRef.current) {
        try {
          graphRef.current._destructor();
        } catch (e) {
          console.error('Error cleaning up graph:', e);
        }
      }
    };
  }, [data, calculateNodeSize, calculatePosition]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Hover Tooltip */}
      {hoveredNode && (
        <div
          className="fixed bg-zinc-900/95 backdrop-blur-sm border border-purple-500/30 rounded-lg p-3 pointer-events-none shadow-xl z-50"
          style={{
            left: tooltipPos.x + 15,
            top: tooltipPos.y + 15,
            transform: 'translate(0, -50%)'
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: hoveredNode.color }}
            />
            <span className="text-white font-semibold">{hoveredNode.provider}</span>
          </div>
          <div className="text-gray-300 font-medium mb-2">{hoveredNode.name}</div>
          <div className="border-t border-gray-700 pt-2 space-y-1">
            <div className="flex items-center gap-2 text-green-400">
              <span>💰</span>
              <span className="font-bold">${hoveredNode.cost.toFixed(2)}/month</span>
            </div>
            <div className="text-xs text-gray-400">
              <span>📊 ${hoveredNode.inputCost.toFixed(2)} in / ${hoveredNode.outputCost.toFixed(2)} out</span>
            </div>
          </div>
        </div>
      )}

      {/* Provider Legend - Mobile: Top right, Desktop: Top center */}
      <div className="absolute top-2 right-2 sm:top-4 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto flex flex-wrap items-start sm:items-center justify-end sm:justify-center gap-1.5 sm:gap-3 z-10 max-w-[45%] sm:max-w-none">
        {Object.entries(PROVIDER_COLORS).map(([provider, color]) => (
          <div key={provider} className="flex items-center gap-1">
            <div
              className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-[9px] sm:text-[11px] text-zinc-300 whitespace-nowrap">{provider}</span>
          </div>
        ))}
      </div>

      {/* Instructions Overlay - Bottom Left, minimal styling */}
      <div className="absolute bottom-2 left-2 text-[8px] sm:text-[10px] text-gray-500 z-10 hidden sm:block">
        Left-click: rotate, Mouse-wheel/middle-click: zoom, Right-click: pan
      </div>

      {/* Data Limit Notice - Small, compact, top-left */}
      {data.length > MAX_NODES && (
        <div className="absolute top-2 left-2 text-[10px] text-yellow-500 z-10">
          Showing top {MAX_NODES} models by cost. {data.length - MAX_NODES} hidden.
        </div>
      )}
    </div>
  );
}

