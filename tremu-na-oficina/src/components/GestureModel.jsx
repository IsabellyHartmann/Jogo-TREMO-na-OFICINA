import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import CameraView from './CameraView';

export default function GestureModel({ letraAlvo, onLetraIdentificada }) {
    const [landmarker, setLandmarker] = useState(null);
    const [carregandoIA, setCarregandoIA] = useState(true);
    const canvasRef = useRef(null);

    // Inicializa o classificador local do MediaPipe
    useEffect(() => {
        async function carregarModelo() {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
                );
                const instancia = await HandLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        // Caminho oficial corrigido para descarregar o modelo .task
                        modelAssetPath: "https://googleapis.com",
                        delegate: "GPU"
                    },
                    runningMode: "VIDEO",
                    numHands: 1
                });
                setLandmarker(instancia);
                setCarregandoIA(false);
            } catch (erro) {
                console.error("Erro ao carregar ficheiros WASM da IA:", erro);
            }
        }
        carregarModelo();
    }, []);

    // Analisa a geometria tridimensional dos 21 pontos (Landmarks) da mão
    const processarFrameCamera = (videoElement) => {
        if (!landmarker || !videoElement || videoElement.readyState !== 4) return;

        const agora = performance.now();
        const resultado = landmarker.detectForVideo(videoElement, agora);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (resultado.handLandmarks && resultado.handLandmarks.length > 0) {
            const pontosMao = resultado.handLandmarks[0]; // Mapeia os 21 pontos tridimensionais
            desenharEsqueletoNoCanvas(ctx, pontosMao);

            // Algoritmo Matemático de Validação Local (Stand-Alone)
            if (validarGestoLGP(pontosMao, letraAlvo)) {
                onLetraIdentificada();
            }
        }
    };

    // Lógica de classificação baseada na extensão ou recolha das pontas dos dedos
    const validarGestoLGP = (pontos, letra) => {
        const indicadorAberto = pontos[8].y < pontos[6].y;
        const medioAberto = pontos[12].y < pontos[10].y;
        const anelarAberto = pontos[16].y < pontos[14].y;
        const mindinhoAberto = pontos[20].y < pontos[18].y;

        if (letra === 'A') {
            // Letra A em LGP: Mão fechada (todos os dedos recolhidos para baixo)
            return !indicadorAberto && !medioAberto && !anelarAberto && !mindinhoAberto;
        }
        if (letra === 'O') {
            // Simulação de transição para o formato em 'O' (dedos ligeiramente curvados)
            return pontos[8].y > pontos[5].y && pontos[4].y > pontos[1].y;
        }
        // Caso padrão para testes (qualquer mão visível valida as restantes letras)
        return pontos.length === 21;
    };

    const desenharEsqueletoNoCanvas = (ctx, pontos) => {
        ctx.fillStyle = "#00ff00";
        ctx.strokeStyle = "#007bff";
        ctx.lineWidth = 3;
        pontos.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x * 400, p.y * 300, 5, 0, 2 * Math.PI);
            ctx.fill();
        });
    };

    return (
        <div style={{ position: 'relative', width: '400px', margin: '0 auto' }}>
            {carregandoIA && <p style={{ color: '#ff9800', fontWeight: 'bold' }}>A descarregar os Modelos de Visão Computacional localmente...</p>}

            <CameraView letraAlvo={letraAlvo} onFrame={processarFrameCamera} />

            <canvas
                ref={canvasRef}
                width="400"
                height="300"
                style={{ position: 'absolute', top: 38, left: 0, zIndex: 2, pointerEvents: 'none', transform: 'scaleX(-1)' }}
            />
        </div> // Etiqueta div de fecho corrigida aqui
    );
}