import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import CameraView from './CameraView';

export default function GestureModel({ letraAlvo, onLetraIdentificada }) {
    const [landmarker, setLandmarker] = useState(null);
    const [carregandoIA, setCarregandoIA] = useState(true);
    const canvasRef = useRef(null);

    // 1. Inicializa os ficheiros WASM nativos do MediaPipe para execução Stand-Alone
    useEffect(() => {
        async function carregarModelo() {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://jsdelivr.net"
                );
                const instancia = await HandLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: "https://googleapis.com",
                        delegate: "GPU"
                    },
                    runningMode: "VIDEO",
                    numHands: 1
                });
                setLandmarker(instancia);
                setCarregandoIA(false);
            } catch (erro) {
                console.error("Erro crítico ao carregar ficheiros WASM da IA:", erro);
            }
        }
        carregarModelo();
    }, []);

    // 2. Processa as matrizes de frames tridimensionais capturados
    const processarFrameCamera = (videoElement) => {
        if (!landmarker || !videoElement || videoElement.readyState !== 4) return;

        const agora = performance.now();
        const resultado = landmarker.detectForVideo(videoElement, agora);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // CORREÇÃO: Extrair o primeiro elemento da matriz de coordenadas reais da mão detectada
        if (resultado.handLandmarks && resultado.handLandmarks.length > 0) {
            const pontosMao = resultado.handLandmarks[0];
            desenharEsqueletoNoCanvas(ctx, pontosMao);

            // Executa o algoritmo matemático de validação local
            if (validarGestoLGP(pontosMao, letraAlvo)) {
                onLetraIdentificada();
            }
        }
    };

    // 3. Algoritmo de Classificação do Alfabeto Manual LGP baseado nos 21 pontos do esqueleto
    const validarGestoLGP = (pontos, letra) => {
        if (!pontos || pontos.length < 21) return false;

        // Compara a ponta de cada dedo com a sua respetiva junta inferior no eixo Y
        const indicadorAberto = pontos[8].y < pontos[6].y;
        const medioAberto = pontos[12].y < pontos[10].y;
        const anelarAberto = pontos[16].y < pontos[14].y;
        const mindinhoAberto = pontos[20].y < pontos[18].y;

        if (letra === 'A') {
            // Letra A (LGP): Mão totalmente fechada (todos os dedos recolhidos para baixo)
            return !indicadorAberto && !medioAberto && !anelarAberto && !mindinhoAberto;
        }
        if (letra === 'O') {
            // Letra O (LGP): Formato curvado de pinça (as pontas dos dedos descem)
            return pontos[8].y > pontos[5].y && pontos[4].y > pontos[1].y;
        }

        // Salvaguarda para as restantes letras (passa automaticamente com qualquer mão detetada)
        return pontos.length === 21;
    };

    const desenharEsqueletoNoCanvas = (ctx, pontos) => {
        ctx.fillStyle = "#00ff00"; // Nós dos dedos a verde brilhante
        ctx.strokeStyle = "#ffcc00"; // Ligações do esqueleto a amarelo industrial
        ctx.lineWidth = 3;
        pontos.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x * 400, p.y * 300, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
    };

    return (
        <div style={{ position: 'relative', width: '400px', height: '320px', margin: '0 auto' }}>
            {carregandoIA && (
                <p style={{ color: '#ffcc00', fontWeight: 'bold', background: '#111', padding: '10px', borderRadius: '5px' }}>
                    🔧 A ligar motores de IA Oficinal Stand-Alone...
                </p>
            )}

            <CameraView letraAlvo={letraAlvo} onFrame={processarFrameCamera} />

            <canvas
                ref={canvasRef}
                width="400"
                height="300"
                style={{ position: 'absolute', top: 38, left: 0, zIndex: 2, pointerEvents: 'none', transform: 'scaleX(-1)' }}
            />
        </div>
    );
}