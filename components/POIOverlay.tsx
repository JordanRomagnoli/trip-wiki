"use client";

import { useState } from "react";
import { POI } from "@/lib/types";
import { calculateDistance } from "@/lib/utils";
import MapsLogo from "./MapsLogo";

interface POIOverlayProps {
    selectedPois: POI[];
    onReset: () => void;
    userLocation?: [number, number] | null;
    roadDistance?: number;
    visitedPois?: string[];
    onToggleVisited?: (poiId: string) => void;
}

export default function POIOverlay({
    selectedPois,
    onReset,
    userLocation = null,
    roadDistance,
    visitedPois = [],
    onToggleVisited,
}: POIOverlayProps) {
    const currentPoi = selectedPois[selectedPois.length - 1];
    const isVisited = visitedPois.includes(currentPoi.id);

    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        try {
            const shareUrl = `${window.location.origin}${window.location.pathname}?poi=${currentPoi.id}`;
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    let distance: string | null = null;
    let distanceLabel = "Distanza";

    if (roadDistance !== undefined) {
        distance = roadDistance.toFixed(2);
        distanceLabel = "Percorso stradale";
    } else if (selectedPois.length === 2) {
        distance = calculateDistance(
            selectedPois[0].coordinates[0],
            selectedPois[0].coordinates[1],
            selectedPois[1].coordinates[0],
            selectedPois[1].coordinates[1],
        ).toFixed(2);
        distanceLabel = "Tra i punti";
    } else if (selectedPois.length === 1 && userLocation) {
        distance = calculateDistance(
            userLocation[0],
            userLocation[1],
            selectedPois[0].coordinates[0],
            selectedPois[0].coordinates[1],
        ).toFixed(2);
        distanceLabel = "Dalla tua posizione";
    }

    const openInMaps = () => {
        const url = `https://www.google.com/maps/search/?api=1&query=${currentPoi.coordinates[0]},${currentPoi.coordinates[1]}`;
        window.open(url, "_blank");
    };

    if (selectedPois.length === 0) return null;

    return (
        <div className="fixed bottom-6 left-4 right-4 z-[1000] flex flex-col items-center pointer-events-none">
            {/* POI Info Card */}
            {selectedPois.length > 0 && (
                <div className="p-5 w-full max-w-md bg-background/95 backdrop-blur-2xl rounded-[32px] shadow-high pointer-events-auto border border-outline animate-in slide-in-from-bottom-8 duration-500 min-h-[140px] flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-4 mb-auto">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 justify-between">
                                <span className="text-[10px] font-bold text-primary tracking-widest uppercase block">
                                    Punto Selezionato
                                </span>
                                {onToggleVisited &&
                                    selectedPois.length === 1 && (
                                        <button
                                            onClick={() =>
                                                onToggleVisited(currentPoi.id)
                                            }
                                            className={`border p-1 rounded-full transition-all active:scale-90 ${
                                                isVisited
                                                    ? "bg-green-500/20 text-green-400 border-green-400"
                                                    : "bg-white/5 text-[#ccff00] border-[#ccff00]"
                                            }`}
                                        >
                                            <svg
                                                className="w-3.5 h-3.5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={3}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </button>
                                    )}
                            </div>
                            <h2 className="text-xl font-bold text-foreground tracking-tight leading-tight">
                                {currentPoi.name}
                            </h2>
                            {currentPoi.description && (
                                <p className="text-xs text-tertiary mt-1.5 leading-relaxed">
                                    {currentPoi.description}
                                </p>
                            )}
                        </div>

                        {distance && (
                            <div className="text-right shrink-0">
                                <div className="text-2xl font-bold text-foreground font-mono leading-none">
                                    {distance}{" "}
                                    <span className="text-sm font-medium opacity-60">
                                        km
                                    </span>
                                </div>
                                <span className="text-[10px] text-primary/70 font-bold uppercase tracking-wider">
                                    {distanceLabel}
                                </span>
                            </div>
                        )}
                    </div>

                    {selectedPois.length === 1 ? (
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={onReset}
                                className="flex-1 py-3.5 px-4 bg-white/5 hover:bg-white/10 text-foreground/80 text-xs font-bold tracking-widest uppercase rounded-2xl border border-outline transition-all active:scale-[0.98]"
                            >
                                Annulla
                            </button>

                            <button
                                onClick={openInMaps}
                                className="flex-1 py-3.5 px-4 bg-[#ccff00]/10 border border-primary text-foreground flex items-center justify-center gap-2 rounded-2xl shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:brightness-110 active:scale-[0.98] transition-all"
                                title="Apri in Google Maps"
                            >
                                <MapsLogo className="w-5 h-5" />
                            </button>

                            <button
                                onClick={handleShare}
                                className={`py-3.5 px-3.5 border text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 rounded-2xl transition-all active:scale-[0.98] ${
                                    copied
                                        ? "bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                        : "bg-white/5 hover:bg-white/10 border-outline text-foreground hover:border-foreground/30"
                                }`}
                            >
                                {copied ? (
                                    <>
                                        <svg
                                            className="w-4 h-4 shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2.5}
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4.5 12.75l6 6 9-13.5"
                                            />
                                        </svg>
                                        {/*<span>Copiato</span>*/}
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            className="w-4 h-4 shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h10a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                                            />
                                        </svg>
                                        {/*<span>Condividi</span>*/}
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={onReset}
                            className="w-full mt-6 py-3.5 px-4 bg-[#ccff00]/10 border border-primary text-foreground text-xs font-bold tracking-widest uppercase rounded-2xl shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:brightness-110 active:scale-[0.98] transition-all"
                        >
                            Calcola una nuova Distanza
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
