import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import CameraView from './CameraView';

export default function GestureModel({ letraAlvo, onLetraIdentificada }) {
    const [landmarker, setLandmarker] = useState(null);
    const [carregandoIA, setCarregandoIA] = useState(true);
    const [bloqueioAvanco, setBloqueioAvanco] = useState(false);
    const landmarkerRef = useRef(null);
    const bloqueioRef = useRef(false);
    const timeoutRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        async function carregarModelo() {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm'
                );

                const instancia = await HandLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/hand_landmarker.task',
                        delegate: 'CPU'
                    },
                    runningMode: 'VIDEO',
                    numHands: 1
                });

                setLandmarker(instancia);
                landmarkerRef.current = instancia;
                setCarregandoIA(false);
            } catch (erro) {
                console.error('Erro ao instanciar o MediaPipe:', erro);
            }
        }

        carregarModelo();

        return () => {
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
            }
            if (landmarkerRef.current) {
                landmarkerRef.current.close();
            }
        };
    }, []);

    const processarFrameCamera = (videoElement) => {
        if (!landmarker || !videoElement || videoElement.readyState !== 4 || bloqueioRef.current) return;

        const agora = performance.now();
        const resultado = landmarker.detectForVideo(videoElement, agora);

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (resultado.handLandmarks && resultado.handLandmarks.length > 0) {
            const pontosMao = resultado.handLandmarks[0];
            desenharEsqueletoNoCanvas(ctx, pontosMao);

            if (validarGestoLGP(pontosMao, letraAlvo)) {
                bloqueioRef.current = true;
                setBloqueioAvanco(true);
                onLetraIdentificada();

                timeoutRef.current = window.setTimeout(() => {
                    bloqueioRef.current = false;
                    setBloqueioAvanco(false);
                }, 1500);
            }
        }
    };

    const validarGestoLGP = (pontos, letra) => {
        if (!pontos || pontos.length < 21) return false;

        const indicadorAberto = pontos[8].y < pontos[6].y;
        const medioAberto = pontos[12].y < pontos[10].y;
        const anelarAberto = pontos[16].y < pontos[14].y;
        const mindinhoAberto = pontos[20].y < pontos[18].y;
        const polegarAfastado = Math.abs(pontos[4].x - pontos[3].x) > 0.05;

        switch (letra) {
            case 'A':
                return !indicadorAberto && !medioAberto && !anelarAberto && !mindinhoAberto;

            case 'E':
                return pontos[8].y > pontos[6].y && pontos[12].y > pontos[10].y;

            case 'O':
                return pontos[8].y > pontos[5].y && pontos[12].y > pontos[9].y && polegarAfastado;

            case 'L':
                return indicadorAberto && !medioAberto && !anelarAberto && !mindinhoAberto && polegarAfastado;

            case 'B':
                return indicadorAberto && medioAberto && anelarAberto && mindinhoAberto;

            case 'C':
                return pontos[8].x > pontos[6].x && pontos[4].y < pontos[1].y;

            case 'R':
                return indicadorAberto && medioAberto && Math.abs(pontos[8].x - pontos[12].x) < 0.03;

            case 'D':
                return indicadorAberto && !medioAberto && !anelarAberto && !mindinhoAberto && Math.abs(pontos[8].x - pontos[12].x) > 0.05;

            case 'U':
            case 'I':
                return mindinhoAberto && !indicadorAberto && !medioAberto && !anelarAberto;

            case 'P':
                return pontos[8].y > pontos[9].y && medioAberto;

            case 'F':
            case 'S':
            case 'T':
                return !indicadorAberto && !medioAberto && polegarAfastado;

            default:
                return false;
        }
    };

    const desenharEsqueletoNoCanvas = (ctx, pontos) => {
        ctx.fillStyle = '#00ff00';
        ctx.strokeStyle = '#ffcc00';
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
                    🔧 Inicializar Motores de Visão Computacional Oficinal...
                </p>
            )}

            <CameraView letraAlvo={letraAlvo} onFrame={processarFrameCamera} />

            <canvas
                ref={canvasRef}
                width='400'
                height='300'
                style={{ position: 'absolute', top: 38, left: 0, zIndex: 2, pointerEvents: 'none', transform: 'scaleX(-1)' }}
            />
        </div>
    );
}
